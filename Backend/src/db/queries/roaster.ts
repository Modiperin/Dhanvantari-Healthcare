import { Document, MongoClient, UpdateOptions } from 'mongodb'
import config from '../../config'

const collectionName = 'roaster'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const updateTiming = async (
  mongoDB: MongoClient,
  condition: Document,
  updateObj: Document,
  options: UpdateOptions = {}
) => getCollection(mongoDB).updateOne(condition, updateObj, options)
