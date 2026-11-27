import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  isCostValid,
  isServiceIdValid,
  isServicePriceNameValid,
  isStatusValid,
  keywordSearch
} from '../validators/pricing'
import {
  createServiceName,
  deleteService,
  getServiceById,
  getServiceList,
  updateService
} from '../controller/pricing'

const pricingRoute = express.Router()

pricingRoute.post(
  '/create',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([isServicePriceNameValid, isCostValid, isStatusValid]),
  createServiceName
)

pricingRoute.get(
  '/list',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([keywordSearch]),
  getServiceList
)

pricingRoute.delete(
  '/delete/:serviceId',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([isServiceIdValid]),
  deleteService
)

pricingRoute.get(
  '/view/:serviceId',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([isServiceIdValid]),
  getServiceById
)

pricingRoute.put(
  '/update/:serviceId',
  auth('S', 'A', 'O', 'D', 'T'),
  validate([
    isServiceIdValid,
    isServicePriceNameValid,
    isCostValid,
    isStatusValid
  ]),
  updateService
)
export default pricingRoute
