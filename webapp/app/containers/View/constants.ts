
import { createTypes } from 'utils/redux'
import { SQL_STRING_TYPES, SQL_NUMBER_TYPES, SQL_DATE_TYPES, SQL_TYPES } from 'app/globalConstants'

enum Types {
  LOAD_VIEWS = 'dq/View/LOAD_VIEWS',
  LOAD_VIEWS_SUCCESS = 'dq/View/LOAD_VIEWS_SUCCESS',
  LOAD_VIEWS_FAILURE = 'dq/View/LOAD_VIEWS_FAILURE',

  LOAD_VIEWS_DETAIL = 'dq/View/LOAD_VIEWS_DETAIL',
  LOAD_VIEWS_DETAIL_SUCCESS = 'dq/View/LOAD_VIEWS_DETAIL_SUCCESS',
  LOAD_VIEWS_DETAIL_FAILURE = 'dq/View/LOAD_VIEWS_DETAIL_FAILURE',

  ADD_VIEW = 'dq/View/ADD_VIEW',
  ADD_VIEW_SUCCESS = 'dq/View/ADD_VIEW_SUCCESS',
  ADD_VIEW_FAILURE = 'dq/View/ADD_VIEW_FAILURE',

  DELETE_VIEW = 'dq/View/DELETE_VIEW',
  DELETE_VIEW_SUCCESS = 'dq/View/DELETE_VIEW_SUCCESS',
  DELETE_VIEW_FAILURE = 'dq/View/DELETE_VIEW_FAILURE',

  EDIT_VIEW = 'dq/View/EDIT_VIEW',
  EDIT_VIEW_SUCCESS = 'dq/View/EDIT_VIEW_SUCCESS',
  EDIT_VIEW_FAILURE = 'dq/View/EDIT_VIEW_FAILURE',

  COPY_VIEW = 'dq/View/COPY_VIEW',
  COPY_VIEW_SUCCESS = 'dq/View/COPY_VIEW_SUCCESS',
  COPY_VIEW_FAILURE = 'dq/View/COPY_VIEW_FAILURE',

  EXECUTE_SQL = 'dq/View/EXECUTE_SQL',
  EXECUTE_SQL_SUCCESS = 'dq/View/EXECUTE_SQL_SUCCESS',
  EXECUTE_SQL_FAILURE = 'dq/View/EXECUTE_SQL_FAILURE',

  UPDATE_EDITING_VIEW = 'dq/View/UPDATE_EDITING_VIEW',
  UPDATE_EDITING_VIEW_INFO = 'dq/View/UPDATE_EDITING_VIEW_INFO',

  SET_SQL_LIMIT = 'dq/View/SET_SQL_LIMIT',
  RESET_VIEW_STATE = 'dq/View/RESET_VIEW_STATE',

  /** Actions for fetch external authorization variables values */
  LOAD_DAC_CHANNELS = 'dq/View/LOAD_DAC_CHANNELS',
  LOAD_DAC_CHANNELS_SUCCESS = 'dq/View/LOAD_DAC_CHANNELS_SUCCESS',
  LOAD_DAC_CHANNELS_FAILURE = 'dq/View/LOAD_DAC_CHANNELS_FAILURE',

  LOAD_DAC_TENANTS = 'dq/View/LOAD_DAC_TENANTS',
  LOAD_DAC_TENANTS_SUCCESS = 'dq/View/LOAD_DAC_TENANTS_SUCCESS',
  LOAD_DAC_TENANTS_FAILURE = 'dq/View/LOAD_DAC_TENANTS_FAILURE',

  LOAD_DAC_BIZS = 'dq/View/LOAD_DAC_BIZS',
  LOAD_DAC_BIZS_SUCCESS = 'dq/View/LOAD_DAC_BIZS_SUCCESS',
  LOAD_DAC_BIZS_FAILURE = 'dq/View/LOAD_DAC_BIZS_FAILURE',
  /** */

  /** Actions for external usages */
  LOAD_SELECT_OPTIONS = 'dq/View/LOAD_SELECT_OPTIONS',
  LOAD_SELECT_OPTIONS_SUCCESS = 'dq/View/LOAD_SELECT_OPTIONS_SUCCESS',
  LOAD_SELECT_OPTIONS_FAILURE = 'dq/View/LOAD_SELECT_OPTIONS_FAILURE',

