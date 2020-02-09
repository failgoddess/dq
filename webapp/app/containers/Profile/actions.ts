
import {
  GET_USER_PROFILE,
  GET_USER_PROFILE_FAILURE,
  GET_USER_PROFILE_SUCCESS
} from './constants'

export function getUserProfile (id) {
  return {
    type: GET_USER_PROFILE,
    payload: {
      id
    }
  }
}

export function userProfileGot (result) {
  return {
    type: GET_USER_PROFILE_SUCCESS,
    payload: {
      result
    }
  }
}

export function getUserProfileFail () {
  return {
    type: GET_USER_PROFILE_FAILURE
  }
}

