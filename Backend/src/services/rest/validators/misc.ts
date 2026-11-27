import { Request } from 'express'
import err from 'utils/err'
import { isWebsiteValid } from 'utils/funcations'

export const isBranchValid = async (req: Request) => {
  const { branch } = req.body

  const validBranches = ['single', 'multi']

  if (!branch || !validBranches.includes(branch)) {
    return err('Please provide valid branch.', 'branch')
  }
  return null
}

export const isWebsiteURLValid = async (req: Request) => {
  const { website } = req.body
  if (website?.trim() === '') return null

  if (!website && !isWebsiteValid(website).valid && website.trim() !== '') {
    return err('Please provide valid website URL.', 'website')
  }

  return null
}

export const isHospitalTypeValid = async (req: Request) => {
  const { hospitalType } = req.body

  // const validHospitalTypes = [
  //   'Physician',
  //   'Clinic',
  //   'Hospital',
  //   'Pharmacy',
  //   'Diagnostic Center',
  //   'Laboratory'
  // ]

  if (
    !hospitalType ||
    !Array.isArray(hospitalType) ||
    !hospitalType.length ||
    hospitalType.some((a: string) => typeof a !== 'string')
  ) {
    return err('Please provide valid hospital type.', 'hospitalType')
  }

  return null
}

export const isGSTNumberValid = async (req: Request) => {
  const { gstNumber } = req.body

  if (!gstNumber || gstNumber === '') {
    return null
  }

  // Check if GST number exists and is string
  if (!gstNumber || typeof gstNumber !== 'string') {
    return err('Please provide GST number.', 'gstNumber')
  }

  // GST number should be 15 characters long
  if (gstNumber.length !== 15) {
    return err('GST number should be 15 characters long.', 'gstNumber')
  }

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

  if (!gstRegex.test(gstNumber)) {
    return err(
      'Invalid GST format. Format should be: 2 digits state code + 10 digits PAN + 1 digit entity number + 1 digit check sum + Z.',
      'gstNumber'
    )
  }

  // Validate state code (first 2 digits)
  const validStateCodes = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38'
  ]

  const stateCode = gstNumber.substring(0, 2)
  if (!validStateCodes.includes(stateCode)) {
    return err('Invalid state code in GST number.', 'gstNumber')
  }

  // Check if PAN portion (characters 3-12) is valid
  const panPortion = gstNumber.substring(2, 12)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
  if (!panRegex.test(panPortion)) {
    return err('Invalid PAN format in GST number.', 'gstNumber')
  }

  return null
}