  LOAD_VIEW_DATA = 'dq/View/LOAD_VIEW_DATA',
  LOAD_VIEW_DATA_SUCCESS = 'dq/View/LOAD_VIEW_DATA_SUCCESS',
  LOAD_VIEW_DATA_FAILURE = 'dq/View/LOAD_VIEW_DATA_FAILURE',

  LOAD_VIEW_DISTINCT_VALUE = 'dq/View/LOAD_VIEW_DISTINCT_VALUE',
  LOAD_VIEW_DISTINCT_VALUE_SUCCESS = 'dq/View/LOAD_VIEW_DISTINCT_VALUE_SUCCESS',
  LOAD_VIEW_DISTINCT_VALUE_FAILURE = 'dq/View/LOAD_VIEW_DISTINCT_VALUE_FAILURE',

  LOAD_VIEW_DATA_FROM_VIZ_ITEM = 'dq/View/LOAD_VIEW_DATA_FROM_VIZ_ITEM',
  LOAD_VIEW_DATA_FROM_VIZ_ITEM_SUCCESS = 'dq/View/LOAD_VIEW_DATA_FROM_VIZ_ITEM_SUCCESS',
  LOAD_VIEW_DATA_FROM_VIZ_ITEM_FAILURE = 'dq/View/LOAD_VIEW_DATA_FROM_VIZ_ITEM_FAILURE'
  /**  */
}

export const ActionTypes = createTypes(Types)

export enum ViewVariableTypes {
  Query = 'query',
  Authorization = 'auth'
}

export const ViewVariableTypesLocale = {
  [ViewVariableTypes.Query]: '查询变量',
  [ViewVariableTypes.Authorization]: '权限变量'
}

export enum ViewVariableValueTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  SqlExpression = 'sql'
}

export enum ViewCorrelationValueTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  SqlExpression = 'sql'
}

export enum ViewToolboxValueTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date'
}

export const ViewVariableValueTypesLocale = {
  [ViewVariableValueTypes.String]: '字符串',
  [ViewVariableValueTypes.Number]: '数字',
  [ViewVariableValueTypes.Boolean]: '布尔',
  [ViewVariableValueTypes.Date]: '日期',
  [ViewVariableValueTypes.SqlExpression]: 'SQL表达式'
}

export enum ViewModelTypes {
  Category = 'category',
  Value = 'value'
}

export const ModelTypeSqlTypeSetting = {
  [ViewModelTypes.Value]: SQL_NUMBER_TYPES,
  [ViewModelTypes.Category]: SQL_TYPES
}

export const ViewModelTypesLocale = {
  [ViewModelTypes.Category]: '维度',
  [ViewModelTypes.Value]: '指标'
}

export enum ViewModelVisualTypes {
  Number = 'number',
  String = 'string',
  Date = 'date',
  GeoCountry = 'geoCountry',
  GeoProvince = 'geoProvince',
  GeoCity = 'geoCity'
}

export const VisualTypeSqlTypeSetting = {
  [ViewModelVisualTypes.Number]: SQL_NUMBER_TYPES,
  [ViewModelVisualTypes.String]: SQL_STRING_TYPES,
  [ViewModelVisualTypes.Date]: SQL_DATE_TYPES
}

export const ViewModelVisualTypesLocale = {
  [ViewModelVisualTypes.Number]: '数字',
  [ViewModelVisualTypes.String]: '字符',
  [ViewModelVisualTypes.Date]: '日期',
  [ViewModelVisualTypes.GeoCountry]: '地理国家',
  [ViewModelVisualTypes.GeoProvince]: '地理省份',
  [ViewModelVisualTypes.GeoCity]: '地理城市'
}

export const DEFAULT_SQL_LIMIT = 1000
export const DEFAULT_SQL_PREVIEW_PAGE_SIZE = 500
export const SQL_PREVIEW_PAGE_SIZE_OPTIONS = [100, 200, 500, 1000,2000,5000,10000]
