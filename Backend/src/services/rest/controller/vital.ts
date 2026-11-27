import { Request, Response } from 'express'
import * as vitalQueries from 'db/queries/vitals'
import * as patientVisitQueries from 'db/queries/patientVisits'
import * as commonQueries from 'db/queries/common'
import { generateUUID } from 'utils/uuid'
import mongoDB from 'db'
import { removeExtraFieldFormObject } from 'utils/funcations'

export const createVital = async (req: Request, res: Response) => {
  const {
    patientId,
    visitId,
    height,
    weight,
    bmi,
    temperature,
    bloodPressure,
    pulse,
    bp,
    spo2,
    bsf,
    rbs,
    bspp,
    respirationRate,
    complaints,
    doctorId,
    visitData
  } = res.locals.shared || {}

  const { user } = res.locals || {}
  const vitalId = generateUUID()

  const vitalData = {
    patientId,
    hospitalId: user.hospitalId,
    visitId,
    height,
    weight,
    bmi,
    temperature,
    bloodPressure,
    pulse,
    bp,
    spo2,
    bsf,
    rbs,
    bspp,
    respirationRate,
    complaints
  }

  const pureData = removeExtraFieldFormObject(
    vitalData,
    [
      'patientId',
      'hospitalId',
      'visitId',
      'height',
      'weight',
      'bmi',
      'temperature',
      'bloodPressure',
      'pulse',
      'bp',
      'spo2',
      'bsf',
      'rbs',
      'bspp',
      'respirationRate',
      'complaints'
    ],
    true,
    [false]
  )

  const visitUpdateData = {
    vitalStatus: 'Completed', // Completed - Vital is completed
    updatedAt: new Date()
  }

  // update doctor into visit if doctorId is different
  if (doctorId && visitData.doctorId !== doctorId) {
    Object.assign(visitUpdateData, {
      doctorId
    })
  }

  await Promise.all([
    commonQueries.createDocument(vitalQueries.getCollection, mongoDB, {
      _id: vitalId,
      ...pureData,
      status: 'A', // A - Active, P - Pending, C - Completed
      createdAt: new Date(),
      updatedAt: new Date()
    }),
    visitData && // the visit data will only comes while vitals added from the vital colection but not in the patient dashboard
      patientVisitQueries.updateVisitByCondition(
        mongoDB,
        {
          visitId,
          hospitalId: user.hospitalId
        },
        visitUpdateData
      )
  ])

  res.status(200).json({
    message: 'Vital created successfully.'
  })
}

export const updateVital = async (req: Request, res: Response) => {
  const { vitalId } = req.params
  const {
    visitId,
    height,
    weight,
    bmi,
    temperature,
    bloodPressure,
    pulse,
    bp,
    spo2,
    bsf,
    rbs,
    bspp,
    respirationRate,
    complaints,
    doctorId,
    visitData
  } = res.locals.shared || {}

  const { user } = res.locals || {}

  const vitalData = {
    height,
    weight,
    bmi,
    temperature,
    bloodPressure,
    pulse,
    bp,
    spo2,
    bsf,
    rbs,
    bspp,
    respirationRate,
    complaints
  }

  const pureData = removeExtraFieldFormObject(
    vitalData,
    [
      'height',
      'weight',
      'bmi',
      'temperature',
      'bloodPressure',
      'pulse',
      'bp',
      'spo2',
      'bsf',
      'rbs',
      'bspp',
      'respirationRate',
      'complaints'
    ],
    true
  )

  await commonQueries.updateDocument(
    vitalQueries.getCollection,
    mongoDB,
    { _id: vitalId },
    { $set: { ...pureData, updatedAt: new Date() } }
  )

  // update doctore into visit if doctorId is different
  if (doctorId && visitData.doctorId !== doctorId) {
    await patientVisitQueries.updateVisitByCondition(
      mongoDB,
      {
        visitId,
        hospitalId: user.hospitalId
      },
      {
        doctorId,
        updatedAt: new Date()
      }
    )
  }

  res.status(200).json({
    message: 'Vital updated successfully.'
  })
}

export const viewPatientAllVitals = async (req: Request, res: Response) => {
  const { patientId } = req.params
  const { user } = res.locals || {}

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const conditions = {
    patientId: patientId,
    hospitalId: user.hospitalId
  }

  const [vitalsData, totalRecords] = await Promise.all([
    vitalQueries.getVitalList(mongoDB, conditions, page, limit),
    commonQueries.countDocuments(
      vitalQueries.getCollection,
      mongoDB,
      conditions
    )
  ])

  res.status(200).json({
    // eslint-disable-next-line quotes
    message: "Patient's all vitals fetched successfully",
    response: {
      list: vitalsData || [],
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit)
    }
  })
}
