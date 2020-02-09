
import { ActionTypes } from './constants'
import { returnType } from 'app/utils/redux';

export const ShareDisplayActions = {
  loadDisplay (token: string, resolve, reject) {
    return {
      type: ActionTypes.LOAD_SHARE_DISPLAY,
      payload: {
        token,
        resolve,
        reject
      }
    }
  },
  displayLoaded (display, slide, widgets) {
    return {
      type: ActionTypes.LOAD_SHARE_DISPLAY_SUCCESS,
      payload: {
        display,
        slide,
        widgets
      }
    }
  },
  loadDisplayFail (error) {
    return {
      type: ActionTypes.LOAD_SHARE_DISPLAY_FAILURE,
      payload: {
        error
      }
    }
  },

  loadLayerData (renderType, layerId, dataToken, requestParams) {
    return {
      type: ActionTypes.LOAD_LAYER_DATA,
      payload: {
        renderType,
        layerId,
        dataToken,
        requestParams
      }
    }
  },
  layerDataLoaded (renderType, layerId, data, requestParams) {
    return {
      type: ActionTypes.LOAD_LAYER_DATA_SUCCESS,
      payload: {
        renderType,
        layerId,
        data,
        requestParams
      }
    }
  },
  loadLayerDataFail (error) {
    return {
      type: ActionTypes.LOAD_LAYER_DATA_FAILURE,
      payload: {
        error
      }
    }
  }
}

const mockAction = returnType(ShareDisplayActions)
export type ShareDisplayActionType = typeof mockAction

export default ShareDisplayActions
