export default {
  algo: 'aes-256-cbc',
  key: process.env.ENCRYPTION_KEY || '',
  iv: '1234567890123456'
}
