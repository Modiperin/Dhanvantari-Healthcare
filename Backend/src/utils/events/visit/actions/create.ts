import { DynamicObjectType } from 'types'
import { newPatientSocketEvent } from 'utils/events/patient/actions/create'

export default async (data: DynamicObjectType) => {
  await newPatientSocketEvent(data)
}
