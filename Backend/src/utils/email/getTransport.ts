export default async () => {
  return {
    smtpConfig: {
      host: process.env.MAIL_HOST, // TODO: Move this to SMTP config file
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    }
  }
}
