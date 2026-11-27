import mongoDB from 'db'
import * as staffQueries from 'db/queries/staff'
import * as commonQueries from 'db/queries/common'
import { Response, Request } from 'express'
import { createHospitalStaff } from 'utils/createUser'
import { getFieldIntoReq, removeExtraFieldFormObject } from 'utils/funcations'
import { assignConditions } from 'utils/searchAndFilter'
import bcrypt from 'bcrypt'
import { parse } from 'date-fns'

export const createStaff = async (req: Request, res: Response) => {
  const {
    email,
    name,
    phoneNo,
    userName,
    userNameType,
    role,
    dateOfBirth,
    gender,
    qualifications,
    active = true,
    type,
    departmentId,
    profileId,
    accessType
  } = req.body

  const { user } = res.locals
  const { accessEndTime, password } = res.locals.shared

  const hashedPassword = await bcrypt.hash(password, 10)

  const staffData = {
    hospitalId: user.hospitalId,
    userName,
    email,
    name,
    phoneNo,
    role,
    password: hashedPassword,
    dateOfBirth,
    dob: parse(dateOfBirth, 'dd-MM-yyyy', new Date()),
    gender,
    qualifications,
    type,
    departmentId,
    active,
    userNameType,
    isDeleted: false
  }

  const pureData = removeExtraFieldFormObject(
    staffData,
    [
      'hospitalId',
      'userName',
      'userNameType',
      'phoneNo',
      'role',
      'dateOfBirth',
      'dob',
      'email',
      'name',
      'gender',
      'qualifications',
      'type',
      'departmentId',
      'active',
      'userNameType',
      'isDeleted',
      'password'
    ],
    true,
    [false]
  )

  if (profileId && ['D', 'T'].includes(role)) {
    Object.assign(pureData, { profileId })
  }

  if (accessType) {
    Object.assign(pureData, {
      accessType
    })
    if (accessType !== 'P') {
      Object.assign(pureData, {
        accessEndTime: new Date(accessEndTime)
      })
    }
  }

  const staffId = await createHospitalStaff(pureData)
  if (!staffId) {
    res.status(500).json({
      message: 'Failed to create staff. Please try again later.'
    })
    return
  }

  res.status(200).json({
    message: 'Staff created successfully.',
    staffId
  })
}

export const createDoctor = async (req: Request, res: Response) => {
  const {
    email,
    name,
    phoneNo,
    userName,
    dateOfBirth,
    gender,
    qualifications,
    active = true,
    type,
    departmentId,
    profileId,
    accessType,
    awards,
    publications,
    socialLinks,
    password,
    specialities,
    titleName,
    bio,
    experience,
    registrationNo
  } = req.body

  const { user } = res.locals
  const { accessEndTime } = res.locals.shared
  const { userNameType } = res.locals.shared

  const hashedPassword = await bcrypt.hash(password, 10)

  const doctorData = {
    hospitalId: user.hospitalId,
    titleName,
    userName,
    email,
    name,
    phoneNo,
    dateOfBirth,
    dob: parse(dateOfBirth, 'dd-MM-yyyy', new Date()),
    gender,
    qualifications,
    type,
    departmentId,
    active,
    userNameType,
    isDeleted: false,
    profileId,
    accessType,
    awards,
    publications,
    socialLinks,
    role: 'D',
    password: hashedPassword,
    specialities,
    experience,
    bio,
    registrationNo
  }

  const pureData = removeExtraFieldFormObject(
    doctorData,
    [
      'hospitalId',
      'userName',
      'userNameType',
      'phoneNo',
      'role',
      'dateOfBirth',
      'dob',
      'email',
      'name',
      'gender',
      'qualifications',
      'type',
      'departmentId',
      'active',
      'isDeleted',
      'specialities',
      'publications',
      'awards',
      'socialLinks',
      'password',
      'accessType',
      'titleName',
      'bio',
      'experience',
      'registrationNo',
      'profileId'
    ],
    true,
    [false]
  )

  if (accessType) {
    if (accessType !== 'P') {
      Object.assign(pureData, {
        accessEndTime: new Date(accessEndTime)
      })
    }
  }

  const staffId = await createHospitalStaff(pureData)
  if (!staffId) {
    res.status(500).json({
      message: 'Failed to create doctor. Please try again later.'
    })
    return
  }

  res.status(200).json({
    message: 'Doctor created successfully.',
    staffId
  })
}

export const updateDoctor = async (req: Request, res: Response) => {
  const { staffId } = req.params
  const {
    email,
    name,
    phoneNo,
    userName,
    dateOfBirth,
    gender,
    qualifications,
    active = true,
    type,
    departmentId,
    profileId,
    accessType,
    awards,
    publications,
    socialLinks,
    password,
    specialities,
    titleName
  } = req.body

  const { user } = res.locals
  const { accessEndTime } = res.locals.shared
  const { userNameType } = res.locals.shared

  const hashedPassword = await bcrypt.hash(password, 10)

  const doctorData = {
    hospitalId: user.hospitalId,
    titleName,
    userName,
    email,
    name,
    phoneNo,
    dateOfBirth,
    dob: parse(dateOfBirth, 'dd-MM-yyyy', new Date()),
    gender,
    qualifications,
    type,
    departmentId,
    active,
    userNameType,
    isDeleted: false,
    profileId,
    accessType,
    awards,
    publications,
    socialLinks,
    role: 'D',
    password: hashedPassword,
    specialities
  }

  const pureData = removeExtraFieldFormObject(
    doctorData,
    [
      'hospitalId',
      'userName',
      'userNameType',
      'phoneNo',
      'role',
      'dateOfBirth',
      'dob',
      'email',
      'name',
      'gender',
      'qualifications',
      'type',
      'departmentId',
      'active',
      'userNameType',
      'isDeleted',
      'specialities',
      'publications',
      'awards',
      'socialLinks',
      'password',
      'accessType',
      'titleName',
      'bio',
      'experience',
      'registrationNo',
      'profileId'
    ],
    true,
    [false]
  )

  if (accessType) {
    if (accessType !== 'P') {
      Object.assign(doctorData, {
        accessEndTime: new Date(accessEndTime)
      })
    }
  }

  await staffQueries.updatestaff(
    mongoDB,
    {
      userId: staffId,
      hospitalId: user.hospitalId,
      isDeleted: false
    },
    pureData
  )

  res.status(200).json({
    message: 'Doctor details updated successfully',
    staffId
  })
}

