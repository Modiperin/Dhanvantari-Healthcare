import aws from './aws.config'
import common from './common'
import mongodb from './mongodb.config'
import redis from './redis.config'
import socket from './socket.config'
import whatsapp from './whatsapp.config'

const config = {
  common,
  mongodb,
  redis,
  whatsapp,
  socket,
  aws
}

export default config
