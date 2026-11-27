import { Document, MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'paymentLogs'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const addPaymentLog = async (mongoDB: MongoClient, data: Document[]) =>
  getCollection(mongoDB).insertMany(data)

export const getPaymentLogsByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  sort: Document = { timestamp: -1 }
) =>
  getCollection(mongoDB)
    .aggregate([
      {
        $match: condition
      },
      {
        $sort: sort
      },
      {
        $lookup: {
          from: 'staffMaster',
          localField: 'updatedBy',
          foreignField: 'userId',
          pipeline: [{ $project: { name: 1 } }],
          as: 'userDetails'
        }
      },
      {
        $unwind: {
          path: '$userDetails',
          preserveNullAndEmptyArrays: true
        }
      }
    ])
    .toArray()
