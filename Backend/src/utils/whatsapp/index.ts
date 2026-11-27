/* eslint-disable camelcase */
import axios from 'axios'
import config from 'config'

export type WhatsappTemplateName =
  | 'appointment'
  | 'follow_up'
  | 'patient_data'
  | 'consultation_details'

// patient_data, consultation_details means prescription data

export type WhatsappTemplateData = {
  name?: string
  date?: string
  time?: string
  location?: string
  doctor?: string
  phone?: string
  duration?: string
  hospitalName?: string
  buttonLink?: string
}

export const getWhatsappTemplateComponents = (
  templateName: WhatsappTemplateName,
  data: WhatsappTemplateData
) => {
  switch (templateName) {
    case 'appointment':
      return [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: data.name || 'There' },
            { type: 'text', text: data.date || new Date() },
            { type: 'text', text: data.time || '12:00 PM' },
            { type: 'text', text: data.location || 'Kalynapura' },
            { type: 'text', text: data.doctor || 'Dr. some' },
            { type: 'text', text: data.phone || '+91-9876543210' },
            { type: 'text', text: data.duration || '30 minutes' },
            { type: 'text', text: data.duration || '30 minutes' },
            { type: 'text', text: data.hospitalName || 'CityCare Hospital' }
          ]
        }
      ]

    case 'follow_up':
      return [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: data.name || 'John Doe' },
            { type: 'text', text: data.date || '10 Sep 2025' },
            { type: 'text', text: data.location || 'Ahmadabad' },
            { type: 'text', text: data.doctor || 'Dr. Smith Johnson' },
            { type: 'text', text: data.phone || '+1-555-234-6789' },
            { type: 'text', text: data.hospitalName || 'CityCare Hospital' }
          ]
        }
      ]

    case 'patient_data':
    case 'consultation_details':
      return [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: data.name || 'John Doe' }, // {{1}}
            { type: 'text', text: data.phone || '+1-555-234-6789' }, // {{3}}
            { type: 'text', text: data.hospitalName || 'CityCare Hospital' } // {{4}} (team name, same as hospital)
          ]
        },
        {
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: [
            { type: 'text', text: data.buttonLink || 'dashboard' } // dynamic prescription ID for {{4}} in URL
          ]
        }
      ]

    default:
      return []
  }
}

export const sendWhatsAppMessage = async (
  to: string,
  templateName: WhatsappTemplateName,
  templateData: WhatsappTemplateData = {}
) => {
  const url = `${config.whatsapp.apiBaseUrl}/${config.whatsapp.apiVersion}/${config.whatsapp.phoneNumberId}/messages`

  const headers = {
    Authorization: `Bearer ${config.whatsapp.accessToken}`,
    'Content-Type': 'application/json'
  }

  const data = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: 'en'
      },
      components: getWhatsappTemplateComponents(templateName, templateData)
    }
  }

  try {
    const response = await axios.post(url, data, { headers })
    return { error: false, data: response.data }
  } catch (error) {
    // console.dir({ error }, { depth: null })
    return {
      error: true,
      data: error
    }
  }
}
