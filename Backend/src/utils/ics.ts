// ics.ts
import { v4 as uuidv4 } from 'uuid'

type AppointmentData = {
  patientName: string
  doctorName: string
  appointmentDate: Date
  duration?: number
  hospitalName?: string
  patientEmail?: string
  doctorEmail: string
  appointmentId?: string
  notes?: string
  reminderMinutes?: number
}

/**
 * Escape special characters for ICS format
 */
function escapeText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '')
}

/**
 * Format date to ICS (UTC format)
 */
function formatICSDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

/**
 * Create a generic ICS event
 */
function createICS(event: {
  title: string
  description?: string
  startDate: string
  endDate: string
  // location?: string
  organizerEmail: string
  organizerName?: string
  attendees?: string[]
  reminderMinutes?: number
}): string {
  const uid = uuidv4()
  const timestamp =
    new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  const formatAttendees = () => {
    if (!event.attendees || event.attendees.length === 0) return ''
    return event.attendees
      .map(
        (email) =>
          `ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${email}`
      )
      .join('\r\n')
  }

  const formatOrganizer = () => {
    const name = event.organizerName
      ? `;CN=${escapeText(event.organizerName)}`
      : ''
    return `ORGANIZER${name}:mailto:${event.organizerEmail}`
  }

  const reminderBlock = event.reminderMinutes
    ? [
        'BEGIN:VALARM',
        `TRIGGER:-PT${event.reminderMinutes}M`,
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder for your appointment',
        'END:VALARM'
      ].join('\r\n')
    : ''

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dhanvantari Healthcare//Appointment System//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    formatOrganizer(),
    `DTSTART:${event.startDate}`,
    `DTEND:${event.endDate}`,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.description
      ? [`DESCRIPTION:${escapeText(event.description)}`]
      : []),
    // ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'PRIORITY:5',
    ...(event.attendees && event.attendees.length > 0
      ? [formatAttendees()]
      : []),
    reminderBlock,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')
}

/**
 * Create an Appointment ICS file content
 */
export function createAppointmentICS(appointmentData: AppointmentData): string {
  const {
    patientName,
    doctorName,
    appointmentDate,
    duration = 30,
    hospitalName,
    patientEmail,
    doctorEmail,
    appointmentId,
    notes,
    reminderMinutes = 5 // default 5 minutes
  } = appointmentData

  const startDate = new Date(appointmentDate)
  const endDate = new Date(startDate.getTime() + duration * 60 * 1000)

  const title = `Appointment - ${hospitalName}`
  const description = [
    'Your appointment has been scheduled.',
    '',
    `Patient: ${patientName}`,
    `Doctor: ${doctorName}`,
    ...(appointmentId ? [`Appointment ID: ${appointmentId}`] : []),
    ...(notes ? [`Notes: ${notes}`] : []),
    '',
    'Please arrive 15 minutes before your scheduled time.'
  ].join('\n')

  const attendees = [doctorEmail, ...(patientEmail ? [patientEmail] : [])]

  return createICS({
    title,
    description,
    startDate: formatICSDate(startDate),
    endDate: formatICSDate(endDate),
    // location: hospitalName,
    organizerEmail: doctorEmail,
    organizerName: `${doctorName}`,
    attendees,
    reminderMinutes
  })
}
