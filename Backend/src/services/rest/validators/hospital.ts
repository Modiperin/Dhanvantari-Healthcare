import { Request, Response } from 'express'
import err from 'utils/err'
import * as hospitalQueries from 'db/queries/hospitals'
import mongoDB from 'db'
import jwt from 'jsonwebtoken'
import { DynamicObjectType } from 'types'
// import passwordValidator from '../validators/passwordValidator'
import { setFieldsIntoLocals } from 'utils/funcations'
import bcrypt from 'bcrypt'
import weakPasswordValidator from './weakPasswordValidator'
import passwordValidator from './passwordValidator'

export const isHospitalIdValid = async (req: Request, res: Response) => {
  const { hospitalId } = req.params

  if (!hospitalId || typeof hospitalId !== 'string' || !hospitalId.trim()) {
    return err('Please provide a valid hospital ID.', 'hospitalId')
  }

  const hospitalData = await hospitalQueries.getHospitalByCondition(mongoDB, {
    _id: hospitalId
  })

  if (!hospitalData) {
    return err('Hospital not found.', 'hospitalId')
  }

  setFieldsIntoLocals(res, {
    hospitalData
  })

  return null
}

export const isTokenValid = async (req: Request, res: Response) => {
  const token = req.query.token ? req.query.token : req.body.token

  if (!token || typeof token !== 'string' || !token.trim()) {
    return err('Please provide a valid token.', 'token')
  }

  try {
    const tokenData = jwt.verify(
      token,
      process.env.JWT_SECRET || ''
    ) as DynamicObjectType

    // console.log({ tokenData })

    if (!tokenData || !tokenData?.hospitalId) {
      return err('Invalid or expired token.', 'token')
    }

    const hospitalData = await hospitalQueries.getHospitalByCondition(mongoDB, {
      _id: tokenData.hospitalId
    })

    if (!hospitalData) {
      return err('Invalid or expired token.', 'token')
    }

    setFieldsIntoLocals(res, {
      hospitalData
    })
  } catch (error) {
    return err('Invalid token', 'token')
  }

  return null
}

export const isSetupPasswordValid = async (req: Request, res: Response) => {
  const { password } = req.body
  const { ref } = req.query

  if (!password || typeof password !== 'string' || !password.trim()) {
    return err('Please provide a valid password.', 'password')
  }

  const adminMsg =
    'Password must be at least 8 characters, include a letter, a number, and a special character.'
  const weakMsg =
    'Password must be at least 5 characters, include a letter, a number, and a special character.'

  if (ref === 'admin') {
    if (!passwordValidator(password)) {
      return err(adminMsg, 'password')
    }
  } else if (!weakPasswordValidator(password)) {
    return err(weakMsg, 'password')
  }

  setFieldsIntoLocals(res, {
    password: password.trim()
  })

  return null
}

export const isConfirmPasswordValid = async (req: Request) => {
  const { password, confirmPassword } = req.body

  if (
    !confirmPassword ||
    typeof confirmPassword !== 'string' ||
    !confirmPassword.trim()
  ) {
    return err('Please provide confirm password.', 'confirmPassword')
  }

  if (password !== confirmPassword) {
    return err('Password and confirm password do not match.', 'confirmPassword')
  }

  return null
}

export const isSuperAdminPasswordValid = async (
  req: Request,
  res: Response
) => {
  const { superAdminPassword } = req.body
  const user = res.locals.user
  const isPasswordSame = await bcrypt.compare(superAdminPassword, user.password)
  if (!isPasswordSame) {
    return err('Invalid Super Admin Password.', 'superAdminPassword')
  }

  return null
}

export const isPrevCurrPasswordValid = async (req: Request, res: Response) => {
  const { password, staffData } = res.locals.shared

  if (staffData?.password) {
    const isSamePrevCurr = await bcrypt.compare(password, staffData?.password)

    if (isSamePrevCurr) {
      // eslint-disable-next-line quotes
      return err("You can't set previous password", 'password')
    }
  }

  return null
}

export const isPadConfigValid = async (req: Request, res: Response) => {
  const { padConfig } = req.body

  if (!padConfig || !Array.isArray(padConfig) || !padConfig.length) {
    return err('Please provide a valid pad configuration.', 'padConfig')
  }

  const validPadFields = [
    'complaints',
    'vitals',
    'diagnosis',
    'medications',
    'referToDoctor',
    'clinicalFindings',
    'lab'
  ]

  const isValid = padConfig.every((item) => {
    return (
      typeof item === 'object' &&
      item.id &&
      validPadFields.includes(item.id) &&
      item.active !== undefined &&
      typeof item.active === 'boolean'
    )
  })

  if (!isValid) {
    return err('Please provide a valid pad configuration.', 'padConfig')
  }

  // setFieldsIntoLocals(res, {
  //   padConfig
  // })

  return null
}

export const isAcceptTermsConditionValid = async (req: Request) => {
  const { acceptTermsCondition } = req.body

  if (acceptTermsCondition !== true) {
    return err(
      'You must accept the terms and conditions.',
      'acceptTermsCondition'
    )
  }

  return null
}

export const isAcceptPrivacyPolicyValid = async (req: Request) => {
  const { acceptPrivacyPolicy } = req.body

  if (acceptPrivacyPolicy !== true) {
    return err('You must accept the privacy policy.', 'acceptPrivacyPolicy')
  }

  return null
}
