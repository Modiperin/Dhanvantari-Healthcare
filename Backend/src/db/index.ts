import config from '../config'
import { MongoClient } from 'mongodb'

const mongoURL = config.mongodb.MONGO_URI

const mongoConnection = new MongoClient(mongoURL)
mongoConnection
  .connect()
  .then(() => {
    console.log('mongoDb Connected')
  })
  .catch((e) => {
    console.log(e)
  })

const mongoDB = mongoConnection

export default mongoDB
