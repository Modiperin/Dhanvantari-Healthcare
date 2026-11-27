import { Response, Request } from 'express'
import mongoDB from 'db'
import * as commonQueries from 'db/queries/common'
import * as departmentQueris from 'db/queries/department'
import { generateUUID } from 'utils/uuid'
import { getFieldIntoReq, removeExtraFieldFormObject } from 'utils/funcations'
import { assignConditions } from 'utils/searchAndFilter'

export const createDepartment = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { name, code, active = true, hospitalId } = req.body

  const departmentData = {
    _id: generateUUID(),
    name: name.trim(),
    code,
    active,
    //todo if role is owner then overrise hospitalId otherwise not.
    hospitalId: hospitalId ? hospitalId : user.hospitalId,
    type: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false
  }

  await commonQueries.createDocument(
    departmentQueris.getCollection,
    mongoDB,
    departmentData
  )

  res.status(200).json({
    message: 'Department created successfully.'
  })
}

export const getDepartments = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { searchCondition, filterCondition } = res.locals.shared

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition = { hospitalId: user.hospitalId, isDeleted: false }
  assignConditions(condition, searchCondition, filterCondition)
  const [departments, totalRecords] = await Promise.all([
    departmentQueris.getDepartmentList(mongoDB, condition, page, limit),
    commonQueries.countDocuments(
      departmentQueris.getCollection,
      mongoDB,
      condition
    )
  ])

  res.status(200).json({
    message: 'Departments fetched successfully.',
    response: {
      list: departments || [],
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit)
    }
  })
}

export const deleteDepartment = async (req: Request, res: Response) => {
  const departmentId = getFieldIntoReq(req, 'departmentId')
  const { user } = res.locals

  await departmentQueris.updateDeptById(
    mongoDB,
    {
      _id: departmentId,
      hospitalId: user.hospitalId
    },
    {
      isDeleted: true,
      updatedAt: new Date()
    }
  )

  res.status(200).json({
    message: 'Department deleted successfully.'
  })
}

export const getDepartmentDetail = async (req: Request, res: Response) => {
  const { deptData } = res.locals.shared || {}

  res.status(200).json({
    message: 'Department Data feteched successfully',
    response: deptData
  })
}

export const updateDepartmentById = async (req: Request, res: Response) => {
  const { departmentId } = req.params
  const { name, code, active } = req.body
  const { user } = res.locals || {}
  const deptData = {
    name,
    code,
    active
  }

  const pureUpdateData = removeExtraFieldFormObject(
    deptData,
    ['name', 'code', 'active'],
    true,
    [false]
  )
  await departmentQueris.updateDeptById(
    mongoDB,
    {
      _id: departmentId,
      hospitalId: user.hospitalId
    },
    pureUpdateData
  )
  res.status(200).json({
    message: 'Department updated successfully.'
  })
}
