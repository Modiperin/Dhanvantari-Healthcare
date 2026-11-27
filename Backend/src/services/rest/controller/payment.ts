import { Request, Response } from 'express'
import mongoDB from 'db'
import * as commonQueries from 'db/queries/common'
import * as paymentQueries from 'db/queries/payments'
import * as paymentLogsQueries from 'db/queries/paymentLogs'
import * as visitQueries from 'db/queries/patientVisits'
import * as patientQueries from 'db/queries/patient'
import { PaymentType } from 'types/payment'
import { generateInvoiceId, generateUUID } from 'utils/uuid'
import { getFieldIntoReq } from 'utils/funcations'
import { generatePaymentLogs } from 'utils/payment'
import { AnyType, DynamicObjectType } from 'types'
import { endOfDay, startOfDay } from 'date-fns'
import {
  assignConditions,
  assignDateRangeCondition
} from 'utils/searchAndFilter'
import { Document } from 'mongodb'

export const viewPayment = async (req: Request, res: Response) => {
  const { paymentData } = res.locals.shared || {}

  if (paymentData?.patientId) {
    const patientData = await patientQueries.getPatientByCondition(
      mongoDB,
      {
        _id: paymentData.patientId,
        hospitalId: paymentData.hospitalId
      },
      {
        name: 1,
        serialId: 1,
        phoneNo: 1
      }
    )

    if (patientData) {
      Object.assign(paymentData, {
        patientData
      })
    }
  }

  res.status(200).json({
    message: 'Payment details fetched successfully.',
    response: paymentData
  })
}

export const viewDuesDetails = async (req: Request, res: Response) => {
  const { patientId } = req.params
  const { user } = res.locals

  const condition = {
    patientId,
    hospitalId: user.hospitalId,
    dueAmount: { $gt: 0 }
  }

  const amountDues = await paymentQueries.getPaymentDuesForPatient(
    mongoDB,
    condition
  )

  res.status(200).json({
    message: 'Dues for the patient fetched successfully',
    response: amountDues
  })
}

