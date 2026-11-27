import pug from 'pug'
import path from 'path'
import { AnyType, DynamicObjectType } from 'types'

const compiledOTPHtml = pug.compileFile(
  path.resolve(`${__dirname}/templates/otp.pug`)
)

const compiledWelcomeHtml = pug.compileFile(
  path.resolve(`${__dirname}/templates/welcome.pug`)
)

export default {
  sendOTP: (normalizedEntry: DynamicObjectType) => ({
    html: compiledOTPHtml(normalizedEntry),
    from: normalizedEntry.mailSender,
    replyTo: normalizedEntry.replyTo,
    to: [normalizedEntry.email],
    subject: 'Your OTP for Admin Login – Alliedge Healthcare'
  }),
  welcome: (normalizedEntry: DynamicObjectType) => ({
    html: compiledWelcomeHtml(normalizedEntry),
    from: normalizedEntry.mailSender,
    replyTo: normalizedEntry.replyTo,
    to: [normalizedEntry.email],
    subject:
      'Welcome to Alliedge Healthcare – Let’s Streamline Healthcare Together!'
  }),
  appointment: (normalizedEntry: DynamicObjectType) => ({
    from: normalizedEntry.mailSender,
    replyTo: normalizedEntry.replyTo,
    to: [normalizedEntry.email],
    subject: `Appointment Confirmed - Dr. ${normalizedEntry.doctorName} on ${normalizedEntry.appointmentDate}`,
    attachments: [
      {
        filename: `Appointment ${normalizedEntry.appointmentId}.ics`,
        content: normalizedEntry.appointmentICS,
        contentType: 'text/calendar; charset="utf-8"; method=REQUEST'
      }
    ]
  })
} as { [key: string]: AnyType }
