
import { call, put, all, takeLatest, takeEvery } from 'redux-saga/effects'
import {
  LOAD_PORTALS,
  ADD_PORTAL,
  DELETE_PORTAL,
  EDIT_PORTAL,
  LOAD_SELECT_TEAMS
} from './constants'
import {
  portalsLoaded,
  loadPortalsFail,
  portalAdded,
  addPortalFail,
  portalDeleted,
  deletePortalFail,
  portalEdited,
  editPortalFail,
  selectTeamsLoaded,
  loadSelectTeamsFail
} from './actions'

import request from 'utils/request'
import api from 'utils/api'
import { errorHandler } from 'utils/util'

export function* getPortals (action) {
  const { payload } = action
  try {
    const asyncData = yield call(request, `${api.portal}?projectId=${payload.projectId}`)
    const portals = asyncData.payload
    yield put(portalsLoaded(portals))
  } catch (err) {
    yield put(loadPortalsFail())
    errorHandler(err)
  }
}

export function* addPortal (action) {
  const { payload } = action
  try {
    const asyncData = yield call(request, {
      method: 'post',
      url: api.portal,
      data: payload.values
    })
    yield put(portalAdded(asyncData.payload))
    payload.resolve()
  } catch (err) {
    yield put(addPortalFail())
    errorHandler(err)
  }
}

export function* deletePortal (action) {
  const { payload } = action
  try {
    yield call(request, {
      method: 'delete',
      url: `${api.portal}/${payload.id}`
    })
    yield put(portalDeleted(payload.id))
  } catch (err) {
    yield put(deletePortalFail())
    errorHandler(err)
  }
}

export function* editPortal (action) {
  const { payload } = action
  try {
    yield call(request, {
      method: 'put',
      url: `${api.portal}/${payload.values.id}`,
      data: payload.values
    })
    yield put(portalEdited(payload.values))
    payload.resolve()
  } catch (err) {
    yield put(editPortalFail())
    errorHandler(err)
  }
}

export function* getSelectTeams (action) {
  const { type, id, resolve } = action.payload
  try {
    let url
    if (type === 'portal') {
      url = `${api.portal}/${id}/exclude/teams`
    } else if (type === 'dashboard') {
      url = `${api.portal}/dashboard/${id}/exclude/teams`
    } else if (type === 'display') {
      url = `${api.display}/${id}/exclude/teams`
    }
    const result = yield call(request, {
      method: 'get',
      url
    })
    yield put(selectTeamsLoaded(result.payload))
    if (resolve) {
      resolve(result.payload)
    }
  } catch (err) {
    yield put(loadSelectTeamsFail())
    errorHandler(err)
  }
}

export default function* rootPortalSaga (): IterableIterator<any> {
  yield all([
    takeLatest(LOAD_PORTALS, getPortals),
    takeEvery(ADD_PORTAL, addPortal),
    takeEvery(DELETE_PORTAL, deletePortal),
    takeEvery(EDIT_PORTAL, editPortal),
    takeEvery(LOAD_SELECT_TEAMS, getSelectTeams)
  ])
}
