import { Document, MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'patient'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const addNewPatient = async (mongoDB: MongoClient, data: Document) =>
  getCollection(mongoDB).insertOne(data)

export const getPatientByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {},
  otherOptions: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection, ...otherOptions })

export const updatePatientByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  updateData: Document
) => getCollection(mongoDB).findOneAndUpdate(condition, { $set: updateData })

export const getPatientListByCondition = async (
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
      { $limit: limit }
    ])
    .toArray()

export const deletePatientByCondition = async (
  mongoDB: MongoClient,
  condition: Document
) => getCollection(mongoDB).deleteOne(condition)
