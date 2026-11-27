import { Request, Response } from 'express'
import mongoDB from 'db'
// import * as commonQueries from 'db/queries/common'
import * as patientVisitQueries from 'db/queries/patientVisits'
import * as vitalQueries from 'db/queries/vitals'
import * as appointmentQueries from 'db/queries/appointment'
import * as consultationQeries from 'db/queries/consultation'
import { endOfDay, startOfDay } from 'date-fns'
import { DynamicObjectType } from 'types'

export const dashboardCard = async (req: Request, res: Response) => {
  const { user } = res.locals

  let { startDate, endDate } = res.locals.shared || {}

  // Set startDate and endDate to today if not provided
  if (!startDate || !endDate) {
    const now = new Date()
    startDate = startOfDay(now)
    endDate = endOfDay(now)
  }

  const condition = {
    hospitalId: user.hospitalId,
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  }

  let vitalRecord
  let registeredPatient
  let appointmentCount = []
  let totalVitalRecord = 0
  let maleVitalRecord = 0
  let femaleVitalRecord = 0
  let emergencyCase = 0
  let normalCase = 0
  let VIPCase = 0
  let totalRegisteredPatient
  let vitalRate = 0
  let maleVitalRate = 0
  let femaleVitalRate = 0

  // !! REMOVE AFTER DEMO
  if (user.userId === '5a88fb9d-1fcd-4349-8c9e-cdc9aa5f87bf') {
    totalRegisteredPatient = 369
    emergencyCase = 8
    normalCase = 360
    VIPCase = 1
    appointmentCount = [
      { total: 45, booked: 30, completed: 7, rescheduled: 5, cancelled: 3 }
    ]
    vitalRate = 82.0
    maleVitalRate = 55.0
    femaleVitalRate = 45.0
  } else {
    ;[registeredPatient, vitalRecord, appointmentCount] = await Promise.all([
      patientVisitQueries.getVisitCountByPriorityForDashboard(
        mongoDB,
        condition
      ),
      vitalQueries.getVitalRecordByGender(mongoDB, condition),
      appointmentQueries.getAppointmentCountsByCondition(mongoDB, {
        hospitalId: user.hospitalId,
        scheduleDate: { $gte: startDate, $lte: endDate }
      })
    ])

    vitalRecord.forEach((data) => {
      // vitalCollectionRate += data.count || 0
      totalVitalRecord += data.count || 0
      if (data._id === 'male') {
        maleVitalRecord += data.count || 0
      } else if (data._id === 'female') {
        femaleVitalRecord += data.count || 0
      }
    })

    registeredPatient.forEach((data) => {
      if (data._id === 1) {
        emergencyCase += data.count || 0
      } else if (data._id === 3) {
        normalCase += data.count || 0
      } else if (data._id === 2) {
        VIPCase += data.count || 0
      }
    })

    totalRegisteredPatient = emergencyCase + normalCase + VIPCase || 0
    vitalRate = (totalVitalRecord / (totalRegisteredPatient || 1)) * 100
    maleVitalRate = (maleVitalRecord / (totalVitalRecord || 1)) * 100
    femaleVitalRate = (femaleVitalRecord / (totalVitalRecord || 1)) * 100
  }

  res.status(200).json({
    message: 'Dashboard card data',
    response: {
      totalRegisteredPatient,
      emergencyCase,
      normalCase,
      VIPCase,
      vitalRecord: totalVitalRecord,
      appointmentCount: appointmentCount[0],
      vitalRate: vitalRate.toFixed(2),
      maleVitalRate: maleVitalRate.toFixed(2),
      femaleVitalRate: femaleVitalRate.toFixed(2)
    }
  })
}

