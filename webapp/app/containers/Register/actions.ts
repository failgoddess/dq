

import {
  SIGNUP,
  SIGNUP_SUCCESS,
  SIGNUP_ERROR,
  SEND_MAIL_AGAIN,
  SEND_MAIL_AGAIN_SUCCESS,
  SEND_MAIL_AGAIN_ERROR
} from './constants'

export function signup (username, email, password, resolve) {
  return {
    type: SIGNUP,
    payload: {
      username,
      email,
      password,
      resolve
    }
  }
}

export function signupSuccess () {
  return {
    type: SIGNUP_SUCCESS
  }
}

export function signupError () {
  return {
    type: SIGNUP_ERROR
  }
}

export function sendMailAgain (email, resolve) {
  return {
    type: SEND_MAIL_AGAIN,
    payload: {
      email,
      resolve
    }
  }
}

export function sendMailAgainSuccess () {
  return {
    type: SEND_MAIL_AGAIN_SUCCESS
  }
}

export function sendMailAgainFail () {
  return {
    type: SEND_MAIL_AGAIN_ERROR
  }
}


