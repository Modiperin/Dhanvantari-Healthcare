import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  getHospitalProfile,
  hospitalSetting,
  resetPassword,
  setupPassword,
  updateDoctorPad,
  updateHospitalProfile,
  verifySetupPasswordToken,
  welcomeToHospital
} from '../controller/hospital'
import {
  isAddressValid,
  isEmailValid,
  isHospitalNameValid,
  isLogoValid
} from '../validators/auth'
import {
  isAcceptPrivacyPolicyValid,
  isAcceptTermsConditionValid,
  isConfirmPasswordValid,
  isHospitalIdValid,
  isPadConfigValid,
  isPrevCurrPasswordValid,
  isSetupPasswordValid,
  isSuperAdminPasswordValid,
  isTokenValid
} from '../validators/hospital'
import { isPhoneNoValid, isStaffIdValid } from '../validators/staff'

const hospitalRoute = express.Router()

hospitalRoute.post(
  '/welcome/:hospitalId',
  auth('O', 'S'),
  validate([isHospitalIdValid]),
  welcomeToHospital
)

hospitalRoute.get('/profile', auth('O', 'S', 'T'), getHospitalProfile)

hospitalRoute.put(
  '/update',
  auth('S'),
  validate([
    isHospitalNameValid,
    isAddressValid,
    isEmailValid,
    isPhoneNoValid,
    isLogoValid
  ]),
  updateHospitalProfile
)

hospitalRoute.get('/setting', auth('O', 'S', 'A', 'D', 'T'), hospitalSetting)

hospitalRoute.get(
  '/verify-setup-token',
  validate([isTokenValid]),
  verifySetupPasswordToken
)

// this api will be used to setup the password for the hospital(super admin)
hospitalRoute.post(
  '/setup-password',
  validate([
    isTokenValid,
    isSetupPasswordValid,
    isConfirmPasswordValid,
    isAcceptTermsConditionValid,
    isAcceptPrivacyPolicyValid
  ]),
  setupPassword
)

// this will use for the staff and doctor to reset password
hospitalRoute.post(
  '/reset-password',
  auth('O', 'S'),
  validate([
    isSetupPasswordValid,
    isConfirmPasswordValid,
    isStaffIdValid,
    isSuperAdminPasswordValid,
    isPrevCurrPasswordValid
  ]),
  resetPassword
)

hospitalRoute.put(
  '/pad-config/:staffId',
  auth('S', 'D'),
  validate([isStaffIdValid, isPadConfigValid]),
  updateDoctorPad
)

export default hospitalRoute
