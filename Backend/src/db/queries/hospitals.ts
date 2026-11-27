import { MongoClient, Document } from 'mongodb'
import config from '../../config'

const collectionName = 'hospitalMaster'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getHospitalByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const addNewHospital = async (mongoDB: MongoClient, data: Document) =>
  getCollection(mongoDB).insertOne(data)

export const updateHospital = async (
  mongoDB: MongoClient,
  condition: Document,
  data: Document
) =>
  getCollection(mongoDB).updateOne(condition, {
    $set: data
  })
