import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import {
  createDepartment,
  deleteDepartment,
  getDepartmentDetail,
  getDepartments,
  updateDepartmentById
} from '../controller/department'
import {
  isDepartmentActiveValid,
  isDepartmentCodeValid,
  isDepartmentIdValid,
  isDepartmentIdValid2,
  isDepartmentNameValid,
  isNameAlreadyExists,
  keywordSearch
} from '../validators/department'

const departmentRoute = express.Router()

departmentRoute.post(
  '/create',
  auth('S', 'O', 'T'),
  validate([
    isDepartmentNameValid,
    isNameAlreadyExists,
    isDepartmentCodeValid,
    isDepartmentActiveValid
  ]),
  createDepartment
)

departmentRoute.get(
  '/list',
  auth('S', 'A', 'T', 'O'),
  validate([keywordSearch]),
  getDepartments
)

departmentRoute.delete(
  '/delete/:departmentId',
  auth('S', 'A', 'O'),
  validate([isDepartmentIdValid]),
  deleteDepartment
)

departmentRoute.get(
  '/view/:deptId',
  auth('S', 'A', 'O'),
  validate([isDepartmentIdValid2]),
  getDepartmentDetail
)

departmentRoute.put(
  '/update/:departmentId',
  auth('S', 'A', 'O'),
  validate([
    isDepartmentIdValid,
    isDepartmentNameValid,
    isNameAlreadyExists,
    isDepartmentCodeValid,
    isDepartmentActiveValid
  ]),
  updateDepartmentById
)

export default departmentRoute
