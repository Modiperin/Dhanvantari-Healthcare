import { Request, Response } from 'express'
import * as paymentQueries from 'db/queries/payments'
import * as commonQueries from 'db/queries/common'
import { AnyType } from 'types'
import err, { handleMultipleErrors } from 'utils/err'
import { multipleErrorsSymbol } from '../middlewares/validate'
import { getFieldIntoReq, setFieldsIntoLocals } from 'utils/funcations'
import { PaymodesType } from 'types/payment'
import mongoDB from 'db'
import { filterSearchHelper, keywordSearchHelper } from 'utils/searchAndFilter'
import { getDateRangeFromAgeRange } from 'utils/dateAndTime'
import { endOfDay, isValid, parse, startOfDay } from 'date-fns'

export const isPaymentIdValid = async (req: Request, res: Response) => {
  const paymentId = getFieldIntoReq(req, 'paymentId')
  const patientId = getFieldIntoReq(req, 'patientId')
  const visitId = getFieldIntoReq(req, 'visitId')
  const { user } = res.locals

  const condition = {
    hospitalId: user.hospitalId
  }

  if (paymentId) {
    Object.assign(condition, { _id: paymentId })
  } else if (patientId && visitId) {
    Object.assign(condition, { patientId, visitId })
  }

  const paymentData = await paymentQueries.getPaymentDetailsByCondition(
    mongoDB,
    condition
  )

  if (!paymentData) {
    return {
      message: 'Payment not found.',
      field: 'paymentId'
    }
  }

  setFieldsIntoLocals(res, {
    paymentData
  })

  return null
}

export const isPaymentAlredyExists = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors || []
  const { patientId, visitId } = req.body

  if (previousErrors.length || !patientId || !visitId) return null

  const { user } = res.locals

  const paymentData = await paymentQueries.getPaymentDetailsByCondition(
    mongoDB,
    {
      patientId,
      visitId,
      hospitalId: user.hospitalId
    }
  )

  if (paymentData) {
    return {
      message: 'Payment already exists.',
      field: 'general'
    }
  }

  return null
}

export const isPaymentsValid = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors || []
  if (previousErrors.length) return null

  const { payments } = req.body

  if (!Array.isArray(payments) || !payments.length) {
    return {
      message: 'Please provide at least one payment.',
      field: 'payments'
    }
  }

  const errors: { field: string; message: string }[] = []

  payments.forEach((item: AnyType, idx: number) => {
    if (!item.name) {
      errors.push({
        field: `payments.${idx}.name`,
        message: 'Each payment must have a name.'
      })
    }
    if (!item.amount || typeof item.amount !== 'number' || item.amount <= 0) {
      errors.push({
        field: `payments.${idx}.amount`,
        message: 'Amount must be a positive number.'
      })
    }

    if (!item.unit || typeof item.unit !== 'number' || item.unit <= 0) {
      errors.push({
        field: `payments.${idx}.unit`,
        message: 'Unit must be a positive number.'
      })
    }

    if (item.discount && typeof item.discount !== 'number') {
      errors.push({
        field: `payments.${idx}.discount`,
        message: 'Discount must be a number.'
      })
    }
    if (item.tax && typeof item.tax !== 'number') {
      errors.push({
        field: `payments.${idx}.tax`,
        message: 'Tax must be a number.'
      })
    }
    if (item.total && typeof item.total !== 'number') {
      errors.push({
        field: `payments.${idx}.total`,
        message: 'Total must be a number.'
      })
    }
    if (item.paymentMode && typeof item.paymentMode !== 'string') {
      errors.push({
        field: `payments.${idx}.paymentMode`,
        message: 'Payment mode must be a string.'
      })
    }
    if (item.status && typeof item.status !== 'string') {
      errors.push({
        field: `payments.${idx}.status`,
        message: 'Status must be a string.'
      })
    }

    if (item.dueAmount && item.dueAmount > item.amount) {
      errors.push({
        field: `payments.${idx}.dueAmount`,
        message: 'Due amount must be less than or equal to the total amount.'
      })
    }
  })

  if (errors.length) {
    return handleMultipleErrors(errors, multipleErrorsSymbol)
  }

  setFieldsIntoLocals(res, {
    payments
  })

  return null
}

