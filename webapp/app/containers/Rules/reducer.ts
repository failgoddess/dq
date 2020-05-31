
import produce from 'immer'
import pick from 'lodash/pick'
import { IRuleState, IRule, IFormedRules, IRuleBase } from './types'
import { getFormedRule, getValidModel } from './util'

import { ActionTypes, DEFAULT_SQL_LIMIT } from './constants'
import { RuleActionType } from './actions'

import { ActionTypes as SourceActionTypes } from 'containers/Source/constants'
import { SourceActionType } from 'containers/Source/actions'

import { LOAD_WIDGET_DETAIL_SUCCESS } from 'containers/Widget/constants'
import { LOAD_DASHBOARD_DETAIL_SUCCESS } from 'containers/Dashboard/constants'

import { ActionTypes as DisplayActionTypes } from 'containers/Display/constants'
import { LOCATION_CHANGE } from 'react-router-redux'

const emptyRule: IRule = {
  id: null,
  name: '',
  sql: '',
  leftSql: '',
  rightSql: '',
  model: '',
  action: '',
  variable: '',
  roles: [],
  config: '',
  description: '',
  projectId: null,
  sourceId: null,
  correlation: null,
  toolbox: null
}

const initialState: IRuleState = {
  rules: [],
  formedRules: {},
  editingRule: emptyRule,
  editingRuleInfo: {
    model: {},
    action: {
    	type:'',
    	sql:'',
    	python:''
    },
    variable: [],
    roles: [],
    correlation:{
  	  expression:'',
  	  expressionPair:{},
  	  condition:''
    },
    toolbox:{
    	slide:'combine',
    }
  },
  sources: [],
  schema: {
    mapDatabases: {},
    mapTables: {},
    mapColumns: {}
  },
  sqlValidation: {
    code: null,
    message: null
  },
  sqlDataSource: {
  	key: {
      columns: [],
      totalCount: 0,
      resultList: []
  	},
  	value:{
  	  columns: [],
      totalCount: 0,
      resultList: []
  	}
  },
  sqlLimit: DEFAULT_SQL_LIMIT,
  loading: {
    rule: false,
    table: false,
    modal: false,
    execute: false,
    copy: false
  },
  channels: [],
  tenants: [],
  bizs: [],
  cancelTokenSources: []
}