export const createPayment = async (req: Request, res: Response) => {
  const { payments, paymodes, patientId, visitId, patientData } =
    res.locals.shared
  const { user } = res.locals

  // Filter and assign payment unique IDs to every payment
  const notCancelledPayments = payments.filter((p: PaymentType) => {
    const payId = generateUUID()
    Object.assign(p, { payId })
    return p.status !== 'cancelled' //  pending, due, completed, cancelled
  }) as PaymentType[]

  const duePayments = payments.filter(
    (p: PaymentType) => p?.dueAmount > 0
  ) as PaymentType[]

  const totalAmount = notCancelledPayments.reduce(
    (sum, p) => sum + p.amount * p.unit,
    0
  )

  const nonPendingPaymentsFromDoctorOPD = payments.filter((p: PaymentType) => {
    return p.status !== 'pending' //  pending, due, completed, cancelled
  }) as PaymentType[]

  console.log({ nonPendingPaymentsFromDoctorOPD })

  const dueAmount = duePayments.reduce((sum, p) => sum + p.dueAmount, 0)

  const totalDiscount = notCancelledPayments.reduce(
    (sum, p) => sum + p.discount,
    0
  )

  const totalTax = notCancelledPayments.reduce(
    (sum, p) => sum + (p.tax * (p.amount * p.unit - p.discount)) / 100,
    0
  )

  const grandTotal = totalAmount - totalDiscount + totalTax
  const paidAmount = (
    (nonPendingPaymentsFromDoctorOPD as PaymentType[]) || []
  ).reduce((sum, pm) => {
    if (pm.dueAmount > 0)
      return (
        sum +
          (pm.unit * pm.amount -
            pm.discount +
            (pm.tax * (pm.amount * pm.unit - pm.discount)) / 100) -
          pm.dueAmount || 0
      )
    return (
      sum +
      (pm.unit * pm.amount -
        pm.discount +
        (pm.tax * (pm.amount * pm.unit - pm.discount)) / 100 || 0)
    )
  }, 0)

  const isAmountPaid = dueAmount <= 0 && paidAmount === grandTotal
  const pendingAmount = grandTotal - paidAmount

  const invoiceId = generateInvoiceId(patientData.serialId)

  const paymentData = {
    _id: generateUUID(),
    invoiceId,
    patientId,
    visitId,
    payments,
    totalAmount,
    totalDiscount,
    totalTax,
    grandTotal,
    paidAmount,
    dueAmount,
    paymodes,
    pendingAmount,
    isAmountPaid,
    hospitalId: user.hospitalId,
    createdBy: user.userId,
    updatedBy: user.userId,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  await Promise.all([
    commonQueries.createDocument(
      paymentQueries.getCollection,
      mongoDB,
      paymentData
    )
  ])

  res.status(201).json({
    message: 'Payment created successfully.'
  })
}

export const updatePayment = async (req: Request, res: Response) => {
  const paymentId = getFieldIntoReq(req, 'paymentId')
  const { payments, paymodes, paymentData: oldPaymentData } = res.locals.shared
  const { user } = res.locals
  const updatedBy = user.userId

  // If payId is not provided, generate a new one
  const notCancelledPayments = payments.filter((p: PaymentType) => {
    const payId = generateUUID()
    Object.assign(p, { payId })
    return p.status !== 'cancelled' //  pending, due, completed, cancelled
  }) as PaymentType[]

  // console.log({ pendingPayments })

  const duePayments = payments.filter(
    (p: PaymentType) => p.dueAmount > 0
  ) as PaymentType[]

  const totalAmount = notCancelledPayments.reduce(
    (sum, p) => sum + p.amount * p.unit,
    0
  )

  const nonPendingPaymentsFromDoctorOPD = payments.filter((p: PaymentType) => {
    return p.status !== 'pending' //  pending, due, completed, cancelled
  }) as PaymentType[]

  console.log({ nonPendingPaymentsFromDoctorOPD })

  const dueAmount = duePayments.reduce((sum, p) => sum + p.dueAmount, 0)

  const totalDiscount = notCancelledPayments.reduce(
    (sum, p) => sum + p.discount,
    0
  )
  const totalTax = notCancelledPayments.reduce(
    (sum, p) => sum + (p.tax * (p.amount * p.unit - p.discount)) / 100,
    0
  )

  const grandTotal = totalAmount - totalDiscount + totalTax
  const paidAmount = (
    (nonPendingPaymentsFromDoctorOPD as PaymentType[]) || []
  ).reduce((sum, pm) => {
    if (pm.dueAmount > 0)
      return (
        sum +
          (pm.amount * pm.unit -
            pm.discount +
            (pm.tax * (pm.amount * pm.unit - pm.discount)) / 100) -
          pm.dueAmount || 0
      )
    return (
      sum +
      (pm.amount * pm.unit -
        pm.discount +
        (pm.tax * (pm.amount * pm.unit - pm.discount)) / 100 || 0)
    )
  }, 0)

  const isAmountPaid = dueAmount === 0 && paidAmount === grandTotal
  const pendingAmount = grandTotal - paidAmount
  const updateData = {
    payments,
    paymodes,
    totalAmount,
    totalDiscount,
    totalTax,
    grandTotal,
    paidAmount,
    dueAmount,
    updatedBy,
    isAmountPaid,
    pendingAmount,
    updatedAt: new Date()
  }

  const paymentLogs = generatePaymentLogs(
    oldPaymentData.payments,
    payments,
    oldPaymentData.visitId,
    paymentId,
    updatedBy
  )

  await Promise.all([
    commonQueries.updateDocument(
      paymentQueries.getCollection,
      mongoDB,
      { _id: paymentId },
      {
        $set: updateData
      }
    ),
    paymentLogs.length && paymentLogsQueries.addPaymentLog(mongoDB, paymentLogs)
  ])

  res.status(200).json({ message: 'Payment updated successfully.' })
}

export const getPaymentQueue = async (req: Request, res: Response) => {
  const { user } = res.locals || {}

  let {
    searchCondition,
    filterCondition,
    patientFilterCondition,
    startDate,
    endDate,
    ageStartDate,
    ageEndDate
  } = res.locals.shared

  // Set startDate and endDate to today if not provided
  if (!startDate || !endDate) {
    const now = new Date()
    startDate = startOfDay(now)
    endDate = endOfDay(now)
  }

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition: AnyType = {
    hospitalId: user.hospitalId
  }

  const extraCondition = { ...searchCondition }

  assignConditions(extraCondition, filterCondition, {})
  assignConditions(extraCondition, patientFilterCondition, {})
  assignDateRangeCondition(extraCondition, 'dob', ageStartDate, ageEndDate)
  assignDateRangeCondition(condition, 'createdAt', startDate, endDate)

  const [visitList, totalCount] = await Promise.all([
    visitQueries.getVisitListByConditionForPayment(
      mongoDB,
      condition,
      extraCondition,
      page,
      limit
    ),
    visitQueries.getVisitCountByCondition(mongoDB, condition, extraCondition)
  ])

  const totalRecords =
    (Array.isArray(totalCount) && totalCount[0] && totalCount[0].count) || 0

  res.status(200).json({
    message: 'Payment list fetched successfully.',
    response: {
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      list: visitList || []
    }
  })
}

export const getPatientPaymentList = async (req: Request, res: Response) => {
  const { patientId } = req.params
  const { user } = res.locals
  const { patientData, searchCondition, startDate, endDate } =
    res.locals.shared || {}

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const conditions = {
    patientId: patientId,
    hospitalId: user.hospitalId
  }

  assignConditions(conditions, searchCondition, {})
  assignDateRangeCondition(conditions, 'createdAt', startDate, endDate)

  const [paymentList, totalRecords] = await Promise.all([
    paymentQueries.getPaymentListByCondition(mongoDB, conditions, page, limit),
    commonQueries.countDocuments(
      paymentQueries.getCollection,
      mongoDB,
      conditions
    )
  ])

  const patientDetails = {
    name: patientData?.name || '',
    serialId: patientData?.serialId || '',
    email: patientData?.email || '',
    phoneNo: patientData?.phoneNo || '',
    dob: patientData?.dob || '',
    gender: patientData?.gender || '',
    dateOfBirth: patientData?.dateOfBirth || ''
  }

  res.status(200).json({
    message: 'Patient payment list fetched successfully.',
    response: {
      list: paymentList || [],
      patientData: patientDetails || {},
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit)
    }
  })
}

