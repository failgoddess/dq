
import { createTypes } from 'utils/redux'
import { SQL_STRING_TYPES, SQL_NUMBER_TYPES, SQL_DATE_TYPES, SQL_TYPES } from 'app/globalConstants'

enum Types {
  LOAD_RULES = 'dq/Rule/LOAD_RULES',
  LOAD_RULES_SUCCESS = 'dq/Rule/LOAD_RULES_SUCCESS',
  LOAD_RULES_FAILURE = 'dq/Rule/LOAD_RULES_FAILURE',

  LOAD_RULES_DETAIL = 'dq/Rule/LOAD_RULES_DETAIL',
  LOAD_RULES_DETAIL_SUCCESS = 'dq/Rule/LOAD_RULES_DETAIL_SUCCESS',
  LOAD_RULES_DETAIL_FAILURE = 'dq/Rule/LOAD_RULES_DETAIL_FAILURE',

  ADD_RULE = 'dq/Rule/ADD_RULE',
  ADD_RULE_SUCCESS = 'dq/Rule/ADD_RULE_SUCCESS',
  ADD_RULE_FAILURE = 'dq/Rule/ADD_RULE_FAILURE',

  DELETE_RULE = 'dq/Rule/DELETE_RULE',
  DELETE_RULE_SUCCESS = 'dq/Rule/DELETE_RULE_SUCCESS',
  DELETE_RULE_FAILURE = 'dq/Rule/DELETE_RULE_FAILURE',

  EDIT_RULE = 'dq/Rule/EDIT_RULE',
  EDIT_RULE_SUCCESS = 'dq/Rule/EDIT_RULE_SUCCESS',
  EDIT_RULE_FAILURE = 'dq/Rule/EDIT_RULE_FAILURE',

  COPY_RULE = 'dq/Rule/COPY_RULE',
  COPY_RULE_SUCCESS = 'dq/Rule/COPY_RULE_SUCCESS',
  COPY_RULE_FAILURE = 'dq/Rule/COPY_RULE_FAILURE',

  EXECUTE_SQL = 'dq/Rule/EXECUTE_SQL',
  EXECUTE_SQL_SUCCESS = 'dq/Rule/EXECUTE_SQL_SUCCESS',
  EXECUTE_SQL_FAILURE = 'dq/Rule/EXECUTE_SQL_FAILURE',

  UPDATE_EDITING_RULE = 'dq/Rule/UPDATE_EDITING_RULE',
  UPDATE_EDITING_RULE_INFO = 'dq/Rule/UPDATE_EDITING_RULE_INFO',

  SET_SQL_LIMIT = 'dq/Rule/SET_SQL_LIMIT',
  RESET_RULE_STATE = 'dq/Rule/RESET_RULE_STATE',

  /** Actions for fetch external authorization variables values */
  LOAD_DAC_CHANNELS = 'dq/Rule/LOAD_DAC_CHANNELS',
  LOAD_DAC_CHANNELS_SUCCESS = 'dq/Rule/LOAD_DAC_CHANNELS_SUCCESS',
  LOAD_DAC_CHANNELS_FAILURE = 'dq/Rule/LOAD_DAC_CHANNELS_FAILURE',

  LOAD_DAC_TENANTS = 'dq/Rule/LOAD_DAC_TENANTS',
  LOAD_DAC_TENANTS_SUCCESS = 'dq/Rule/LOAD_DAC_TENANTS_SUCCESS',
  LOAD_DAC_TENANTS_FAILURE = 'dq/Rule/LOAD_DAC_TENANTS_FAILURE',

  LOAD_DAC_BIZS = 'dq/Rule/LOAD_DAC_BIZS',
  LOAD_DAC_BIZS_SUCCESS = 'dq/Rule/LOAD_DAC_BIZS_SUCCESS',
  LOAD_DAC_BIZS_FAILURE = 'dq/Rule/LOAD_DAC_BIZS_FAILURE',
  /** */

  /** Actions for external usages */
  LOAD_SELECT_OPTIONS = 'dq/Rule/LOAD_SELECT_OPTIONS',
  LOAD_SELECT_OPTIONS_SUCCESS = 'dq/Rule/LOAD_SELECT_OPTIONS_SUCCESS',
  LOAD_SELECT_OPTIONS_FAILURE = 'dq/Rule/LOAD_SELECT_OPTIONS_FAILURE',

