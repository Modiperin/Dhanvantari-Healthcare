/* eslint-disable camelcase */
import { Response, Request } from 'express'
import redisDB from 'db/redis'
import * as redisQueries from 'db/redis/queries'
import * as hospitalQueries from 'db/queries/hospitals'
import * as staffQueries from 'db/queries/staff'
import * as adminQueries from 'db/queries/admin'
import createHospital, {
  createHospitalStaff
} from '../../../../utils/createUser'
import mongoDB from 'db'
import { createJWT } from 'utils/token'
// import { generateOTP } from 'utils/otp'
// import sendEmail from 'utils/email'
import { generateUUID } from 'utils/uuid'
import bcrypt, { hash } from 'bcrypt'

export const signup = async (req: Request, res: Response) => {
  const {
    email,
    phoneNo,
    address,
    pincode,
    digiPin,
    optionalEmail,
    optionalPhoneNo,
    city,
    state,
    country,
    pocDetails
  } = req.body
  const { password, name, logo } = res.locals.shared || {}

  const hashedPassword = await bcrypt.hash(password, 10)

  // const encryptedPassword = encrypt(password)

  const hospitalData = {
    name,
    email,
    password: hashedPassword,
    address,
    pincode,
    digiPin,
    phoneNo,
    optionalEmail,
    optionalPhoneNo,
    city,
    state,
    country,
    logo,
    pocDetails
  }

  const idObjects = await createHospital(hospitalData) // will return userId of super admin

  if (!idObjects) {
    res.status(400).json({
      message: 'something want wrong please try again.'
    })
    return
  }

  const token = createJWT(
    {
      id: idObjects.userId
    },
    process.env.JWT_SECRET || ''
  )

  res.status(200).json({
    message: 'Hospital registered successfully.',
    token,
    hospitalId: idObjects.hospitalId
  })
}

export const ownerSignup = async (req: Request, res: Response) => {
  const { email } = req.body
  const { password } = res.locals.shared || {}

  // const encryptedPassword = encrypt(password)
  const hashedPassword = await bcrypt.hash(password, 10)

  const hospitalId = generateUUID()

  const hospitalData = {
    _id: hospitalId,
    name: 'Dhanvantari Hospital',
    email,
    userName: email, // email will be used as username
    role: 'O',
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  await hospitalQueries.addNewHospital(mongoDB, hospitalData)

  const userId = await createHospitalStaff(hospitalData)

  if (!userId) {
    res.status(400).json({
      message: 'something want wrong please try again.'
    })
    return
  }

  res.status(200).json({
    message: 'Owner registered successfully.',
    userId
  })
}

export const login = async (req: Request, res: Response) => {
   console.log('[LOGIN] Controller reached')
  const { email, password } = req.body
  console.log('123')
  const hashedPassword=await bcrypt.hash(password,10)
  console.log({hashedPassword})

  const user = await staffQueries.getStaffByCondition(mongoDB, {
    userName: email
  })
  // console.log({user:user})

  if (!user) {
    res.status(401).json({
      message: 'Invalid email or password.'
    })
    return
  }

  if (user.isLocked) {
    res.status(403).json({
      message: 'Your account is locked. Please contact administrator.'
    })
    return
  }

  let isPasswordSame = false

  isPasswordSame = await bcrypt.compare(password, user.password)
  console.log({isPasswordSame})

  if (!isPasswordSame) {
    res.status(401).json({
      message: 'Invalid email or password.'
    })
    return
  }

  // if (user.role === 'S') {
  //   const otp = generateOTP()

  //   const emailRes = await sendEmail('sendOTP', {
  //     email: user.email,
  //     otp,
  //     name: user.name || user.email
  //   })

  //   if (emailRes.success) {
  //     await redisQueries.setData(redisDB, `otp:login:${user.userId}`, otp, 300) // Store OTP for 5 minutes
  //   }

  //   res.json({
  //     message: 'OTP sent to your email',
  //     step: 'OTP',
  //     emailSent: emailRes.success,
  //     id: emailRes.success && user.userId
  //   })
  //   return
  // }

  const token = createJWT(
    {
      id: user.userId,
      sub: user.userName,
      role: user.role,
      hospital_id: user.hospitalId,
      profile_id: user.profileId
    },
    process.env.JWT_SECRET || ''
  )

  res.json({
    message: 'login successfully.',
    token,
    role: user.role
  })
}

export const adminLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await adminQueries.getAdminByCondition(mongoDB, {
    email
  })

  console.log({ user })

  if (!user) {
    res.status(401).json({
      message: 'Invalid email or password.'
    })
    return
  }

  let isPasswordSame = false

  isPasswordSame = await bcrypt.compare(password, user.password)

  if (!isPasswordSame) {
    res.status(401).json({
      message: 'Invalid email or password.'
    })
    return
  }

  const token = createJWT(
    {
      id: user.userId
    },
    process.env.JWT_SECRET || ''
  )

  res.json({
    message: 'login successfully.',
    token
  })
}

export const verifyOTP = async (req: Request, res: Response) => {
  const { id } = res.locals.shared
  const user = await staffQueries.getStaffByCondition(mongoDB, {
    userId: id
  })

  if (!user) {
    res.status(401).json({
      message: 'Something went wrong. Please try again.'
    })
    return
  }

  const token = createJWT(
    {
      id: user.userId,
      sub: user.userName,
      role: user.role,
      hospital_id: user.hospitalId,
      profile_id: user.profileId
    },
    process.env.JWT_SECRET || ''
  )

  await redisQueries.deleteKeys(redisDB, [`otp:login:${id}`])

  res.json({
    message: 'OTP verified successfully.',
    token
  })
}
