import { AnyType, DynamicObjectType } from 'types'
import patientActions from './patient'
import visitActions from './visit'

const eventActions: {
  [key: string]: {
    [key: string]: (data: DynamicObjectType) => Promise<AnyType>
  }
} = {
  patient: patientActions,
  visit: visitActions
}

export default async (
  feature: string,
  eventName: string,
  data: DynamicObjectType
) => {
  if (!Object.keys(eventActions).includes(feature)) {
    throw new Error('Invalid featureName')
  }

  if (!eventActions[feature][eventName]) {
    throw new Error(`Invalid eventName for feature: ${feature}.`)
  }

  return eventActions[feature][eventName](data)
}
