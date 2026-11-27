import { Request, Response } from 'express'
import mongoDB from 'db'
import * as staffQueries from 'db/queries/staff'
import * as patientQueries from 'db/queries/patient'
import err, { handleMultipleErrors } from 'utils/err'
import { getFieldIntoReq, setFieldsIntoLocals } from 'utils/funcations'
import {
  validateAddressDetalis,
  validateEmergencyContactDetails
} from './helper'
import { multipleErrorsSymbol } from 'services/rest/middlewares/validate'
import { filterSearchHelper, keywordSearchHelper } from 'utils/searchAndFilter'
import { getDateRangeFromAgeRange } from 'utils/dateAndTime'

export const isPatientIdValid = async (req: Request, res: Response) => {
  const patientId = getFieldIntoReq(req, 'patientId')
  const { user } = res.locals || {}

  if (!patientId || typeof patientId !== 'string' || patientId.trim() === '') {
    return err('Please provide a valid patient ID.', 'patientId')
  }

  const patientData = await patientQueries.getPatientByCondition(mongoDB, {
    _id: patientId,
    hospitalId: user.hospitalId
  })

  if (!patientData) {
    return err('Patient not found.', 'patientId')
  }

  setFieldsIntoLocals(res, {
    patientData,
    patientId
  })

  return null
}

export const isNameValid = async (req: Request, res: Response) => {
  const { name } = req.body

  if (!name || !name.trim()) {
    return err('Name is required.', 'name')
  }

  if (name.length < 2) {
    return err('Name should be more then 1 characters.', 'name')
  }

  setFieldsIntoLocals(res, {
    name: name.trim()
  })

  return null
}

export const isBloodGroupValid = async (req: Request, res: Response) => {
  const { bloodGroup } = req.body

  const validBloodGroups = [
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
    'N/A'
  ]

  if (!bloodGroup || typeof bloodGroup !== 'string') {
    return err('Blood group is required.', 'bloodGroup')
  }

  if (!validBloodGroups.includes(bloodGroup.trim().toUpperCase())) {
    return err(
      'Invalid blood group. Accepted values: A+, A-, B+, B-, AB+, AB-, O+, O-.',
      'bloodGroup'
    )
  }

  setFieldsIntoLocals(res, {
    bloodGroup: bloodGroup.trim().toUpperCase()
  })

  return null
}

export const isEmergencyContactValid = async (req: Request, res: Response) => {
  const { emergencyContact } = req.body

  // if (!emergencyContact) {
  //   return err('Emergency contact is required.', 'emergencyContact')
  // }

  const emergencyContactValidation =
    validateEmergencyContactDetails(emergencyContact)

  if (
    emergencyContactValidation.error &&
    emergencyContactValidation.validationErrors?.length
  ) {
    return handleMultipleErrors(
      emergencyContactValidation.validationErrors,
      multipleErrorsSymbol
    )
  }

  setFieldsIntoLocals(res, {
    emergencyContact
  })

  return null
}

export const isAddressValid = async (req: Request, res: Response) => {
  const { address } = req.body

  if (!address || typeof address !== 'object') {
    return err('Address is required and should be an object.', 'address')
  }

  const addressValidation = validateAddressDetalis(address)

  if (addressValidation.error && addressValidation.validationErrors?.length) {
    return handleMultipleErrors(
      addressValidation.validationErrors,
      multipleErrorsSymbol
    )
  }

  setFieldsIntoLocals(res, {
    address
  })

  return null
}

export const isDoctorDetailsValid = async (req: Request, res: Response) => {
  if (!('doctorId' in req.body)) return null

  const { doctorId } = req.body
  const { user } = res.locals || {}

  if (!doctorId || typeof doctorId !== 'string' || !doctorId.trim()) {
    return err('Please select the doctore.', 'doctorId')
  }

  const doctorData = await staffQueries.getStaffByCondition(mongoDB, {
    userId: doctorId.trim(),
    hospitalId: user.hospitalId,
    role: 'D'
  })

  if (!doctorData) {
    return err('Doctor not found.', 'doctorId')
  }

  setFieldsIntoLocals(res, {
    doctorData,
    doctorId
  })

  return null
}

