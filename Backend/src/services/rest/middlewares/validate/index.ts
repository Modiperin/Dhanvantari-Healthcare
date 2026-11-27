import { Request, Response, NextFunction, RequestHandler } from 'express'
import { AnyType } from 'types'

type Validator = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<AnyType>

export const multipleErrorsSymbol = Symbol('multipleErrors')

export default (validators: Validator[]): RequestHandler => {
  return async (req, res, next) => {
    res.locals.validationErrors = []

    for (const validator of validators) {
      try {
        const result = await validator(req, res, next)

        if (result !== null && result !== undefined) {
          const errorSymbol = result?.symbol || ''
          if (errorSymbol === multipleErrorsSymbol) {
            res.locals.validationErrors.push(...result.errors)
          } else {
            res.locals.validationErrors.push(result)
          }
        }
      } catch (error: AnyType) {
        console.log({ error })

        res.status(400).json({ message: 'Validation error' })
        return
      }
    }

    if (res.locals.validationErrors.length === 0) {
      return next()
    }

    const reasons = res.locals.validationErrors.map((err: AnyType) => ({
      message: err.message,
      field: err.field,
      ...(err.extraData || {})
    }))

    res.status(400).json({ message: 'Validation Failed', reasons })
    return
  }
}
