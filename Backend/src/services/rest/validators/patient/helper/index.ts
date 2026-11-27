import { AddressType, EmergencyContactType } from 'types/patient'
import phoneValidator from '../../phoneValidator'

export const validateEmergencyContactDetails = (
  emergencyContact: EmergencyContactType
) => {
  const errors: {
    field: string
    message: string
  }[] = []

  let relationship = [
    'guardian',
    'sister',
    'brother',
    'father',
    'mother',
    'uncle',
    'aunt',
    'friend',
    'spouse',
    'wife',
    'husband',
    'son',
    'daughter',
    'other'
  ]

  if (typeof emergencyContact !== 'object') {
    errors.push({
      message: 'Invalid emergency contact details.',
      field: 'emergencyContact'
    })

    if (errors.length)
      return {
        error: true,
        validationErrors: errors
      }
  }

  if (emergencyContact.name && emergencyContact.name.trim().length < 2) {
    errors.push({
      message:
        'Please provide a valid emergency contact name (at least 2 characters).',
      field: 'emergencyContact.name'
    })
  }

  if (emergencyContact.phoneNo && !phoneValidator(emergencyContact.phoneNo)) {
    errors.push({
      message: 'Please provide a valid emergency contact phone number.',
      field: 'emergencyContact.phoneNo'
    })
  }

  if (
    emergencyContact.relationship.length &&
    !relationship.includes(emergencyContact.relationship)
  ) {
    errors.push({
      message: 'Please provide valid emergency contact relationship.',
      field: 'emergencyContact.relationship'
    })
  }

  // if any errors is present then return it
  if (errors.length) {
    return {
      error: true,
      validationErrors: errors
    }
  }

  return {
    error: false
  }
}

export const validateAddressDetalis = (address: AddressType) => {
  const errors: { field: string; message: string }[] = []

  if (!address || typeof address !== 'object') {
    errors.push({
      field: 'address',
      message: 'Invalid address details.'
    })
    return { error: true, validationErrors: errors }
  }

  if (!address.houseName || address.houseName.trim().length < 2) {
    errors.push({
      field: 'address.houseName',
      message: 'Please provide a valid house name.'
    })
  }

  if (!address.locality || address.locality.trim().length < 2) {
    errors.push({
      field: 'address.locality',
      message: 'Please provide a valid locality.'
    })
  }

  if (!address.area || address.area.trim().length < 2) {
    errors.push({
      field: 'address.area',
      message: 'Please provide a valid area.'
    })
  }
  if (
    !address.pincode ||
    // typeof address.pincode !== 'numbe' ||
    address.pincode.toString().length < 4 ||
    !/^[a-zA-Z0-9\s-]+$/.test(String(address.pincode))
  ) {
    errors.push({
      field: 'address.pincode',
      message: 'Please provide a valid pincode.'
    })
  }

  if (!address.digipin) {
    errors.push({
      field: 'address.digipin',
      message: 'Please provide a valid digipin.'
    })
  }

  if (!address.state || address.state.trim().length < 2) {
    errors.push({
      field: 'address.state',
      message: 'Please provide a valid state.'
    })
  }

  if (!address.country || address.country.trim().length < 2) {
    errors.push({
      field: 'address.country',
      message: 'Please provide a valid country.'
    })
  }

  if (errors.length) {
    return { error: true, validationErrors: errors }
  }

  return { error: false }
}
