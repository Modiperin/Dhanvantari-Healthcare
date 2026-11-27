import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import { patientQueue } from '../controller/opd'
import { filterSearch, keywordSearch } from '../validators/patientVisit'

const opdRoute = express.Router()

opdRoute.get(
  '/list',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  patientQueue
)

opdRoute.get(
  '/doctor/list',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  patientQueue
)

export default opdRoute
