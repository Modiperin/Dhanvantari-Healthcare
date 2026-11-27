import mongoDB from 'db'
import { Request, Response } from 'express'
import * as pharmacyQueries from 'db/queries/pharmacy'
import { AnyType } from 'types'
import err, { handleMultipleErrors } from 'utils/err'
import { multipleErrorsSymbol } from '../middlewares/validate'
import { getFieldIntoReq, setFieldsIntoLocals } from 'utils/funcations'
import { filterSearchHelper } from 'utils/searchAndFilter'
import { getDateRangeFromAgeRange } from 'utils/dateAndTime'
import { endOfDay, isValid, parse, startOfDay } from 'date-fns'

export const isPharmacyIdValid = async (req: Request, res: Response) => {
  const pharmacyId = getFieldIntoReq(req, 'pharmacyId')
  const patientId = getFieldIntoReq(req, 'patientId')
  const visitId = getFieldIntoReq(req, 'visitId')
  const { user } = res.locals

  const condition = {
    hospitalId: user.hospitalId
  }

  if (pharmacyId) {
    Object.assign(condition, { _id: pharmacyId })
  } else if (patientId && visitId) {
    Object.assign(condition, { patientId, visitId })
  }

  const pharmacyData = await pharmacyQueries.getPharmacyDetailsByCondition(
    mongoDB,
    condition
  )

  if (!pharmacyData) {
    return {
      message: 'Pharmacy not found.',
      field: 'pharmacyId'
    }
  }

  setFieldsIntoLocals(res, {
    pharmacyData
  })

  return null
}

export const isPharmacyAlreadyExist = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors || []
  const { patientId, visitId } = req.body

  if (previousErrors.length || !patientId || !visitId) return null

  const { user } = res.locals

  const pharmacyData = await pharmacyQueries.getPharmacyDetailsByCondition(
    mongoDB,
    {
      patientId,
      visitId,
      hospitalId: user.hospitalId
    }
  )

  if (pharmacyData) {
    return {
      message: 'Pharmacy already exists.',
      field: 'general'
    }
  }

  return null
}

export const isPharmaciesValid = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors || []
  if (previousErrors.length) return null

  const { pharmacies } = req.body

  if (!Array.isArray(pharmacies) || !pharmacies.length) {
    return {
      message: 'Please provide at least one pharmacy.',
      field: 'pharmacies'
    }
  }

  const errors: { field: string; message: string }[] = []

  pharmacies.forEach((item: AnyType, idx: number) => {
    if (!item.name) {
      errors.push({
        field: `pharmacies.${idx}.name`,
        message: 'Each pharmacy must have a name.'
      })
    }
    if (!item.amount || typeof item.amount !== 'number' || item.amount <= 0) {
      errors.push({
        field: `pharmacies.${idx}.amount`,
        message: 'Amount must be a positive number.'
      })
    }

    if (!item.unit || typeof item.unit !== 'number' || item.unit <= 0) {
      errors.push({
        field: `pharmacies.${idx}.unit`,
        message: 'Unit must be a positive number.'
      })
    }

    if (item.discount && typeof item.discount !== 'number') {
      errors.push({
        field: `pharmacies.${idx}.discount`,
        message: 'Discount must be a number.'
      })
    }
    if (item.tax && typeof item.tax !== 'number') {
      errors.push({
        field: `pharmacies.${idx}.tax`,
        message: 'Tax must be a number.'
      })
    }
    if (item.total && typeof item.total !== 'number') {
      errors.push({
        field: `pharmacies.${idx}.total`,
        message: 'Total must be a number.'
      })
    }
    if (item.paymentMode && typeof item.paymentMode !== 'string') {
      errors.push({
        field: `payments.${idx}.paymentMode`,
        message: 'Payment mode must be a string.'
      })
    }
    if (item.status && typeof item.status !== 'string') {
      errors.push({
        field: `pharmacies.${idx}.status`,
        message: 'Status must be a string.'
      })
    }
  })

  if (errors.length) {
    return handleMultipleErrors(errors, multipleErrorsSymbol)
  }

  setFieldsIntoLocals(res, {
    pharmacies
  })

  return null
}

export const filterSearch = async (req: Request, res: Response) => {
  const previousErrors = res.locals.validationErrors
  if (previousErrors.length) {
    return null
  }

  const {
    ageStart,
    ageEnd,
    gender,
    startDate,
    endDate,
    status,
    isAmountPaid,
    grandTotalEnd,
    grandTotalStart
  } = req.query
  let patientFilter: any
  let result: any
  if (req.path.split('/')[2] === 'invoice') {
    patientFilter = filterSearchHelper({
      'patientDetails.gender': {
        value: gender,
        multi: true,
        type: 'string'
      }
    })
    result = filterSearchHelper({
      isAmountPaid: {
        value: isAmountPaid,
        multi: true,
        type: 'boolean'
      }
    })
  } else {
    patientFilter = filterSearchHelper(
      {
        gender: {
          value: gender,
          multi: true,
          type: 'string'
        }
      },
      true
    )
    result = filterSearchHelper(
      {
        status: {
          value: status,
          multi: true,
          type: 'string'
        },
        'pharmacyDetails.isAmountPaid': {
          value: isAmountPaid,
          multi: true,
          type: 'boolean'
        }
      },
      true
    )
  }

  // const result = filterSearchHelper(
  //   {
  //     'patientDetails.gender': {
  //       value: gender,
  //       multi: true,
  //       type: 'string'
  //     }
  //   },
  //   true
  // )

  // const patientFilterCondition = filterSearchHelper({
  //   isAmountPaid: {
  //     value: isAmountPaid,
  //     multi: true,
  //     type: 'boolean'
  //   }
  // })

  let rangeFilters = {}
  if (grandTotalEnd || grandTotalStart) {
    Object.assign(rangeFilters, {
      grandTotal: {
        $gte: Number(grandTotalStart) || 0,
        $lte: Number(grandTotalEnd) || Infinity
      }
    })
  }

  if (ageStart || ageEnd) {
    const dateRange = getDateRangeFromAgeRange(Number(ageStart), Number(ageEnd))

    if (dateRange) {
      setFieldsIntoLocals(res, {
        ...dateRange
      })
    }
  }

  if (startDate || endDate) {
    // Parse the dates in 'yyyy-MM-dd' format
    const parsedStart = parse(String(startDate), 'dd-MM-yyyy', new Date())
    const parsedEnd = parse(String(endDate), 'dd-MM-yyyy', new Date())

    if (!isValid(parsedStart) || !isValid(parsedEnd)) {
      return err('Please provide valid startDate and endDate.', 'date')
    }

    const startDateInUserTimezone = startOfDay(parsedStart)
    const endDateInUserTimezone = endOfDay(parsedEnd)

    setFieldsIntoLocals(res, {
      startDate: startDateInUserTimezone,
      endDate: endDateInUserTimezone
    })
  }

  setFieldsIntoLocals(res, {
    filterCondition: result.filterData,
    patientFilterCondition: patientFilter.filterData,
    rangeFilters
  })

  return null
}
