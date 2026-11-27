import { MongoClient, Document } from 'mongodb'
import config from '../../config'

const collectionName = 'consultation'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getConsultationByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const updateConsultation = async (
  mongoDB: MongoClient,
  condition: Document,
  data: Document
) =>
  getCollection(mongoDB).updateOne(condition, {
    $set: data
  })

export const getTopDiagnosis = async (
  mongoDB: MongoClient,
  condition: Document,
  limit: number = 10
) => {
  return getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $project: { diagnosis: 1 }
      },
      { $unwind: '$diagnosis' },
      {
        $group: {
          _id: '$diagnosis.id',
          name: { $first: '$diagnosis.name' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ])
    .toArray()
}

export const getTopMedications = async (
  mongoDB: MongoClient,
  condition: Document,
  limit: number = 10
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $project: { medications: 1 }
      },
      { $unwind: '$medications' },
      {
        $group: {
          _id: '$medications.id',
          name: { $first: '$medications.name' },
          count: { $sum: '$medications.totalQuantity' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: limit }
    ])
    .toArray()