export const invoiceList = async (req: Request, res: Response) => {
  const { user } = res.locals
  let {
    searchCondition,
    filterCondition,
    patientFilterCondition,
    startDate,
    endDate,
    ageStartDate,
    ageEndDate,
    rangeFilters
  } = res.locals.shared

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition: AnyType = {
    hospitalId: user.hospitalId
  }

  const extraCondition = { ...searchCondition }
  assignConditions(condition, filterCondition, {})
  assignConditions(extraCondition, patientFilterCondition, {})
  assignDateRangeCondition(
    extraCondition,
    'patientDetails.dob',
    ageStartDate,
    ageEndDate
  )
  assignDateRangeCondition(condition, 'createdAt', startDate, endDate)
  assignConditions(condition, rangeFilters, {})

  // console.dir({ condition, extraCondition }, { depth: null })

  const [invoiceList, totalCount] = await Promise.all([
    paymentQueries.getAllInvoiceList(
      mongoDB,
      condition,
      extraCondition,
      page,
      limit
    ),
    paymentQueries.getAllInvoiceCount(mongoDB, condition, extraCondition)
  ])

  // console.log({ invoiceList, totalCount })

  const totalRecords =
    (Array.isArray(totalCount) && totalCount[0] && totalCount[0].count) || 0

  res.status(200).json({
    message: 'Payment list fetched successfully.',
    response: {
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      list: invoiceList || []
    }
  })
}

