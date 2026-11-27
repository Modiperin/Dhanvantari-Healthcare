import mongoDB from 'db'
import * as appointmentQueries from 'db/queries/appointment'
import { addMilliseconds } from 'date-fns'
import { threeHoursInMilliseconds, twoHoursInMilliseconds } from '..'
import Bluebird from 'bluebird'
import { sendWhatsAppMessage } from 'utils/whatsapp'

type Appointment = {
  _id: string
  appointmentId: string
  patientId: string
  hospitalId: string
  doctorId: string
  date: string
  time: string
  scheduleDate: Date
  status: string
  name: string
  phoneNo: string
  doctorDetails: { titleName: string; name: string }
}

export default async (jobStartTime: number) => {
  const twoHoursFromNow = addMilliseconds(jobStartTime, twoHoursInMilliseconds)
  const threeHoursFromNow = addMilliseconds(
    jobStartTime,
    threeHoursInMilliseconds
  )

  const appointmentList =
    await appointmentQueries.getAppointmentListForSendingNotification(mongoDB, {
      status: { $in: ['booked', 'rescheduled'] },
      scheduleDate: {
        $gte: new Date(twoHoursFromNow),
        $lt: new Date(threeHoursFromNow)
      }
    })

  if (!appointmentList.length) {
    console.log('No appointments to notify.')
    return
  }

  await Bluebird.mapSeries(appointmentList, async (hospital) => {
    const appointments = hospital.appointments || []
    await Bluebird.map(appointments, async (appointment: Appointment) => {
      try {
        if (!appointment.phoneNo) return

        // Send whatsapp notification
        await sendWhatsAppMessage(appointment.phoneNo, 'appointment', {
          name: appointment.name,
          date: appointment.date,
          time: appointment.time,
          location: hospital?.hospitalDetails?.address || '',
          doctor: appointment?.doctorDetails?.name || '',
          phone: hospital?.hospitalDetails?.phoneNo || '',
          hospitalName: hospital?.hospitalDetails?.name || ''
        })
      } catch (error) {
        console.log(error)
      }
    })
  })
}
