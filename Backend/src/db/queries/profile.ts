import { Document, MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'profile'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getProfileByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const getProfileListByCondition = async (
  mongoDB: MongoClient,
  condition: Document = {},
  page: number = 1,
  limit: number = 20,
  sort: Document = { createdAt: -1 }
) =>
  getCollection(mongoDB)
    .aggregate([
      {
        $match: condition
      },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'staffMaster',
          let: { profileId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$profileId', '$$profileId'] } } },
            {
              $group: {
                _id: null,
                count: { $sum: 1 }
              }
            }
          ],
          as: 'staffCountData'
        }
      },
      {
        $unwind: {
          path: '$staffCountData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          desc: 1,
          access: 1,
          createdAt: 1,
          updatedAt: 1,
          counts: { $ifNull: ['$staffCountData.count', 0] }
        }
      }
    ])
    .toArray()
