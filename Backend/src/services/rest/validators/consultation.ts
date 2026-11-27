import { Request, Response } from 'express'
import * as consultationQueries from 'db/queries/consultation'
import * as visitQueries from 'db/queries/patientVisits'
import { AnyType } from 'types'
import err, { handleMultipleErrors } from 'utils/err'
import { setFieldsIntoLocals } from 'utils/funcations'
import mongoDB from 'db'
import { multipleErrorsSymbol } from '../middlewares/validate'
import { addDays, format, isValid, parse } from 'date-fns'
import jsonwebtoken from 'jsonwebtoken'

export const isConsultationIdValid = async (req: Request, res: Response) => {
  const { consultationId } = req.params
  const { user } = res.locals || {}

  if (!consultationId) {
    return err('Invalid consultation.', 'consultationId')
  }

  const consultationData = await consultationQueries.getConsultationByCondition(
    mongoDB,
    { _id: consultationId, hospitalId: user.hospitalId }
  )

  if (!consultationData) {
    return err('Consultation not found.', 'consultationId')
  }

  setFieldsIntoLocals(res, {
    consultationData
  })

  return null
}

export const isConsultationCreated = async (req: Request, res: Response) => {
  const { visitId } = req.body
  const { user } = res.locals || {}

  if (!visitId) {
    return err('Invalid visit ID.', 'visitId')
  }

  const existingConsultation =
    await consultationQueries.getConsultationByCondition(mongoDB, {
      visitId,
      hospitalId: user.hospitalId
    })
  console.log(existingConsultation)

  if (existingConsultation) {
    return err(
      'Consultation already exists for this visit ID. Please refresh this page.',
      'visitId'
    )
  }

  return null
}

// diagnosis Array of object
//   {
//   id string
//   name string
//   since {value number , unit string}
//   status  ruled-out,confirm,suspected
//   note string
//   }

export const isDiagnosisValid = async (req: Request, res: Response) => {
  if (!('diagnosis' in req.body)) return null
  const { diagnosis } = req.body

  if (!diagnosis || !Array.isArray(diagnosis)) {
    return err('Diagnosis should be an array of objects.', 'diagnosis')
  }

  const validStatuses = ['ruled-out', 'confirm', 'suspected']
  const validUnits = ['hours', 'days', 'weeks', 'months', 'years']
  const errors: { field: string; message: string }[] = []

  diagnosis.forEach((item: AnyType, idx: number) => {
    if (!item.id || !item.name) {
      errors.push({
        field: `diagnosis.${idx}.name`,
        message: 'Each diagnosis must have an id and name.'
      })
    }
    if (
      item.since &&
      (!item.since.value || !validUnits.includes(item.since.unit))
    ) {
      errors.push({
        field: `diagnosis.${idx}.since`,
        message: 'Since must have a valid value and unit.'
      })
    }
    if (item.status && !validStatuses.includes(item.status)) {
      errors.push({
        field: `diagnosis.${idx}.status`,
        message: `Status must be one of ${validStatuses.join(', ')}`
      })
    }
    if (
      'note' in item &&
      (typeof item.note !== 'string' || !item.note.trim())
    ) {
      errors.push({
        field: `diagnosis.${idx}.note`,
        message: 'Please provide a valid note.'
      })
    }
  })

  if (errors.length) {
    return handleMultipleErrors(errors, multipleErrorsSymbol)
  }

  setFieldsIntoLocals(res, { diagnosis })

  return null
}