export const viewStaff = async (req: Request, res: Response) => {
  const { staffData } = res.locals.shared || {}

  res.status(200).json({
    message: 'Staff member fetched successfully.',
    response: staffData
  })
}

export const bulkCreateStaff = async (req: Request, res: Response) => {
  // const { staffList } = req.body
  // const { user } = res.locals
  //TODO: in feature we will use the SQS
}

export const updateStaff = async (req: Request, res: Response) => {
  const { staffId } = req.params
  const {
    email,
    name,
    phoneNo,
    userName,
    userNameType,
    dateOfBirth,
    gender,
    qualifications,
    active = true,
    type,
    departmentId,
    profileId,
    accessType
  } = req.body

  const { user } = res.locals
  const { accessEndTime, role } = res.locals.shared

  const staffData = {
    userName,
    email,
    name,
    phoneNo,
    role,
    dateOfBirth,
    dob: parse(dateOfBirth, 'dd-MM-yyyy', new Date()),
    gender,
    qualifications,
    type,
    departmentId,
    active,
    userNameType
  }

  const pureUpdateData = removeExtraFieldFormObject(
    staffData,
    [
      'hospitalId',
      'userName',
      'userNameType',
      'phoneNo',
      'role',
      'dateOfBirth',
      'dob',
      'email',
      'name',
      'gender',
      'qualifications',
      'type',
      'departmentId',
      'active',
      'userNameType'
    ],
    true,
    [false]
  )

  if (profileId && ['D', 'T', 'A'].includes(role)) {
    Object.assign(pureUpdateData, { profileId })
  }

  if (accessType) {
    Object.assign(pureUpdateData, {
      accessType
    })
    if (accessType !== 'P') {
      Object.assign(pureUpdateData, {
        accessEndTime: new Date(accessEndTime)
      })
    }
  }

  await staffQueries.updatestaff(
    mongoDB,
    {
      userId: staffId,
      hospitalId: user.hospitalId,
      isDeleted: false
    },
    pureUpdateData
  )

  res.status(200).json({
    message: 'Staff member updated successfully.'
  })
}

export const updateStaffBasicDetails = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { name, userName, dateOfBirth, gender, userNameType } =
    res.locals.shared
  const staffData = {
    name,
    userName,
    dateOfBirth,
    dob: parse(dateOfBirth, 'dd-MM-yyyy', new Date()),
    gender,
    userNameType,
    updatedAt: new Date()
  }

  const pureData = removeExtraFieldFormObject(
    staffData,
    [
      'userName',
      'dateOfBirth',
      'name',
      'gender',
      'dob',
      'userNameType',
      'updatedAt'
    ],
    true,
    [false]
  )
  await staffQueries.updatestaff(
    mongoDB,
    {
      userId: user.userId,
      hospitalId: user.hospitalId,
      isDeleted: { $ne: true }
    },
    pureData
  )

  res.status(200).json({
    // eslint-disable-next-line quotes
    message: "Staff member's basic details updated successfully."
  })
}

export const getStaffList = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { searchCondition, filterCondition } = res.locals.shared

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition = {
    hospitalId: user.hospitalId,
    isDeleted: { $ne: true }
    // test: { $ne: true }
  }

  assignConditions(condition, searchCondition, filterCondition)

  // console.dir({ condition }, { depth: null })

  const [staffList, totalRecords] = await Promise.all([
    staffQueries.getStaffList(mongoDB, condition, page, limit),
    commonQueries.countDocuments(staffQueries.getCollection, mongoDB, condition)
  ])

  res.status(200).json({
    message: 'Staff list fetched successfully.',
    response: {
      list: staffList || [],
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit)
    }
  })
}

export const deleteStaff = async (req: Request, res: Response) => {
  const staffId = getFieldIntoReq(req, 'staffId')
  const { user } = res.locals

  await staffQueries.updatestaff(
    mongoDB,
    {
      userId: staffId,
      hospitalId: user.hospitalId
    },
    {
      isDeleted: true,
      updatedAt: new Date()
    }
  )

  res.status(200).json({
    message: 'Staff member deleted successfully.'
  })
}

export const getTestingStaffList = async (req: Request, res: Response) => {
  const staffList = await commonQueries.findDocuments(
    staffQueries.getCollection,
    mongoDB,
    { role: 'D', test: true }
  )

  res.status(200).json({
    message: 'Staff list fetched successfully.',
    list: staffList || []
  })
}
