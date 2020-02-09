
import axios, { AxiosRequestConfig, AxiosResponse, AxiosPromise } from 'axios'

axios.defaults.validateStatus = function (status) {
  return status < 400
}

function parseJSON (response: AxiosResponse) {
  return response.data
}

function refreshToken (response: AxiosResponse) {
  const token = response.data.header && response.data.header.token
  if (token) {
    setToken(token)
  }
  return response
}

export function request (config: AxiosRequestConfig): AxiosPromise
export function request (url: string, options?: AxiosRequestConfig): AxiosPromise
export default function request (url: any, options?: AxiosRequestConfig): AxiosPromise {
  return axios(url, options)
    .then(refreshToken)
    .then(parseJSON)
}

export function setToken (token: string) {
  window.addEventListener('storage', syncToken, false)
  localStorage.setItem('TOKEN', token)
  localStorage.setItem('TOKEN_EXPIRE', `${new Date().getTime() + 3600000}`)
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

function syncToken (e: StorageEvent) {
  const { key, newValue } = e
  if (key !== 'TOKEN') { return }
  if (!newValue) {
    delete axios.defaults.headers.common['Authorization']
  } else {
    axios.defaults.headers.common['Authorization'] = `Bearer ${newValue}`
  }
}

export function removeToken () {
  window.addEventListener('storage', syncToken)
  localStorage.removeItem('TOKEN')
  localStorage.removeItem('TOKEN_EXPIRE')
  delete axios.defaults.headers.common['Authorization']

}

export function getToken () {
  return axios.defaults.headers.common['Authorization']
}

interface IDQResponseHeader {
  code: number
  msg: string
  token: string
}

export interface IDQResponse<T> {
  header: IDQResponseHeader,
  payload: T
}
