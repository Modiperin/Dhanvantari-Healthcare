import { Request, Response } from 'express'
import mongoDB from 'db'
import * as patientVisitQueries from 'db/queries/patientVisits'
import {
  assignConditions,
  assignDateRangeCondition
} from 'utils/searchAndFilter'
import { endOfDay, startOfDay } from 'date-fns'
import { AnyType } from 'types'

export const patientQueue = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { from = 'nurse' } = req.query // from : 'nurse' | 'doctor' - Queue

  let {
    searchCondition,
    filterCondition,
    patientFilterCondition,
    startDate,
    endDate,
    ageStartDate,
    ageEndDate
  } = res.locals.shared

  // Set startDate and endDate to today if not provided
  if (!startDate || !endDate) {
    const now = new Date()
    startDate = startOfDay(now)
    endDate = endOfDay(now)
  }

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition: AnyType = {
    hospitalId: user.hospitalId
  }

  const extraCondition = { ...searchCondition }

  assignConditions(condition, filterCondition, {})
  assignConditions(extraCondition, patientFilterCondition, {})
  assignDateRangeCondition(extraCondition, 'dob', ageStartDate, ageEndDate)
  assignDateRangeCondition(condition, 'createdAt', startDate, endDate)

  const doneCondition = {
    ...condition
  }
  if (from === 'doctor') {
    if (condition?.contStatus == 'Completed')
      doneCondition.contStatus = { $ne: 'Completed' }
    else doneCondition.contStatus = { $eq: 'Completed' }
  } else {
    if (condition?.vitalStatus == 'Completed')
      doneCondition.vitalStatus = { $ne: 'Completed' }
    else doneCondition.vitalStatus = { $eq: 'Completed' }
  }

  const [visits, totalVisitCount, doneData] = await Promise.all([
    patientVisitQueries.getVisitListByCondition(
      mongoDB,
      condition,
      extraCondition,
      page,
      limit,
      {
        priority: 1
      }
    ),
    patientVisitQueries.getVisitCountByCondition(
      mongoDB,
      condition,
      extraCondition
    ),
    patientVisitQueries.getVisitCountByCondition(
      mongoDB,
      doneCondition,
      extraCondition
    )
  ])

  const doneCount = doneData[0]?.count ?? 0

  const totalRecords =
    (Array.isArray(totalVisitCount) &&
      totalVisitCount[0] &&
      totalVisitCount[0].count) ||
    0

  res.status(200).json({
    message: 'Patient queued successfully',
    response: {
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      list: visits || [],
      doneCount
    }
  })
}
