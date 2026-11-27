import { Request, Response } from 'express'
import mongoDB from 'db'
import * as patientVisitQueries from 'db/queries/patientVisits'
import { getFieldIntoReq, setFieldsIntoLocals } from 'utils/funcations'
import { filterSearchHelper, keywordSearchHelper } from 'utils/searchAndFilter'
import err from 'utils/err'
import { endOfDay, isValid, parse, startOfDay } from 'date-fns'
import { getDateRangeFromAgeRange } from 'utils/dateAndTime'

export const isVisitTypeValid = async (req: Request, res: Response) => {
  const { type } = req.body

  const validVisitTypes = ['Walkin', 'Appointment']

  if (!type || !validVisitTypes.includes(type)) {
    return err(
      'Visit type is required and should be either Walkin or Appointment.', // TODO: Change this message to be more specific
      'visitType'
    )
  }

  setFieldsIntoLocals(res, {
    type: type.trim()
  })

  return null
}

export const isVisitNoteValid = async (req: Request, res: Response) => {
  const { visitNote } = req.body
  if (!visitNote) return null

  if (typeof visitNote !== 'string' || !visitNote.trim()) {
    return err('Visit note is required.', 'visitNote')
  }

  setFieldsIntoLocals(res, {
    visitNote: visitNote.trim()
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

  let allowedKeywordToSerach = ['name', 'email', 'phoneNo']

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

export const filterSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const {
    priority,
    appointmentType,
    ageStart,
    ageEnd,
    gender,
    startDate,
    endDate,
    status,
    vitalStatus,
    contStatus
  } = req.query

  const result = filterSearchHelper(
    {
      priority: {
        value: priority,
        multi: true,
        type: 'number'
      },
      type: {
        value: appointmentType,
        multi: true,
        type: 'string'
      },
      status: {
        value: status,
        multi: true,
        type: 'string'
      },
      vitalStatus: {
        value: vitalStatus,
        multi: true,
        type: 'string'
      },
      contStatus: {
        value: contStatus,
        multi: true,
        type: 'string'
      }
    },
    true
  )

  const patientFilter = filterSearchHelper(
    {
      gender: {
        value: gender,
        multi: true,
        type: 'string'
      }
    },
    true
  )

  if (ageStart || ageEnd) {
    const dateRange = getDateRangeFromAgeRange(Number(ageStart), Number(ageEnd))

    if (dateRange) {
      setFieldsIntoLocals(res, {
        ...dateRange
      })
    }
  }

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

  setFieldsIntoLocals(res, {
    filterCondition: result.filterData,
    patientFilterCondition: patientFilter.filterData
  })

  return null
}

export const isVisitIdValid = async (req: Request, res: Response) => {
  const visitId = getFieldIntoReq(req, 'visitId')

  if (!visitId) return null

  if (!visitId || typeof visitId !== 'string' || visitId.trim() === '') {
    return err('Please provide a valid visit ID.', 'visitId')
  }
  const { user } = res.locals || {}

  const visitData = await patientVisitQueries.getVisitByCondition(mongoDB, {
    visitId,
    hospitalId: user.hospitalId
  })

  if (!visitData) {
    return err('Visit not found.', 'visitId')
  }

  setFieldsIntoLocals(res, {
    visitId: visitId.trim(),
    visitData
  })

  return null
}

export const isStatusValid = async (req: Request, res: Response) => {
  const { status } = req.body

  if (!status) return null

  if (typeof status !== 'string' || status.trim() === '') {
    return err('Please provide a valid status.', 'status')
  }

  const validStatuses = ['Checked-in', 'Completed', 'Cancelled', 'No-show']

  if (!validStatuses.includes(status)) {
    return err(`Status must be one of: ${validStatuses.join(', ')}`, 'status')
  }

  setFieldsIntoLocals(res, {
    status: status.trim()
  })

  return null
}

export const isVitalStatusValid = async (req: Request, res: Response) => {
  const { vitalStatus } = req.body

  if (!vitalStatus) return null

  if (typeof vitalStatus !== 'string' || vitalStatus.trim() === '') {
    return err('Please provide a valid vital status.', 'vitalStatus')
  }

  const validVitalStatuses = ['Pending', 'Ongoing', 'Completed']

  if (!validVitalStatuses.includes(vitalStatus)) {
    return err(
      `Vital status must be one of: ${validVitalStatuses.join(', ')}`,
      'vitalStatus'
    )
  }

  setFieldsIntoLocals(res, {
    vitalStatus: vitalStatus.trim()
  })

  return null
}

export const isConsultationStatusValid = async (
  req: Request,
  res: Response
) => {
  const { contStatus } = req.body
  const { visitData } = res.locals.shared || {}
  // console.log({ contStatus, visitData })

  if (
    !contStatus ||
    visitData?.contStatus === 'Completed' ||
    visitData?.contStatus === contStatus
  )
    return null

  if (typeof contStatus !== 'string' || contStatus.trim() === '') {
    return err('Please provide a valid consultation status.', 'contStatus')
  }

  const validConsultationStatuses = ['Pending', 'Ongoing', 'Completed']

  if (!validConsultationStatuses.includes(contStatus)) {
    return err(
      `Consultation status must be one of: ${validConsultationStatuses.join(', ')}`,
      'contStatus'
    )
  }

  setFieldsIntoLocals(res, {
    contStatus: contStatus.trim()
  })

  return null
}
