import config from 'config'
import { createClient, RedisClientType } from 'redis'

// TODO: REMOVE THE IO-REDIS FROM PACKAGE.JSON

const elastiCacheURL = config.redis.elastiCacheURL || 'localhost'
const elastiCachePort = config.redis.elastiCachePort || 6379
//default:AVNS_vuVd-MAvvT4CNizeayD@redis-3c28f8bf-alliedge-4903.a.aivencloud.com
//28451

const base = config.redis.base || 'redis:'

const redisClient: RedisClientType = createClient({
  url: `${base}//${elastiCacheURL}:${elastiCachePort}`
})

redisClient
  .connect()
  .then(() => {
    console.log('redis Connected')
  })
  .catch((e) => {
    console.log(e)
  })

const redisDB = redisClient

export default redisDB

