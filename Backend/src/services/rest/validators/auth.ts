import { Request, Response } from 'express'
import * as redisQueries from 'db/redis/queries'
import * as staffQueries from '../../../db/queries/staff'
import emailValidator from './emailValidator'
import passwordValidator from './passwordValidator'
import err from '../../../utils/err'
import mongoDB from '../../../db'
import redisDB from 'db/redis'
import phoneValidator from './phoneValidator'
import { setFieldsIntoLocals } from 'utils/funcations'

export const isEmailValid = async (req: Request, res: Response) => {
  if (!('email' in req.body)) return null

  const { email } = req.body

  if (!email || !emailValidator(email)) {
    return err('Please provide valid email address.', 'email')
  }

  setFieldsIntoLocals(res, {
    email: email.trim()
  })

  return null
}

export const isOptionalEmailValid = async (req: Request) => {
  const { optionalEmail } = req.body

  if (!('optionalEmail' in req.body)) return null

  if (!optionalEmail || !emailValidator(optionalEmail)) {
    return err('Please provide valid optional email address.', 'optionalEmail')
  }

  return null
}

export const isOptionalPhoneValid = async (req: Request) => {
  const { optionalPhoneNo } = req.body

  if (!('optionalPhoneNo' in req.body)) return null

  if (!phoneValidator(optionalPhoneNo)) {
    return err(
      'Please provide a valid optional phone number. It should be between 7 to 15 digits.',
      'optionalPhoneNo'
    )
  }

  return null
}

export const isPhoneValid = async (req: Request) => {
  const { phone } = req.body

  if (!phone || !phone.trim()) {
    return err('Please provide a valid phone number.', 'phone')
  }

  if (!phoneValidator(phone)) {
    return err(
      'Please provide a valid phone number. It should be between 7 to 15 digits.',
      'phone'
    )
  }

  return null
}

export const isPasswordValid = async (req: Request, res: Response) => {
  const { password, from } = req.body
  // Check if the request is from onboarding than set the pssword to master password
  if (from === 'onboarding' && !password) {
    const newPassword = process.env.MASTER_PASSWORD || password || ''

    setFieldsIntoLocals(res, {
      password: newPassword
    })

    return null
  }

  if (!password) {
    return err('Please enter a valid password.', 'password')
  }

  const accessApi = ['/auth/signup']
  if (accessApi.includes(req.path) && !passwordValidator(password)) {
    return err(
      'Weak password. Use at least 8 characters, alphanumeric, and 1 special character.',
      'password'
    )
  }

  setFieldsIntoLocals(res, {
    password: password.trim()
  })

  return null
}

export const isEmailAlredyExist = async (req: Request) => {
  const { email } = req.body

  const user = await staffQueries.getStaffByCondition(mongoDB, {
    userName: email,
    isDeleted: { $ne: true }
  })

  if (user) {
    return err('email already registered.', 'email')
  }

  return null
}

