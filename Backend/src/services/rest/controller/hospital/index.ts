import { Response, Request } from 'express'
import * as hospitalQueries from 'db/queries/hospitals'
import * as staffQueries from 'db/queries/staff'
import * as profileQueries from 'db/queries/profile'
import * as padConfigQueries from 'db/queries/padConfig'
import sendEmail from 'utils/email'
import config from 'config'
import { createJWT } from 'utils/token'
import mongoDB from 'db'
import bcrypt from 'bcrypt'
import { getFieldIntoReq, removeExtraFieldFormObject } from 'utils/funcations'
import { generateUUID } from 'utils/uuid'

export const welcomeToHospital = async (req: Request, res: Response) => {
  const { hospitalData } = res.locals.shared
  const { name: hospitalName, onboarding, email, phoneNo, _id } = hospitalData

  if (onboarding?.isCompleted) {
    res.status(200).json({
      message: 'Welcome back to the hospital dashboard.'
    })
    return
  }

  const token = await createJWT(
    {
      hospitalId: _id
    },
    process.env.JWT_SECRET || '',
    '2d'
  )

  const emailRes = await sendEmail('welcome', {
    email,
    hospitalName,
    phoneNo,
    setupLink: `${config.common.APP_URL}/setup-password?token=${token}`
  })

  if (!emailRes.success) {
    res.status(400).json({
      message: 'Failed to send onboarding email. Please try again later.'
    })
    return
  }

  // TODO: update the super admin details instead of hospital
  await hospitalQueries.updateHospital(
    mongoDB,
    { _id },
    { 'onboarding.isCompleted': true }
  )

  res.status(200).json({
    message: 'We have sent you an email to complete the onboarding process.'
  })
}

export const getHospitalProfile = async (req: Request, res: Response) => {
  const { user } = res.locals

  const hospitalData = await hospitalQueries.getHospitalByCondition(mongoDB, {
    _id: user.hospitalId
  })

  res.status(200).json({
    message: 'Hospital profile fetched successfully.',
    response: hospitalData
  })
}

export const updateHospitalProfile = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { name, email, phoneNo, address, logo } = res.locals.shared || {}
  const hospitalData = {
    name,
    email,
    phoneNo,
    address,
    logo,
    updatedAt: new Date()
  }

  const pureUpdateData = removeExtraFieldFormObject(
    hospitalData,
    ['name', 'email', 'phoneNo', 'address', 'logo', 'updatedAt'],
    true,
    [false]
  )

  await hospitalQueries.updateHospital(
    mongoDB,
    { _id: user.hospitalId },
    pureUpdateData
  )

  res.status(200).json({
    message: 'Hospital profile updated successfully.'
  })
}

export const  hospitalSetting = async (req: Request, res: Response) => {
  const { user } = res.locals

  delete user.password
  delete user._id

  const needToFetchProfile = !['O', 'S', 'A'].includes(user.role)

  const [hospitalData, profileData, padConfig] = await Promise.all([
    hospitalQueries.getHospitalByCondition(
      mongoDB,
      { _id: user.hospitalId },
      { _id: 0, name: 1, address: 1, phoneNo: 1, email: 1, logo: 1 }
    ),
    needToFetchProfile &&
      profileQueries.getProfileByCondition(
        mongoDB,
        { _id: user.profileId },
        { _id: 0, access: 1 }
      ),
    ['S', 'D'].includes(user.role) &&
      padConfigQueries.getPadConfigByCondition(
        mongoDB,
        { doctorId: user.userId, hospitalId: user.hospitalId },
        { _id: 0, doctorId: 0, hospitalId: 0 }
      )
  ])

  if (!hospitalData && user.role !== 'O') {
    res.status(401).json({
      message: 'Hospital not found.'
    })
    return
  }

  res.status(200).json({
    message: 'setting fetched successfully.',
    response: {
      ...user,
      hospitalData,
      access: (profileData && profileData?.access) || {},
      padConfig: (padConfig && padConfig?.padConfig) || {}
    }
  })
}

export const verifySetupPasswordToken = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Token is valid.',
    data: res.locals.shared.hospitalData,
    success: true
  })
}

export const setupPassword = async (req: Request, res: Response) => {
  const { password, hospitalData } = res.locals.shared

  // const encryptedPassword = encrypt(password)
  const hashedPassword = await bcrypt.hash(password, 10)

  await staffQueries.updatestaff(
    mongoDB,
    { userId: hospitalData.ownerId },
    { password: hashedPassword }
  )

  res.status(200).json({
    message: 'Password setup successfully. You can now login.',
    success: true
  })
}
export const resetPassword = async (req: Request, res: Response) => {
  const staffId = getFieldIntoReq(req, 'staffId')
  const { password } = res.locals.shared

  const hashedPassword = await bcrypt.hash(password, 10)

  await staffQueries.updatestaff(
    mongoDB,
    { userId: staffId },
    { password: hashedPassword }
  )

  res.status(200).json({
    message: 'Password reset successfully. You can now login.',
    success: true
  })
}

export const updateDoctorPad = async (req: Request, res: Response) => {
  const { staffId } = req.params
  const { user } = res.locals || {}
  const { padConfig } = req.body

  await padConfigQueries.updatePadConfig(
    mongoDB,
    {
      doctorId: staffId,
      hospitalId: user.hospitalId
    },
    {
      $set: {
        padConfig,
        updatedAt: new Date()
      },
      $setOnInsert: {
        _id: generateUUID(),
        createdAt: new Date()
      }
    },
    { upsert: true }
  )

  res.status(200).json({
    message: 'Doctor pad updated successfully.'
  })
}
