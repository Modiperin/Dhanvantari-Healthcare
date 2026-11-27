import { Request, Response, NextFunction } from 'express'
import { AnyType } from 'types'

export default (message: string, fieldName: string, symbol?: symbol) => {
  const error = {
    message,
    field: fieldName,
    symbol
  }
  return error
}

export const handleMultipleErrors = (
  errors: { message: string; field: string }[],
  symbol: symbol
) => {
  const multipleErrors = {
    message: 'Validation failed',
    errors,
    symbol
  }
  return multipleErrors
}

export const errorHandler = (
  err: AnyType,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('[ERROR]', err)

  const statusCode = err.statusCode || 500
  const message = 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    message
  })
}
