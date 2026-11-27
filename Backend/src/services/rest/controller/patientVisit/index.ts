import { Request, Response } from 'express'
import * as patientVisitQueries from 'db/queries/patientVisits'
import * as patientQueries from 'db/queries/patient'
import * as vitalQueries from 'db/queries/vitals'
import * as staffQueries from 'db/queries/staff'
import * as departmentQueries from 'db/queries/department'
import * as consultationQueries from 'db/queries/consultation'
import * as hospitalQueries from 'db/queries/hospitals'
import { generateUUID, generateVisitId } from 'utils/uuid'
import mongoDB from 'db'
import {
  assignConditions,
  assignDateRangeCondition
} from 'utils/searchAndFilter'
import { Document } from 'mongodb'
import { removeExtraFieldFormObject } from 'utils/funcations'
import { updateDocument } from 'db/queries/common'
import { getCollection } from 'db/queries/appointment'
import events from 'utils/events'
import { createJWT } from 'utils/token'

export const createPatientVisit = async (req: Request, res: Response) => {
  const {
    patientId,
    type,
    visitNote = '',
    doctorId,
    priority = 3,
    patientData,
    doctorData,
    referredBy = 'self'
  } = res.locals.shared || {}

  const { appointmentId, prevVisitAsFollowUp } = req.body

  const { user } = res.locals || {}

  const visitId = generateVisitId(patientData.serialId)

  const patientVisitData = {
    _id: generateUUID(),
    visitId,
    patientId: patientId,
    hospitalId: user.hospitalId,
    doctorId,
    priority,
    type: type || 'Walkin', // Default to 'Walkin' if not provided
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, departmentData] = await Promise.all([
    patientVisitQueries.addNewVisit(mongoDB, patientVisitData),
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

  if (appointmentId || typeof appointmentId === 'string') {
    await updateDocument(
      getCollection,
      mongoDB,
      { _id: appointmentId },
      { $set: { status: 'completed' } }
    )
  }

  events('visit', 'visitCreated', {
    patientVisitData,
    user,
    patientData,
    doctorData,
    departmentData
  })

  res.status(200).json({
    message: 'Patient visit created successfully.'
  })
}

export const getPatientVisitList = async (req: Request, res: Response) => {
  const { user } = res.locals || {}
  const {
    searchCondition,
    filterCondition,
    startDate,
    endDate,
    ageStartDate,
    ageEndDate,
    patientFilterCondition
  } = res.locals.shared

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition = { hospitalId: user.hospitalId }
  const extraCondition: Document = { ...searchCondition }
  assignConditions(extraCondition, filterCondition, {})
  assignConditions(extraCondition, patientFilterCondition, {})
  assignDateRangeCondition(extraCondition, 'dob', ageStartDate, ageEndDate)
  assignDateRangeCondition(condition, 'createdAt', startDate, endDate)
  // console.dir({ extraCondition, condition }, { depth: null })
  const [visits, totalVisitCount] = await Promise.all([
    patientVisitQueries.getVisitListByCondition(
      mongoDB,
      condition,
      extraCondition,
      page,
      limit
    ),
    patientVisitQueries.getVisitCountByCondition(
      mongoDB,
      condition,
      extraCondition
    )
  ])

  const totalRecords =
    (Array.isArray(totalVisitCount) &&
      totalVisitCount[0] &&
      totalVisitCount[0].count) ||
    0

  res.status(200).json({
    message: 'Patient visit list fetched successfully.',
    response: {
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      list: visits || []
    }
  })
}

export const viewPatientVisit = async (req: Request, res: Response) => {
  const { user } = res.locals || {}
  const { visitData } = res.locals.shared || {}

  const [patientData, vitalData, doctorData, consultationData] =
    await Promise.all([
      patientQueries.getPatientByCondition(
        mongoDB,
        {
          _id: visitData.patientId,
          hospitalId: user.hospitalId
        },
        {
          name: 1,
          email: 1,
          phoneNo: 1,
          serialId: 1,
          dateOfBirth: 1,
          gender: 1,
          bloodGroup: 1,
          medicalHistory: 1
        }
      ),
      vitalQueries.getVitalsByCondition(mongoDB, {
        patientId: visitData.patientId,
        visitId: visitData.visitId,
        hospitalId: user.hospitalId
      }),
      staffQueries.getStaffByCondition(
        mongoDB,
        { userId: visitData.doctorId, hospitalId: user.hospitalId },
        { userId: 1, name: 1, email: 1, phoneNo: 1, departmentId: 1 }
      ),
      consultationQueries.getConsultationByCondition(mongoDB, {
        visitId: visitData.visitId,
        hospitalId: user.hospitalId
      })
    ])

  if (!patientData) {
    res.status(404).json({
      message: 'Patient not found.'
    })
    return
  }
  const followUp = {
    date: visitData?.followUp?.date,
    days: visitData?.followUp?.days,
    instructions: visitData?.followUp?.instructions
  }

  Object.assign(consultationData || {}, { followUp: followUp })

  res.status(200).json({
    message: 'Patient visit details fetched successfully.',
    response: {
      ...visitData,
      patientData,
      vitalData,
      doctorData,
      consultationData
    }
  })
}

export const updatePatientVisit = async (req: Request, res: Response) => {
  const { visitId } = req.params
  const { status, vitalStatus, contStatus } = res.locals.shared || {}
  const { user } = res.locals || {}

  const updateData = {
    status,
    vitalStatus,
    contStatus,
    updatedAt: new Date()
  }

  const pureUpdateData = removeExtraFieldFormObject(
    updateData,
    ['status', 'vitalStatus', 'contStatus', 'updatedAt'],
    true
  )

  await patientVisitQueries.updateVisitByCondition(
    mongoDB,
    {
      visitId,
      hospitalId: user.hospitalId
    },
    pureUpdateData
  )

  await events('visit', 'visitUpdated', { visitId, user })

  res.status(200).json({
    message: 'Patient visit updated successfully.'
  })
}

export const viewPrescription = async (req: Request, res: Response) => {
  const { user } = res.locals || {}
  const { from } = req.query || {}

  const { visitData } = res.locals.shared || {}

  const hospitalId = user?.hospitalId || visitData?.hospitalId

  const isFromPreview = from === 'preview'

  const [vitalData, doctorData, consultationData, patientData, hospitalData] =
    await Promise.all([
      vitalQueries.getVitalsByCondition(mongoDB, {
        patientId: visitData.patientId,
        visitId: visitData.visitId,
        hospitalId
      }),
      staffQueries.getStaffByCondition(
        mongoDB,
        {
          userId: visitData.doctorId,
          hospitalId
        },
        {
          userId: 1,
          name: 1,
          email: 1,
          phoneNo: 1,
          departmentId: 1,
          titleName: 1,
          qualifications: 1,
          registrationNo: 1
        }
      ),
      consultationQueries.getConsultationByCondition(mongoDB, {
        visitId: visitData.visitId,
        hospitalId
      }),
      isFromPreview &&
        patientQueries.getPatientByCondition(
          mongoDB,
          {
            _id: visitData.patientId,
            hospitalId
          },
          {
            name: 1,
            email: 1,
            phoneNo: 1,
            serialId: 1,
            dateOfBirth: 1
          }
        ),
      isFromPreview &&
        hospitalQueries.getHospitalByCondition(
          mongoDB,
          {
            _id: hospitalId
          },
          {
            name: 1,
            address: 1,
            phoneNo: 1,
            email: 1,
            logo: 1
          }
        )
    ])

  const followUp = {
    date: visitData?.followUp?.date,
    days: visitData?.followUp?.days,
    instructions: visitData?.followUp?.instructions
  }

  Object.assign(consultationData || {}, { followUp: followUp })

  const response = {
    ...visitData,
    vitalData,
    doctorData,
    consultationData
  }

  if (patientData) {
    Object.assign(response, { patientData })
  }
  if (hospitalData) {
    Object.assign(response, { hospitalData })
  }

  const token = createJWT(
    { id: `${hospitalId}:${visitData.visitId}` },
    process.env.JWT_SECRET || '',
    '7d'
  )

  const prescriptionLink = `consultation/preview/${token}`

  res.status(200).json({
    message: 'Prescription fetched successfully.',
    response: {
      ...response,
      prescriptionLink
    }
  })
}
