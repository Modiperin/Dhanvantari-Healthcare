import mongoDB from 'db'
import { staffMemberListByAccess } from 'db/queries/staff'
import { DynamicObjectType } from 'types'
import sendSocketMessage from 'utils/socket'

export const endVisitSocket = async (data: DynamicObjectType) => {
  const { visitId, user } = data

  const teamList = await staffMemberListByAccess(mongoDB, user.hospitalId, {
    $or: [{ 'access.nurse.view': true }, { 'access.doctor.view': true }]
  })
  const userNames = teamList.map((member) => member.userName)

  await sendSocketMessage(userNames, {
    eventName: 'END_VISIT',
    data: visitId
  })
}

export default async (data: DynamicObjectType) => {
  await endVisitSocket(data)
}
