import express from 'express'
import validate from '../middlewares/validate'
import auth from '../middlewares/auth'
import { isStaffIdValid } from '../validators/staff'
import {
  isBreakTimingValid,
  isDateProvidedForAvailableDoctors,
  isDayValid,
  isLeaveAlredyApplied,
  isLeaveDateValid,
  isOnLeaveValid,
  isStaffIsDoctor,
  isTimingValid,
  keywordSearch
} from '../validators/roaster'
import {
  createTiming,
  getAvailableDoctors,
  scheduleBreakTiming,
  timingList
} from '../controller/roaster'

const roasterRoute = express.Router()

roasterRoute.get(
  '/list',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([keywordSearch]),
  timingList
)

roasterRoute.post(
  '/create',
  auth('O', 'S', 'A'),
  validate([
    isStaffIdValid,
    isStaffIsDoctor,
    isDayValid,
    isOnLeaveValid,
    isTimingValid
  ]),
  createTiming
)

roasterRoute.post(
  '/schedule-break',
  auth('O', 'S', 'A'),
  validate([
    isStaffIdValid,
    isStaffIsDoctor,
    isLeaveDateValid,
    isLeaveAlredyApplied,
    isOnLeaveValid,
    isBreakTimingValid
  ]),
  scheduleBreakTiming
)

roasterRoute.get(
  '/available-doctors',
  auth('O', 'S', 'A', 'D', 'T'),
  validate([isDateProvidedForAvailableDoctors]),
  getAvailableDoctors
)

// TODO: add route for update leave request(update schedule break timing)

export default roasterRoute
