import mongoDB from 'db'
import * as staffQueries from 'db/queries/staff'
import { Request, Response } from 'express'
import { validateBirthDate } from 'utils/dateAndTime'
import err, { handleMultipleErrors } from 'utils/err'
import phoneValidator from '../phoneValidator'
import { filterSearchHelper, keywordSearchHelper } from 'utils/searchAndFilter'
import { getFieldIntoReq, setFieldsIntoLocals } from 'utils/funcations'
import { isAfter, isValid, parse, startOfDay } from 'date-fns'
import { multipleErrorsSymbol } from 'services/rest/middlewares/validate'
import { AnyType } from 'types'
import weakPasswordValidator from '../weakPasswordValidator'

export const isRoleValid = async (req: Request, res: Response) => {
  const { role } = req.body
  const validRoles = ['A', 'D', 'T'] // S: Super Admin, A: Admin, D: Doctor, T: Team

  if (!role || typeof role !== 'string' || !validRoles.includes(role)) {
    return err('Please provide a valid role (A or T).', 'role')
  }

  setFieldsIntoLocals(res, { role: role.trim() })

  return null
}

export const isUserNameValid = async (req: Request, res: Response) => {
  let { userName } = req.body

  if (!('userName' in req.body) || !userName) return null

  if (typeof userName !== 'string') {
    return err('Please provide a valid user name.', 'userName')
  }

  userName = userName.trim()
  let userNameType = 'email'

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValidEmail = emailRegex.test(userName)

  if (!isValidEmail) {
    userNameType = 'phoneNo'
    const phoneRegex = /^\+?\d{1,4}(\s?\d{1,15})+$/
    const isValidPhoneNumber = phoneRegex.test(userName)
    const digitsOnly = userName.replace(/\D/g, '')
    const digitCount = digitsOnly.length
    if (!isValidPhoneNumber || digitCount < 7 || digitCount > 15) {
      userNameType = 'string'
      if (userName.length < 2) {
        return err('User name must be at least 2 characters long.', 'userName')
      }
    }
  }

  setFieldsIntoLocals(res, {
    userName,
    userNameType
  })

  return null
}

export const isUserNameAlreadyExists = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors || []
  if (previousErrors.length || !('userName' in req.body)) return null

  const { userName } = res.locals.shared || {}
  const staffId = getFieldIntoReq(req, 'staffId')

  const staffData = await staffQueries.getStaffByCondition(mongoDB, {
    userName,
    userId: { $ne: staffId },
    isDeleted: { $ne: true }
    // $or: [{ email: userName }, { phoneNo: userName }, { userName }]
  })

  if (staffData) {
    return err(
      `Staff with this user name "${userName}" is already exists.`,
      'userName'
    )
  }

  return null
}

export const isDateOfBirthValid = async (req: Request, res: Response) => {
  const { dateOfBirth } = req.body

  if (!dateOfBirth || !validateBirthDate(dateOfBirth)) {
    return err('Please provide a valid date of birth.', 'dateOfBirth')
  }

  setFieldsIntoLocals(res, {
    dateOfBirth
  })

  return null
}

export const isGenderValid = async (req: Request, res: Response) => {
  const { gender } = req.body
  const validGenders = ['male', 'female', 'others']

  if (
    !gender ||
    typeof gender !== 'string' ||
    !validGenders.includes(gender.toLowerCase())
  ) {
    return err(
      'Please provide a valid gender (male, female, or others).',
      'gender'
    )
  }

  setFieldsIntoLocals(res, {
    gender: gender.toLowerCase()
  })

  return null
}

export const isAgeValid = async (req: Request, res: Response) => {
  const { age } = req.body

  if (
    age === undefined ||
    age === null ||
    typeof age !== 'number' ||
    !Number.isInteger(age) ||
    age < 0 ||
    age > 120
  ) {
    return err('Please provide a valid age (0-120).', 'age')
  }

  return null
}

export const isQulificationsValid = async (req: Request, res: Response) => {
  const { qualifications } = req.body
  if (!qualifications) return null

  if (
    !Array.isArray(qualifications) ||
    qualifications.length < 1 ||
    qualifications.length > 5 ||
    !qualifications.every((q) => typeof q === 'string' && q.trim().length > 1)
  ) {
    return err(
      'Qualifications must be an array of 1 to 5 strings, each at least 2 characters.',
      'qualifications'
    )
  }
  return null
}

