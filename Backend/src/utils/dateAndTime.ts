import {
  parse,
  isValid,
  isAfter,
  format,
  startOfWeek,
  endOfWeek,
  subYears,
  startOfYear,
  endOfYear
} from 'date-fns'
import { fromZonedTime } from 'date-fns-tz'

export const validateBirthDate = (birthDate: string): boolean => {
  const date = new Date(parse(birthDate, 'dd-MM-yyyy', new Date()))
  const today = new Date()

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return false
  }

  // Check if the date is in the future
  if (date > today) {
    return false
  }

  // Check if the person is at least 18 years old
  //   const age = today.getFullYear() - date.getFullYear()
  //   const monthDiff = today.getMonth() - date.getMonth()

  //   if (age < 18 || (age === 18 && monthDiff < 0)) {
  //     return false
  //   }

  return true
}

export const parseTime = (timeStr: string): Date | null => {
  // Try 12-hour format first
  let date = parse(timeStr.trim(), 'h:mm a', new Date())
  if (isValid(date)) return date
  // Try 24-hour format
  date = parse(timeStr.trim(), 'HH:mm', new Date())
  if (isValid(date)) return date
  return null
}

export function validateAndMergeTiming(timing: string[]): {
  error?: string
  mergedTiming?: string[]
} {
  if (!Array.isArray(timing) || timing.length < 2 || timing.length % 2 !== 0) {
    return {
      error:
        'Timing must be an array with an even number of elements (at least 2).'
    }
  }

  // Helper to parse both 12-hour and 24-hour formats

  // Parse and validate all intervals
  const intervals: { start: Date; end: Date }[] = []
  for (let i = 0; i < timing.length; i += 2) {
    const start = parseTime(timing[i])
    const end = parseTime(timing[i + 1])

    if (!start || !end) {
      return {
        error: `Invalid time format at index ${i} or ${i + 1}. Use HH:mm or h:mm AM/PM format.`
      }
    }
    if (!isAfter(end, start)) {
      return {
        error: `Start time must be before end time for slot ${i / 2 + 1}.`
      }
    }
    intervals.push({ start, end })
  }

  // Sort intervals by start time
  intervals.sort((a, b) => a.start.getTime() - b.start.getTime())

  // Merge overlapping or adjacent intervals
  const merged: { start: Date; end: Date }[] = []
  for (const interval of intervals) {
    if (
      merged.length === 0 ||
      interval.start.getTime() > merged[merged.length - 1].end.getTime()
    ) {
      merged.push(interval)
    } else {
      // Merge with previous
      merged[merged.length - 1].end = isAfter(
        interval.end,
        merged[merged.length - 1].end
      )
        ? interval.end
        : merged[merged.length - 1].end
    }
  }

  // Return merged intervals as array of strings in 24-hour format
  const mergedTiming = merged.flatMap(({ start, end }) => [
    format(start, 'HH:mm'),
    format(end, 'HH:mm')
  ])

  return { mergedTiming }
}

export const convertDateToNumber = (date: string): number => {
  const parsed = parse(date, 'dd-MM-yyyy', new Date())
  return Number(format(parsed, 'yyyyMMdd'))
}

export const getTimestampFromDate = (date: string): number => {
  const parsed = parse(date, 'dd-MM-yyyy', new Date())
  return isValid(parsed) ? parsed.getTime() : NaN
}

export const convertNumberToDate = (dateNum: number): string => {
  const parsed = parse(dateNum.toString(), 'yyyyMMdd', new Date())
  return format(parsed, 'dd-MM-yyyy')
}

export const getCurrentWeekRangeAsTimestamp = () => {
  const weekStartDate = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEndDate = endOfWeek(new Date(), { weekStartsOn: 1 })

  const weekStartTimestamp = weekStartDate.getTime()
  const weekEndTimestamp = weekEndDate.getTime()
  return { weekStartTimestamp, weekEndTimestamp }
}

/**
 * Converts a date and time string in a given format and timezone to a UTC Date object.
 * @param dateStr - e.g. '10-07-2025'
 * @param dateFormat - e.g. 'dd-MM-yyyy'
 * @param timeStr - e.g. '09:30 AM'
 * @param timeFormat - e.g. 'hh:mm a'
 * @param timezone - e.g. 'Asia/Kolkata'
 * @returns Date in UTC or null if invalid
 */
export function convertToUTC(
  dateStr: string,
  dateFormat: string,
  timeStr: string,
  timeFormatType: '12' | '24' = '24',
  timezone: string = 'Asia/Kolkata'
): Date | null {
  const timeFormat = timeFormatType === '12' ? 'hh:mm a' : 'HH:mm'
  const dateTimeStr = `${dateStr} ${timeStr}`
  const dateTimeFormat = `${dateFormat} ${timeFormat}`

  const localDate = parse(dateTimeStr, dateTimeFormat, new Date())

  if (!isValid(localDate)) return null

  return fromZonedTime(localDate, timezone)
}

export const getDateRangeFromAgeRange = (ageStart: number, ageEnd: number) => {
  if (ageStart < 0 || ageEnd < 0 || ageStart > ageEnd) {
    return null
  }

  const currentDate = new Date()
  const ageStartDate = startOfYear(subYears(currentDate, ageEnd))
  const ageEndDate = endOfYear(subYears(currentDate, ageStart))

  return { ageStartDate, ageEndDate }
}