export const isHospitalNameValid = async (req: Request, res: Response) => {
  const { name } = req.body

  if (req.path.includes('/update') && !name) return null

  if (!name || !name.trim()) {
    return err('Hospital name is required.', 'name')
  }

  if (name.length < 2 || name.length > 50) {
    return err('Hospital name should be between 3 to 50 characters.', 'name')
  }

  setFieldsIntoLocals(res, {
    name: name.trim()
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
export const isFirstNameValid = async (req: Request, res: Response) => {
  const { firstName } = req.body

  if (!firstName || !firstName.trim()) {
    return null
  }

  if (firstName.length < 2 || firstName.length > 20) {
    return err('First name should be between 2 to 20 characters.', 'firstName')
  }

  setFieldsIntoLocals(res, {
    firstName: firstName.trim()
  })

  return null
}

export const isLastNameValid = async (req: Request, res: Response) => {
  const { lastName } = req.body

  if (!lastName || !lastName.trim()) {
    return null
  }

  if (lastName.length < 2 || lastName.length > 50) {
    return err('Last name should be between 2 to 50 characters.', 'lastName')
  }

  setFieldsIntoLocals(res, {
    lastName: lastName.trim()
  })

  return null
}

export const isOTPValid = async (req: Request, res: Response) => {
  const { id, otp } = req.body

  if (!id || !id.trim()) {
    return err('ID is required.', 'id')
  }

  if (!otp || !otp.trim()) {
    return err('OTP is required.', 'otp')
  }

  if (otp.length !== 6 || !/^\d+$/.test(otp)) {
    return err('OTP should be a 6-digit number.', 'otp')
  }

  const storedOtp = await redisQueries.getData(redisDB, `otp:login:${id}`)

  if (storedOtp !== otp) {
    return err('Invalid OTP.', 'otp')
  }

  setFieldsIntoLocals(res, {
    id: id.trim(),
    otp: otp.trim()
  })

  return null
}

export const isAddressValid = async (req: Request, res: Response) => {
  const { address } = req.body

  if (req.path.includes('/update') && !address) return null

  if (!address || !address.trim()) {
    return err('Please provide a valid address.', 'address')
  }

  if (address.length < 5 || address.length > 100) {
    return err('Address should be between 5 to 100 characters.', 'address')
  }

  setFieldsIntoLocals(res, {
    address: address.trim()
  })

  return null
}

export const isPincodeValid = async (req: Request) => {
  const { pincode } = req.body

  if (!pincode) {
    return err('Please provide a valid pincode.', 'pincode')
  }

  const pincodeRegex = /^\d{6}$/
  if (!pincodeRegex.test(pincode)) {
    return err('Pincode should be a 6-digit number.', 'pincode')
  }

  return null
}

export const isDigiPinValid = async (req: Request) => {
  const { digiPin } = req.body
  if (!('digiPin' in req.body)) return null

  if (typeof digiPin !== 'string' || !digiPin.trim()) {
    return err('Please provide a valid DIGIPIN.', 'digiPin')
  }

  // DIGIPIN should be 10 codes only: F, C, J, K, L, M, P, T or 2-9. (case-sensitive)
  const digiPinRegex = /^[FCJKLMPT2-9]{10}$/
  if (!digiPinRegex.test(digiPin)) {
    return err(
      'DIGIPIN should be 10 codes only: F, C, J, K, L, M, P, T or 2-9.',
      'digiPin'
    )
  }

  return null
}

export const isLogoValid = async (req: Request, res: Response) => {
  const { logo } = req.body

  if (!logo || !logo.trim()) {
    return null
  }

  if (logo.length > 500) {
    return err('Logo URL should not exceed 500 characters.', 'logo')
  }

  setFieldsIntoLocals(res, {
    logo: logo.trim()
  })

  return null
}

export const isCityValid = async (req: Request, res: Response) => {
  const { city } = req.body
  if (!city || !city.trim()) {
    return err('Please provide a valid city.', 'city')
  }
  return null
}

export const isStateValid = async (req: Request, res: Response) => {
  const { state } = req.body
  if (!state || !state.trim()) {
    return err('Please provide a valid state.', 'state')
  }
  return null
}

export const isCountryValid = async (req: Request, res: Response) => {
  const { country } = req.body
  if (!country || !country.trim()) {
    return err('Please provide a valid country.', 'country')
  }
  return null
}

export const isPocDetailsValid = async (req: Request, res: Response) => {
  // const { pocDetails } = req.body
  // console.log({req:req?.body})
  const { name, email, phoneNo } = req?.body

  if (!name && !email && !phoneNo) {
    return null
  } else if (!name) {
    return err('Please provide a valid POC name.', 'pocDetails.name')
  } else if (!email) {
    return err('Please provide a valid POC email.', 'pocDetails.email')
  } else if (!phoneNo) {
    return err('Please provide a valid POC phone number.', 'pocDetails.phoneNo')
  }

  return null
}
