export default {
  apiBaseUrl: 'https://graph.facebook.com',
  apiVersion: process.env.WHATSAPP_API_VERSION || 'v20.0',
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  accessToken: process.env.WHATSAPP_SECRET_KEY || ''
}
