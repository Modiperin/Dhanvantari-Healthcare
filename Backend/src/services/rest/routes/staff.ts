import express from 'express'
import auth from '../middlewares/auth'
import validate from '../middlewares/validate'
import { isEmailValid, isNameValid } from '../validators/auth'
import { isDepartmentIdValid } from '../validators/department'
import {
  filterSearch,
  isAccessEndTimeValid,
  isAccessTypeValid,
  isActiveValid,
  isAwardsValid,
  isBioValid,
  isDateOfBirthValid,
  isExperienceValid,
  isGenderValid,
  isPhoneNoValid,
  isPublicationValid,
  isQulificationsValid,
  isRegistrationNoValid,
  isRoleValid,
  isSocailLinksValid,
  isSpecialitiesValid,
  isStaffIdValid,
  isStaffTypeValid,
  isTitleNameValid,
  isUserNameAlreadyExists,
  isUserNameValid,
  isWeakPasswordValid,
  keywordSearch
} from '../validators/staff'
import {
  createDoctor,
  createStaff,
  deleteStaff,
  getStaffList,
  getTestingStaffList,
  updateDoctor,
  updateStaff,
  updateStaffBasicDetails,
  viewStaff
} from '../controller/staff'
import { isProfileIdExists, isProfileIdValid } from '../validators/profile'
import { isStatusValid } from '../validators/pricing'

const staffRoute = express.Router()

// TODO: add default one role
// TODO: Acess control validation and limit reach validation

staffRoute.post(
  '/create',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([
    isRoleValid,
    isNameValid,
    isEmailValid,
    isPhoneNoValid,
    isWeakPasswordValid,
    isUserNameValid,
    isUserNameAlreadyExists,
    isDateOfBirthValid,
    isGenderValid,
    isQulificationsValid,
    isActiveValid,
    isStaffTypeValid,
    isDepartmentIdValid,
    isProfileIdValid,
    isProfileIdExists,
    isAccessTypeValid,
    isAccessEndTimeValid
  ]),
  createStaff
)

//TODO titlename, registration No., Bio, experience in years, awards(name, received date, awarded by), Publication(punlication url, publication name, date, organization), social media link
staffRoute.post(
  '/create-doctor',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([
    isNameValid,
    isUserNameValid,
    isUserNameAlreadyExists,
    isWeakPasswordValid,
    isDateOfBirthValid,
    isGenderValid,
    isQulificationsValid,
    isStaffTypeValid,
    isStatusValid,
    isDepartmentIdValid,
    isAccessTypeValid,
    isAccessEndTimeValid,
    isAwardsValid,
    isSocailLinksValid,
    isPublicationValid,
    isSpecialitiesValid,
    isActiveValid,
    isBioValid,
    isExperienceValid,
    isRegistrationNoValid,
    isTitleNameValid
  ]),
  createDoctor
)

staffRoute.get(
  '/view/:staffId',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([isStaffIdValid]),
  viewStaff
)

staffRoute.post('/create/bulk', auth('S', 'A', 'O', 'D', 'T'), validate([]))

// TODO: can not update the role but can update the access
staffRoute.put(
  '/update/:staffId',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([
    isStaffIdValid,
    isNameValid,
    isEmailValid,
    isPhoneNoValid,
    isUserNameValid,
    isUserNameAlreadyExists,
    isDateOfBirthValid,
    isGenderValid,
    isQulificationsValid,
    isActiveValid,
    isStaffTypeValid,
    isDepartmentIdValid,
    isProfileIdValid,
    isProfileIdExists,
    isAccessTypeValid,
    isAccessEndTimeValid
  ]),
  updateStaff
)

staffRoute.put(
  '/update/basic-details/:staffId',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([
    isStaffIdValid,
    isNameValid,
    isUserNameValid,
    isUserNameAlreadyExists,
    isPhoneNoValid,
    isGenderValid,
    isDateOfBirthValid
  ]),
  updateStaffBasicDetails
)

staffRoute.put(
  '/update-doctor/:staffId',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([
    isStaffIdValid,
    isNameValid,
    isEmailValid,
    isUserNameValid,
    isUserNameAlreadyExists,
    isDateOfBirthValid,
    isGenderValid,
    isQulificationsValid,
    isActiveValid,
    isStaffTypeValid,
    isDepartmentIdValid,
    isProfileIdValid,
    isProfileIdExists,
    isAccessTypeValid,
    isAccessEndTimeValid,
    isAwardsValid,
    isSocailLinksValid,
    isPublicationValid,
    isSpecialitiesValid,
    isBioValid,
    isRegistrationNoValid,
    isTitleNameValid
  ]),
  updateDoctor
)

staffRoute.get(
  '/list',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([keywordSearch, filterSearch]),
  getStaffList
)

staffRoute.get('/list/test', getTestingStaffList)

staffRoute.delete(
  '/delete/:staffId',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([isStaffIdValid]),
  deleteStaff
)

export default staffRoute
