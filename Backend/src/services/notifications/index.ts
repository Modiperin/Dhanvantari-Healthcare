import cron from 'node-cron'
import revokeAccess from './revokeAccess'
import appointmentsNotification from './appointments'
import followupNotification from './followup'

console.log('Notification service started...')

export const oneDayInMilliseconds = 24 * 60 * 60 * 1000
export const oneHourInMilliseconds = 60 * 60 * 1000
export const twoHoursInMilliseconds = 2 * 60 * 60 * 1000
export const threeHoursInMilliseconds = 3 * 60 * 60 * 1000

//!! Running a task every day at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running a task every day at midnight')
  await revokeAccess(Date.now())
  console.log('Revoke access task completed')
})

//!! Running a task every 1 hours
cron.schedule('0 */1 * * *', async () => {
  console.log('Running a task every 1 hours')
  await appointmentsNotification(Date.now())
  console.log('Appointments notification task completed')
})

//!! Running at 6 AM IST (12:30 AM UTC)
cron.schedule('30 0 * * *', async () => {
  console.log('Running follow-up notifications at 6 AM IST')
  await followupNotification(Date.now())
  console.log('Follow-up notification task completed')
})