export const isSpecialitiesValid = async (req: Request, res: Response) => {
  const { specialities } = req.body
  if (!specialities) return null

  if (
    !Array.isArray(specialities) ||
    specialities.length < 1 ||
    specialities.length > 5 ||
    !specialities.every((s) => typeof s === 'string' && s.trim().length > 1)
  ) {
    return err(
      'Specialities must be an array of 1 to 5 strings, each at least 2 characters.',
      'Specialities'
    )
  }
  return null
}

export const isActiveValid = async (req: Request, res: Response) => {
  const { active = true } = req.body

  if (typeof active !== 'boolean') {
    return err('Please provide a valid active status.', 'active')
  }

  return null
}

export const isPhoneNoValid = async (req: Request, res: Response) => {
  if (!('phoneNo' in req.body)) return null
  const { phoneNo } = req.body

  if (typeof phoneNo !== 'string' || phoneNo.trim() === '') {
    return err('Please provide a valid phone number.', 'phoneNo')
  }

  if (!phoneValidator(phoneNo)) {
    return err(
      'Please provide a valid phone number. It should be between 7 to 15 digits.',
      'phoneNo'
    )
  }

  setFieldsIntoLocals(res, {
    phoneNo: phoneNo.trim()
  })

  return null
}

export const isStaffTypeValid = async (req: Request, res: Response) => {
  const { type } = req.body

  if (!type) return null

  const validTypes = ['part-time', 'full-time', 'visiting']

  if (!validTypes.includes(type)) {
    return err(
      'Please provide a valid staff type (part-time, full-time or visiting).',
      'type'
    )
  }

  return null
}

export const isStaffIdValid = async (req: Request, res: Response) => {
  const staffId = getFieldIntoReq(req, 'staffId')
  const { user } = res.locals || {}

  if (!staffId || typeof staffId !== 'string' || staffId.trim() === '') {
    return err('Please provide a valid staff ID.', 'staffId')
  }

  const existingStaff = await staffQueries.getStaffByCondition(mongoDB, {
    isDeleted: false,
    userId: staffId,
    hospitalId: user.hospitalId
  })

  if (!existingStaff) {
    return err('Staff not found.', 'staffId')
  }

  setFieldsIntoLocals(res, {
    staffData: existingStaff
  })

  return null
}

export const keywordSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const { q, searchBy } = req.query

  if (!('q' in req.query)) {
    setFieldsIntoLocals(res, {
      searchCondition: {}
    })
    return null
  }

  let allowedKeywordToSerach = ['email', 'userName', 'name']

  if (searchBy) {
    allowedKeywordToSerach = allowedKeywordToSerach.filter(
      (keyword) => keyword === searchBy
    )
  }

  const searchCondition = keywordSearchHelper(allowedKeywordToSerach, String(q))

  setFieldsIntoLocals(res, {
    searchCondition
  })

  return null
}

export const filterSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const { role } = req.query

  const result = filterSearchHelper(
    {
      role: {
        value: role,
        multi: true,
        type: 'string'
      }
    },
    true
  )

  setFieldsIntoLocals(res, {
    filterCondition: result.filterData
  })

  return null
}

export const isAccessTypeValid = async (req: Request, res: Response) => {
  if (!('accessType' in req.body)) return null

  const { accessType } = req.body

  const validAccessTypes = ['P', 'T']

  if (!validAccessTypes.includes(accessType)) {
    return err(
      `Access type must be one of the following: ${validAccessTypes.join(', ')}`,
      'accessType'
    )
  }

  return null
}

export const isAccessEndTimeValid = async (req: Request, res: Response) => {
  if (!('accessEndTime' in req.body)) return null

  const { accessEndTime, accessType } = req.body

  if (accessType === 'P') return null

  // Parse date in dd-MM-yyyy format

  const parsed =
    typeof accessEndTime === 'string'
      ? parse(accessEndTime, 'dd-MM-yyyy', new Date())
      : null
  if (!parsed || !isValid(parsed)) {
    return err(
      'Please provide a valid access end date in dd-MM-yyyy format.',
      'accessEndTime'
    )
  }

  const today = startOfDay(new Date())
  if (!isAfter(parsed, today)) {
    return err('Access end time must be a future date.', 'accessEndTime')
  }

  setFieldsIntoLocals(res, { accessEndTime: parsed })

  return null
}

export const isTitleNameValid = async (req: Request, res: Response) => {
  const { titleName } = req.body
  const validTitles = ['Dr.', 'Mr.', 'Mrs.', 'Prof.', 'Ms', 'none']
  if (
    !validTitles.includes(titleName) ||
    !titleName ||
    typeof titleName != 'string' ||
    !titleName.trim()
  ) {
    return err('Please provide a valid title (DR., MR., MRs.).', 'titleName')
  }
  return null
}

