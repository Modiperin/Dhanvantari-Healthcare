import express from 'express'
import validate from '../middlewares/validate'
import {
  isAddressValid,
  isCityValid,
  isCountryValid,
  isDigiPinValid,
  isEmailAlredyExist,
  isEmailValid,
  isHospitalNameValid,
  isLogoValid,
  isOptionalEmailValid,
  isOptionalPhoneValid,
  isOTPValid,
  isPasswordValid,
  isPincodeValid,
  isPocDetailsValid,
  isStateValid
} from '../validators/auth'
import {
  adminLogin,
  login,
  ownerSignup,
  signup,
  verifyOTP
} from '../controller/auth'

const authRouter = express.Router()

authRouter.post(
  '/signup',
  validate([
    isEmailValid,
    isPasswordValid,
    isEmailAlredyExist,
    isHospitalNameValid,
    isAddressValid,
    isPincodeValid,
    isDigiPinValid,
    // isCityValid,
    // isStateValid,
    // isCountryValid,
    isOptionalEmailValid,
    isOptionalPhoneValid,
    isLogoValid,
    isPocDetailsValid
  ]),
  signup
)

authRouter.post(
  '/owner-signup',
  validate([isEmailValid, isPasswordValid, isEmailAlredyExist]),
  ownerSignup
)

authRouter.post('/login', login)

authRouter.post('/admin/login', adminLogin)

authRouter.post('/verify-otp', validate([isOTPValid]), verifyOTP)

export default authRouter
