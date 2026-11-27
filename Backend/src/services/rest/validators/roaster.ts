import * as leaveRequestQueris from 'db/queries/leaveRequests'
import * as commonQueries from 'db/queries/common'
import { isAfter, isValid, parse, startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import { getTimestampFromDate, validateAndMergeTiming } from 'utils/dateAndTime'
import err from 'utils/err'
import { setFieldsIntoLocals } from 'utils/funcations'
import { keywordSearchHelper } from 'utils/searchAndFilter'
import mongoDB from 'db'

export const isDayValid = async (req: Request, res: Response) => {
  const { day } = req.body
  const validDays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ]

  if (!validDays.includes(day)) {
    return err(
      'Invalid day provided. Please provide a valid day of the week.',
      'day'
    )
  }
  return null
}

export const isTimingValid = async (req: Request, res: Response) => {
  const { timing, onLeave } = req.body

  if (onLeave && (!timing || !Array.isArray(timing) || !timing.length)) {
    setFieldsIntoLocals(res, {
      mergedTiming: []
    })

    return null
  }

  const { error, mergedTiming } = validateAndMergeTiming(timing)

  if (error) return err(error, 'timing')

  setFieldsIntoLocals(res, {
    mergedTiming
  })

  return null
}

export const isOnLeaveValid = async (req: Request, res: Response) => {
  const { onLeave } = req.body

  if (typeof onLeave !== 'boolean') {
    return err('Invalid value for onLeave. It should be a boolean.', 'onLeave')
  }

  setFieldsIntoLocals(res, {
    onLeave
  })

  return null
}

export const isStaffIsDoctor = async (req: Request, res: Response) => {
  const validationErrors = res.locals.validationErrors
  if (validationErrors.length) {
    return null
  }

  const { staffData } = res.locals.shared || {}

  if (!staffData || staffData.role !== 'D') {
    return err('Staff is not a doctor.', 'staffId')
  }

  return null
}

export const isLeaveDateValid = async (req: Request, res: Response) => {
  const { date } = req.body

  if (!date) {
    return err('Date is required.', 'date')
  }

  const dateFormat = 'dd-MM-yyyy'

  const parsed = parse(date, dateFormat, new Date())
  if (!isValid(parsed)) {
    return err(`Invalid date format. Expected format: ${dateFormat}`, 'date')
  }

  const today = startOfDay(new Date())
  if (!isAfter(parsed, today)) {
    return err('Date must be a future date.', 'breakTiming')
  }

  setFieldsIntoLocals(res, {
    date
  })

  return null
}

export const isLeaveAlredyApplied = async (req: Request, res: Response) => {
  if (res.locals?.validationErrors?.length) return null

  const { date, staffId } = req.body
  const { user } = res.locals || {}

  const leaveDate = await commonQueries.findDocument(
    leaveRequestQueris.getCollection,
    mongoDB,
    {
      userId: staffId,
      hospitalId: user.hospitalId,
      date: getTimestampFromDate(date)
    }
  )

  if (leaveDate) {
    if (leaveDate.onLeave) {
      return err('Full Day Leave already applied for this date.', 'date')
    }

    setFieldsIntoLocals(res, {
      oldTiming: leaveDate.timing || []
    })
  }

  return null
}

export const isBreakTimingValid = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) return null

  const { timing, onLeave } = req.body
  const { oldTiming = [] } = res.locals.shared || {}

  if (onLeave) {
    setFieldsIntoLocals(res, {
      mergedTiming: []
    })
    return null
  }

  const { error, mergedTiming } = validateAndMergeTiming([
    ...timing,
    ...oldTiming
  ])

  if (error) return err(error, 'timing')

  setFieldsIntoLocals(res, {
    mergedTiming,
    onLeave
  })

  return null
}

export const keywordSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const { q, searchBy } = req.query

  if (!('q' in req.query)) {
    setFieldsIntoLocals(res, {
      searchCondition: {}
    })
    return null
  }

  let allowedKeywordToSerach = ['name']

  if (searchBy) {
    allowedKeywordToSerach = allowedKeywordToSerach.filter(
      (keyword) => keyword === searchBy
    )
  }

  const searchCondition = keywordSearchHelper(allowedKeywordToSerach, String(q))

  setFieldsIntoLocals(res, {
    searchCondition
  })

  return null
}

export const isDateProvidedForAvailableDoctors = async (
  req: Request,
  res: Response
) => {
  const { date } = req.query

  if (!date) {
    return err('Date is required.', 'date')
  }

  const parsedDate = parse(String(date), 'dd-MM-yyyy', new Date())

  if (!isValid(parsedDate)) {
    return err('Invalid date format. Expected format: dd-MM-yyyy', 'date')
  }

  setFieldsIntoLocals(res, {
    parsedDate
  })

  return null
}
