import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  createConsultation,
  createDiagnosis,
  createLab,
  createMedication,
  sendConsultationToWhatsApp,
  updateConsultation,
  viewConsultation
} from '../controller/consultation'
import {
  isConsultationStatusValid,
  isVisitIdValid
} from '../validators/patientVisit'
import {
  isClinicalFindingsValid,
  isConsultationCreated,
  isConsultationIdValid,
  isDiagnosisValid,
  isFollowUpValid,
  isLabsValid,
  isMedicationsValid,
  isPatientValidToSendWhatsApp,
  isPreviewTokenValid,
  isReferToDoctorValid
} from '../validators/consultation'
import { isNameValid } from '../validators/auth'
import { isPatientIdValid } from '../validators/patient'
import { viewPrescription } from '../controller/patientVisit'

const consultationRoute = express.Router()

consultationRoute.post(
  '/create',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isVisitIdValid,
    isConsultationCreated,
    isDiagnosisValid,
    isMedicationsValid,
    isLabsValid,
    isClinicalFindingsValid,
    isReferToDoctorValid,
    isFollowUpValid,
    isConsultationStatusValid
  ]),
  createConsultation
)

consultationRoute.put(
  '/update/:consultationId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isVisitIdValid,
    isConsultationIdValid,
    isDiagnosisValid,
    isMedicationsValid,
    isLabsValid,
    isClinicalFindingsValid,
    isReferToDoctorValid,
    isFollowUpValid,
    isConsultationStatusValid
  ]),
  updateConsultation
)

consultationRoute.post(
  '/diagnosis/create/:hospitalId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isNameValid]),
  createDiagnosis
)

consultationRoute.post(
  '/medication/create/:hospitalId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isNameValid]),
  createMedication
)

consultationRoute.post(
  '/lab/create/:hospitalId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isNameValid]),
  createLab
)

consultationRoute.get(
  '/view',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isVisitIdValid]),
  viewConsultation
)

consultationRoute.post(
  '/send/:consultationId',
  auth('O', 'S', 'A', 'D'),
  validate([
    isConsultationIdValid,
    isPatientIdValid,
    isPatientValidToSendWhatsApp
  ]),
  sendConsultationToWhatsApp
)

consultationRoute.get(
  '/preview/:token',
  validate([isPreviewTokenValid]),
  viewPrescription
) // this one is visit controller function

export default consultationRoute
