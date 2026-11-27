import { Document, MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'patientVisits'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const addNewVisit = async (mongoDB: MongoClient, data: Document) =>
  getCollection(mongoDB).insertOne(data)

export const getVisitByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const updateVisitByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  updateData: Document
) => getCollection(mongoDB).findOneAndUpdate(condition, { $set: updateData })

export const getVisitListByCondition = async (
  mongoDB: MongoClient,
  condition: Document = {},
  extraCondition: Document = {},
  page: number = 1,
  limit: number = 10,
  sort: Document = { createdAt: -1 }
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'patient',
          let: { patientId: '$patientId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$patientId'] } } },
            {
              $project: {
                serialId: 1,
                name: 1,
                gender: 1,
                dateOfBirth: 1,
                dob: 1,
                phoneNo: 1
              }
            }
          ],
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $project: {
          name: '$patientDetails.name',
          serialId: '$patientDetails.serialId',
          gender: '$patientDetails.gender',
          dateOfBirth: '$patientDetails.dateOfBirth',
          dob: '$patientDetails.dob',
          phoneNo: '$patientDetails.phoneNo',
          visitId: 1,
          patientId: 1,
          hospitalId: 1,
          doctorId: 1,
          priority: 1,
          type: 1,
          status: 1,
          vitalStatus: 1,
          contStatus: 1,
          visitNote: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $match: extraCondition
      },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'staffMaster',
          let: { doctorId: '$doctorId' },
          localField: 'doctorId',
          foreignField: 'userId',
          as: 'doctorDetails',
          pipeline: [
            { $match: { isDeleted: false } },
            {
              $project: {
                name: 1,
                departmentId: 1,
                titleName: 1,
                qualifications: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$doctorDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'departments',
          let: {
            departmentId: '$doctorDetails.departmentId',
            hospitalId: '$hospitalId'
          },
          as: 'departmentDetails',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$departmentId'] },
                    { $eq: ['$hospitalId', '$$hospitalId'] }
                  ]
                }
              }
            },
            {
              $project: {
                name: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$departmentDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'vitals',
          let: { visitId: '$visitId', hospitalId: '$hospitalId' },
          as: 'vitalDetails',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$visitId', '$$visitId'] },
                    { $eq: ['$hospitalId', '$$hospitalId'] }
                  ]
                }
              }
            },
            {
              $project: {
                vitalId: '$_id'
              }
            },
            {
              $sort: { createdAt: -1 }
            },
            { $limit: 1 }
          ]
        }
      },
      {
        $unwind: {
          path: '$vitalDetails',
          preserveNullAndEmptyArrays: true
        }
      }
    ])
    .toArray()

export const getVisitCountByCondition = async (
  mongoDB: MongoClient,
  condition: Document = {},
  extraCondition: Document = {}
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'patient',
          let: { patientId: '$patientId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$patientId'] } } },
            {
              $project: {
                serialId: 1,
                name: 1,
                gender: 1,
                dateOfBirth: 1,
                dob: 1
              }
            }
          ],
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $project: {
          name: '$patientDetails.name',
          dob: '$patientDetails.dob',
          status: 1,
          priority: 1,
          gender: '$patientDetails.gender',
          type: 1
        }
      },
      {
        $match: extraCondition
      },
      { $count: 'count' }
    ])
    .toArray()

export const getVisitListByConditionForPayment = async (
  mongoDB: MongoClient,
  condition: Document = {},
  extraCondition: Document = {},
  page: number = 1,
  limit: number = 10,
  sort: Document = { createdAt: -1 }
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'patient',
          let: { patientId: '$patientId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$patientId'] } } },
            {
              $project: {
                serialId: 1,
                name: 1,
                gender: 1,
                dateOfBirth: 1,
                dob: 1,
                phoneNo: 1
              }
            }
          ],
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $project: {
          name: '$patientDetails.name',
          serialId: '$patientDetails.serialId',
          gender: '$patientDetails.gender',
          dateOfBirth: '$patientDetails.dateOfBirth',
          dob: '$patientDetails.dob',
          phoneNo: '$patientDetails.phoneNo',
          visitId: 1,
          patientId: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $lookup: {
          from: 'payments',
          let: { patientId: '$patientId', visitId: '$visitId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$visitId', '$$visitId'] },
                    { $eq: ['$patientId', '$$patientId'] }
                  ]
                }
              }
            },
            { $limit: 1 },
            {
              $project: {
                _id: 1,
                isAmountPaid: 1
              }
            }
          ],
          as: 'paymentDetails'
        }
      },
      {
        $unwind: {
          path: '$paymentDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: extraCondition
      },
      {
        $project: {
          name: 1,
          paymentId: '$paymentDetails._id',
          isAmountPaid: {
            $cond: [
              { $ifNull: ['$paymentDetails.isAmountPaid', false] },
              'paid',
              'unpaid'
            ]
          },
          serialId: 1,
          gender: 1,
          dateOfBirth: 1,
          dob: 1,
          phoneNo: 1,
          visitId: 1,
          patientId: 1,
          status: {
            $cond: [
              { $ifNull: ['$paymentDetails._id', false] },
              'bill',
              'unbill'
            ]
          },
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ])
    .toArray()

export const getVisitListByConditionForPharmacy = async (
  mongoDB: MongoClient,
  condition: Document = {},
  extraCondition: Document = {},
  page: number = 1,
  limit: number = 10,
  sort: Document = { createdAt: -1 }
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'patient',
          let: { patientId: '$patientId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$patientId'] } } },
            {
              $project: {
                serialId: 1,
                name: 1,
                gender: 1,
                dateOfBirth: 1,
                dob: 1,
                phoneNo: 1
              }
            }
          ],
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $project: {
          name: '$patientDetails.name',
          serialId: '$patientDetails.serialId',
          gender: '$patientDetails.gender',
          dateOfBirth: '$patientDetails.dateOfBirth',
          dob: '$patientDetails.dob',
          phoneNo: '$patientDetails.phoneNo',
          visitId: 1,
          patientId: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1
        }
      },
      {
        $lookup: {
          from: 'pharmacies',
          let: { patientId: '$patientId', visitId: '$visitId' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$visitId', '$$visitId'] },
                    { $eq: ['$patientId', '$$patientId'] }
                  ]
                }
              }
            },
            { $limit: 1 },
            {
              $project: {
                _id: 1,
                isAmountPaid: 1
              }
            }
          ],
          as: 'pharmacyDetails'
        }
      },
      {
        $unwind: {
          path: '$pharmacyDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $match: extraCondition
      },
      {
        $project: {
          name: 1,
          pharmacyId: '$pharmacyDetails._id',
          isAmountPaid: {
            $cond: [
              { $ifNull: ['$pharmacyDetails.isAmountPaid', false] },
              'paid',
              'unpaid'
            ]
          },
          serialId: 1,
          gender: 1,
          dateOfBirth: 1,
          dob: 1,
          phoneNo: 1,
          visitId: 1,
          patientId: 1,
          status: {
            $cond: [
              { $ifNull: ['$pharmacyDetails._id', false] },
              'bill',
              'unbill'
            ]
          },
          createdAt: 1,
          updatedAt: 1
        }
      },
      { $sort: sort },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ])
    .toArray()

