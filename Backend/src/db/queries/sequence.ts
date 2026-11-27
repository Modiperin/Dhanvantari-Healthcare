import { MongoClient } from 'mongodb'
import config from '../../config'

const collectionName = 'sequenceManager'

export const getCollection = (mongoDB: MongoClient) =>
  mongoDB.db(config.mongodb.DB_NAME).collection(collectionName)

export type SequenceName =
  | 'staff'
  | 'doctor'
  | 'patient'
  | 'appointment'
  | 'department'
  | 'bed'
  | 'inventory'
  | 'medicine'
  | 'labTest'
  | 'invoice'

export const getDefaultPrefix = (field: SequenceName): string => {
  switch (field) {
    case 'staff':
      return 'STF'
    case 'doctor':
      return 'DOC'
    case 'patient':
      return 'PTN'
    case 'appointment':
      return 'APT'
    case 'department':
      return 'DPT'
    case 'bed':
      return 'BED'
    case 'inventory':
      return 'INY'
    case 'medicine':
      return 'MED'
    case 'labTest':
      return 'LAB'
    case 'invoice':
      return 'INC'
    default:
      throw new Error(`Unknown sequence field: ${field}`)
  }
}

export const getId = async (
  mongoDB: MongoClient,
  field: SequenceName,
  hospitalId: string
): Promise<number> => {
  const sequenceData = await getCollection(mongoDB).findOneAndUpdate(
    { name: field, hospitalId },
    {
      $inc: { sequenceValue: 1 },
      $setOnInsert: {
        hospitalId,
        prefix: getDefaultPrefix(field),
        createdAt: new Date()
      }
    },
    { returnDocument: 'after', upsert: true }
  )

  return sequenceData?.sequenceValue || 1
}
