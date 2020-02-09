
import {
    LOAD_PORTALS,
    LOAD_PORTALS_SUCCESS,
    LOAD_PORTALS_FAILURE,
    ADD_PORTAL,
    ADD_PORTAL_SUCCESS,
    ADD_PORTAL_FAILURE,
    DELETE_PORTAL,
    DELETE_PORTAL_SUCCESS,
    DELETE_PORTAL_FAILURE,
    EDIT_PORTAL,
    EDIT_PORTAL_SUCCESS,
    EDIT_PORTAL_FAILURE,
    LOAD_SELECT_TEAMS,
    LOAD_SELECT_TEAMS_SUCCESS,
    LOAD_SELECT_TEAMS_FAILURE
  } from './constants'
import { fromJS } from 'immutable'

const initialState = fromJS({
    portals: false,
    selectTeams: []
})

function portalReducer (state = initialState, action) {
  const { type, payload } = action
  const portals = state.get('portals')
  switch (type) {
    case LOAD_PORTALS:
        return state
    case LOAD_PORTALS_SUCCESS:
        return state.set('portals', payload.result)
    case LOAD_PORTALS_FAILURE:
        return state
    case ADD_PORTAL:
        return state
    case ADD_PORTAL_SUCCESS:
        portals.unshift(payload.result)
        return state.set('portals', portals.slice())
    case ADD_PORTAL_FAILURE:
        return state
    case DELETE_PORTAL:
        return state
    case DELETE_PORTAL_SUCCESS:
        return state.set('portals', portals.filter((g) => g.id !== payload.id))
    case DELETE_PORTAL_FAILURE:
    return state
    case EDIT_PORTAL:
        return state
    case EDIT_PORTAL_SUCCESS:
        portals.splice(portals.findIndex((g) => g.id === payload.result.id), 1, payload.result)
        return state.set('portals', portals.slice())
    case EDIT_PORTAL_FAILURE:
        return state
    case LOAD_SELECT_TEAMS:
        return state
    case LOAD_SELECT_TEAMS_SUCCESS:
        return state.set('selectTeams', payload.result)
    case LOAD_SELECT_TEAMS_FAILURE:
        return state
    default:
    return state
  }
}

export default portalReducer
