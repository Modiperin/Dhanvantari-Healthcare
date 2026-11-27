import { Request, Response, NextFunction } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import * as staffQueries from 'db/queries/staff'
import mongoDB from 'db'
import { AnyType } from 'types'

export type Roles = 'S' | 'A' | 'D' | 'T' | 'O'

const auth = (...allowedRoles: Roles[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    if (!token || typeof token !== 'string') {
      res.status(401).json({ message: 'Invalid User' })
      return
    }

    const accessToken = token.split('Bearer ')[1]
    if (!accessToken) {
      res.status(401).json({ message: 'Invalid User' })
      return
    }

    const jwtSecret = process.env.JWT_SECRET || ''

    try {
      const decodedToken = jsonwebtoken.verify(
        accessToken,
        jwtSecret
      ) as AnyType
      if (!decodedToken.id) {
        res.status(401).json({ message: 'Invalid User' })
        return
      }

      const userData = await staffQueries.getStaffByCondition(
        mongoDB,
        { userId: decodedToken.id },
        { _id: 0 }
      )

      if (!userData) {
        res.status(401).json({ message: 'Invalid User' })
        return
      }

      if (!allowedRoles.includes(userData.role)) {
        res
          .status(403)
          .json({ message: 'Unauthorized: Insufficient permissions' })
        return
      }

      if (userData.userId !== userData.ownerId) {
        // TODO: valiadte team member
      }

      res.locals.user = userData
    } catch (error) {
      console.log(error)

      res.status(401).json({ message: 'Invalid User' })
      return
    }

    return next()
  }
}

export default auth
