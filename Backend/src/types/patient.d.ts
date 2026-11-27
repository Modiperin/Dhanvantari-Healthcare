export interface EmergencyContactType {
  name: string
  relationship: string
  phoneNo: string
  email?: string
}

export type AddressType = {
  houseName: string
  locality: string
  area: string
  pincode: number
  digipin: string
  state: string
  country: string
}

export type ComplaintsType = {
  chiefComplaints?: string
  severness?: string
  region?: string
  bsf?: string
}

export type PatientDataType = {
  _id?: string
  serialId?: number
  hospitalId: string
  name: string
  gender: string
  bloodGroup: string
  dateOfBirth: string | Date
  phoneNo: string
  email: string
  emergencyContact: EmergencyContactType
  address: AddressType
}