export const getFollowUpDetailsWithDoctor = async (
  mongoDB: MongoClient,
  condition: Document = {}
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'staffMaster',
          localField: 'doctorId',
          foreignField: 'userId',
          as: 'doctorDetails'
        }
      },
      { $unwind: '$doctorDetails' },
      {
        $project: {
          'followUp.scheduleDate': 1,
          'followUp.date': 1,
          doctorId: '$doctorDetails._id',
          doctorName: '$doctorDetails.name',
          _id: 0,
          visitId: 1
        }
      }
    ])
    .toArray()

export const getVisitCountByPriorityForDashboard = async (
  mongoDB: MongoClient,
  condition: Document = {}
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ])
    .toArray()

export const getVisitListByConditionForDashboard = async (
  mongoDB: MongoClient,
  condition: Document = {},
  limit: number = 10,
  sort: Document = { createdAt: -1 }
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      { $sort: sort },
      {
        $group: {
          _id: '$patientId',
          latestVisit: { $first: '$$ROOT' },
          totalVisitCount: { $sum: 1 }
        }
      },
      { $sort: { 'latestVisit.createdAt': -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'patient',
          let: { patientId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$patientId'] } } },
            {
              $project: {
                doctorId: 1,
                name: 1,
                phoneNo: 1
              }
            }
          ],
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $project: {
          name: '$patientDetails.name',
          phoneNo: '$patientDetails.phoneNo',
          doctorId: '$latestVisit.doctorId',
          hospitalId: '$latestVisit.hospitalId',
          patientId: '$_id',
          totalVisitCount: 1,
          lastVisit: '$latestVisit.createdAt'
        }
      },
      {
        $lookup: {
          from: 'staffMaster',
          let: { doctorId: '$doctorId' },
          localField: 'doctorId',
          foreignField: 'userId',
          as: 'doctorDetails',
          pipeline: [
            {
              $project: {
                name: 1,
                departmentId: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$doctorDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'departments',
          let: {
            departmentId: '$doctorDetails.departmentId',
            hospitalId: '$hospitalId'
          },
          as: 'departmentDetails',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$_id', '$$departmentId'] },
                    { $eq: ['$hospitalId', '$$hospitalId'] }
                  ]
                }
              }
            },
            {
              $project: {
                name: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$departmentDetails',
          preserveNullAndEmptyArrays: true
        }
      }
    ])
    .toArray()

export const getFollowUpListForSendingNotification = async (
  mongoDB: MongoClient,
  condition: Document = {}
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $lookup: {
          from: 'patient',
          let: { patientId: '$patientId' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$patientId'] } } },
            {
              $project: {
                name: 1,
                phoneNo: 1
              }
            }
          ],
          as: 'patientDetails'
        }
      },
      { $unwind: '$patientDetails' },
      {
        $project: {
          name: '$patientDetails.name',
          phoneNo: '$patientDetails.phoneNo',
          patientId: 1,
          hospitalId: 1,
          doctorId: 1,
          date: '$followUp.date',
          scheduleDate: '$followUp.scheduleDate'
        }
      },
      {
        $lookup: {
          from: 'staffMaster',
          let: { doctorId: '$doctorId' },
          localField: 'doctorId',
          foreignField: 'userId',
          as: 'doctorDetails',
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
                titleName: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$doctorDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$hospitalId',
          followups: { $push: '$$ROOT' }
        }
      },
      {
        $lookup: {
          from: 'hospitalMaster',
          localField: '_id',
          foreignField: '_id',
          as: 'hospitalDetails',
          pipeline: [
            {
              $project: {
                _id: 0,
                name: 1,
                phoneNo: 1,
                address: 1
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: '$hospitalDetails',
          preserveNullAndEmptyArrays: true
        }
      }
    ])
    .toArray()
