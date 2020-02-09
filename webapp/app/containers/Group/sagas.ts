
import { call, put, all, takeLatest, takeEvery } from 'redux-saga/effects'
import {
  LOAD_GROUPS,
  ADD_GROUP,
  DELETE_GROUP,
  // LOAD_GROUP_DETAIL,
  EDIT_GROUP
} from './constants'
import {
  groupsLoaded,
  loadGroupFail,
  groupAdded,
  addGroupFail,
  groupDeleted,
  deleteGroupFail,
  // groupDetailLoaded,
  groupEdited,
  editGroupFail
} from './actions'

import request from 'utils/request'
import api from 'utils/api'
import { errorHandler } from 'utils/util'

export function* getGroups () {
  try {
    const asyncData = yield call(request, api.group)
    const groups = asyncData.payload
    yield put(groupsLoaded(groups))
  } catch (err) {
    yield put(loadGroupFail())
    errorHandler(err)
  }
}

export function* addGroup ({ payload }) {
  try {
    const asyncData = yield call(request, {
      method: 'post',
      url: api.group,
      data: [payload.group]
    })
    const result = asyncData.payload
    yield put(groupAdded(result))
    payload.resolve()
  } catch (err) {
    yield put(addGroupFail())
    errorHandler(err)
  }
}

export function* deleteGroup ({ payload }) {
  try {
    yield call(request, {
      method: 'delete',
      url: `${api.group}/${payload.id}`
    })
    yield put(groupDeleted(payload.id))
  } catch (err) {
    yield put(deleteGroupFail())
    errorHandler(err)
  }
}

export function* editGroup ({ payload }) {
  try {
    yield call(request, {
      method: 'put',
      url: api.group,
      data: [payload.group]
    })
    yield put(groupEdited(payload.group))
    payload.resolve()
  } catch (err) {
    yield put(editGroupFail())
    errorHandler(err)
  }
}

export default function* rootGroupSaga (): IterableIterator<any> {
  yield all([
    takeLatest(LOAD_GROUPS, getGroups),
    takeEvery(ADD_GROUP, addGroup as any),
    takeEvery(DELETE_GROUP, deleteGroup as any),
    // takeLatest(LOAD_GROUP_DETAIL, getGroupDetail),
    takeEvery(EDIT_GROUP, editGroup as any)
  ])
}
