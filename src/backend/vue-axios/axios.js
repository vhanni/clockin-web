/* global localStorage */

import axios from 'axios'

const API_URL = process.env.API_URL
const instance = axios.create({
  baseURL: API_URL
})
instance.defaults.headers.post['Content-Type'] = 'application/json'
instance.interceptors.request.use(config => {
  if (localStorage.token) {
    config.headers['Authorization'] = `Bearer ${localStorage.token}`
  }
  return config
})
export default instance
