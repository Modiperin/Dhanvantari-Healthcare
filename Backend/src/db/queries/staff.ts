import { Document, MongoClient } from 'mongodb'
import config from '../../config'
import { getCurrentWeekRangeAsTimestamp } from 'utils/dateAndTime'
import * as commonQueries from './common'
import * as profileQueries from './profile'

const collectionName = 'staffMaster'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getStaffByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const addNewStaff = async (mongoDB: MongoClient, data: Document) =>
  getCollection(mongoDB).insertOne(data)

export const getStaffList = async (
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
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'departmentData',
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$departmentData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'profile',
          localField: 'profileId',
          foreignField: '_id',
          as: 'profileData',
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$profileData',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          userId: 1,
          ownerId: 1,
          hospitalId: 1,
          name: 1,
          userName: 1,
          // firstName: 1,
          // lastName: 1,
          email: 1,
          phoneNo: 1,
          role: 1,
          active: 1,
          departmentData: 1,
          profileData: 1,
          createdAt: 1,
          updatedAt: 1,
          gender: 1,
          qualifications: 1,
          age: 1,
          dateOfBirth: 1,
          code: 1,
          accessType: 1,
          accessEndTime: 1,
          awards: 1,
          publications: 1,
          socialLinks: 1,
          specialities: 1,
          titleName: 1,
          type: 1,
          bio: 1,
          registrationNo: 1,
          experience: 1
        }
      }
    ])
    .toArray()

export const deleteStaffMember = async (
  mongoDB: MongoClient,
  condition: Document
) => getCollection(mongoDB).deleteOne(condition)

export const updatestaff = async (
  mongoDB: MongoClient,
  condition: Document,
  data: Document
) =>
  getCollection(mongoDB).updateOne(condition, {
    $set: data
  })

export const getDoctorRoaster = async (
  mongoDB: MongoClient,
  condition: Document,
  page: number = 1,
  limit: number = 20,
  sort: Document = { createdAt: -1 }
) => {
  const { weekStartTimestamp, weekEndTimestamp } =
    getCurrentWeekRangeAsTimestamp()

  return getCollection(mongoDB)
    .aggregate([
      {
        $match: condition
      },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          email: 1,
          userId: 1,
          // firstName: 1,
          // lastName: 1,
          name: 1
        }
      },
      {
        $lookup: {
          from: 'leaveRequests',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $gte: ['$date', weekStartTimestamp] },
                    { $lte: ['$date', weekEndTimestamp] }
                  ]
                }
              }
            }
          ],
          as: 'leaveData'
        }
      },
      {
        $lookup: {
          from: 'roaster',
          localField: 'userId',
          foreignField: 'staffId',
          as: 'roasterData',
          pipeline: [
            {
              $project: {
                _id: 0,
                day: 1,
                timing: 1,
                onLeave: 1
              }
            }
          ]
        }
      }
    ])
    .toArray()
}

export const getAvailableDoctors = async (
  mongoDB: MongoClient,
  condition: Document,
  startDate: number,
  endDate: number,
  dayName: string = ''
) =>
  getCollection(mongoDB)
    .aggregate([
      {
        $match: condition
      },
      {
        $project: {
          _id: 0,
          email: 1,
          userId: 1,
          // firstName: 1,
          // lastName: 1,
          name: 1,
          departmentId: 1
        }
      },
      {
        $lookup: {
          from: 'leaveRequests',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    { $gte: ['$date', startDate] },
                    { $lte: ['$date', endDate] }
                  ]
                }
              }
            }
          ],
          as: 'leaveData'
        }
      },
      {
        $lookup: {
          from: 'roaster',
          let: { userId: '$userId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$staffId', '$$userId'] },
                    { $eq: ['$day', dayName] }
                  ]
                }
              }
            },
            {
              $project: {
                _id: 0,
                day: 1,
                timing: 1,
                onLeave: 1
              }
            }
          ],
          as: 'roasterData'
        }
      },
      {
        $addFields: {
          isOnLeave: { $gt: [{ $size: '$leaveData' }, 0] },
          isAvailable: { $gt: [{ $size: '$roasterData' }, 0] }
        }
      },
      {
        $sort: {
          isOnLeave: 1, // Not on leave (false = 0) comes first
          isAvailable: -1 // Available (true = 1) comes first
        }
      },
      {
        $project: {
          email: 1,
          userId: 1,
          // firstName: 1,
          // lastName: 1,
          name: 1,
          departmentId: 1
        }
      }
    ])
    .toArray()

export const staffMemberListByAccess = async (
  mongoDB: MongoClient,
  hospitalId: string,
  accessCondition: Document = {}
) => {
  const allTeam = await getCollection(mongoDB)
    .find({
      hospitalId
    })
    .toArray()

  const ownerAndAdmin: Document[] = []
  const staffMembers: Document[] = []

  allTeam.forEach((member) => {
    if (['S', 'A'].includes(member.role)) {
      ownerAndAdmin.push(member)
    } else {
      staffMembers.push(member)
    }
  })

  const profileList = await commonQueries.findDocuments(
    profileQueries.getCollection,
    mongoDB,
    {
      hospitalId,
      ...accessCondition
    }
  )

  const profileIds = profileList.map((profile) => profile._id)

  const filteredStaffMembers = staffMembers.filter((member) => {
    return member.profileId && profileIds.includes(member.profileId)
  })

  return [...ownerAndAdmin, ...filteredStaffMembers]
}
