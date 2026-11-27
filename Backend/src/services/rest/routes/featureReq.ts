import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  createFeatureRequest,
  getFeatureRequestList
} from '../controller/featureReq'
import { isDescriptionValid, isTitleValid } from '../validators/featureReq'

const featureReqRoute = express.Router()

featureReqRoute.post(
  '/create',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isTitleValid, isDescriptionValid]),
  createFeatureRequest
)

featureReqRoute.get(
  '/list',
  auth('O', 'S', 'A', 'T', 'D'),
  getFeatureRequestList
)

export default featureReqRoute
