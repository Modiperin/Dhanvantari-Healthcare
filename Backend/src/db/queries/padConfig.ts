import { Document, MongoClient, UpdateOptions } from 'mongodb'
import config from '../../config'

const collectionName = 'padConfig'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getPadConfigByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const updatePadConfig = async (
  mongoDB: MongoClient,
  condition: Document,
  updateObj: Document,
  options: UpdateOptions = {}
) => getCollection(mongoDB).updateOne(condition, updateObj, options)
