import { Document, MongoClient } from 'mongodb'
import config from 'config'

const collectionName = 'departments'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const deleteDepartment = async (
  mongoDB: MongoClient,
  condition: Document
) => getCollection(mongoDB).deleteOne(condition)

export const getDepartmentByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => {
  return getCollection(mongoDB).findOne(condition, { projection })
}

export const updateDeptById = async (
  mongoDB: MongoClient,
  condition: Document,
  data: Document
) =>
  getCollection(mongoDB).updateOne(condition, {
    $set: data
  })

export const getDepartmentList = async (
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
          active: 1,
          code: 1
        }
      }
    ])
    .toArray()
