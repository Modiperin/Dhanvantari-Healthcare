import { endOfDay, isValid, parse, startOfDay } from 'date-fns'
import { Request, Response } from 'express'
import err from 'utils/err'
import { setFieldsIntoLocals } from 'utils/funcations'

export const filterSearch = async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query

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

  return null
}
