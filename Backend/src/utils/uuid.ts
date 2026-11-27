import { v4 as uuidv4 } from 'uuid'

export const generateUUID = () => uuidv4()

export const generateRandomString = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase()

export const generateVisitId = (patientSerial: number) => {
  const random = generateRandomString()
  return `P${patientSerial}-${random}`
}

export const generateAppointmentId = (patientSerial: number) => {
  const random = generateRandomString()
  return `A${patientSerial}-${random}`
}

export const generateInvoiceId = (patientSerial: number) => {
  const random = generateRandomString()
  return `I${patientSerial}-${random}`
}

export const generateUniqueId = () =>
  Date.now() + Math.floor(Math.random() * 1000)
