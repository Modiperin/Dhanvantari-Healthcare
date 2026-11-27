import { DynamicObjectType } from 'types'
import getTransport from './getTransport'
import generateEmailBody from './generateEmailBody'
import nodemailer from './nodemailer'
import config from 'config'

const sendEmail = async (
  feature: string,
  emailContentData: DynamicObjectType
) => {
  const transportData = await getTransport()

  Object.assign(emailContentData, {
    mailSender: `${config.common.companyName} <${config.common.fromEmail}>`
  })

  const emailbody = generateEmailBody[feature](emailContentData)

  const response = await nodemailer(transportData.smtpConfig, emailbody)
  console.dir({ response }, { depth: null })
  return response
}

export default sendEmail
