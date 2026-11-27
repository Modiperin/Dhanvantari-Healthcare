import { Request, Response } from 'express'
import { PaymentType, PaymodesType } from 'types/payment'
import { getFieldIntoReq } from 'utils/funcations'
import { generateInvoiceId, generateUUID } from 'utils/uuid'
import * as commonQueries from 'db/queries/common'
import * as pharmacyQueries from 'db/queries/pharmacy'
import * as visitQueries from 'db/queries/patientVisits'
import * as patientQueries from 'db/queries/patient'
import mongoDB from 'db'
import { endOfDay, startOfDay } from 'date-fns'
import { AnyType } from 'types'
import {
  assignConditions,
  assignDateRangeCondition
} from 'utils/searchAndFilter'

export const createPharmacy = async (req: Request, res: Response) => {
  const { pharmacies, paymodes, patientId, visitId, patientData } =
    res.locals.shared
  const { user } = res.locals

  // Filter and assign payment unique IDs to every payment
  const notCancelledPharmacies = pharmacies.filter((p: PaymentType) => {
    const payId = generateUUID()
    Object.assign(p, { payId })
    return p.status === 'completed' //  pending, completed, cancelled
  }) as PaymentType[]

  const pendingPharmacies = pharmacies.filter(
    (p: PaymentType) => p.status === 'pending'
  ) as PaymentType[]

  const totalAmount = notCancelledPharmacies.reduce(
    (sum, p) => sum + p.amount * p.unit,
    0
  )

  const pendingAmount = pendingPharmacies.reduce(
    (sum, p) => sum + p.amount * p.unit,
    0
  )

  const totalDiscount = notCancelledPharmacies.reduce(
    (sum, p) => sum + p.discount,
    0
  )
  const totalTax = notCancelledPharmacies.reduce(
    (sum, p) => sum + (p.tax * (p.amount * p.unit - p.discount)) / 100,
    0
  )

  const grandTotal = totalAmount + pendingAmount - totalDiscount + totalTax
  const paidAmount = ((paymodes as PaymodesType[]) || []).reduce((sum, pm) => {
    return sum + (pm.amount || 0)
  }, 0)

  // const dueAmount = grandTotal - paidAmount - pendingAmount

  // const isAmountPaid = dueAmount <= 0 || pendingAmount <= 0
  const isAmountPaid = pendingAmount <= 0

  const invoiceId = generateInvoiceId(patientData.serialId)

  const pharmaciesData = {
    _id: generateUUID(),
    invoiceId,
    patientId,
    visitId,
    pharmacies,
    totalAmount,
    totalDiscount,
    totalTax,
    grandTotal,
    paidAmount,
    // dueAmount,
    paymodes,
    isAmountPaid,
    hospitalId: user.hospitalId,
    createdBy: user.userId,
    updatedBy: user.userId,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  console.dir({ pharmaciesData }, { depth: null })

  await commonQueries.createDocument(
    pharmacyQueries.getCollection,
    mongoDB,
    pharmaciesData
  )

  res.status(201).json({
    message: 'Pharmacy created successfully.'
  })
}

export const updatePharmacy = async (req: Request, res: Response) => {
  const pharmacyId = getFieldIntoReq(req, 'pharmacyId')
  const {
    pharmacies,
    paymodes,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    pharmacyData: oldPharmacyData
  } = res.locals.shared
  const { user } = res.locals
  const updatedBy = user.userId

  // If payId is not provided, generate a new one
  const notCancelledPharmacies = pharmacies.filter((p: PaymentType) => {
    if (!p.payId) {
      p.payId = generateUUID()
    }
    return p.status === 'completed'
  }) as PaymentType[]

  const pendingPharmacies = pharmacies.filter(
    (p: PaymentType) => p.status === 'pending'
  ) as PaymentType[]

  const totalAmount = notCancelledPharmacies.reduce(
    (sum, p) => sum + p.amount * p.unit,
    0
  )

  const pendingAmount = pendingPharmacies.reduce(
    (sum, p) => sum + p.amount * p.unit,
    0
  )

  const totalDiscount = notCancelledPharmacies.reduce(
    (sum, p) => sum + p.discount,
    0
  )
  const totalTax = notCancelledPharmacies.reduce(
    (sum, p) => sum + (p.tax * (p.amount - p.discount)) / 100,
    0
  )

  const grandTotal = totalAmount + pendingAmount - totalDiscount + totalTax
  const paidAmount = ((paymodes as PaymodesType[]) || []).reduce(
    (sum, pm) => sum + (pm.amount || 0),
    0
  )

  // const dueAmount = grandTotal - paidAmount - pendingAmount

  // const isAmountPaid = dueAmount <= 0 || pendingAmount <= 0
  const isAmountPaid = pendingAmount <= 0

  const updateData = {
    pharmacies,
    paymodes,
    totalAmount,
    totalDiscount,
    pendingAmount,
    totalTax,
    grandTotal,
    paidAmount,
    // dueAmount,
    updatedBy,
    isAmountPaid,
    updatedAt: new Date()
  }
  // console.log(updateData)

  // const paymentLogs = generatePaymentLogs(
  //   oldPharmacyData.payments,
  //   payments,
  //   oldPharmacyData.visitId,
  //   pharmacyId,
  //   updatedBy
  // )

  await Promise.all([
    commonQueries.updateDocument(
      pharmacyQueries.getCollection,
      mongoDB,
      { _id: pharmacyId },
      {
        $set: updateData
      }
    )
    // paymentLogs.length && paymentLogsQueries.addPaymentLog(mongoDB, paymentLogs)
  ])

  res.status(200).json({ message: 'Pharmacy updated successfully.' })
}

export const getPharmacyQueue = async (req: Request, res: Response) => {
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
  //   assignConditions(extraCondition,{
  //   $or: [
  //     { "paymentDetails.isAmountPaid": false },
  //     { "paymentDetails.isAmountPaid": { $exists: false } }
  //   ]
  // },{})

  assignConditions(extraCondition, filterCondition, {})
  assignConditions(extraCondition, patientFilterCondition, {})
  assignDateRangeCondition(extraCondition, 'dob', ageStartDate, ageEndDate)
  assignDateRangeCondition(condition, 'createdAt', startDate, endDate)

  // console.dir({ condition, extraCondition }, { depth: null })

  const [visitList, totalCount] = await Promise.all([
    visitQueries.getVisitListByConditionForPharmacy(
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
    message: 'Pharmacy list fetched successfully.',
    response: {
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      list: visitList || []
    }
  })
}

export const pharmacyInvoiceList = async (req: Request, res: Response) => {
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

  const [invoiceList, totalCount] = await Promise.all([
    pharmacyQueries.getAllInvoiceList(
      mongoDB,
      condition,
      extraCondition,
      page,
      limit
    ),
    pharmacyQueries.getAllInvoiceCount(mongoDB, condition, extraCondition)
  ])

  const totalRecords =
    (Array.isArray(totalCount) && totalCount[0] && totalCount[0].count) || 0

  res.status(200).json({
    message: 'Pharmacies list fetched successfully.',
    response: {
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      list: invoiceList || []
    }
  })
}

export const viewPharmacy = async (req: Request, res: Response) => {
  const { pharmacyData } = res.locals.shared || {}

  if (pharmacyData?.patientId) {
    const patientData = await patientQueries.getPatientByCondition(
      mongoDB,
      {
        _id: pharmacyData.patientId,
        hospitalId: pharmacyData.hospitalId
      },
      {
        name: 1,
        serialId: 1,
        phoneNo: 1
      }
    )

    if (patientData) {
      Object.assign(pharmacyData, {
        patientData
      })
    }
  }

  res.status(200).json({
    message: 'Pharmacy details fetched successfully.',
    response: pharmacyData
  })
}

export const getInvoicePharmaciesCard = async (req: Request, res: Response) => {
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
  const pharmacyCard = await pharmacyQueries.getInvoiceCard(
    mongoDB,
    conditions,
    extraCondition
  )
  res.status(200).json({
    message: 'Patient pharmacies card fetched successfully.',
    response: {
      totalPaymentCount: pharmacyCard[0]?.totalPharmacyCount || 0,
      totalPayment: pharmacyCard[0]?.totalPharmacy || 0,
      paidAmount: pharmacyCard[0]?.paidAmount || 0,
      dueAmount: pharmacyCard[0]?.dueAmount || 0
    }
  })
}
