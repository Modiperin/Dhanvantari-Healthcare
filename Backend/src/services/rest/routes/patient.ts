import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  addPatientHistory,
  deletePatient,
  getPatientList,
  getPatientProfile,
  prescriptionsList,
  registerPatient,
  updatePatient,
  viewPatientMedicalHistory
} from '../controller/patient'
import {
  filterSearch,
  isAddressValid,
  isBloodGroupValid,
  isCurrentlyTakingMedicinesValid,
  isDoctorDetailsValid,
  isDrugAllergyValid,
  isEmergencyContactValid,
  isFoodAllergyValid,
  isMedicalHistoryFlagValid,
  isNameValid,
  isPastSurgicalValid,
  isPatientAlreadyExists,
  isPatientIdValid,
  isPriorityValid,
  isProcedureValid,
  isReferredByValid,
  keywordSearch
} from '../validators/patient'
import {
  isDateOfBirthValid,
  isGenderValid,
  isPhoneNoValid
} from '../validators/staff'
import { isEmailValid } from '../validators/auth'
import { isVisitNoteValid } from '../validators/patientVisit'

const patientRoute = express.Router()

patientRoute.get(
  '/view/:patientId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPatientIdValid]),
  getPatientProfile
)

patientRoute.post(
  '/create',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isNameValid,
    isGenderValid,
    isBloodGroupValid,
    isDateOfBirthValid,
    isPhoneNoValid,
    isPatientAlreadyExists,
    isEmailValid,
    isEmergencyContactValid,
    isAddressValid,
    isDoctorDetailsValid,
    isPriorityValid,
    isVisitNoteValid,
    isReferredByValid
  ]),
  registerPatient
)

patientRoute.put(
  '/update/:patientId',
  auth('O', 'S', 'A', 'T', 'D'),
  // TODO: need to update the data accodig to update
  validate([
    isPatientIdValid,
    isNameValid,
    isGenderValid,
    isBloodGroupValid,
    isDateOfBirthValid,
    isPhoneNoValid,
    isPatientAlreadyExists,
    isEmailValid, // TODO: need to check is email is already exists with other patient same for phoneNo
    isEmergencyContactValid,
    isAddressValid,
    isMedicalHistoryFlagValid,
    isFoodAllergyValid,
    isDrugAllergyValid,
    isPastSurgicalValid,
    isProcedureValid,
    isCurrentlyTakingMedicinesValid
  ]),
  updatePatient
)

patientRoute.get(
  '/list',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  getPatientList
)

patientRoute.delete(
  '/delete/:patientId',
  auth('S', 'A'),
  validate([isPatientIdValid]),
  deletePatient
)

patientRoute.post(
  '/add/history/:patientId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isPatientIdValid,
    isMedicalHistoryFlagValid,
    isFoodAllergyValid,
    isDrugAllergyValid,
    isPastSurgicalValid,
    isProcedureValid,
    isCurrentlyTakingMedicinesValid
  ]),
  addPatientHistory
)

patientRoute.get(
  '/view/medicalHistory/:patientId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPatientIdValid]),
  viewPatientMedicalHistory
)

patientRoute.get(
  '/prescriptions/list',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([isPatientIdValid]),
  prescriptionsList
)

export default patientRoute
