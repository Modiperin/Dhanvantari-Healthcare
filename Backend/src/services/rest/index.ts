import express from 'express'
import cors from 'cors'
import http from 'http'
import morgan from 'morgan'
import setupAllRoutes from './routes/index'
import '../../db'
import 'db/redis'
import { errorHandler } from 'utils/err'
import 'services/notifications' // for running notification service (cron jobs etc.)
import rateLimiterMiddleware from './middlewares/rateLimiter'

const port = process.env.PORT || '3000'

const app = express()
const server = http.createServer(app)

//middlerware
app.set('trust proxy', true)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
// app.use(rateLimiterMiddleware)

//Setups Routes
setupAllRoutes(app)

app.use(errorHandler)

server.listen(port, () => {
  console.log('server started on port:', port)
})
