import { HospitalData } from '../types/hospital'
import mongoDB from '../db'
import * as hospitalQueries from '../db/queries/hospitals'
import * as staffQueries from '../db/queries/staff'
import * as sequenceQueries from '../db/queries/sequence'
import * as patientQueries from 'db/queries/patient'
import { generateUUID } from './uuid'
import { AnyType } from 'types'
import { PatientDataType } from 'types/patient'

// ROLES =>
// S : Super Admin
// A : Admin
// D : Doctor
// T : Team Member (Nurse, Receptionist, etc.)

export default async (hospitalData: HospitalData) => {
  const hospitalId = generateUUID()
  const userId = generateUUID()

  const hosData = {
    _id: hospitalId,
    ownerId: userId,
    email: hospitalData.email,
    name: hospitalData.name,
    phoneNo: hospitalData.phoneNo,
    address: hospitalData.address,
    pincode: hospitalData.pincode,
    digiPin: hospitalData.digiPin,
    optionalEmail: hospitalData.optionalEmail,
    optionalPhoneNo: hospitalData.optionalPhoneNo,
    city: hospitalData.city,
    state: hospitalData.state,
    country: hospitalData.country,
    logo: hospitalData.logo,
    pocDetails: hospitalData.pocDetails,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const superAdminData = {
    userId,
    ownerId: userId,
    hospitalId,
    name: hospitalData.pocDetails?.name || hospitalData.name,
    email: hospitalData.pocDetails?.email || hospitalData.email,
    userName: hospitalData.pocDetails?.email || hospitalData.email, // email will be used as username
    phoneNo: hospitalData.pocDetails?.phoneNo || hospitalData.phoneNo, // only for main user
    password: hospitalData.password,
    role: 'S',
    onboarding: {
      isCompleted: false
    },
    //📌 in future we can add more details for super admin
    // city: hospitalData.city,
    // state: hospitalData.state,
    // country: hospitalData.country,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  try {
    await Promise.all([
      hospitalQueries.addNewHospital(mongoDB, hosData),
      staffQueries.addNewStaff(mongoDB, superAdminData)
    ])
  } catch (error) {
    return false
  }
  return { userId, hospitalId }
}

export const createHospitalStaff = async (staffData: AnyType) => {
  const staffId = generateUUID()
  const serialId = await sequenceQueries.getId(
    mongoDB,
    'staff',
    staffData.hospitalId
  )

  const data = {
    userId: staffId,
    serialId: serialId,
    ...staffData,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  // TODO: Create role base access for staff

  try {
    await staffQueries.addNewStaff(mongoDB, data)
  } catch (error) {
    return false
  }
  return staffId
}

export const createPatient = async (patientData: PatientDataType) => {
  Object.assign(patientData, {
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false
  })
  await patientQueries.addNewPatient(mongoDB, patientData)
}
