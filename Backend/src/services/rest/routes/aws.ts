import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import { isContetntTypeValid, isUrlTypeValid } from '../validators/aws'
import { presignedUrl } from '../controller/aws'

const dashboardRoute = express.Router()

dashboardRoute.get(
  '/presigned',
  auth('O', 'S'),
  validate([isUrlTypeValid, isContetntTypeValid]),
  presignedUrl
)

export default dashboardRoute