export const isPaymodesValid = async (req: Request, res: Response) => {
  const { paymodes, from } = req.body
  if (from === 'doctor-opd' && !paymodes.length) return null
  if (!Array.isArray(paymodes) || !paymodes.length) {
    return {
      message: 'Please provide at least one payment mode.',
      field: 'paymodes'
    }
  }

  const errors: { field: string; message: string }[] = []

  paymodes.forEach((item: PaymodesType, idx: number) => {
    if (!item.type) {
      errors.push({
        field: `paymodes.${idx}.type`,
        message: 'Each payment mode must have a type.'
      })
    }
    if (item.amount && typeof item.amount !== 'number') {
      errors.push({
        field: `paymodes.${idx}.amount`,
        message: 'Invalid amount. It must be a number.'
      })
    }
  })

  if (errors.length) {
    return handleMultipleErrors(errors, multipleErrorsSymbol)
  }

  setFieldsIntoLocals(res, {
    paymodes
  })

  return null
}

export const invoiceKeywordSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const { q } = req.query

  if (!('q' in req.query)) {
    setFieldsIntoLocals(res, {
      searchCondition: {}
    })
    return null
  }

  let allowedKeywordToSerach = ['invoiceId', 'visitId', 'grandTotal']

  const searchCondition = keywordSearchHelper(allowedKeywordToSerach, String(q))

  setFieldsIntoLocals(res, {
    searchCondition
  })

  return null
}

export const filterSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const {
    ageStart,
    ageEnd,
    gender,
    startDate,
    endDate,
    status,
    isAmountPaid,
    grandTotalEnd,
    grandTotalStart
  } = req.query
  let patientFilter: any
  let result: any
  if (req.path.split('/')[2] === 'invoice') {
    patientFilter = filterSearchHelper({
      'patientDetails.gender': {
        value: gender,
        multi: true,
        type: 'string'
      }
    })
    result = filterSearchHelper({
      isAmountPaid: {
        value: isAmountPaid,
        multi: true,
        type: 'boolean'
      }
    })
  } else {
    patientFilter = filterSearchHelper(
      {
        gender: {
          value: gender,
          multi: true,
          type: 'string'
        }
      },
      true
    )
    result = filterSearchHelper(
      {
        status: {
          value: status,
          multi: true,
          type: 'string'
        },
        'paymentDetails.isAmountPaid': {
          value: isAmountPaid,
          multi: true,
          type: 'boolean'
        }
      },
      true
    )
  }

  let rangeFilters = {}
  if (grandTotalEnd || grandTotalStart) {
    Object.assign(rangeFilters, {
      grandTotal: {
        $gte: Number(grandTotalStart) || 0,
        $lte: Number(grandTotalEnd) || Infinity
      }
    })
  }

  if (ageStart || ageEnd) {
    const dateRange = getDateRangeFromAgeRange(Number(ageStart), Number(ageEnd))

    if (dateRange) {
      setFieldsIntoLocals(res, {
        ...dateRange
      })
    }
  }

  if (startDate || endDate) {
    // Parse the dates in 'yyyy-MM-dd' format
    const parsedStart = parse(String(startDate), 'dd-MM-yyyy', new Date())
    const parsedEnd = parse(String(endDate), 'dd-MM-yyyy', new Date())

    if (!isValid(parsedStart) || !isValid(parsedEnd)) {
      return err('Please provide valid startDate and endDate.', 'date')
    }

    const startDateInUserTimezone = startOfDay(parsedStart)
    const endDateInUserTimezone = endOfDay(parsedEnd)

    setFieldsIntoLocals(res, {
      startDate: startDateInUserTimezone,
      endDate: endDateInUserTimezone
    })
  }

  setFieldsIntoLocals(res, {
    filterCondition: result.filterData,
    patientFilterCondition: patientFilter.filterData,
    rangeFilters
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

  let allowedKeywordToSerach = []
  if (req.path.split('/')[2] === 'invoice') {
    allowedKeywordToSerach.push(
      'patientDetails.email',
      'patientDetails.userName',
      'patientDetails.name'
    )
  } else {
    allowedKeywordToSerach.push('email', 'userName', 'name')
  }

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

export const isInvoiceIdValid = async (req: Request, res: Response) => {
  const invoiceIds = getFieldIntoReq(req, 'invoiceIds')
  const { user } = res.locals

  const invoiceData = await commonQueries.findDocuments(
    paymentQueries.getCollection,
    mongoDB,
    {
      invoiceId: { $in: invoiceIds },
      hospitalId: user.hospitalId
    }
  )

  if (
    !invoiceData ||
    !invoiceData.length ||
    invoiceData.length !== invoiceIds.length
  ) {
    return {
      message: 'Invoice not found.',
      field: 'invoiceIds'
    }
  }

  setFieldsIntoLocals(res, {
    invoiceData
  })

  return null
}
