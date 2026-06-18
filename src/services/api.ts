import axios from 'axios'
import { API_BASE_URL } from '@/constants/storageKeys'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
})

export default api
