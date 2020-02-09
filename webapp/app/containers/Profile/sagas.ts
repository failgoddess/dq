
import { call, put, all, takeLatest } from 'redux-saga/effects'

import { GET_USER_PROFILE } from './constants'
import {
  userProfileGot,
  getUserProfileFail
} from './actions'

import request from 'utils/request'
import api from 'utils/api'
import { errorHandler } from 'utils/util'

export function* getUserProfile (action): IterableIterator<any> {
  const { id } = action.payload

  try {
    const asyncData = yield call(request, {
      method: 'get',
      url: `${api.user}/profile/${id}`
    })
    const result = asyncData.payload
    yield put(userProfileGot(result))
  } catch (err) {
    yield put(getUserProfileFail())
    errorHandler(err)
  }
}


export default function* rootGroupSaga (): IterableIterator<any> {
  yield all([
    takeLatest(GET_USER_PROFILE, getUserProfile as any)
  ])
}