export const dashboardPatientList = async (req: Request, res: Response) => {
  const { user } = res.locals || {}

  // let { startDate, endDate } = res.locals.shared || {}

  // // Set startDate and endDate to today if not provided
  // if (!startDate || !endDate) {
  //   const now = new Date()
  //   startDate = startOfDay(now)
  //   endDate = endOfDay(now)
  // }

  const condition = {
    hospitalId: user.hospitalId
    // createdAt: {
    //   $gte: startDate,
    //   $lte: endDate
    // }
  }

  const colors = ['#1666c0', '#1ea4c8', '#b3e2f3', '#ff7c47', '#d1d3d4']

  let recentPatient: DynamicObjectType[] = []
  let topDiagnosis: DynamicObjectType[] = []
  let topMedications: DynamicObjectType[] = []
  let topChiefComplaints: DynamicObjectType[] = []

  // !! REMOVE AFTER DEMO
  if (user.userId === '5a88fb9d-1fcd-4349-8c9e-cdc9aa5f87bf') {
    recentPatient = [
      {
        name: 'John Doe',
        age: 30,
        gender: 'male',
        lastVisit: new Date(),
        phoneNo: '+1234567890',
        departmentDetails: {
          name: 'Cardiology'
        },
        totalVisitCount: 5
      },
      {
        name: 'Jane Smith',
        age: 28,
        gender: 'female',
        lastVisit: new Date(),
        phoneNo: '+0987654321',
        departmentDetails: {
          name: 'Pediatrics'
        },
        totalVisitCount: 3
      },
      {
        name: 'Alice Johnson',
        age: 35,
        gender: 'female',
        lastVisit: new Date(),
        phoneNo: '+1122334455',
        departmentDetails: {
          name: 'Dermatology'
        },
        totalVisitCount: 2
      },
      {
        name: 'Bob Brown',
        age: 40,
        gender: 'male',
        lastVisit: new Date(),
        phoneNo: '+2233445566',
        departmentDetails: { name: 'Neurology' },
        totalVisitCount: 6
      },
      {
        name: 'Charlie Davis',
        departmentDetails: { name: 'Orthopedics' },
        lastVisit: new Date(),
        totalVisitCount: 4
      }
    ]

    topDiagnosis = [
      { name: 'Fever', value: 42, color: '#1666c0' },
      { name: 'Diabetes', value: 15, color: '#1ea4c8' },
      { name: 'Hypertension', value: 21, color: '#b3e2f3' },
      { name: 'Respiratory Issues', value: 12, color: '#ff7c47' },
      { name: 'Infections', value: 10, color: '#d1d3d4' }
    ]

    topMedications = [
      {
        name: 'Paracetamol',
        value: 45,
        color: '#1666c0'
      },
      {
        name: 'Metformin',
        value: 17,
        color: '#1ea4c8'
      },
      {
        name: 'Amoxicillin',
        value: 14,
        color: '#ff7c47'
      },
      {
        name: 'Atorvastatin',
        value: 13,
        color: '#b3e2f3'
      },
      {
        name: 'Omeprazole',
        value: 11,
        color: '#d1d3d4'
      }
    ]

    topChiefComplaints = [
      { name: 'Fever', value: 40, color: '#1666c0' },
      { name: 'Pain', value: 25, color: '#1ea4c8' },
      { name: 'Cough', value: 18, color: '#b3e2f3' },
      { name: 'Headache', value: 12, color: '#ff7c47' },
      { name: 'Vomiting', value: 8, color: '#d1d3d4' }
    ]
  } else {
    ;[recentPatient, topDiagnosis, topMedications, topChiefComplaints] =
      await Promise.all([
        patientVisitQueries.getVisitListByConditionForDashboard(
          mongoDB,
          condition,
          5
        ),
        consultationQeries.getTopDiagnosis(mongoDB, condition, 5),
        consultationQeries.getTopMedications(mongoDB, condition, 5),
        vitalQueries.getTopChiefComplaints(mongoDB, condition, 5)
      ])
    const totalDiagnosis = topDiagnosis.reduce(
      (acc, curr) => acc + curr.count,
      0
    )
    const totalMedications = topMedications.reduce(
      (acc, curr) => acc + curr.count,
      0
    )
    const totalChiefComplaints = topChiefComplaints.reduce(
      (acc, curr) => acc + curr.count,
      0
    )

    topDiagnosis.forEach((item, idx) => {
      item.value = Number(
        ((item.count / (totalDiagnosis || 1)) * 100).toFixed(2)
      )
      item.color = colors[idx] || '#000000'
    })
    topMedications.forEach((item, idx) => {
      item.value = Number(
        ((item.count / (totalMedications || 1)) * 100).toFixed(2)
      )
      item.color = colors[idx] || '#000000'
    })

    topChiefComplaints.forEach((item, idx) => {
      if (item.name === null) item.name = 'Not Specified'
      item.value = Number(
        ((item.count / (totalChiefComplaints || 1)) * 100).toFixed(2)
      )
      item.color = colors[idx] || '#000000'
    })
  }

  res.status(200).json({
    message: 'Recent patient list fetched.',
    response: {
      recentPatient,
      topDiagnosis,
      topMedications,
      topChiefComplaints
    }
  })
}
