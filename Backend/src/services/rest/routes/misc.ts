import express from 'express'
import validate from '../middlewares/validate'
import {
  demoList,
  scheduleDemo,
  searchDiagnosis,
  searchLabTest,
  searchMedicine,
  searchSymptoms
} from '../controller/misc'
import {
  isEmailValid,
  isFirstNameValid,
  isHospitalNameValid,
  isLastNameValid,
  isPhoneValid
} from '../validators/auth'
import {
  isBranchValid,
  isGSTNumberValid,
  isHospitalTypeValid,
  isWebsiteURLValid
} from '../validators/misc'
import apiKeyAuth from '../middlewares/auth/apiKeyAuth'

const route = express.Router()

route.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Dhanvantari HIS Backend API',
    version: '1.0.0'
  })
})

route.post(
  '/demo/schedule',
  validate([
    isFirstNameValid,
    isLastNameValid,
    isEmailValid,
    isPhoneValid,
    isHospitalNameValid,
    isWebsiteURLValid,
    isHospitalTypeValid,
    isBranchValid,
    isGSTNumberValid
  ]),
  scheduleDemo
)

// TODO: validate user for demo list (only owner can see the demo list)
route.get('/demo/list', demoList)

route.get('/diagnosis/search', apiKeyAuth, searchDiagnosis)

route.get('/medicine/search', apiKeyAuth, searchMedicine)

route.get('/labtest/search', apiKeyAuth, searchLabTest)

route.get('/symptoms/search', apiKeyAuth, searchSymptoms)

export default route
