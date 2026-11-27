import { Document, MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'pharmacies'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getPharmacyDetailsByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

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
          pharmacies: 1,
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
          totalPharmacyCount: { $sum: 1 },
          totalPharmacy: { $sum: '$grandTotal' },
          paidAmount: { $sum: '$paidAmount' },
          dueAmount: { $sum: '$dueAmount' }
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
