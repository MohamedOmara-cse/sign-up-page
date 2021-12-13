import axios from 'axios'
import * as rax from 'retry-axios'
import { getToken, setToken } from '../util/auth'

const baseURL = `${process.env.API_HOST}`
const headers = {
  'X-Requested-With': 'XMLHttpRequest',
}

const api = axios.create({ baseURL, headers })
rax.attach(api)

if (process.client) {
  // Request interceptor
  api.interceptors.request.use((config) => {
    const authToken = getToken()

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`
    }

    return config
  })

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      // Update the access token if one was provided in
      // the API response meta data.
      if (
        response.data &&
        response.data.meta &&
        response.data.meta.access_token
      ) {
        setToken(response.data.meta.access_token)
      }

      return response
    },
    (error) => {
      // Do something with response error
      return Promise.reject(error)
    }
  )
}

export default api
