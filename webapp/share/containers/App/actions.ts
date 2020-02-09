import {
  LOGIN,
  LOGGED,
  LOGOUT
} from './constants'

export function login (username, password, shareInfo, resolve) {
  return {
    type: LOGIN,
    payload: {
      username,
      password,
      shareInfo,
      resolve
    }
  }
}

export function logout () {
  return {
    type: LOGOUT
  }
}

export function logged (user) {
  return {
    type: LOGGED,
    payload: {
      user
    }
  }
}
