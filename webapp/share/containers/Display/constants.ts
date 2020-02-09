import { createTypes } from 'utils/redux'

enum Types {
  LOAD_SHARE_DISPLAY = 'dq/Share/LOAD_SHARE_DISPLAY',
  LOAD_SHARE_DISPLAY_SUCCESS = 'dq/Share/LOAD_SHARE_DISPLAY_SUCCESS',
  LOAD_SHARE_DISPLAY_FAILURE = 'dq/Share/LOAD_SHARE_DISPLAY_FAILURE',

  LOAD_LAYER_DATA = 'dq/Share/LOAD_LAYER_DATA',
  LOAD_LAYER_DATA_SUCCESS = 'dq/Share/LOAD_LAYER_DATA_SUCCESS',
  LOAD_LAYER_DATA_FAILURE = 'dq/Share/LOAD_LAYER_DATA_FAILURE'
}

export const ActionTypes = createTypes(Types)