const ruleReducer = (state = initialState, action: RuleActionType | SourceActionType): IRuleState => (
  produce(state, (draft) => {
    switch (action.type) {
      case ActionTypes.LOAD_RULES:
      case ActionTypes.DELETE_RULE:
        draft.loading.rule = true
        break
      case ActionTypes.LOAD_RULES_FAILURE:
      case ActionTypes.DELETE_RULE_FAILURE:
        draft.loading.rule = false
        break
      case ActionTypes.LOAD_RULES_SUCCESS:
        draft.rules = action.payload.rules
        draft.formedRules = {}
        draft.loading.rule = false
        break
      case ActionTypes.LOAD_RULES_DETAIL_SUCCESS:
        const detailedRules = action.payload.rules
        if (action.payload.isEditing) {
          draft.editingRule = detailedRules[0]
          draft.editingRuleInfo = pick(getFormedRule(detailedRules[0]), ['model', 'variable', 'roles','correlation','toolbox','action'])
        }
        draft.formedRules = detailedRules.reduce((acc, rule) => {
          const { id, model, variable, roles, correlation, toolbox, action } = getFormedRule(rule)
          acc[id] = {
            ...rule,
            action,
            model,
            variable,
            roles,
            correlation,
            toolbox
          }
          return acc
        }, draft.formedRules)
        break
      case SourceActionTypes.LOAD_SOURCES_SUCCESS:
        draft.sources = action.payload.sources
        draft.schema = {
          mapDatabases: {},
          mapTables: {},
          mapColumns: {}
        }
        break
      case SourceActionTypes.LOAD_SOURCE_DATABASES_SUCCESS:
        const { sourceDatabases } = action.payload
        draft.schema.mapDatabases[sourceDatabases.sourceId] = sourceDatabases.databases
        break
      case SourceActionTypes.LOAD_SOURCE_DATABASE_TABLES_SUCCESS:
        const { databaseTables } = action.payload
        draft.schema.mapTables[`${databaseTables.sourceId}_${databaseTables.dbName}`] = databaseTables
        break
      case SourceActionTypes.LOAD_SOURCE_TABLE_COLUMNS_SUCCESS:
        const { databaseName, tableColumns } = action.payload
        draft.schema.mapColumns[`${tableColumns.sourceId}_${databaseName}_${tableColumns.tableName}`] = tableColumns
        break
      case ActionTypes.EXECUTE_SQL:
        draft.loading.execute = true
        draft.sqlValidation = { code: null, message: null }
        break
      case ActionTypes.EXECUTE_SQL_SUCCESS:
        const sqlResponse = action.payload.result
        const validModel = getValidModel(draft.editingRuleInfo.model, sqlResponse.payload.columns)
        draft.sqlDataSource = sqlResponse.payload
        draft.editingRuleInfo.model = validModel
        draft.loading.execute = false
        draft.sqlValidation = {
          code: sqlResponse.header.code,
          message: sqlResponse.header.msg
        }
        break
      case ActionTypes.EXECUTE_SQL_FAILURE:
        draft.sqlDataSource = {
          ...draft.sqlDataSource,
          columns: [],
          totalCount: 0,
          resultList: []
        }
        draft.loading.execute = false
        draft.sqlValidation = {
          code: action.payload.err.code,
          message: action.payload.err.msg
        }
        break
      case ActionTypes.UPDATE_EDITING_RULE:
        draft.editingRule = action.payload.rule
        break
      case ActionTypes.UPDATE_EDITING_RULE_INFO:
        draft.editingRuleInfo = action.payload.ruleInfo
        break
      case ActionTypes.SET_SQL_LIMIT:
        draft.sqlLimit = action.payload.limit
        break
      case ActionTypes.EDIT_RULE_SUCCESS:
        draft.editingRule = emptyRule
        draft.editingRuleInfo = { model: {}, variable: [], roles: [], action: {} }
        draft.formedRules[action.payload.result.id] = getFormedRule(action.payload.result)
        break

      case ActionTypes.COPY_RULE:
        draft.loading.copy = true
        break
      case ActionTypes.COPY_RULE_SUCCESS:
        const fromRuleId = action.payload.fromRuleId
        const copiedRuleKeys: Array<keyof IRuleBase> = ['id', 'name', 'description']
        const copiedRule: IRuleBase = pick(action.payload.result, copiedRuleKeys)
        copiedRule.sourceName = action.payload.result.source.name
        draft.rules.splice(draft.rules.findIndex(({ id }) => id === fromRuleId) + 1, 0, copiedRule)
        draft.loading.copy = false
        break
      case ActionTypes.COPY_RULE_FAILURE:
        draft.loading.copy = false
        break

      case ActionTypes.LOAD_DAC_CHANNELS_SUCCESS:
        draft.channels = action.payload.channels
        break
      case ActionTypes.LOAD_DAC_TENANTS_SUCCESS:
        draft.tenants = action.payload.tenants
        break
      case ActionTypes.LOAD_DAC_TENANTS_FAILURE:
        draft.tenants = []
        break
      case ActionTypes.LOAD_DAC_BIZS_SUCCESS:
        draft.bizs = action.payload.bizs
        break
      case ActionTypes.LOAD_DAC_BIZS_FAILURE:
        draft.bizs = []
        break
      case ActionTypes.RESET_RULE_STATE:
        return initialState
        break
      case LOAD_WIDGET_DETAIL_SUCCESS:
        const widgetRule = action.payload.rule
        console.log("------------")
        draft.formedRules[widgetRule.id] = {
          ...widgetRule,
          model: JSON.parse(widgetRule.model || '{}'),
          action: JSON.parse(widgetRule.action || '{}'),
          variable: JSON.parse(widgetRule.variable || '[]')
        }
        break
      case LOAD_DASHBOARD_DETAIL_SUCCESS:
      case DisplayActionTypes.LOAD_DISPLAY_DETAIL_SUCCESS:
        const updatedRules: IFormedRules = (action.payload.rules || []).reduce((obj, rule) => {
          console.log("---------------")
          obj[rule.id] = {
            ...rule,
            model: JSON.parse(rule.model || '{}'),
            action: JSON.parse(widgetRule.action || '{}'),
            variable: JSON.parse(rule.variable || '[]')
          }
          return obj
        }, {})
        draft.formedRules = {
          ...draft.formedRules,
          ...updatedRules
        }
        break
      case ActionTypes.LOAD_RULE_DATA_FROM_VIZ_ITEM:
      case ActionTypes.LOAD_SELECT_OPTIONS:
        draft.cancelTokenSources.push(action.payload.cancelTokenSource)
        break
      case LOCATION_CHANGE:
        if (state.cancelTokenSources.length) {
          state.cancelTokenSources.forEach((source) => {
            source.cancel()
          })
          draft.cancelTokenSources = []
        }
        break
      default:
        break
    }
  })
)

export default ruleReducer