export const getInvoicePaymentsCard = async (req: Request, res: Response) => {
  const { user } = res.locals
  let {
    searchCondition,
    filterCondition,
    patientFilterCondition,
    startDate,
    endDate,
    ageStartDate,
    ageEndDate,
    rangeFilters
  } = res.locals.shared

  const conditions: AnyType = {
    hospitalId: user.hospitalId
  }

  const extraCondition = { ...searchCondition }
  assignConditions(extraCondition, filterCondition, {})
  assignConditions(extraCondition, patientFilterCondition, {})
  assignDateRangeCondition(
    extraCondition,
    'patientDetails.dob',
    ageStartDate,
    ageEndDate
  )
  assignDateRangeCondition(conditions, 'createdAt', startDate, endDate)
  assignConditions(conditions, rangeFilters, {})

  // console.dir({ conditions, extraCondition }, { depth: null })
  const paymentCard = await paymentQueries.getInvoiceCard(
    mongoDB,
    conditions,
    extraCondition
  )
  res.status(200).json({
    message: 'Patient payment card fetched successfully.',
    response: {
      totalPaymentCount: paymentCard[0]?.totalPaymentCount || 0,
      totalPayment: paymentCard[0]?.totalPayment || 0,
      paidAmount: paymentCard[0]?.paidAmount || 0,
      dueAmount: paymentCard[0]?.dueAmount || 0,
      unpaidVisitCount: paymentCard[0]?.unpaidVisitCount || 0
    }
  })
}

export const getPatientPaymentCard = async (req: Request, res: Response) => {
  const { patientId } = req.params
  const { user } = res.locals

  const conditions = {
    patientId,
    hospitalId: user.hospitalId
  }

  const paymentCard = await paymentQueries.getPaymentCardByCondition(
    mongoDB,
    conditions
  )

  res.status(200).json({
    message: 'Patient payment card fetched successfully.',
    response: {
      totalPaymentCount: paymentCard[0]?.totalPaymentCount || 0,
      totalPayment: paymentCard[0]?.totalPayment || 0,
      paidAmount: paymentCard[0]?.paidAmount || 0,
      dueAmount: paymentCard[0]?.dueAmount || 0,
      pendingAmount: paymentCard[0]?.pendingAmount || 0,
      unpaidVisitCount: paymentCard[0]?.unpaidVisitCount || 0
    }
  })
}

export const getPatientPaymentLogs = async (req: Request, res: Response) => {
  const { paymentId } = req.params

  const conditions = {
    paymentId
  }

  const paymentLogs = await paymentLogsQueries.getPaymentLogsByCondition(
    mongoDB,
    conditions
  )

  res.status(200).json({
    message: 'Patient payment logs fetched successfully.',
    response: paymentLogs || []
  })
}

export const settleUpDues = async (req: Request, res: Response) => {
  const { user } = res.locals || {}
  const { invoiceData } = res.locals.shared || {}

  const logs: Document[] = []
  const paymentIds: string[] = []

  invoiceData.forEach((inv: DynamicObjectType) => {
    if (inv.dueAmount > 0) {
      paymentIds.push(inv._id)
      logs.push({
        paymentId: inv._id,
        visitId: inv.visitId,
        paidFrom: inv.invoiceId,
        settlementAmount: inv.dueAmount,
        changeType: 'settlement',
        oldData: inv,
        timestamp: new Date(),
        updatedBy: user.userId
      })
    }
  })

  await Promise.all([
    paymentQueries.settleupPreviosDues(mongoDB, {
      _id: { $in: paymentIds }
    }),
    logs.length && paymentLogsQueries.addPaymentLog(mongoDB, logs)
  ])

  res.status(200).json({
    message: 'Dues settled successfully.',
    response: { paymentIds }
  })
}