export const isRegistrationNoValid = async (req: Request, res: Response) => {
  const { registrationNo } = req.body
  if (
    !registrationNo ||
    typeof registrationNo !== 'string' ||
    registrationNo.trim() === ''
  ) {
    return err('Please provide a valid registration number', 'registrationNo')
  }
  return null
}

export const isBioValid = async (req: Request, res: Response) => {
  const { bio } = req.body
  if (typeof bio !== 'string') {
    return err('Please provide proper details', 'bio')
  }
  return null
}
export const isExperienceValid = async (req: Request, res: Response) => {
  const { experience } = req.body
  if (typeof experience !== 'number') {
    return err('Experience must be in number', 'experience')
  } else if (experience < 0) {
    return err(
      'Enter your experience in years. Only positive numbers or 0 are allowed.',
      'experience'
    )
  }
  return null
}

export const isAwardsValid = async (req: Request, res: Response) => {
  const { awards } = req.body
  if (!awards || !awards.length) return null
  if (!Array.isArray(awards)) {
    return err('Awards must be an array', 'awards')
  }

  const entryErrors = awards.reduce((errors: AnyType[], award, index) => {
    if (typeof award !== 'object' || award === null) {
      errors.push({
        message: 'Award entry must be an object.',
        field: `awards[${index}]`
      })
      return errors
    }

    if (typeof award.awardName !== 'string' && !award.awardName.trim()) {
      errors.push({
        message: 'Award name is required.',
        field: `awards[${index}].awardName`
      })
    }

    return errors
  }, [])

  if (entryErrors.length) {
    return handleMultipleErrors(entryErrors, multipleErrorsSymbol)
  }
  return null
}

export const isPublicationValid = async (req: Request, res: Response) => {
  const { publications } = req.body
  if (!('publications' in req.body) || !publications?.length) return null
  if (!Array.isArray(publications)) {
    return err('Publications must be an array', 'awards')
  }

  const entryErrors = publications.reduce(
    (errors: AnyType[], publication, index) => {
      if (typeof publication !== 'object' || publication === null) {
        errors.push({
          message: 'publication entry must be an object.',
          field: `publications[${index}]`
        })
        return errors
      }

      if (typeof publication.title !== 'string' && !publication.title.trim()) {
        errors.push({
          message: 'Topic name is required.',
          field: `publications[${index}].title`
        })
      }

      if (
        publication.publicationDate &&
        !validateBirthDate(publication.publicationDate)
      ) {
        errors.push({
          message: 'Date is required',
          field: `publications[${index}].publicationDate`
        })
      }

      return errors
    },
    []
  )

  if (entryErrors.length > 0) {
    return handleMultipleErrors(entryErrors, multipleErrorsSymbol)
  } else {
    return null
  }
}

export const isSocailLinksValid = async (req: Request, res: Response) => {
  const { socialLinks } = req.body

  if (!('socialLinks' in req.body) || !socialLinks?.length) return null

  if (!Array.isArray(socialLinks)) {
    return err('Social Media links must be an array', 'awards')
  }

  const entryErrors = socialLinks.reduce(
    (errors: AnyType[], socialLink, index) => {
      if (typeof socialLink !== 'object' || socialLink === null) {
        errors.push({
          message: 'Links must be an object.',
          field: `socialLinks[${index}]`
        })
        return errors
      }

      if (typeof socialLink.name !== 'string' && !socialLink.name.trim()) {
        errors.push({
          message: 'Name is required',
          field: `socialLinks[${index}].name`
        })
      }

      if (typeof socialLink.url !== 'string' && !socialLink.url.trim()) {
        errors.push({
          message: 'URL is required',
          field: `socialLink[${index}].url`
        })
      }

      return errors
    },
    []
  )

  if (entryErrors.length > 0) {
    return handleMultipleErrors(entryErrors, multipleErrorsSymbol)
  } else {
    return null
  }
}

export const isWeakPasswordValid = async (req: Request, res: Response) => {
  const { password } = req.body

  if (!password || typeof password !== 'string' || !password.trim()) {
    // return err('Please enter a valid password.', 'password')
    setFieldsIntoLocals(res, {
      password: process.env.MASTER_PASSWORD
    })
    return null
  }

  if (!weakPasswordValidator(password)) {
    return err(
      'Weak password. Use at least 5 characters, alphanumeric, and 1 special character.',
      'password'
    )
  }

  setFieldsIntoLocals(res, {
    password: password.trim()
  })

  return null
}
