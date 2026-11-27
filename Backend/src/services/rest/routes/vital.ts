import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  createVital,
  updateVital,
  viewPatientAllVitals
} from '../controller/vital'
import { isDoctorDetailsValid, isPatientIdValid } from '../validators/patient'
import { isVisitIdValid } from '../validators/patientVisit'
import {
  isBMIValid,
  isBPValid,
  isBSFValid,
  isBSPPValid,
  isComplaintsValid,
  isHeightValid,
  isPulseValid,
  isrbsValid,
  isRespirationRateValid,
  isSpo2Valid,
  isTemperatureValid,
  isVitalAlreadyExists,
  isVitalIdValid,
  isWeightValid
} from '../validators/vital/vital'

const vitalRoute = express.Router()

// TODO: make sure one patient can have only one vital record per visit

vitalRoute.post(
  '/create',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isPatientIdValid,
    isVisitIdValid,
    isVitalAlreadyExists,
    isHeightValid,
    isWeightValid,
    isBMIValid,
    isRespirationRateValid,
    isTemperatureValid,
    isPulseValid,
    isBPValid,
    isSpo2Valid,
    isBSFValid,
    isrbsValid,
    isBSPPValid,
    isComplaintsValid,
    isDoctorDetailsValid
  ]),
  createVital
)

vitalRoute.put(
  '/update/:vitalId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isVitalIdValid,
    isPatientIdValid,
    isVisitIdValid,
    isHeightValid,
    isWeightValid,
    isBMIValid,
    isRespirationRateValid,
    isTemperatureValid,
    isPulseValid,
    isBPValid,
    isSpo2Valid,
    isBSFValid,
    isrbsValid,
    isBSPPValid,
    isComplaintsValid,
    isDoctorDetailsValid
  ]),
  updateVital
)

vitalRoute.get(
  '/list/:patientId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPatientIdValid]),
  viewPatientAllVitals
)

export default vitalRoute
