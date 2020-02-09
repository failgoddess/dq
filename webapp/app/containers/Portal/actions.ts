
import {
  LOAD_PORTALS,
  LOAD_PORTALS_SUCCESS,
  LOAD_PORTALS_FAILURE,
  ADD_PORTAL,
  ADD_PORTAL_SUCCESS,
  ADD_PORTAL_FAILURE,
  EDIT_PORTAL,
  EDIT_PORTAL_SUCCESS,
  EDIT_PORTAL_FAILURE,
  DELETE_PORTAL,
  DELETE_PORTAL_SUCCESS,
  DELETE_PORTAL_FAILURE,
  LOAD_SELECT_TEAMS,
  LOAD_SELECT_TEAMS_SUCCESS,
  LOAD_SELECT_TEAMS_FAILURE
} from './constants'

export function loadPortals (projectId) {
  return {
    type: LOAD_PORTALS,
    payload: {
      projectId
    }
  }
}

export function portalsLoaded (result) {
  return {
    type: LOAD_PORTALS_SUCCESS,
    payload: {
      result
    }
  }
}

export function loadPortalsFail () {
  return {
    type: LOAD_PORTALS_FAILURE
  }
}

export function addPortal (values, resolve) {
  return {
    type: ADD_PORTAL,
    payload: {
      values,
      resolve
    }
  }
}

export function portalAdded (result) {
  return {
    type: ADD_PORTAL_SUCCESS,
    payload: {
        result
    }
  }
}

export function addPortalFail () {
  return {
    type: ADD_PORTAL_FAILURE
  }
}

export function editPortal (values, resolve) {
  return {
    type: EDIT_PORTAL,
    payload: {
      values,
      resolve
    }
  }
}

export function portalEdited (result) {
  return {
    type: EDIT_PORTAL_SUCCESS,
    payload: {
      result
    }
  }
}

export function editPortalFail () {
  return {
    type: EDIT_PORTAL_FAILURE
  }
}

export function deletePortal (id) {
  return {
    type: DELETE_PORTAL,
    payload: {
      id
    }
  }
}

export function portalDeleted (id) {
  return {
    type: DELETE_PORTAL_SUCCESS,
    payload: {
      id
    }
  }
}

export function deletePortalFail () {
  return {
      type: DELETE_PORTAL_FAILURE
  }
}

export function loadSelectTeams (type, id, resolve) {
  return {
    type: LOAD_SELECT_TEAMS,
    payload: {
      type,
      id,
      resolve
    }
  }
}

export function selectTeamsLoaded (result) {
  return {
    type: LOAD_SELECT_TEAMS_SUCCESS,
    payload: {
      result
    }
  }
}

export function loadSelectTeamsFail () {
  return {
      type: LOAD_SELECT_TEAMS_FAILURE
  }
}
