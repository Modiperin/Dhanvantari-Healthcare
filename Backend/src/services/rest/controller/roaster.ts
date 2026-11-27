import mongoDB from 'db'
import * as roasterQueries from 'db/queries/roaster'
import * as staffQueries from 'db/queries/staff'
import * as leaveRequestsQueries from 'db/queries/leaveRequests'
import * as commonQueries from 'db/queries/common'
import { Request, Response } from 'express'
import { getFieldIntoReq } from 'utils/funcations'
import { generateUUID } from 'utils/uuid'
import { getTimestampFromDate } from 'utils/dateAndTime'
import { assignConditions } from 'utils/searchAndFilter'
import { endOfDay, format, startOfDay } from 'date-fns'

export const timingList = async (req: Request, res: Response) => {
  const { user } = res.locals || {}

  const { searchCondition } = res.locals.shared

  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.max(1, Number(req.query.limit) || 10)

  const condition = {
    hospitalId: user.hospitalId,
    role: 'D',
    isDeleted: { $ne: true }
  }

  assignConditions(condition, searchCondition, {})

  const [roasterData, totalRecords] = await Promise.all([
    staffQueries.getDoctorRoaster(mongoDB, condition, page, limit),
    commonQueries.countDocuments(staffQueries.getCollection, mongoDB, condition)
  ])

  res.status(200).json({
    message: 'Roaster data fetched successfully',
    response: {
      currentPage: page,
      pageLimit: limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
      list: roasterData || []
    }
  })
}

export const createTiming = async (req: Request, res: Response) => {
  const { day, onLeave } = req.body
  const { mergedTiming } = res.locals.shared || {}
  const staffId = getFieldIntoReq(req, 'staffId')
  const { user } = res.locals || {}

  await roasterQueries.updateTiming(
    mongoDB,
    { staffId, day },
    {
      $set: {
        onLeave,
        timing: mergedTiming,
        updatedAt: new Date()
      },
      $setOnInsert: {
        _id: generateUUID(),
        hospitalId: user.hospitalId,
        createdAt: new Date()
      }
    },
    { upsert: true }
  )

  res.status(200).json({
    message: 'Timing updated successfully'
  })
}

export const scheduleBreakTiming = async (req: Request, res: Response) => {
  const { date, mergedTiming, onLeave } = res.locals.shared || {}

  const { user } = res.locals || {}
  const staffId = getFieldIntoReq(req, 'staffId')

  await leaveRequestsQueries.updateLeaveRequest(
    mongoDB,
    {
      userId: staffId,
      hospitalId: user.hospitalId,
      date: getTimestampFromDate(date)
    },
    {
      $set: {
        onLeave,
        timing: mergedTiming,
        updatedAt: new Date()
      },
      $setOnInsert: {
        _id: generateUUID(),
        hospitalId: user.hospitalId,
        createdAt: new Date()
      }
    },
    { upsert: true }
  )

  res.status(200).json({
    message: 'Leave request created successfully'
  })
}

export const getAvailableDoctors = async (req: Request, res: Response) => {
  const { user } = res.locals || {}
  const { parsedDate } = res.locals.shared || {}

  // Get the day name (e.g., 'Monday')
  const dayName = format(parsedDate, 'EEEE')

  // Get start and end of the day
  const start = startOfDay(parsedDate).getTime()
  const end = endOfDay(parsedDate).getTime()

  const availableDoctors = await staffQueries.getAvailableDoctors(
    mongoDB,
    {
      hospitalId: user.hospitalId,
      role: 'D',
      isDeleted: { $ne: true }
    },
    start,
    end,
    dayName
  )

  res.status(200).json({
    message: 'Available doctors fetched successfully',
    response: availableDoctors
  })
}