  LOAD_RULE_DATA = 'dq/Rule/LOAD_RULE_DATA',
  LOAD_RULE_DATA_SUCCESS = 'dq/Rule/LOAD_RULE_DATA_SUCCESS',
  LOAD_RULE_DATA_FAILURE = 'dq/Rule/LOAD_RULE_DATA_FAILURE',

  LOAD_RULE_DISTINCT_VALUE = 'dq/Rule/LOAD_RULE_DISTINCT_VALUE',
  LOAD_RULE_DISTINCT_VALUE_SUCCESS = 'dq/Rule/LOAD_RULE_DISTINCT_VALUE_SUCCESS',
  LOAD_RULE_DISTINCT_VALUE_FAILURE = 'dq/Rule/LOAD_RULE_DISTINCT_VALUE_FAILURE',

  LOAD_RULE_DATA_FROM_VIZ_ITEM = 'dq/Rule/LOAD_RULE_DATA_FROM_VIZ_ITEM',
  LOAD_RULE_DATA_FROM_VIZ_ITEM_SUCCESS = 'dq/Rule/LOAD_RULE_DATA_FROM_VIZ_ITEM_SUCCESS',
  LOAD_RULE_DATA_FROM_VIZ_ITEM_FAILURE = 'dq/Rule/LOAD_RULE_DATA_FROM_VIZ_ITEM_FAILURE'
  /**  */
}

export const ActionTypes = createTypes(Types)

export enum RuleVariableTypes {
  Query = 'query',
  Authorization = 'auth'
}

export const RuleVariableTypesLocale = {
  [RuleVariableTypes.Query]: '查询变量',
  [RuleVariableTypes.Authorization]: '权限变量'
}

export enum RuleVariableValueTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  SqlExpression = 'sql'
}

export enum RuleCorrelationValueTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date',
  SqlExpression = 'sql'
}

export enum RuleToolboxValueTypes {
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  Date = 'date'
}

export const RuleVariableValueTypesLocale = {
  [RuleVariableValueTypes.String]: '字符串',
  [RuleVariableValueTypes.Number]: '数字',
  [RuleVariableValueTypes.Boolean]: '布尔',
  [RuleVariableValueTypes.Date]: '日期',
  [RuleVariableValueTypes.SqlExpression]: 'SQL表达式'
}

export enum RuleModelTypes {
  Category = 'category',
  Value = 'value'
}

export const ModelTypeSqlTypeSetting = {
  [RuleModelTypes.Value]: SQL_NUMBER_TYPES,
  [RuleModelTypes.Category]: SQL_TYPES
}

export const RuleModelTypesLocale = {
  [RuleModelTypes.Category]: '维度',
  [RuleModelTypes.Value]: '指标'
}

export enum RuleModelVisualTypes {
  Number = 'number',
  String = 'string',
  Date = 'date',
  GeoCountry = 'geoCountry',
  GeoProvince = 'geoProvince',
  GeoCity = 'geoCity'
}

export const VisualTypeSqlTypeSetting = {
  [RuleModelVisualTypes.Number]: SQL_NUMBER_TYPES,
  [RuleModelVisualTypes.String]: SQL_STRING_TYPES,
  [RuleModelVisualTypes.Date]: SQL_DATE_TYPES
}

export const RuleModelVisualTypesLocale = {
  [RuleModelVisualTypes.Number]: '数字',
  [RuleModelVisualTypes.String]: '字符',
  [RuleModelVisualTypes.Date]: '日期',
  [RuleModelVisualTypes.GeoCountry]: '地理国家',
  [RuleModelVisualTypes.GeoProvince]: '地理省份',
  [RuleModelVisualTypes.GeoCity]: '地理城市'
}

export const DEFAULT_SQL_LIMIT = 500
export const DEFAULT_SQL_PRERULE_PAGE_SIZE = 500
export const SQL_PRERULE_PAGE_SIZE_OPTIONS = [100, 200, 500, 1000,2000,5000,10000]
