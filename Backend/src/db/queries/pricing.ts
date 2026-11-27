const collectionName = 'pricings'
import { Document, MongoClient } from 'mongodb'
import config from 'config'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const addNewPrice = async (mongoDB: MongoClient, data: Document) =>
  getCollection(mongoDB).insertOne(data)

export const getServiceByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const getPagedServiceList = async (
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
      { $limit: limit },
      {
        $project: {
          _id: 1,
          name: 1,
          cost: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          currencyType: 1
        }
      }
    ])
    .toArray()

export const deleteServiceById = async (
  mongoDB: MongoClient,
  condition: Document
) => getCollection(mongoDB).deleteOne(condition)

export const updatePricing = async (
  mongoDB: MongoClient,
  condition: Document,
  data: Document
) =>
  getCollection(mongoDB).updateOne(condition, {
    $set: data
  })
