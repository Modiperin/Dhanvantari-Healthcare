import mongoDB from 'db'
import { getServiceByCondition } from 'db/queries/pricing'
import { Request, Response } from 'express'
import err from 'utils/err'
import { getFieldIntoReq, setFieldsIntoLocals } from 'utils/funcations'
import { keywordSearchHelper } from 'utils/searchAndFilter'

export const isServicePriceNameValid = async (req: Request, res: Response) => {
  const { name } = req.body

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return err('Please provide a valid service/payment name.', 'name')
  }

  return null
}

export const isCostValid = async (req: Request, res: Response) => {
  const { cost } = req.body

  if (cost <= 0 || typeof cost !== 'number') {
    return err('Please provide a valid cost.', 'cost')
  }
}

export const isStatusValid = async (req: Request, res: Response) => {
  const { status = true } = req.body

  if (typeof status !== 'boolean') {
    return err('Please provide a valid active status.', 'active')
  }

  return null
}

export const isServiceIdValid = async (req: Request, res: Response) => {
  const serviceId = getFieldIntoReq(req, 'serviceId')
  const { user } = res.locals || {}
  if (!serviceId || typeof serviceId !== 'string' || serviceId.trim() === '') {
    return err('Please provide a valid staff ID.', 'staffId')
  }

  const existingService = await getServiceByCondition(mongoDB, {
    _id: serviceId,
    hospitalId: user.hospitalId
  })

  if (!existingService) {
    return err('Service not found.', 'serviceId')
  }

  setFieldsIntoLocals(res, {
    serviceData: existingService
  })
  return null
}

export const keywordSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const { q, searchBy } = req.query

  if (!('q' in req.query)) {
    setFieldsIntoLocals(res, {
      searchCondition: {}
    })
    return null
  }

  let allowedKeywordToSerach = ['name']

  if (searchBy) {
    allowedKeywordToSerach = allowedKeywordToSerach.filter(
      (keyword) => keyword === searchBy
    )
  }

  const searchCondition = keywordSearchHelper(allowedKeywordToSerach, String(q))

  setFieldsIntoLocals(res, {
    searchCondition
  })

  return null
}
