import { RedisClientType } from 'redis'
import { AnyType } from 'types'
import Bluebird from 'bluebird'

export const getData = (redisDB: RedisClientType, key: string) =>
  redisDB.get(key)

export const setData = (
  redisDB: RedisClientType,
  key: string,
  value: AnyType,
  expireTime?: number
) =>
  redisDB.set(key, typeof value === 'string' ? value : JSON.stringify(value), {
    EX: expireTime
  })

export const isKeyExists = (redisDB: RedisClientType, key: string) =>
  redisDB.exists(key)

export const setMultipleData = (
  redisDB: RedisClientType,
  data: Record<string, AnyType>
) => {
  const arr = Object.keys(data).reduce(
    (prev: string[], curr) =>
      prev.concat([
        curr,
        typeof data[curr] === 'string' ? data[curr] : JSON.stringify(data[curr])
      ]),
    []
  )

  return redisDB.mSet(arr)
}

export const getKeyList = (redisDB: RedisClientType, key: string = '*') => {
  return redisDB.keys(key)
}

export const deleteKeys = async (
  redisDB: RedisClientType,
  keys: string[] = []
) => {
  return Bluebird.mapSeries(keys, async (key) => {
    await redisDB.unlink([key])
  })
}
