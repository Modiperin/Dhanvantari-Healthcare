import { Request, Response, NextFunction } from 'express'

export default (req: Request, res: Response, next: NextFunction) => {
  const userApiKey = req.header('x-api-key')
  const validApiKey = process.env.HEALTHCARE_API_KEY

  if (!userApiKey || userApiKey !== validApiKey) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  return next()
}
