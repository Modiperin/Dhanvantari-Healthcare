import { Request, Response } from 'express'
import * as sequenceQueries from 'db/queries/sequence'
import * as patientQueries from 'db/queries/patient'
import * as patientVisitQueries from 'db/queries/patientVisits'
import * as departmentQueries from 'db/queries/department'
import * as commonQueries from 'db/queries/common'
import * as appointmentQuries from 'db/queries/appointment'
import { generateUUID, generateVisitId } from 'utils/uuid'
import mongoDB from 'db'
import { getFieldIntoReq, removeExtraFieldFormObject } from 'utils/funcations'
import {
  assignConditions,
  assignDateRangeCondition
} from 'utils/searchAndFilter'
import { createPatient } from 'utils/createUser'
import events from 'utils/events'
import { endOfDay, parse, startOfDay } from 'date-fns'

export const getPatientProfile = async (req: Request, res: Response) => {
  const { patientData } = res.locals.shared || {}
  const { patientId } = req.params
  const { from } = req.query
  if (from === 'app') {
    const now = new Date() // Current time
    const halfHourEarlier = new Date(now.getTime() - 30 * 60 * 1000)
    let startDate = startOfDay(now)
    let endDate = endOfDay(now)

    const [appointmentData, followUpData] = await Promise.all([
      appointmentQuries.getAppointmentListByPatientId(mongoDB, {
        patientId: patientId,
        scheduleDate: {
          $gte: halfHourEarlier
        },
        status: {
          $ne: 'completed'
        }
      }),
      patientVisitQueries.getFollowUpDetailsWithDoctor(mongoDB, {
        'followUp.scheduleDate': { $gte: startDate, $lte: endDate },
        patientId
      })
    ])

    Object.assign(patientData, {
      appointmentData,
      by: 'appointment',
      followUpData
    })
  }

  res.status(200).json({
    message: 'Patient profile fetched successfully',
    response: patientData || {}
  })
}

export const registerPatient = async (req: Request, res: Response) => {
  const {
    name,
    gender,
    bloodGroup,
    dateOfBirth,
    phoneNo,
    email,
    emergencyContact,
    address,
    doctorId,
    priority = 3,
    visitNote = '',
    doctorData,
    referredBy = 'self'
  } = res.locals.shared || {}
  const { user } = res.locals || {}
  const { prevVisitAsFollowUp } = req.body

  const [patientSerialNumber, departmentData] = await Promise.all([
    sequenceQueries.getId(mongoDB, 'patient', user.hospitalId),
    departmentQueries.getDepartmentByCondition(
      mongoDB,
      {
        _id: doctorData.departmentId,
        hospitalId: user.hospitalId
      },
      {
        name: 1
      }
    )
  ])

  const patientData = {
    _id: generateUUID(),
    serialId: patientSerialNumber,
    hospitalId: user.hospitalId,
    name,
    gender,
    bloodGroup,
    dateOfBirth,
    dob: parse(dateOfBirth, 'dd-MM-yyyy', new Date()),
    phoneNo,
    email,
    emergencyContact,
    address
  }

  const visitId = generateVisitId(patientSerialNumber)

  const patientVisitData = {
    _id: generateUUID(),
    visitId,
    patientId: patientData._id,
    hospitalId: user.hospitalId,
    doctorId,
    priority,
    type: 'Walkin',
    status: 'Checked-in',
    vitalStatus: 'Pending', // Default status for vitals
    contStatus: 'Pending', // Default status for consultations
    visitNote,
    referredBy,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  if (prevVisitAsFollowUp) {
    Object.assign(patientVisitData, { prevVisitAsFollowUp })
  }

  await Promise.all([
    createPatient(patientData),
    patientVisitQueries.addNewVisit(mongoDB, patientVisitData)
  ])

  events('patient', 'patientCreated', {
    patientData,
    doctorData,
    patientVisitData,
    departmentData,
    user
  })

  res.status(200).json({
    message: 'Patient created successfully'
  })
}

export const updatePatient = async (req: Request, res: Response) => {
  const {
    name,
    gender,
    bloodGroup,
    dateOfBirth,
    phoneNo,
    email,
    emergencyContact,
    address,
    foodAllergy,
    drugAllergy,
    pastSurgical,
    procedure,
    currentlyTakingMedicines
  } = res.locals.shared || {}

  const patientData = {
    name,
    gender,
    bloodGroup,
    dateOfBirth,
    dob: parse(dateOfBirth, 'dd-MM-yyyy', new Date()),
    phoneNo,
    email,
    emergencyContact,
    address,
    updatedAt: new Date()
  }

  const purePatientData = removeExtraFieldFormObject(
    patientData,
    [
      'name',
      'gender',
      'bloodGroup',
      'dateOfBirth',
      'dob',
      'phoneNo',
      'email',
      'emergencyContact',
      'address',
      'updatedAt'
    ],
    true,
    [false]
  )

  const { alcohol, diabetes, smoking, tobacco } = req.body || {}
  const historyData = {
    alcohol,
    diabetes,
    smoking,
    tobacco,
    foodAllergy,
    drugAllergy,
    pastSurgical,
    procedure,
    currentlyTakingMedicines
  }

  const pureHistoryData = removeExtraFieldFormObject(
    historyData,
    [
      'alcohol',
      'diabetes',
      'smoking',
      'tobacco',
      'foodAllergy',
      'drugAllergy',
      'pastSurgical',
      'procedure',
      'currentlyTakingMedicines'
    ],
    true,
    [false]
  )

  const { user } = res.locals || {}

  const patientId = getFieldIntoReq(req, 'patientId')
  if (Object.keys(pureHistoryData).length) {
    Object.assign(purePatientData, { medicalHistory: pureHistoryData })
  }

  await patientQueries.updatePatientByCondition(
    mongoDB,
    { _id: patientId, hospitalId: user.hospitalId, isDeleted: { $ne: true } },
    purePatientData
  )

  res.status(200).json({
    message: 'Patient updated successfully'
  })
}

export const getPatientList = async (req: Request, res: Response) => {
  const { user } = res.locals || {}

  const { searchCondition, filterCondition, ageStartDate, ageEndDate } =
    res.locals.shared

  const condition = { hospitalId: user.hospitalId, isDeleted: { $ne: true } }

  assignConditions(condition, searchCondition, filterCondition)
  assignDateRangeCondition(condition, 'dob', ageStartDate, ageEndDate)

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const [patients, totalRecords] = await Promise.all([
    patientQueries.getPatientListByCondition(mongoDB, condition, page, limit),
    commonQueries.countDocuments(
      patientQueries.getCollection,
      mongoDB,
      condition
    )
  ])

  res.status(200).json({
    message: 'Patient list fetched successfully',
    response: {
      list: patients || [],
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit)
    }
  })
}

