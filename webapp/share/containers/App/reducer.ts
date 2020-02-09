import {
  LOGGED,
  LOGOUT
} from './constants'
import { fromJS } from 'immutable'

const initialState = fromJS({
  logged: false,
  loginUser: null
})

function appReducer (state = initialState, { type, payload }) {
  switch (type) {
    case LOGGED:
      return state
        .set('logged', true)
        .set('loginUser', payload.user)
    case LOGOUT:
      return state
        .set('logged', false)
        .set('loginUser', null)
    default:
      return state
  }
}

export default appReducer
