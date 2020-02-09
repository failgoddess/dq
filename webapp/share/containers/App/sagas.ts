
import { takeLatest } from 'redux-saga'
import { call, fork, put } from 'redux-saga/effects'

import { LOGIN, GET_LOGIN_USER } from './constants'
import { logged } from './actions'

import request from '../../../app/utils/request'
import { errorHandler } from '../../../app/utils/util'
import api from '../../../app/utils/api'

export function* login (action) {
  const { username, password, shareInfo, resolve } = action.payload
  try {
    const userInfo = yield call(request, {
      method: 'post',
      url: `${api.share}/login/${shareInfo}`,
      data: {
        username,
        password
      }
    })
    yield put(logged(userInfo.payload))
    resolve()
  } catch (err) {
    errorHandler(err)
  }
}

export default function* rootAppSaga (): IterableIterator<any> {
  yield [
    takeLatest(LOGIN, login)
  ]
}
