import config from 'config'
import axios from 'axios'
import { DynamicObjectType } from 'types'

const sendSocketMessage = async (
  userNames: string[],
  data: DynamicObjectType
) => {
  let url = `${config.socket.API_URL}`

  if (userNames.length > 1) {
    url = `${url}/send-multi`
  } else {
    url = `${url}/send`
  }

  try {
    const response = await axios.post(
      url,
      { userNames, ...data },
      {
        headers: {
          'x-api-key': config.socket.API_KEY,
          'Content-Type': 'application/json'
        }
      }
    )
    return response.data
  } catch (error) {
    console.error('Error sending message to user:', error)
  }
}

export default sendSocketMessage
