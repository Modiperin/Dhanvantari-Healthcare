import crypto from 'crypto'
import config from 'config/encryption.config'

export const encrypt = (data: string) => {
  const cipher = crypto.createCipheriv(config.algo, config.key, config.iv)

  let encryptedValue = cipher.update(data, 'utf8', 'hex')
  encryptedValue += cipher.final('hex')

  return encryptedValue
}

export const decrypt = (data: string = '') => {
  let decryptedValue = ''
  try {
    const decipher = crypto.createDecipheriv(config.algo, config.key, config.iv)

    decipher.setAutoPadding(true)
    decryptedValue =
      decipher.update(data, 'hex', 'utf8') + decipher.final('utf8')
  } catch (_err) {
    const decipher2 = crypto.createDecipheriv(
      config.algo,
      config.key,
      config.iv
    )
    decipher2.setAutoPadding(false)
    try {
      decryptedValue = decipher2.update(data, 'hex', 'utf8')
      decryptedValue += decipher2.final('utf8')
      if (decryptedValue === '') decryptedValue = data
    } catch (_err) {
      return data
    }
  }

  return decryptedValue.replace(/\0/g, '')
}

export const compareEncryption = (
  decryptedValue: string,
  encryptedValue: string
) => {
  if (decryptedValue === decrypt(encryptedValue)) {
    return true
  }
  return false
}
