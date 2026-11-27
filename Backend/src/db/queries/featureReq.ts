import { Document, MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'featureRequests'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getFeatureRequestsByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {},
  skip: number = 0,
  limit: number = 10
) =>
  getCollection(mongoDB)
    .find(condition, { projection })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .toArray()
