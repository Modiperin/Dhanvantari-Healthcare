import mongoDB from 'db'
import * as commonQueries from 'db/queries/common'
import * as pricingQueries from 'db/queries/pricing'
import {
  addNewPrice,
  getPagedServiceList,
  updatePricing
} from 'db/queries/pricing'
import { Request, Response } from 'express'
import { getFieldIntoReq } from 'utils/funcations'
import { assignConditions } from 'utils/searchAndFilter'
import { generateUUID } from 'utils/uuid'

export const createServiceName = async (req: Request, res: Response) => {
  const { name, cost, status = true } = req.body
  const { user } = res.locals

  const pricingData = {
    _id: generateUUID(),
    name: name.trim(),
    cost,
    status,
    hospitalId: user.hospitalId,
    type: 'system',
    currencyType: 'INR',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false
  }

  const priceId = await addNewPrice(mongoDB, pricingData)
  if (!priceId) {
    res.status(500).json({
      message: 'Failed to create serive/payment. Please try again later.'
    })
    return
  }

  // console.log({ pricingData })

  res.status(200).json({
    message: 'Service/Payment created successfully.'
  })
}

export const getServiceById = async (req: Request, res: Response) => {
  const { serviceData } = res.locals.shared || {}
  // console.log({ serviceData })

  res.status(200).json({
    message: 'Service/Payment(s) details fetched successfully.',
    response: serviceData
  })
}

export const getServiceList = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { searchCondition, filterCondition } = res.locals.shared

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition = { hospitalId: user.hospitalId, isDeleted: false }

  assignConditions(condition, searchCondition, filterCondition)

  const [serviceList, totalRecords] = await Promise.all([
    getPagedServiceList(mongoDB, condition, page, limit),
    commonQueries.countDocuments(
      pricingQueries.getCollection,
      mongoDB,
      condition
    )
  ])

  res.status(200).json({
    message: 'Service/Pricing list fetched successfully.',
    response: {
      list: serviceList || [],
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit)
    }
  })
}

export const deleteService = async (req: Request, res: Response) => {
  const serviceId = getFieldIntoReq(req, 'serviceId')

  await commonQueries.updateDocument(
    pricingQueries.getCollection,
    mongoDB,
    {
      _id: serviceId,
      hospitalId: res.locals.user.hospitalId
    },
    {
      $set: {
        isDeleted: true,
        updatedAt: new Date()
      }
    }
  )
  res.status(200).json({
    message: 'Service/Payment(s) deleted successfully.'
  })
}

export const updateService = async (req: Request, res: Response) => {
  const { serviceId } = req.params
  const { name, cost, status = true } = req.body
  const { user } = res.locals

  const pricingData = {
    _id: serviceId,
    name: name.trim(),
    cost,
    status,
    hospitalId: user.hospitalId,
    type: 'system',
    currencyType: 'INR',
    updatedAt: new Date()
  }

  await updatePricing(
    mongoDB,
    { _id: serviceId, hospitalId: user.hospitalId },
    pricingData
  )

  res.status(200).json({
    message: 'Service/Payment updated successfully.'
  })
}
