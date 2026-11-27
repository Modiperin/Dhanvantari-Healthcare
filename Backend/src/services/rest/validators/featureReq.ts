import { Request, Response } from 'express'
import err from 'utils/err'

export const isTitleValid = async (req: Request, res: Response) => {
  const { title } = req.body
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return err(
      'Please provide a title for your feature request. This helps us understand what you need.',
      'title'
    )
  }

  return null
}

export const isDescriptionValid = async (req: Request, res: Response) => {
  const { description } = req.body
  if (
    !description ||
    typeof description !== 'string' ||
    description.trim().length === 0
  ) {
    return err(
      'Please provide a description for your feature request. This helps us understand what you need.',
      'description'
    )
  }
  return null
}