export const isPriorityValid = async (req: Request, res: Response) => {
  if (!('priority' in req.body)) return null
  const { priority } = req.body
  const validPriorities = [1, 2, 3]
  if (!validPriorities.includes(priority)) {
    return err(
      'Invalid priority. Accepted values: 1 (Emergency), 2 (VIP), 3 (Normal).',
      'priority'
    )
  }

  setFieldsIntoLocals(res, {
    priority
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

  const { bloodGroup, gender, ageStart, ageEnd } = req.query

  const result = filterSearchHelper(
    {
      bloodGroup: {
        value: bloodGroup,
        multi: true,
        type: 'string'
      },
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

  setFieldsIntoLocals(res, {
    filterCondition: result.filterData
  })

  return null
}

export const isMedicalHistoryFlagValid = async (
  req: Request,
  res: Response
) => {
  const errors: { message: string; field: string }[] = []

  const { alcohol, diabetes, smoking, tobacco } = req.body

  if (typeof alcohol !== 'boolean') {
    errors.push({
      message: 'Alcohol field is required and should be a boolean.',
      field: 'alcohol'
    })
  }
  if (typeof diabetes !== 'boolean') {
    errors.push({
      message: 'Diabetes field is required and should be a boolean.',
      field: 'diabetes'
    })
  }
  if (typeof smoking !== 'boolean') {
    errors.push({
      message: 'Smoking field is required and should be a boolean.',
      field: 'smoking'
    })
  }
  if (typeof tobacco !== 'boolean') {
    errors.push({
      message: 'Tobacco field is required and should be a boolean.',
      field: 'tobacco'
    })
  }

  if (errors.length) {
    return handleMultipleErrors(errors, multipleErrorsSymbol)
  }

  return null
}

export const isFoodAllergyValid = async (req: Request, res: Response) => {
  if (!('foodAllergy' in req.body)) return null

  const { foodAllergy } = req.body

  if (!Array.isArray(foodAllergy)) {
    return err('Please enter valid food allergies.', 'foodAllergy')
  }

  if (foodAllergy.some((item) => typeof item !== 'string' || !item.trim())) {
    return err('Please enter valid food allergies.', 'foodAllergy')
  }

  setFieldsIntoLocals(res, {
    foodAllergy: foodAllergy.map((item: string) => item.trim())
  })

  return null
}

export const isDrugAllergyValid = async (req: Request, res: Response) => {
  if (!('drugAllergy' in req.body)) return null

  const { drugAllergy } = req.body

  if (!Array.isArray(drugAllergy)) {
    return err('Please enter valid drug allergies.', 'drugAllergy')
  }

  if (drugAllergy.some((item) => typeof item !== 'string' || !item.trim())) {
    return err('Please enter valid drug allergies.', 'drugAllergy')
  }

  setFieldsIntoLocals(res, {
    drugAllergy: drugAllergy.map((item: string) => item.trim())
  })

  return null
}

export const isPastSurgicalValid = async (req: Request, res: Response) => {
  if (!('pastSurgical' in req.body)) return null

  const { pastSurgical } = req.body

  if (!Array.isArray(pastSurgical)) {
    return err('Please enter valid past surgical history.', 'pastSurgical')
  }

  if (pastSurgical.some((item) => typeof item !== 'string' || !item.trim())) {
    return err('Please enter valid past surgical history.', 'pastSurgical')
  }

  setFieldsIntoLocals(res, {
    pastSurgical: pastSurgical.map((item: string) => item.trim())
  })

  return null
}

export const isProcedureValid = async (req: Request, res: Response) => {
  if (!('procedure' in req.body)) return null

  const { procedure } = req.body

  if (!Array.isArray(procedure)) {
    return err('Please enter valid procedures.', 'procedure')
  }

  if (procedure.some((item) => typeof item !== 'string' || !item.trim())) {
    return err('Please enter valid procedures.', 'procedure')
  }

  setFieldsIntoLocals(res, {
    procedure: procedure.map((item: string) => item.trim())
  })

  return null
}

export const isCurrentlyTakingMedicinesValid = async (
  req: Request,
  res: Response
) => {
  if (!('currentlyTakingMedicines' in req.body)) return null

  const { currentlyTakingMedicines } = req.body

  if (!Array.isArray(currentlyTakingMedicines)) {
    return err(
      'Please enter valid currently taking medicines.',
      'currentlyTakingMedicines'
    )
  }

  if (
    currentlyTakingMedicines.some(
      (item) => typeof item !== 'string' || !item.trim()
    )
  ) {
    return err(
      'Please enter valid currently taking medicines.',
      'currentlyTakingMedicines'
    )
  }

  setFieldsIntoLocals(res, {
    currentlyTakingMedicines: currentlyTakingMedicines.map((item: string) =>
      item.trim()
    )
  })

  return null
}

export const isPatientAlreadyExists = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const { name, phoneNo } = res.locals.shared || {}

  if (!name && !phoneNo) {
    return null
  }

  const { user } = res.locals || {}
  const patientId = getFieldIntoReq(req, 'patientId')

  const patientData = await patientQueries.getPatientByCondition(
    mongoDB,
    {
      _id: { $ne: patientId },
      name,
      phoneNo,
      hospitalId: user.hospitalId
    },
    {},
    { collation: { locale: 'en', strength: 2 } }
  )

  if (patientData) {
    return err(
      'Patient already exists with this Name and phone number.',
      'general'
    )
  }

  return null
}

export const isReferredByValid = async (req: Request, res: Response) => {
  if (!('referredBy' in req.body)) return null

  const { referredBy } = req.body

  if (referredBy && typeof referredBy !== 'string') {
    return err('Please enter valid refferred by.', 'referredBy')
  }

  setFieldsIntoLocals(res, {
    referredBy: referredBy.trim()
  })

  return null
}