export const isFollowUpValid = async (req: Request, res: Response) => {
  const { followUp } = req.body
  if (!followUp || !('followUp' in req.body)) return null

  if (!Object.keys(followUp).length) {
    setFieldsIntoLocals(res, { followUp })
    return null
  }

  if (!followUp || typeof followUp !== 'object') {
    return err('Follow-up should be an object.', 'followUp')
  }

  // Validate days
  if (typeof followUp.days === 'number' && followUp.days < 0) {
    return err('days must be greater than 0', 'followUp.days')
  }
  let parsedDate: Date | null = null

  const newDate = addDays(new Date(), followUp.days)
  parsedDate = parse(format(newDate, 'dd-M-yyyy'), 'dd-M-yyyy', new Date())

  // Parse date if provided
  if (typeof followUp.date === 'string' && followUp.date.trim()) {
    parsedDate = parse(followUp.date, 'dd-M-yyyy', new Date())
  }

  // Mutually exclusive: either days or date, not both
  const hasDays = !!followUp.days
  const hasDate = !!followUp.date && !!followUp.date.trim()

  if (!hasDays && !hasDate) {
    return err('Either days or date must be provided.', 'followUp.date')
  }

  if (hasDays && hasDate) {
    return err('You cannot enter both days and date.', 'followUp.date')
  }

  if (hasDate && !isValid(parsedDate)) {
    return err('date must be a valid date string.', 'followUp.date')
  }

  // Validate instructions
  if (
    typeof followUp.instructions !== 'string' &&
    !followUp.instructions.trim()
  ) {
    return err(
      'instructions must be a non-empty string.',
      'followUp.instructions'
    )
  }
  Object.assign(followUp, {
    scheduleDate: parsedDate,
    date:
      followUp.date || format(newDate.toLocaleDateString('en'), 'dd-M-yyyy'),
    days: 0
  })

  setFieldsIntoLocals(res, { followUp })
  return null
}

// medications Array of object
// {
//   id string
//   name string
//   noOfDoses number
//   time M,A,E,N
//   timing after | before
//   noOfDays number
//   instructions string
// }

export const isMedicationsValid = async (req: Request, res: Response) => {
  if (!('medications' in req.body)) return null
  const { medications } = req.body

  if (!medications || !Array.isArray(medications)) {
    return err('Medications should be an array of objects.', 'medications')
  }

  const validTimes = ['M', 'A', 'E', 'N']
  const validTimings = ['A', 'B']
  const errors: { field: string; message: string }[] = []

  medications.forEach((item: AnyType, idx: number) => {
    if (!item.id || !item.name) {
      errors.push({
        field: `medications.${idx}.name`,
        message: 'Each medication must have an id and name.'
      })
    }
    if (
      item.noOfDoses &&
      (typeof item.noOfDoses !== 'number' || item.noOfDoses <= 0)
    ) {
      errors.push({
        field: `medications.${idx}.noOfDoses`,
        message: 'noOfDoses must be a positive number.'
      })
    }

    if (item.time && !validTimes.includes(item.time)) {
      errors.push({
        field: `medications.${idx}.time`,
        message: `time must be one of ${validTimes.join(', ')}.`
      })
    }

    if (item.timing && !validTimings.includes(item.timing)) {
      errors.push({
        field: `medications.${idx}.timing`,
        message: `timing must be one of ${validTimings.join(', ')}.`
      })
    }

    if (
      item.noOfDays &&
      (typeof item.noOfDays !== 'number' || item.noOfDays <= 0)
    ) {
      errors.push({
        field: `medications.${idx}.noOfDays`,
        message: 'noOfDays must be a positive number.'
      })
    }

    if (
      'instructions' in item &&
      (typeof item.instructions !== 'string' || !item.instructions.trim())
    ) {
      errors.push({
        field: `medications.${idx}.instructions`,
        message: 'Please provide valid instructions.'
      })
    }
  })

  if (errors.length) {
    return handleMultipleErrors(errors, multipleErrorsSymbol)
  }

  setFieldsIntoLocals(res, { medications })

  return null
}

// labs Array of object
//    {
//     id string
//     name string
//     reportDate Date
//     instructions string
//    }

export const isLabsValid = async (req: Request, res: Response) => {
  if (!('labs' in req.body)) return null
  const { labs } = req.body

  if (!labs || !Array.isArray(labs)) {
    return err('labs should be an array of objects.', 'labs')
  }

  const errors: { field: string; message: string }[] = []

  labs.forEach((item: AnyType, idx: number) => {
    if (!item.id || !item.name) {
      errors.push({
        field: `labs.${idx}.name`,
        message: 'Each lab entry must have an id and name.'
      })
    }
    if ('reportDate' in item && isNaN(Date.parse(item.reportDate))) {
      errors.push({
        field: `labs.${idx}.reportDate`,
        message: 'reportDate must be a valid date string.'
      })
    }
    if (
      'instructions' in item &&
      (typeof item.instructions !== 'string' || !item.instructions.trim())
    ) {
      errors.push({
        field: `labs.${idx}.instructions`,
        message: 'Please provide valid instructions.'
      })
    }
  })

  if (errors.length) {
    return handleMultipleErrors(errors, multipleErrorsSymbol)
  }

  setFieldsIntoLocals(res, { labs })

  return null
}

