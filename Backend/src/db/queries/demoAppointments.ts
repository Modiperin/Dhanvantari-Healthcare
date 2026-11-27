import { Document, Filter, MongoClient } from 'mongodb'
import config from 'config'

const collectionName = 'demoAppointments'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getDemoAppointmentsByCondition = async (
  mongoDB: MongoClient,
  condition: object,
  projection: object = {},
  sort: Filter<Document> = { createdAt: -1 }
) => getCollection(mongoDB).find(condition, { projection, sort }).toArray()
