import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  bookAppointment,
  bookAppointmentForExistingPatient,
  deleteAppointment,
  getAppointmentList,
  updateAppointment,
  viewAppointment
} from '../controller/appointment'
import {
  isBloodGroupValid,
  isDoctorDetailsValid,
  isEmergencyContactValid,
  isNameValid,
  isPatientIdValid
} from '../validators/patient'
import {
  isDateOfBirthValid,
  isGenderValid,
  isPhoneNoValid
} from '../validators/staff'
import { isEmailValid } from '../validators/auth'
import {
  filterSearch,
  isAppointmentDateValid,
  isAppointmentFallBetweenThresh,
  isAppointmentIdValid,
  isAppointmentStatusValid
} from '../validators/appointment'
import { isVisitNoteValid, keywordSearch } from '../validators/patientVisit'

const appointmentRoute = express.Router()

appointmentRoute.post(
  '/create/new',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isNameValid,
    isGenderValid,
    isBloodGroupValid,
    isDateOfBirthValid,
    isPhoneNoValid,
    isEmailValid,
    isEmergencyContactValid,
    // isAddressValid,
    isDoctorDetailsValid,
    isAppointmentDateValid,
    isVisitNoteValid
  ]),
  bookAppointment
)

appointmentRoute.post(
  '/create/old',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isPatientIdValid,
    isDoctorDetailsValid,
    isVisitNoteValid,
    isAppointmentDateValid
  ]),
  bookAppointmentForExistingPatient
)

appointmentRoute.get(
  '/list',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  getAppointmentList
)

appointmentRoute.put(
  '/update/:appointmentId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isAppointmentIdValid,
    isAppointmentDateValid,
    isAppointmentStatusValid
  ]),
  updateAppointment
)

appointmentRoute.get(
  '/view/:appointmentId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isAppointmentIdValid, isAppointmentFallBetweenThresh]),
  viewAppointment
)

appointmentRoute.delete(
  '/delete/:appointmentId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isAppointmentIdValid]),
  deleteAppointment
)

export default appointmentRoute
