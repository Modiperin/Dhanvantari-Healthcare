import { Response, Request } from 'express'
import * as commonQueries from 'db/queries/common'
import * as profileQueries from 'db/queries/profile'
import mongoDB from 'db'
import { generateUUID } from 'utils/uuid'
import { assignConditions } from 'utils/searchAndFilter'

export const getProfile = async (req: Request, res: Response) => {
  const { profileData } = res.locals.shared

  res.status(200).json({
    message: 'Profile fetched successfully.',
    response: profileData
  })
}

export const createProfile = async (req: Request, res: Response) => {
  const { name, access, desc, role } = req.body
  const { user } = res.locals

  const profileData = {
    _id: generateUUID(),
    name: name.trim(),
    access,
    desc,
    hospitalId: user.hospitalId,
    createdBy: user._id,
    createdAt: new Date(),
    updatedAt: new Date(),
    role: role
  }

  await commonQueries.createDocument(
    profileQueries.getCollection,
    mongoDB,
    profileData
  )

  res.status(201).json({
    message: 'Profile created successfully.'
  })
}

export const updateProfile = async (req: Request, res: Response) => {
  const { profileId } = req.params
  const { name, access, desc, role } = req.body
  const { user } = res.locals

  const updateData = {
    name: name.trim(),
    access,
    desc,
    updatedAt: new Date(),
    role
  }

  await commonQueries.updateDocument(
    profileQueries.getCollection,
    mongoDB,
    { _id: profileId, hospitalId: user.hospitalId },
    {
      $set: updateData
    }
  )

  res.status(200).json({
    message: 'Profile updated successfully.'
  })
}

export const getProfileList = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { searchCondition, filterCondition } = res.locals.shared

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition = { hospitalId: user.hospitalId }

  assignConditions(condition, searchCondition, filterCondition)

  const [profiles, totalRecords] = await Promise.all([
    await profileQueries.getProfileListByCondition(
      mongoDB,
      condition,
      page,
      limit
    ),
    commonQueries.countDocuments(
      profileQueries.getCollection,
      mongoDB,
      condition
    )
  ])

  res.status(200).json({
    message: 'Profiles fetched successfully.',
    response: {
      list: profiles || [],
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit)
    }
  })
}

export const deleteProfile = async (req: Request, res: Response) => {
  const { profileId } = req.params
  const { user } = res.locals

  await commonQueries.updateDocument(
    profileQueries.getCollection,
    mongoDB,
    {
      _id: profileId,
      hospitalId: user.hospitalId
    },
    {
      $set: {
        isDeleted: true,
        updatedAt: new Date()
      }
    }
  )

  res.status(200).json({
    message: 'Profile deleted successfully.'
  })
}
