export type HospitalData = {
  _id?: string
  email: string
  phoneNo?: string
  password: string
  name: string
  address?: string
  pincode?: string
  digiPin?: string
  optionalEmail?: string
  optionalPhoneNo?: string
  city?: string
  state?: string
  country?: string
  logo?: string
  pocDetails?: {
    name: string
    email: string
    phoneNo: string
  }
}
