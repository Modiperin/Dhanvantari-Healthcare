import { AnyType } from 'types'

const development = {
  s3BucketName: {
    healthcare: 'alliedge-healthcare'
  }
}

const production = {
  s3BucketName: {
    healthcare: 'alliedge-healthcare'
  }
}

const aws: { [key: string]: AnyType } = {
  accessKeyId: process.env.AWS_ACCESS_KEY || '',
  secretAccessKey: process.env.AWS_SECRET_KEY || '',
  region: process.env.AWS_REGION || 'ap-south-1',
  s3Region: process.env.AWS_REGION || 'ap-south-1',
  s3ApiVersion: '2006-03-01'
}

switch (process.env.NODE_ENV) {
  case 'production':
    Object.assign(aws, production)
    break
  case 'development':
  default:
    Object.assign(aws, development)
    break
}

export default aws
