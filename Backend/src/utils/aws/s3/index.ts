import config from 'config'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { generateUUID } from 'utils/uuid'

export const AwsPresignedUrl = async (
  usedFor: string = '',
  contentType: string = 'image/jpg',
  ownerId: string
) => {
  try {
    const s3Client = new S3Client({
      region: config.aws.region,
      credentials: {
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey
      }
    })

    const extension = contentType.split('/')[1]
    const key = `logos/${generateUUID()}.${extension}`

    const command = new PutObjectCommand({
      Bucket: config.aws.s3BucketName[usedFor] || '',
      Key: key,
      ContentType: contentType,
      ACL: 'public-read'
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 })

    return {
      ok: true,
      url: signedUrl,
      objectUrl: `https://${config.aws.s3BucketName[usedFor]}.s3.${config.aws.s3Region}.amazonaws.com/${key}`
    }
  } catch (error) {
    console.log(error)

    return { ok: false, message: '' }
  }
}
