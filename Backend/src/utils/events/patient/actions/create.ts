import mongoDB from 'db'
import { staffMemberListByAccess } from 'db/queries/staff'
import { DynamicObjectType } from 'types'
import sendSocketMessage from 'utils/socket'

export const newPatientSocketEvent = async (data: DynamicObjectType) => {
  const { patientData, patientVisitData, user, doctorData, departmentData } =
    data

  //TODO: Add logs if fails

  const teamList = await staffMemberListByAccess(mongoDB, user.hospitalId, {
    $or: [{ 'access.nurse.view': true }, { 'access.doctor.view': true }]
  })
  const userNames = teamList.map((member) => member.userName)

  const eventData = {
    ...patientVisitData,
    name: patientData.name,
    serialId: patientData.serialId,
    gender: patientData.gender,
    dateOfBirth: patientData.dateOfBirth,
    doctorDetails: {
      name: doctorData.name,
      departmentId: departmentData._id
    },
    departmentDetails: departmentData
  }

  //TODO: find list of user names to send the socket message
  await sendSocketMessage(userNames, {
    eventName: 'NEW_PATIENT',
    data: eventData
  })
}

export default async (data: DynamicObjectType) => {
  await newPatientSocketEvent(data)
}
