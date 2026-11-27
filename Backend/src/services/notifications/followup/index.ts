import mongoDB from 'db'
import * as visitQueries from 'db/queries/patientVisits'
import { addMilliseconds } from 'date-fns'
import Bluebird from 'bluebird'
import { sendWhatsAppMessage } from 'utils/whatsapp'
import { oneDayInMilliseconds } from '..'

type FollowUp = {
  _id: string
  patientId: string
  hospitalId: string
  doctorId: string
  name: string
  phoneNo: string
  date: string
  scheduleDate: Date
  doctorDetails: { titleName: string; name: string }
}

export default async (jobStartTime: number) => {
  const timestamp = addMilliseconds(jobStartTime, oneDayInMilliseconds)

  const hospitalWiseFollowup =
    await visitQueries.getFollowUpListForSendingNotification(mongoDB, {
      'followUp.scheduleDate': {
        $gt: new Date(jobStartTime),
        $lte: new Date(timestamp)
      }
    })

  if (!hospitalWiseFollowup.length) {
    console.log('No follow-up to notify.')
    return
  }

  await Bluebird.mapSeries(hospitalWiseFollowup, async (hospital) => {
    const followUps = hospital.followups || []
    await Bluebird.map(followUps, async (followUp: FollowUp) => {
      try {
        if (!followUp.phoneNo) return

        // Send whatsapp notification
        await sendWhatsAppMessage(followUp.phoneNo, 'follow_up', {
          name: followUp.name,
          date: followUp.date,
          location: hospital?.hospitalDetails?.address || '',
          doctor: followUp?.doctorDetails?.name || '',
          phone: hospital?.hospitalDetails?.phoneNo || '',
          hospitalName: hospital?.hospitalDetails?.name || ''
        })
      } catch (error) {
        console.log(error)
      }
    })
  })
}
