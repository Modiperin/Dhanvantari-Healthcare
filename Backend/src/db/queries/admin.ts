import { Document, MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'admins'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getAdminByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })
