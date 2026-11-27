import { Document, MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'payments'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getPaymentDetailsByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const getPaymentDuesForPatient = async (
  mongoDB: MongoClient,
  condition: Document = {}
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      // { $group: { _id: '$visitId', totalDue: { $sum: '$dueAmount' } } },
      {
        $group: {
          _id: null,
          visits: {
            $push: {
              visitId: '$_id',
              invoiceId: '$invoiceId',
              totalDue: '$dueAmount'
            }
          },
          grandTotal: { $sum: '$dueAmount' }
        }
      }
    ])
    .toArray()

export const getPaymentListByCondition = async (
  mongoDB: MongoClient,
  condition: Document = {},
  // extraCondition: Document = {},
  page: number = 1,
  limit: number = 10,
  sort: Document = { createdAt: -1 }
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          invoiceId: 1,
          visitId: 1,
          grandTotal: 1,
          paymodes: 1,
          createdAt: 1,
          isAmountPaid: {
            $cond: [{ $ifNull: ['$isAmountPaid', false] }, 'paid', 'unpaid']
          },
          payments: 1,
          dueAmount: 1
        }
      }
    ])
    .toArray()

export const getPaymentCardByCondition = async (
  mongoDB: MongoClient,
  condition: Document = {}
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $group: {
          _id: null,
          totalPaymentCount: { $sum: 1 },
          totalPayment: { $sum: '$grandTotal' },
          paidAmount: { $sum: '$paidAmount' },
          dueAmount: {
            $sum: {
              $add: [
                { $ifNull: ['$dueAmount', 0] },
                { $ifNull: ['$pendingAmount', 0] }
              ]
            }
          },
          pendingAmount: { $sum: '$pendingAmount' },
          unpaidVisitCount: {
            $sum: { $cond: [{ $eq: ['$dueAmount', 0] }, 0, 1] }
          }
        }
      }
    ])
    .toArray()

export const getAllInvoiceList = async (
  mongoDB: MongoClient,
  condition: Document = {},
  extraCondition: Document = {},
  page: number = 1,
  limit: number = 10,
  sort: Document = { createdAt: -1 }
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'patient',
          let: { patientId: '$patientId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$patientId'] } } },
            {
              $project: {
                serialId: 1,
                name: 1,
                gender: 1,
                dateOfBirth: 1,
                dob: 1,
                phoneNo: 1
              }
            }
          ],
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $match: extraCondition
      },
      {
        $project: {
          name: '$patientDetails.name',
          serialId: '$patientDetails.serialId',
          gender: '$patientDetails.gender',
          dateOfBirth: '$patientDetails.dateOfBirth',
          dob: '$patientDetails.dob',
          phoneNo: '$patientDetails.phoneNo',
          totalAmount: 1,
          paidAmount: 1,
          dueAmount: 1,
          isAmountPaid: {
            $cond: [{ $ifNull: ['$isAmountPaid', false] }, 'paid', 'unpaid']
          },
          grandTotal: 1,
          paymodes: 1,
          payments: 1,
          visitId: 1,
          patientId: 1,
          createdAt: 1,
          updatedAt: 1,
          invoiceId: 1
        }
      },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ])
    .toArray()

export const getInvoiceCard = async (
  mongoDB: MongoClient,
  condition: Document = {},
  extraCondition: Document = {}
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'patient',
          let: { patientId: '$patientId' },
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$patientId'] } } }],
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $match: extraCondition
      },
      {
        $group: {
          _id: null,
          totalPaymentCount: { $sum: 1 },
          totalPayment: { $sum: '$grandTotal' },
          paidAmount: { $sum: '$paidAmount' },
          dueAmount: {
            $sum: {
              $add: [
                { $ifNull: ['$dueAmount', 0] },
                { $ifNull: ['$pendingAmount', 0] }
              ]
            }
          },
          unpaidVisitCount: {
            $sum: { $cond: [{ $eq: ['$dueAmount', 0] }, 0, 1] }
          }
        }
      }
    ])
    .toArray()
export const getAllInvoiceCount = async (
  mongoDB: MongoClient,
  condition: Document = {},
  extraCondition: Document = {}
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'patient',
          let: { patientId: '$patientId' },
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$patientId'] } } }],
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $match: extraCondition
      },
      { $count: 'count' }
    ])
    .toArray()

export const settleupPreviosDues = async (
  mongoDB: MongoClient,
  condition: Document = {}
) => {
  const updateData: Document = {
    $set: {
      'payments.$[].status': 'completed',
      'payments.$[].dueAmount': 0,
      dueAmount: 0,
      isAmountPaid: true,
      updatedAt: new Date()
    }
  }

  return getCollection(mongoDB).updateMany(condition, updateData)
}
