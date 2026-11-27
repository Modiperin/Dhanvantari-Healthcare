import { Response, Request } from 'express'
import * as commonQueries from 'db/queries/common'
import * as demoAppointmentsQueries from 'db/queries/demoAppointments'
import * as diagnosisQueries from 'db/queries/diagnosis'
import * as medicineQueries from 'db/queries/medicine'
import * as labTestQueries from 'db/queries/labTest'
import * as symptomsQueries from 'db/queries/symptoms'
import mongoDB from 'db'

export const scheduleDemo = async (req: Request, res: Response) => {
  const {
    email,
    name: hospitalName,
    phone,
    website,
    hospitalType,
    gstNumber
  } = req.body

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
  const userAgent = req.headers['user-agent']

  const demoAppointmentData = {
    email,
    hospitalName,
    phone,
    website,
    hospitalType,
    gstNumber,
    ip,
    userAgent,
    status: 'pending',
    createdAt: new Date()
  }

  await commonQueries.createDocument(
    demoAppointmentsQueries.getCollection,
    mongoDB,
    demoAppointmentData
  )

  res.status(200).json({
    message:
      'Demo appointment scheduled successfully. We will contact you soon.'
  })
}

export const demoList = async (req: Request, res: Response) => {
  const demoAppointments =
    await demoAppointmentsQueries.getDemoAppointmentsByCondition(
      mongoDB,
      {},
      {
        _id: 0,
        ip: 0,
        userAgent: 0
      }
    )

  res.status(200).json({
    message: 'Demo appointments fetched successfully.',
    response: demoAppointments
  })
}

export const searchDiagnosis = async (req: Request, res: Response) => {
  const { q } = req.query
  const query = typeof q === 'string' ? q.trim() : ''

  if (!query || typeof query !== 'string') {
    res.status(400).json({ message: 'Invalid search query' })
    return
  }

  const result = await diagnosisQueries.getDiagnosisListByCondition(
    mongoDB,
    {
      name: { $regex: query, $options: 'i' }
    },
    {
      aliases: 0
    }
  )

  res.status(200).json({
    message: 'Diagnosis fetched successfully.',
    response: result
  })
}

export const searchMedicine = async (req: Request, res: Response) => {
  const { q } = req.query
  const query = typeof q === 'string' ? q.trim() : ''

  if (!query || typeof query !== 'string') {
    res.status(400).json({ message: 'Invalid search query' })
    return
  }

  const result = await medicineQueries.getMedicineListByCondition(
    mongoDB,
    {
      name: { $regex: query, $options: 'i' }
    },
    {
      aliases: 0
    }
  )

  res.status(200).json({
    message: 'Medicine fetched successfully.',
    response: result
  })
}

export const searchLabTest = async (req: Request, res: Response) => {
  const { q } = req.query
  const query = typeof q === 'string' ? q.trim() : ''

  if (!query || typeof query !== 'string') {
    res.status(400).json({ message: 'Invalid search query' })
    return
  }

  const result = await labTestQueries.getLabTestListByCondition(
    mongoDB,
    {
      name: { $regex: query, $options: 'i' }
    },
    {
      aliases: 0
    }
  )

  res.status(200).json({
    message: 'Lab tests fetched successfully.',
    response: result
  })
}
export const searchSymptoms = async (req: Request, res: Response) => {
  const { q } = req.query
  const query = typeof q === 'string' ? q.trim() : ''

  if (!query || typeof query !== 'string') {
    res.status(400).json({ message: 'Invalid search query' })
    return
  }

  const result = await symptomsQueries.getSymptomsListByCondition(
    mongoDB,
    {
      name: { $regex: query, $options: 'i' }
    },
    {
      aliases: 0
    }
  )

  res.status(200).json({
    message: 'Symptoms fetched successfully.',
    response: result
  })
}
