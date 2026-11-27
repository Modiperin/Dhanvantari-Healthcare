import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  createPayment,
  getInvoicePaymentsCard,
  getPatientPaymentCard,
  getPatientPaymentList,
  getPatientPaymentLogs,
  getPaymentQueue,
  invoiceList,
  settleUpDues,
  updatePayment,
  viewDuesDetails,
  viewPayment
} from '../controller/payment'
import { isPatientIdValid } from '../validators/patient'
import { isVisitIdValid } from '../validators/patientVisit'
import {
  filterSearch,
  invoiceKeywordSearch,
  isInvoiceIdValid,
  isPaymentAlredyExists,
  isPaymentIdValid,
  isPaymentsValid,
  isPaymodesValid,
  keywordSearch
} from '../validators/payment'

const paymentRoute = express.Router()

paymentRoute.get(
  '/view',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPaymentIdValid]),
  viewPayment
)

paymentRoute.get(
  '/view/dues/:patientId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPatientIdValid]),
  viewDuesDetails
)

paymentRoute.post(
  '/create',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([
    isPatientIdValid,
    isVisitIdValid,
    isPaymentAlredyExists,
    isPaymentsValid,
    isPaymodesValid
  ]),
  createPayment
)

paymentRoute.put(
  '/update/:paymentId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPaymentIdValid, isPaymentsValid, isPaymodesValid]),
  updatePayment
)

paymentRoute.get(
  '/list',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  getPaymentQueue
)

paymentRoute.get(
  '/list/invoice',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  invoiceList
)

paymentRoute.get(
  '/card/invoice',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([keywordSearch, filterSearch]),
  getInvoicePaymentsCard
)

paymentRoute.get(
  '/list/:patientId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPatientIdValid, invoiceKeywordSearch, filterSearch]),
  getPatientPaymentList
)

paymentRoute.get(
  '/card/:patientId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPatientIdValid]),
  getPatientPaymentCard
)

paymentRoute.get(
  '/logs/:paymentId',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isPaymentIdValid]),
  getPatientPaymentLogs
)

paymentRoute.post(
  '/settleupdue',
  auth('O', 'S', 'A', 'T', 'D'),
  validate([isInvoiceIdValid]),
  settleUpDues
)

export default paymentRoute
