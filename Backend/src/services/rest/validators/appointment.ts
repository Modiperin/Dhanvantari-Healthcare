import { Request, Response } from 'express'
import mongoDB from 'db'
import * as appointmentQueries from 'db/queries/appointment'
import {
  parse,
  isValid,
  startOfDay,
  endOfDay,
  subMinutes,
  addMinutes,
  isWithinInterval
} from 'date-fns'
import err from '../../../utils/err'
import { getFieldIntoReq, setFieldsIntoLocals } from '../../../utils/funcations'
import {
  convertToUTC,
  getDateRangeFromAgeRange,
  parseTime
} from 'utils/dateAndTime'
import { filterSearchHelper } from 'utils/searchAndFilter'

export const isAppointmentDateValid = async (req: Request, res: Response) => {
  if (req.path.includes('update') && !req.body.date) {
    return null
  }

  // Parse date in dd-MM-yyyy format
  const { date, time } = req.body

  if (!date) return err('Appointment date is required.', 'date')
  if (!time) return err('Appointment time is required.', 'time')

  const parsed =
    typeof date === 'string' ? parse(date, 'dd-MM-yyyy', new Date()) : null
  if (!parsed) {
    return err(
      'Please provide a valid appointment date in dd-MM-yyyy format.',
      'date'
    )
  }

  const parsedDate =
    typeof date === 'string' ? parse(date, 'dd-MM-yyyy', new Date()) : null
  if (!parsedDate || !isValid(parsedDate)) {
    return err(
      'Please provide a valid appointment date in dd-MM-yyyy format.',
      'date'
    )
  }

  // Validate time
  const parsedTime = parseTime(time)
  if (!parsedTime) {
    return err(
      'Invalid time format. Please use HH:mm or h:mm AM/PM format.',
      'time'
    )
  }

  // Combine date and time as UTC
  const scheduleDate = convertToUTC(date, 'dd-MM-yyyy', time, '12')

  setFieldsIntoLocals(res, { date, time, scheduleDate })

  return null
}

// export const isAppointmentTimingValid = async (req: Request, res: Response) => {
//   const previousErrors = res.locals.validationErrors
//   const ignore = req.path.includes('update') && !req.body.time

//   if (previousErrors.length || ignore) return null

//   const { time } = req.body
//   const { date } = res.locals.shared || {}

//   if (!time) return err('Appointment time is required.', 'time')

//   const parsedTime = parseTime(time)
//   if (!parsedTime) {
//     return err(
//       'Invalid time format. Please use HH:mm or h:mm AM/PM format.',
//       'time'
//     )
//   }

//   if (!date || !(date instanceof Date)) {
//     return err('Appointment date is missing or invalid.', 'date')
//   }

//   console.dir({ date }, { depth: null })
//   // Combine date and time as UTC
//   // const scheduleDate = convertToUTC()
//   //  new Date(
//   //   Date.UTC(
//   //     date.getFullYear(),
//   //     date.getMonth(),
//   //     date.getDate(),
//   //     parsedTime.getHours(),
//   //     parsedTime.getMinutes(),
//   //     0,
//   //     0
//   //   )
//   // )

//   if (scheduleDate.getTime() <= Date.now()) {
//     return err(
//       'Appointment date and time must be in the future.',
//       'scheduleDate'
//     )
//   }

//   console.dir({ scheduleDate }, { depth: null })

//   setFieldsIntoLocals(res, { time, scheduleDate })

//   return null
// }

export const isAppointmentIdValid = async (req: Request, res: Response) => {
  const appointmentId = getFieldIntoReq(req, 'appointmentId')

  if (
    !appointmentId ||
    typeof appointmentId !== 'string' ||
    !appointmentId.trim()
  ) {
    return err('Please provide a valid appointmentId.', 'appointmentId')
  }

  const { user } = res.locals || {}

  const appointmentData = await appointmentQueries.getAppointmentByCondition(
    mongoDB,
    {
      appointmentId,
      hospitalId: user.hospitalId
    },
    {
      date: 1,
      time: 1,
      scheduleDate: 1,
      status: 1,
      _id: 1,
      doctorId: 1
    }
  )

  if (!appointmentData) {
    return err('Appointment not found.', 'appointmentId')
  }

  setFieldsIntoLocals(res, {
    appointmentId,
    appointmentData
  })

  return null
}

export const filterSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const { status, startDate, endDate, ageStart, ageEnd, gender, bloodGroup } =
    req.query

  const result = filterSearchHelper(
    {
      gender: {
        value: gender,
        multi: true,
        type: 'string'
      },
      bloodGroup: {
        value: bloodGroup,
        multi: true,
        type: 'string'
      },
      status: {
        value: status,
        multi: true,
        type: 'string'
      }
    },
    true
  )

  if (startDate || endDate) {
    // Parse the dates in 'yyyy-MM-dd' format
    const parsedStart = parse(String(startDate), 'dd-MM-yyyy', new Date())
    const parsedEnd = parse(String(endDate), 'dd-MM-yyyy', new Date())

    if (!isValid(parsedStart) || !isValid(parsedEnd)) {
      return err('Please provide valid startDate and endDate.', 'date')
    }

    const startDateInUserTimezone = startOfDay(parsedStart)
    const endDateInUserTimezone = endOfDay(parsedEnd)

    setFieldsIntoLocals(res, {
      startDate: startDateInUserTimezone,
      endDate: endDateInUserTimezone
    })
  }

  if (ageStart || ageEnd) {
    const dateRange = getDateRangeFromAgeRange(Number(ageStart), Number(ageEnd))

    if (dateRange) {
      setFieldsIntoLocals(res, {
        ...dateRange
      })
    }
  }

  setFieldsIntoLocals(res, {
    filterCondition: result.filterData
  })

  return null
}

export const isAppointmentStatusValid = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length || !('status' in req.body)) return null

  const { status } = req.body

  if (!status || typeof status !== 'string' || !status.trim()) {
    return err('Please provide a valid appointment status.', 'status')
  }

  const validStatuses = ['booked', 'completed', 'cancelled', 'rescheduled']
  if (!validStatuses.includes(status)) {
    return err(
      `Invalid status. Valid statuses are: ${validStatuses.join(', ')}`,
      'status'
    )
  }

  setFieldsIntoLocals(res, { status })

  return null
}

export const isAppointmentFallBetweenThresh = async (
  req: Request,
  res: Response
) => {
  const { appointmentData } = res.locals.shared
  if (!appointmentData || appointmentData?.status === 'completed') {
    return err(
      'Appointment(s) not available or it is checked-in',
      'appointmentId'
    )
  }

  const appointmentDateTime = parse(
    appointmentData?.date + ' ' + appointmentData?.time,
    'dd-MM-yyyy hh:mm a',
    new Date()
  )

  const now = new Date()

  const startWindow = subMinutes(appointmentDateTime, 30)
  const endWindow = addMinutes(appointmentDateTime, 30)

  const isAllowedEntry = isWithinInterval(now, {
    start: startWindow,
    end: endWindow
  })

  if (isAllowedEntry) {
    setFieldsIntoLocals(res, {
      ...appointmentData,
      isEntryAllowed: isAllowedEntry
    })
  } else {
    return err('Entry not allowed. Out of appointment window.', 'outOfTime')
  }
  return null
}
