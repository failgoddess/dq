import { fromJS } from 'immutable'
import { ActionTypes } from './constants'
import { GraphTypes } from '../../../app/containers/Display/components/util'

import { fieldGroupedSort } from 'containers/Widget/components/Config/Sort'
import { DashboardItemStatus } from '../Dashboard'

const initialState = fromJS({
  title: '',
  display: null,
  slide: null,
  layers: [],
  layersInfo: {},
  widgets: []
})

function displayReducer (state = initialState, { type, payload }) {
  const layersInfo = state.get('layersInfo')

  switch (type) {
    case ActionTypes.LOAD_SHARE_DISPLAY_SUCCESS:
      return state
        .set('title', payload.display.name)
        .set('display', payload.display)
        .set('slide', payload.slide)
        .set('layers', payload.slide.relations)
        .set('widgets', payload.widgets)
        .set('layersInfo', payload.slide.relations.reduce((obj, layer) => {
          obj[layer.id] = (layer.type === GraphTypes.Chart) ? {
            status: DashboardItemStatus.Initial,
            datasource: { resultList: [] },
            loading: false,
            queryConditions: {
              tempFilters: [],
              linkageFilters: [],
              globalFilters: [],
              variables: [],
              linkageVariables: [],
              globalVariables: []
            },
            interactId: '',
            renderType: 'rerender'
          } : {
            loading: false
          }
          return obj
        }, {}))
    case ActionTypes.LOAD_SHARE_DISPLAY_FAILURE:
      return state
        .set('display', null)
        .set('slide', null)
        .set('layers', [])
        .set('widgets', [])
        .set('layersInfo', {})
    case ActionTypes.LOAD_LAYER_DATA:
      return state
        .set('layersInfo', {
          ...layersInfo,
          [payload.layerId]: {
            ...layersInfo[payload.layerId],
            loading: true
          }
        })
    case ActionTypes.LOAD_LAYER_DATA_SUCCESS:
      fieldGroupedSort(payload.data.resultList, payload.requestParams.customOrders)
      return state
        .set('layersInfo', {
          ...layersInfo,
          [payload.layerId]: {
            ...layersInfo[payload.layerId],
            status: DashboardItemStatus.Fulfilled,
            loading: false,
            datasource: payload.data,
            renderType: payload.renderType
          }
        })
    case ActionTypes.LOAD_LAYER_DATA_FAILURE:
      return state
        .set('loadings', {
          ...layersInfo,
          [payload.layerId]: {
            ...layersInfo[payload.layerId],
            status: DashboardItemStatus.Error,
            loading: false
          }
        })
    default:
        return state
  }
}

export default displayReducer
