import { MongoClient, Document } from 'mongodb'
import config from '../../config'

const collectionName = 'vitals'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getVitalsByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const updateVitals = async (
  mongoDB: MongoClient,
  condition: Document,
  data: Document
) =>
  getCollection(mongoDB).updateOne(condition, {
    $set: data
  })

export const getVitalList = async (
  mongoDB: MongoClient,
  condition: Document = {},
  page: number = 1,
  limit: number = 20,
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
          complaints: 0,
          hospitalId: 0,
          patientId: 0,
          status: 0,
          updatedAt: 0
        }
      }
    ])
    .toArray()

export const getVitalRecordByGender = async (
  mongoDB: MongoClient,
  condition: Document = {}
) => {
  return getCollection(mongoDB)
    .aggregate([
      {
        $match: condition
      },
      {
        $lookup: {
          from: 'patient',
          localField: 'patientId',
          foreignField: '_id',
          as: 'patientDetails',
          pipeline: [
            {
              $project: {
                gender: 1
              }
            }
          ]
        }
      },
      {
        $unwind: '$patientDetails'
      },
      {
        $group: {
          _id: '$patientDetails.gender',
          count: { $sum: 1 }
        }
      }
    ])
    .toArray()
}

export const getTopChiefComplaints = async (
  mongoDB: MongoClient,
  condition: Document = {},
  limit: number = 10
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      { $unwind: '$complaints' },
      {
        $group: {
          _id: '$complaints.chief',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0
        }
      }
    ])
    .toArray()
