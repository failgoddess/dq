
import {
  SIGNUP,
  SIGNUP_ERROR,
  SIGNUP_SUCCESS
} from './constants'

import { fromJS } from 'immutable'

const initialState = fromJS({
  signupLoading: false
})

function signupReducer (state = initialState, action) {
  const { type } = action
  switch (type) {
    case  SIGNUP:
      return state
        .set('signupLoading', true)
    case SIGNUP_SUCCESS:
      return state
        .set('signupLoading', false)
    case SIGNUP_ERROR:
      return state
        .set('signupLoading', false)
    default:
      return state
  }
}

export default signupReducer
