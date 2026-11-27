import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import { dashboardCard, dashboardPatientList } from '../controller/dashboard'
import { filterSearch } from '../validators/dashboard'

const dashboardRoute = express.Router()

dashboardRoute.get(
  '/card',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([filterSearch]),
  dashboardCard
)

dashboardRoute.get(
  '/recent-patients',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([]),
  dashboardPatientList
)

export default dashboardRoute
