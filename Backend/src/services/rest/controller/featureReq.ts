import { Request, Response } from 'express'
import { generateUUID } from 'utils/uuid'
import * as featureReqQueries from 'db/queries/featureReq'
import mongoDB from 'db'
import { Document } from 'mongodb'

export const createFeatureRequest = async (req: Request, res: Response) => {
  const { title, description } = req.body
  const { user } = res.locals || {}

  const data: Document = {
    _id: generateUUID(),
    userId: user.userId,
    title,
    description,
    status: 'Pending',
    hospitalId: user.hospitalId,
    createdAt: new Date()
  }

  await featureReqQueries.getCollection(mongoDB).insertOne(data)

  res.status(200).json({
    message: 'Feature request created successfully.',
    data
  })
}

export const getFeatureRequestList = async (req: Request, res: Response) => {
  const { user } = res.locals || {}
  const { hospitalId } = user || {}

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition: Document = {
    hospitalId,
    userId: user.userId
  }

  const [featureRequests, totalRecords] = await Promise.all([
    featureReqQueries.getFeatureRequestsByCondition(
      mongoDB,
      condition,
      {},
      (page - 1) * limit,
      limit
    ),
    featureReqQueries.getCollection(mongoDB).countDocuments(condition)
  ])

  res.status(200).json({
    message: 'Feature requests retrieved successfully.',
    response: {
      list: featureRequests,
      currentPage: page,
      pageLimit: limit,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords
    }
  })
}
