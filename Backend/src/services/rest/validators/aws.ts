import { Request } from 'express'
import { DynamicObjectType } from 'types'
import err from 'utils/err'

export const isUrlTypeValid = async (req: Request) => {
  const { for: urlType } = req.query as DynamicObjectType

  const valid = ['healthcare']

  if (!urlType || !valid.includes(urlType)) {
    return err('Invalid URL type', 'for')
  }

  return null
}

export const isContetntTypeValid = async (req: Request) => {
  const { contentType } = req.query as DynamicObjectType

  const valid = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf']

  if (!contentType || !valid.includes(contentType)) {
    return err('Invalid content type', 'contentType')
  }

  return null
}
