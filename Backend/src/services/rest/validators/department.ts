import { Request, Response } from 'express'
import mongoDB from 'db'
import * as commonQueries from 'db/queries/common'
import * as departmentQueris from 'db/queries/department'
import err from 'utils/err'
import { getFieldIntoReq, setFieldsIntoLocals } from 'utils/funcations'
import { keywordSearchHelper } from 'utils/searchAndFilter'

export const isDepartmentNameValid = async (req: Request, res: Response) => {
  const { name } = req.body
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return err('Please provide a valid department name.', 'name')
  }

  return null
}

export const isNameAlreadyExists = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors || []
  if (previousErrors.length) return null

  const { name } = req.body
  const { user } = res.locals
  const { departmentId } = req.params

  const existingDepartment = await commonQueries.findDocument(
    departmentQueris.getCollection,
    mongoDB,
    {
      _id: { $ne: departmentId },
      hospitalId: user.hospitalId,
      name: name.trim(),
      isDeleted: { $ne: true }
    }
  )

  if (existingDepartment) {
    return err('Department name already exists.', 'name')
  }
  return null
}

export const isDepartmentCodeValid = async (req: Request, res: Response) => {
  const { code } = req.body

  if (!code || typeof code !== 'string' || code.trim() === '') {
    return err('Please provide a valid department code.', 'code')
  }

  return null
}

export const isDepartmentActiveValid = async (req: Request, res: Response) => {
  const { active = true } = req.body

  if (typeof active !== 'boolean') {
    return err('Please provide a valid active status.', 'active')
  }

  return null
}

export const isDepartmentTypeValid = async (req: Request, res: Response) => {
  const { type } = req.body

  const validTypes = ['system', 'custom']

  if (!type || !validTypes.includes(type)) {
    return err('Please provide a valid department type.', 'type')
  }

  return null
}

export const isDepartmentIdValid = async (req: Request, res: Response) => {
  const departmentId = getFieldIntoReq(req, 'departmentId')
  const { user } = res.locals || {}

  if (
    !departmentId ||
    typeof departmentId !== 'string' ||
    !departmentId.trim()
  ) {
    return err('Please provide a valid department ID.', 'departmentId')
  }

  const existingDepartment = await commonQueries.findDocument(
    departmentQueris.getCollection,
    mongoDB,
    {
      _id: departmentId.trim(),
      hospitalId: user.hospitalId
    }
  )

  if (!existingDepartment) {
    return err('Department not found.', 'departmentId')
  }

  return null
}

export const isDepartmentIdValid2 = async (req: Request, res: Response) => {
  const departmentId = getFieldIntoReq(req, 'deptId')
  const { user } = res.locals || {}
  if (
    !departmentId ||
    typeof departmentId !== 'string' ||
    departmentId.trim() === ''
  ) {
    return err('Please provide a valid department ID.', 'departmentId')
  }

  const existingDepartment = await departmentQueris.getDepartmentByCondition(
    mongoDB,
    {
      _id: departmentId,
      hospitalId: user.hospitalId
    }
  )

  if (!existingDepartment) {
    return err('Department not found.', 'departmentId')
  }
  setFieldsIntoLocals(res, {
    deptData: existingDepartment
  })

  return null
}

export const keywordSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const { q, searchBy } = req.query

  if (!('q' in req.query)) {
    setFieldsIntoLocals(res, {
      searchCondition: {}
    })
    return null
  }

  let allowedKeywordToSerach = ['name', 'code']

  if (searchBy) {
    allowedKeywordToSerach = allowedKeywordToSerach.filter(
      (keyword) => keyword === searchBy
    )
  }
  const searchCondition = keywordSearchHelper(allowedKeywordToSerach, String(q))

  setFieldsIntoLocals(res, {
    searchCondition
  })

  return null
}
