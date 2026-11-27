import { Express } from 'express'

import misc from './misc'
import authRoutes from './auth'
import hospitalRoute from './hospital'
import departmentRoute from './department'
import staffRoute from './staff'
import profileRoute from './profiles'
import roasterRoute from './roaster'
import patientRoute from './patient'
import pricingRoute from './pricing'
import visitRoute from './visits'
import opdRoute from './opd'
import vitalRoute from './vital'
import appointmentRoute from './appointment'
import consultationRoute from './consultation'
import paymentRoute from './payment'
import pharmacyRoute from './pharmacy'
import dashboardRoute from './dashboard'
import aws from './aws'
import featureReq from './featureReq'

const routes = [
  { prefix: '/', router: misc },
  { prefix: '/auth', router: authRoutes },
  { prefix: '/hospital', router: hospitalRoute },
  { prefix: '/department', router: departmentRoute },
  { prefix: '/staff', router: staffRoute },
  { prefix: '/profile', router: profileRoute },
  { prefix: '/roaster', router: roasterRoute },
  { prefix: '/patient', router: patientRoute },
  { prefix: '/pricing', router: pricingRoute },
  { prefix: '/visit', router: visitRoute },
  { prefix: '/opd', router: opdRoute },
  { prefix: '/vital', router: vitalRoute },
  { prefix: '/appointment', router: appointmentRoute },
  { prefix: '/consultation', router: consultationRoute },
  { prefix: '/payment', router: paymentRoute },
  { prefix: '/pharmacy', router: pharmacyRoute },
  { prefix: '/dashboard', router: dashboardRoute },
  { prefix: '/aws', router: aws },
  { prefix: '/feature-req', router: featureReq }
]

export default (app: Express) => {
  routes.forEach((route) => {
    app.use(route.prefix, route.router)
  })
}
