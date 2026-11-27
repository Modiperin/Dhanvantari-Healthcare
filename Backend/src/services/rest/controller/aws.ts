import { Request, Response } from 'express'
import { AwsPresignedUrl } from 'utils/aws/s3'

export const presignedUrl = async (req: Request, res: Response) => {
  const { for: urlType, contentType } = req.query as {
    for: string
    contentType: string
  }

  const response = await AwsPresignedUrl(urlType, contentType, '')

  if (!response.ok) {
    res.status(400).json({
      message: response.message || 'Could not generate signed URL'
    })
    return
  }

  res.status(200).json({ url: response.url, objectUrl: response.objectUrl })
}
