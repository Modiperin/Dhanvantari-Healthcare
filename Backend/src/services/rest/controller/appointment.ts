import { Request, Response } from 'express'
import mongoDB from 'db'
import * as sequenceQueries from 'db/queries/sequence'
import * as appointmentQueries from 'db/queries/appointment'
import * as commonQueries from 'db/queries/common'
import * as hospitalQueries from 'db/queries/hospitals'
import { generateAppointmentId, generateUUID } from 'utils/uuid'
import { createPatient } from 'utils/createUser'
import {
  assignConditions,
  assignDateRangeCondition
} from 'utils/searchAndFilter'
import { removeExtraFieldFormObject } from 'utils/funcations'
import { getStaffByCondition } from 'db/queries/staff'
import { createAppointmentICS } from 'utils/ics'
import sendEmail from 'utils/email'

export const bookAppointment = async (req: Request, res: Response) => {
  const { user } = res.locals || {}

  const {
    name,
    gender,
    bloodGroup,
    dateOfBirth,
    email,
    phoneNo,
    emergencyContact,
    address,
    doctorId,
    date,
    time,
    scheduleDate,
    visitNote,
    doctorData
  } = res.locals.shared || {}

  const [patientSerialNumber, hospitalData] = await Promise.all([
    sequenceQueries.getId(mongoDB, 'patient', user.hospitalId),
    hospitalQueries.getHospitalByCondition(mongoDB, { _id: user.hospitalId })
  ])

  const patientData = {
    _id: generateUUID(),
    serialId: patientSerialNumber,
    hospitalId: user.hospitalId,
    name,
    gender,
    bloodGroup,
    dateOfBirth,
    phoneNo,
    email,
    emergencyContact,
    address
  }

  const appointmentId = generateAppointmentId(patientSerialNumber)

  const appointmentData = {
    _id: generateUUID(),
    appointmentId,
    patientId: patientData._id,
    hospitalId: user.hospitalId,
    doctorId,
    visitNote,
    date,
    time,
    scheduleDate,
    status: 'booked', //  status can be 'booked', 'cancelled', 'completed', etc.
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const icsContent = createAppointmentICS({
    patientName: patientData.name,
    doctorName: doctorData.name,
    appointmentDate: scheduleDate,
    duration: 30,
    hospitalName: hospitalData?.name || '',
    patientEmail: patientData.email,
    doctorEmail: doctorData.email,
    appointmentId: appointmentData._id,
    notes: 'Bring medical reports if any.',
    reminderMinutes: 30
  })

  await Promise.all([
    createPatient(patientData),
    commonQueries.createDocument(
      appointmentQueries.getCollection,
      mongoDB,
      appointmentData
    ),
    patientData.email &&
      sendEmail('appointment', {
        email: patientData.email,
        doctorName: doctorData.name,
        appointmentDate: date,
        appointmentId: appointmentData._id,
        appointmentICS: icsContent
      })
  ])

  res.status(200).json({ message: 'Appointment booked successfully' })
}

export const bookAppointmentForExistingPatient = async (
  req: Request,
  res: Response
) => {
  const { user } = res.locals || {}

  const {
    patientId,
    doctorId,
    date,
    time,
    scheduleDate,
    visitNote,
    doctorData,
    patientData
  } = res.locals.shared || {}

  const appointmentId = generateAppointmentId(patientData.serialId)

  const hospitalData = await hospitalQueries.getHospitalByCondition(mongoDB, {
    _id: user.hospitalId
  })

  const appointmentData = {
    _id: generateUUID(),
    appointmentId,
    patientId,
    hospitalId: user.hospitalId,
    doctorId,
    visitNote,
    date,
    time,
    scheduleDate,
    status: 'booked',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const icsContent = createAppointmentICS({
    patientName: patientData.name,
    doctorName: doctorData.name,
    appointmentDate: scheduleDate,
    duration: 30,
    hospitalName: hospitalData?.name || '',
    patientEmail: patientData.email,
    doctorEmail: doctorData.email,
    appointmentId: appointmentData._id,
    notes: 'Bring medical reports if any.',
    reminderMinutes: 30
  })

  await Promise.all([
    commonQueries.createDocument(
      appointmentQueries.getCollection,
      mongoDB,
      appointmentData
    ),
    patientData.email &&
      sendEmail('appointment', {
        email: patientData.email,
        doctorName: doctorData.name,
        appointmentDate: date,
        appointmentId: appointmentData._id,
        appointmentICS: icsContent
      })
  ])

  res.status(200).json({ message: 'Appointment booked successfully' })
}

export const getAppointmentList = async (req: Request, res: Response) => {
  const { user } = res.locals || {}
  const {
    searchCondition,
    filterCondition,
    startDate,
    endDate,
    ageStartDate,
    ageEndDate
  } = res.locals.shared || {}

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition = { hospitalId: user.hospitalId }
  const extraCondition = { ...searchCondition }

  assignConditions(extraCondition, filterCondition, {})
  assignDateRangeCondition(condition, 'scheduleDate', startDate, endDate)
  assignDateRangeCondition(extraCondition, 'dob', ageStartDate, ageEndDate)

  // console.dir({condition,extraCondition},{depth:null})

  const [appointments, totalAppointmentCount] = await Promise.all([
    appointmentQueries.getAppointmentListByCondition(
      mongoDB,
      condition,
      extraCondition,
      page,
      limit
    ),
    appointmentQueries.getAppointmentCountByCondition(
      mongoDB,
      condition,
      extraCondition
    )
  ])
  // console.log(totalAppointmentCount)
  const totalRecords =
    (Array.isArray(totalAppointmentCount) &&
      totalAppointmentCount[0] &&
      totalAppointmentCount[0].count) ||
    0

  res.status(200).json({
    message: 'Appointment list fetched successfully',
    response: {
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      list: appointments || []
    }
  })
}

export const updateAppointment = async (req: Request, res: Response) => {
  const { user } = res.locals || {}
  const { appointmentId, appointmentData, date, time, scheduleDate } =
    res.locals.shared || {}
  // console.log(res.locals.shared)
  const updateData = {
    date,
    time,
    scheduleDate,
    status: appointmentData?.status,
    updatedAt: new Date()
  }
  // console.log(updateData)
  if (
    appointmentData?.status === 'completed' ||
    appointmentData?.status === 'cancelled'
  ) {
    res.status(200).json({
      message:
        // eslint-disable-next-line quotes
        "The appointment you're trying to access is marked as completed or cancelled."
    })
  } else {
    var status = 'rescheduled'
    const pureUpdateData = removeExtraFieldFormObject(
      { ...updateData, status },
      ['date', 'time', 'scheduleDate', 'status', 'updatedAt'],
      true,
      [false]
    )

    // console.log({ pureUpdateData })

    await commonQueries.updateDocument(
      appointmentQueries.getCollection,
      mongoDB,
      { appointmentId: appointmentId, hospitalId: user.hospitalId },
      {
        $set: pureUpdateData
      }
    )

    res.status(200).json({ message: 'Appointment updated successfully' })
  }
}

export const viewAppointment = async (req: Request, res: Response) => {
  const {
    appointmentId,
    doctorId,
    visitNote,
    date,
    time,
    status,
    isEntryAllowed,
    _id
  } = res.locals.shared

  let response = {
    appointmentId,
    visitNote,
    date,
    time,
    status,
    isEntryAllowed,
    _id
  }

  if (doctorId) {
    const doctorName = await getStaffByCondition(
      mongoDB,
      { userId: doctorId },
      { name: 1 }
    )
    Object.assign(response, {
      doctorName: doctorName?.name,
      doctorId: doctorId
    })
  }

  res
    .status(200)
    .json({ message: 'Appointments fetched succesfully', response: response })
}

export const deleteAppointment = async (req: Request, res: Response) => {
  const { user } = res.locals || {}
  const { appointmentId } = res.locals.shared || {}
  await commonQueries.updateDocument(
    appointmentQueries.getCollection,
    mongoDB,
    {
      appointmentId: appointmentId,
      hospitalId: user.hospitalId,
      $or: [{ status: { $eq: 'booked' } }, { status: { $eq: 'rescheduled' } }]
    },
    {
      $set: { status: 'cancelled' }
    }
  )

  res.status(200).json({ message: 'Appointment cancelled successfully' })
}