// clinicalFindings array of object
// {
//   id string
//   name string
//    instructions string
// }

export const isClinicalFindingsValid = async (req: Request, res: Response) => {
  if (!('clinicalFindings' in req.body)) return null

  const { clinicalFindings } = req.body

  if (!Array.isArray(clinicalFindings)) {
    return err('Invalid clinical findings format.', 'clinicalFindings')
  }

  const errors: { field: string; message: string }[] = []

  clinicalFindings.forEach((item: AnyType, idx: number) => {
    if (!item.name) {
      errors.push({
        field: `clinicalFindings.${idx}.name`,
        message: 'Each clinical finding must have name.'
      })
    }

    if (
      'instructions' in item &&
      (typeof item.instructions !== 'string' || !item.instructions.trim())
    ) {
      errors.push({
        field: `clinicalFindings.${idx}.instructions`,
        message: 'Please provide valid instructions.'
      })
    }
  })

  if (errors.length) {
    return handleMultipleErrors(errors, multipleErrorsSymbol)
  }

  setFieldsIntoLocals(res, { clinicalFindings })

  return null
}

// referToDoctor object
//   {
//     doctorId string
//     noteForPatient string
//     notrForDoctore string
//   }

export const isReferToDoctorValid = async (req: Request, res: Response) => {
  if (!('referToDoctor' in req.body)) return null

  const { referToDoctor } = req.body

  if (typeof referToDoctor !== 'object') {
    return err('referToDoctor should be an object.', 'referToDoctor')
  }

  const errors: { field: string; message: string }[] = []

  if (
    !referToDoctor.id ||
    typeof referToDoctor.id !== 'string' ||
    !referToDoctor.id.trim()
  ) {
    errors.push({
      field: 'referToDoctor.id',
      message: 'id is required and must be a non-empty string.'
    })
  }
  if (
    'noteForPatient' in referToDoctor &&
    (typeof referToDoctor.noteForPatient !== 'string' ||
      !referToDoctor.noteForPatient.trim())
  ) {
    errors.push({
      field: 'referToDoctor.noteForPatient',
      message: 'noteForPatient must be a non-empty string if provided.'
    })
  }
  if (
    'noteForDoctore' in referToDoctor &&
    (typeof referToDoctor.noteForDoctore !== 'string' ||
      !referToDoctor.noteForDoctore.trim())
  ) {
    errors.push({
      field: 'referToDoctor.noteForDoctore',
      message: 'noteForDoctore must be a non-empty string if provided.'
    })
  }

  if (errors.length) {
    return handleMultipleErrors(errors, multipleErrorsSymbol)
  }

  setFieldsIntoLocals(res, { referToDoctor })

  return null
}

export const isPatientValidToSendWhatsApp = async (
  req: Request,
  res: Response
) => {
  const previousErrors = res.locals?.validationErrors || null

  if (previousErrors && previousErrors.length) return null

  const { patientData, consultationData } = res.locals.shared || {}

  if (!patientData || !patientData.phoneNo) {
    return err('Patient phone number is not available.', 'patientId')
  }

  if (consultationData && consultationData.isSentToWhatsApp) {
    return err('Prescription has already been sent to WhatsApp.', 'patientId')
  }

  return null
}

export const isPreviewTokenValid = async (req: Request, res: Response) => {
  const { token } = req.params
  if (!token || typeof token !== 'string' || !token.trim()) {
    return err('Invalid token.', 'token')
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || ''
    const decodedToken = jsonwebtoken.verify(token, jwtSecret) as AnyType

    if (!decodedToken || !decodedToken.id) {
      return err('Invalid token.', 'token')
    }

    const [hospitalId, visitId] = decodedToken.id.split(':')
    if (!hospitalId || !visitId) {
      return err('Invalid token.', 'token')
    }

    const visitData = await visitQueries.getVisitByCondition(mongoDB, {
      visitId,
      hospitalId
    })

    if (!visitData) {
      return err('Invalid token.', 'token')
    }

    setFieldsIntoLocals(res, { visitData })
    return null
  } catch (error) {
    return err('Invalid or expired token.', 'token')
  }
}
