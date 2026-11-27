import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  createPatientVisit,
  getPatientVisitList,
  updatePatientVisit,
  viewPatientVisit,
  viewPrescription
} from '../controller/patientVisit'
import {
  isDoctorDetailsValid,
  isPatientIdValid,
  isPriorityValid,
  isReferredByValid
} from '../validators/patient'
import {
  filterSearch,
  isConsultationStatusValid,
  isStatusValid,
  isVisitIdValid,
  isVisitNoteValid,
  isVisitTypeValid,
  isVitalStatusValid,
  keywordSearch
} from '../validators/patientVisit'

const visitRoute = express.Router()

visitRoute.get(
  '/view/:visitId',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([isVisitIdValid]),
  viewPatientVisit
)

visitRoute.post(
  '/create',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([
    isPatientIdValid,
    isDoctorDetailsValid,
    isPriorityValid,
    isVisitNoteValid,
    isVisitTypeValid,
    isReferredByValid
    //TODO: add more fields validation
  ]),
  createPatientVisit
)

visitRoute.put(
  '/update/:visitId',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([
    isVisitIdValid,
    isStatusValid,
    isVitalStatusValid,
    isConsultationStatusValid
  ]),
  updatePatientVisit
)

visitRoute.get(
  '/list',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([keywordSearch, filterSearch]),
  getPatientVisitList
)

visitRoute.get(
  '/prescription/view/:visitId',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([isVisitIdValid]),
  viewPrescription
)

export default visitRoute
