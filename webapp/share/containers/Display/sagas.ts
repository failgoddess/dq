
import omit from 'lodash/omit'
import { takeLatest, takeEvery } from 'redux-saga'
import { call, fork, put } from 'redux-saga/effects'

import { message } from 'antd'
import request from 'utils/request'
import api from 'utils/api'
import { ActionTypes } from './constants'
import ShareDisplayActions, { ShareDisplayActionType } from './actions'

export function* getDisplay (action: ShareDisplayActionType) {
  if (action.type !== ActionTypes.LOAD_SHARE_DISPLAY) { return }

  const { token, resolve, reject } = action.payload
  const { loadDisplayFail, displayLoaded } = ShareDisplayActions
  try {
    const asyncData = yield call(request, `${api.share}/display/${token}`)
    const { header, payload } = asyncData
    if (header.code === 401) {
      reject(header.msg)
      yield put(loadDisplayFail(header.msg))
      return
    }
    const display = payload
    const { slides, widgets } = display
    yield put(displayLoaded(display, slides[0], widgets || [])) // @FIXME should return empty array in response
    resolve(display, slides[0], widgets)
  } catch (err) {
    message.destroy()
    yield put(loadDisplayFail(err))
    message.error('获取 Display 信息失败，请刷新重试')
    reject(err)
  }
}

export function* getData (action: ShareDisplayActionType) {
  if (action.type !== ActionTypes.LOAD_LAYER_DATA) { return }

  const { renderType, layerId, dataToken, requestParams } = action.payload
  const {
    filters,
    tempFilters,
    linkageFilters,
    globalFilters,
    variables,
    linkageVariables,
    globalVariables,
    pagination,
    ...rest
  } = requestParams
  const { pageSize, pageNo } = pagination || { pageSize: 0, pageNo: 0 }
  const { layerDataLoaded, loadLayerDataFail } = ShareDisplayActions

  try {
    const response = yield call(request, {
      method: 'post',
      url: `${api.share}/data/${dataToken}`,
      data: {
        ...omit(rest, 'customOrders'),
        filters: filters.concat(tempFilters).concat(linkageFilters).concat(globalFilters),
        params: variables.concat(linkageVariables).concat(globalVariables),
        pageSize,
        pageNo
      }
    })
    const { resultList } = response.payload
    response.payload.resultList = (resultList && resultList.slice(0, 600)) || []
    yield put(layerDataLoaded(renderType, layerId, response.payload, requestParams))
  } catch (err) {
    yield put(loadLayerDataFail(err))
  }
}

export default function* rootDisplaySaga (): IterableIterator<any> {
  yield [
    takeLatest(ActionTypes.LOAD_SHARE_DISPLAY, getDisplay),
    takeEvery(ActionTypes.LOAD_LAYER_DATA, getData)
  ]
}
