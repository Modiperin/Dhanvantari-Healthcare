import { Request, Response, NextFunction } from 'express'
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible'
import redisDB from 'db/redis'

const rateLimiter = new RateLimiterRedis({
  storeClient: redisDB,
  useRedisPackage: true,
  keyPrefix: 'rl',
  points: 100, // Number of points(Requests)
  duration: 1, // Per second
  blockDuration: 300 // Block for 5 minutes if consumed more than request limit
})

const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('[REQUEST] Rate limiter entered; Redis ready:', redisDB.isReady)
  if (!redisDB.isReady) {
    res.status(503).json({ message: 'Redis is not ready. Please try again later.' })
    return
  }
  try {
    await rateLimiter.consume(req.ip || 1)
    console.log('[REQUEST] Rate limiter passed')
    next()
  } catch (err) {
    if (!(err instanceof RateLimiterRes)) {
      console.error('[RATE LIMITER] Redis operation failed')
      res.status(503).json({ message: 'Service temporarily unavailable. Please try again.' })
      return
    }
    res.status(429).json({
      message: 'Too Many Requests'
    })
  }
}

export default rateLimiterMiddleware


