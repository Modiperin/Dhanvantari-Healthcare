import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  createPharmacy,
  getInvoicePharmaciesCard,
  getPharmacyQueue,
  pharmacyInvoiceList,
  updatePharmacy,
  viewPharmacy
} from '../controller/pharmacy'
import { isPatientIdValid } from '../validators/patient'
import { isVisitIdValid } from '../validators/patientVisit'
import { isPaymodesValid, keywordSearch } from '../validators/payment'
import {
  filterSearch,
  isPharmaciesValid,
  isPharmacyAlreadyExist,
  isPharmacyIdValid
} from '../validators/pharmacy'
// import { keywordSearch } from '../validators/staff'

const pharmacyRoute = express.Router()

pharmacyRoute.post(
  '/create',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isPatientIdValid,
    isVisitIdValid,
    isPharmacyAlreadyExist,
    isPharmaciesValid,
    isPaymodesValid
  ]),
  createPharmacy
)

pharmacyRoute.put(
  '/update/:pharmacyId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPharmacyIdValid, isPharmaciesValid, isPaymodesValid]),
  updatePharmacy
)

pharmacyRoute.get(
  '/list',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  getPharmacyQueue
)

pharmacyRoute.get(
  '/list/invoice',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  pharmacyInvoiceList
)

pharmacyRoute.get(
  '/view',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPharmacyIdValid]),
  viewPharmacy
)

pharmacyRoute.get(
  '/card/invoice',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  getInvoicePharmaciesCard
)

export default pharmacyRoute
