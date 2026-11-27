import { Request, Response } from 'express'
import { getFieldIntoReq, removeExtraFieldFormObject } from 'utils/funcations'
import { generateUniqueId, generateUUID } from 'utils/uuid'
import * as consultationQueries from 'db/queries/consultation'
import * as commonQueries from 'db/queries/common'
import mongoDB from 'db'
import * as diagnosisQueries from 'db/queries/diagnosis'
import * as medicineQueries from 'db/queries/medicine'
import * as labTestQueries from 'db/queries/labTest'
import * as visitQuries from 'db/queries/patientVisits'
import * as patientQueries from 'db/queries/patient'
import * as hospitalQueries from 'db/queries/hospitals'
import { createJWT } from 'utils/token'
import { sendWhatsAppMessage } from 'utils/whatsapp'

export const createConsultation = async (req: Request, res: Response) => {
  const {
    diagnosis,
    medications,
    labs,
    clinicalFindings,
    referToDoctor,
    followUp,
    visitData,
    contStatus
  } = res.locals.shared || {}
  const { user } = res.locals || {}
  const visitId = getFieldIntoReq(req, 'visitId')

  //TODO: validate is there any consultation already exists for this visitId
  const consultationId = generateUUID()

  const consultationData = {
    _id: consultationId,
    visitId,
    diagnosis,
    medications,
    labs,
    clinicalFindings,
    referToDoctor,
    by: user.userId,
    hospitalId: user.hospitalId,
    followUp
  }

  const pureData = removeExtraFieldFormObject(
    consultationData,
    [
      '_id',
      'visitId',
      'diagnosis',
      'medications',
      'labs',
      'clinicalFindings',
      'referToDoctor',
      'by',
      'hospitalId',
      'followUp'
    ],
    true
  )

  await commonQueries.createDocument(
    consultationQueries.getCollection,
    mongoDB,
    { ...pureData, createdAt: new Date(), updatedAt: new Date() }
  )
  const visitPureData = removeExtraFieldFormObject(
    { contStatus, followUp },
    ['contStatus', 'followUp'],
    true
  )
  // console.log({ contStatus, visitPureData })
  if (Object.keys(visitPureData).length > 0) {
    await commonQueries.updateDocument(
      visitQuries.getCollection,
      mongoDB,
      {
        _id: visitData?._id
      },
      {
        $set: {
          ...visitPureData
        }
      }
    )
  }

  res.status(200).json({
    message: 'Consultation created successfully.',
    consultationId
  })
}

export const updateConsultation = async (req: Request, res: Response) => {
  const {
    diagnosis,
    medications,
    labs,
    clinicalFindings,
    referToDoctor,
    followUp,
    visitData,
    contStatus
  } = res.locals.shared || {}
  const { user } = res.locals || {}
  const { consultationId } = req.params

  const consultationData = {
    diagnosis,
    medications,
    labs,
    clinicalFindings,
    referToDoctor
  }

  const pureData = removeExtraFieldFormObject(
    consultationData,
    ['diagnosis', 'medications', 'labs', 'clinicalFindings', 'referToDoctor'],
    true
  )

  await consultationQueries.updateConsultation(
    mongoDB,
    { _id: consultationId, hospitalId: user.hospitalId },
    {
      ...pureData,
      updatedAt: new Date()
    }
  )

  const visitPureData = removeExtraFieldFormObject(
    { contStatus, followUp },
    ['contStatus', 'followUp'],
    true
  )
  // console.log({ visitPureData })
  if (Object.keys(visitPureData).length > 0) {
    await commonQueries.updateDocument(
      visitQuries.getCollection,
      mongoDB,
      {
        _id: visitData?._id
      },
      {
        $set: {
          ...visitPureData
        }
      }
    )
  }

  res.status(200).json({
    message: 'Consultation updated successfully.'
  })
}

export const createDiagnosis = async (req: Request, res: Response) => {
  const _id = generateUUID()
  const { user } = res.locals || {}
  const { name } = res.locals.shared

  await commonQueries.createDocument(diagnosisQueries.getCollection, mongoDB, {
    _id,
    name,
    hospitalId: user.hospitalId,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  res.status(200).json({
    message: 'Diagnosis created successfully.',
    response: { _id, name }
  })
}

export const createMedication = async (req: Request, res: Response) => {
  const _id = generateUniqueId()
  const { user } = res.locals || {}
  const { name } = res.locals.shared

  await commonQueries.createDocument(medicineQueries.getCollection, mongoDB, {
    _id,
    name,
    hospitalId: user.hospitalId,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  res.status(200).json({
    message: 'Medication created successfully',
    response: { _id, name }
  })
}

export const createLab = async (req: Request, res: Response) => {
  const _id = generateUniqueId()
  const { name } = res.locals.shared
  const { user } = res.locals || {}

  await commonQueries.createDocument(labTestQueries.getCollection, mongoDB, {
    _id,
    name,
    hospitalId: user.hospitalId,
    createdAt: new Date(),
    updatedAt: new Date()
  })
  res.status(200).json({
    message: 'Lab created successfully.',
    response: { _id, name }
  })
}

export const viewConsultation = async (req: Request, res: Response) => {
  const { visitData } = res.locals.shared || {}
  const { user } = res.locals

  const [patientData, consultationData] = await Promise.all([
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
        bloodGroup: 1
      }
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
  res.status(200).json({
    message: 'Consultation fetched successfully.',
    response: {
      patientData,
      consultationData
    }
  })
}

export const sendConsultationToWhatsApp = async (
  req: Request,
  res: Response
) => {
  const { patientData, consultationData } = res.locals.shared || {}
  const { consultationId } = req.params
  const { user } = res.locals

  let phoneNo = patientData.phoneNo || ''

  const token = createJWT(
    { id: `${consultationData.hospitalId}:${consultationData.visitId}` },
    process.env.JWT_SECRET || '',
    '7d'
  )

  const url = `consultation/preview/${token}`

  const hospitalData = await hospitalQueries.getHospitalByCondition(
    mongoDB,
    { _id: user.hospitalId },
    { name: 1 }
  )

  const response = await sendWhatsAppMessage(phoneNo, 'consultation_details', {
    name: patientData.name,
    hospitalName: hospitalData?.name,
    buttonLink: url
  })

  if (response.error) {
    res.status(400).json({
      message: 'Failed to send WhatsApp message'
    })
    return
  }

  await consultationQueries.updateConsultation(
    mongoDB,
    { _id: consultationId },
    { isSentToWhatsApp: true }
  )

  res.status(200).json({
    message: 'Consultation link sent to patient WhatsApp successfully.'
  })
}