export const deletePatient = async (req: Request, res: Response) => {
  const patientId = getFieldIntoReq(req, 'patientId')
  const { user } = res.locals || {}

  await patientQueries.updatePatientByCondition(
    mongoDB,
    {
      isDeleted: false,
      _id: patientId,
      hospitalId: user.hospitalId
    },
    {
      isDeleted: true,
      updatedAt: new Date()
    }
  )

  res.status(200).json({
    message: 'Patient deleted successfully'
  })
}

export const addPatientHistory = async (req: Request, res: Response) => {
  const { patientId } = req.params
  const {
    alcohol,
    diabetes,
    smoking,
    tobacco,
    foodAllergy,
    drugAllergy,
    pastSurgical,
    procedure,
    currentlyTakingMedicines
  } = req.body || {}

  const { user } = res.locals || {}

  const historyData = {
    alcohol,
    diabetes,
    smoking,
    tobacco,
    foodAllergy,
    drugAllergy,
    pastSurgical,
    procedure,
    currentlyTakingMedicines
  }

  await patientQueries.updatePatientByCondition(
    mongoDB,
    { _id: patientId, hospitalId: user.hospitalId },
    {
      medicalHistory: historyData
    }
  )

  res.status(200).json({
    message: 'Patient history added successfully'
  })
}

export const viewPatientMedicalHistory = async (
  req: Request,
  res: Response
) => {
  const { patientData } = res.locals.shared || {}
  res.status(200).json({
    message: 'Patient medical history fetched successfully',
    response: { medicalHistory: patientData?.medicalHistory || {} }
  })
}

export const prescriptionsList = async (req: Request, res: Response) => {
  const patientId = getFieldIntoReq(req, 'patientId')
  const { patientData } = res.locals.shared || {}

  const visitList = await commonQueries.findDocuments(
    patientVisitQueries.getCollection,
    mongoDB,
    {
      patientId,
      hospitalId: res.locals.user.hospitalId,
      contStatus: 'Completed'
    },
    {
      visitId: 1,
      createdAt: 1
    },
    {
      createdAt: -1
    }
  )

  res.status(200).json({
    message: 'Patient prescriptions fetched successfully',
    response: {
      patientData,
      list: visitList || []
    }
  })
}
