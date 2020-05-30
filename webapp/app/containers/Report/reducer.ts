

import { LOAD_SIDEBAR } from './constants'
import { fromJS } from 'immutable'

const initialState = fromJS({
  sidebar: false,
  currentProject: false
})

function reportReducer (state = initialState, action) {
  const { payload } = action
  console.log("-----------")
  console.log(action)
  switch (action.type) {
    case LOAD_SIDEBAR:
      return state.set('sidebar', action.sidebar)
    default:
      return state
  }
}

export default reportReducer
