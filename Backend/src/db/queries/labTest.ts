import { Document, MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'labTest'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getLabTestListByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {},
  limit: number = 10
) =>
  getCollection(mongoDB).find(condition, { projection }).limit(limit).toArray()
