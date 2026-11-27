import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  createProfile,
  getProfile,
  getProfileList,
  updateProfile
} from '../controller/profile'
import {
  isDescriptionValid,
  isProfileAccessValid,
  isProfileIdExists,
  isProfileIdValid,
  isProfileNameAlreadyExists,
  isProfileNameValid,
  keywordSearch
} from '../validators/profile'

const profileRoute = express.Router()

profileRoute.get(
  '/view/:profileId',
  auth('S', 'A'),
  validate([isProfileIdValid, isProfileIdExists]),
  getProfile
)

profileRoute.post(
  '/create',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([
    isProfileNameValid,
    isProfileNameAlreadyExists,
    isProfileAccessValid,
    isDescriptionValid
  ]),
  createProfile
)

profileRoute.put(
  '/update/:profileId',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([
    isProfileIdValid,
    isProfileIdExists,
    isProfileNameValid,
    isProfileNameAlreadyExists,
    isProfileAccessValid,
    isDescriptionValid
  ]),
  updateProfile
)

profileRoute.delete(
  '/delete/:profileId',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([isProfileIdValid, isProfileIdExists])
)

profileRoute.get(
  '/list',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([keywordSearch]),
  getProfileList
)

export default profileRoute
