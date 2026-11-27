import { MongoClient, Document } from 'mongodb'
import config from '../../config'

const collectionName = 'appointments'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export const getAppointmentByCondition = async (
  mongoDB: MongoClient,
  condition: Document,
  projection: Document = {}
) => getCollection(mongoDB).findOne(condition, { projection })

export const getAppointmentListByPatientId = async (
  mongoDB: MongoClient,
  condition: Document = {},
  sort: Document = { createdAt: -1 }
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      { $sort: sort },
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
        $project: {
          doctorName: '$doctorDetails.name',
          date: 1,
          time: 1,
          _id: 1,
          status: 1
        }
      }
    ])
    .toArray()

export const getAppointmentListByCondition = async (
  mongoDB: MongoClient,
  condition: Document = {},
  extraCondition: Document = {},
  page: number = 1,
  limit: number = 20,
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
                bloodGroup: 1,
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
          bloodGroup: '$patientDetails.bloodGroup',
          appointmentId: 1,
          patientId: 1,
          hospitalId: 1,
          doctorId: 1,
          date: 1,
          scheduleDate: 1,
          time: 1,
          status: 1,
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
            {
              $project: {
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
      }
    ])
    .toArray()

export const getAppointmentCountByCondition = async (
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
                bloodGroup: 1,
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
          gender: '$patientDetails.gender',
          dob: '$patientDetails.dob',
          bloodGroup: '$patientDetails.bloodGroup',
          status: 1
        }
      },
      {
        $match: extraCondition
      },
      { $count: 'count' }
    ])
    .toArray()

export const getAppointmentCountsByCondition = async (
  mongoDB: MongoClient,
  condition: Document = {}
) =>
  getCollection(mongoDB)
    .aggregate([
      { $match: condition },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$count' },
          booked: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'booked'] }, '$count', 0]
            }
          },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'completed'] }, '$count', 0]
            }
          },
          rescheduled: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'rescheduled'] }, '$count', 0]
            }
          },
          cancelled: {
            $sum: {
              $cond: [{ $eq: ['$_id', 'cancelled'] }, '$count', 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          total: 1,
          booked: 1,
          completed: 1,
          rescheduled: 1,
          cancelled: 1
        }
      }
    ])
    .toArray()

export const getAppointmentListForSendingNotification = async (
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
          appointmentId: 1,
          patientId: 1,
          hospitalId: 1,
          doctorId: 1,
          date: 1,
          scheduleDate: 1,
          time: 1,
          status: 1
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
          appointments: { $push: '$$ROOT' }
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
