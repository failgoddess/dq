
import {
  GET_USER_PROFILE,
  GET_USER_PROFILE_SUCCESS
} from './constants'
import { fromJS } from 'immutable'


const initialState = fromJS({
  userProfile: false,
  loading: false
})

function appReducer (state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case GET_USER_PROFILE:
      return state
        .set('loading', true)
    case GET_USER_PROFILE_SUCCESS:
      return state
        .set('loading', false)
        .set('userProfile', payload.result)
    default:
      return state
  }
}

export default appReducer
