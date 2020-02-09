
import { removeToken } from 'utils/request'

export default function () {
  const token = localStorage.getItem('TOKEN')
  if (token) {
    const expire = localStorage.getItem('TOKEN_EXPIRE')
    const timestamp = new Date().getTime()

    if (Number(expire) > timestamp) {
      return true
    } else {
      removeToken()
      return false
    }
  } else {
    return false
  }
}
