
import { SqlTypes } from 'app/globalConstants'
import { ISourceSimple, ISourceBase, ISchema } from 'containers/Source/types'
import { RuleModelTypes, RuleModelVisualTypes, RuleVariableTypes, RuleVariableValueTypes } from './constants'
import { CancelTokenSource } from 'axios'

export interface IRuleBase {
  id: number
  name: string
  description: string
  sourceName: string
}

type IRuleTemp = Omit<IRuleBase, 'sourceName'>

export interface IRule extends IRuleTemp {
  sql: string
  leftSql: string
  leftRowKey: string
  rightSql: string
  rightRowKey: string
  model: string
  action: IRuleAction
  variable: string
  config: string
  projectId: number
  source?: ISourceSimple
  sourceId: number
  roles: IRuleRoleRaw[]
  condition: string
}

type IRuleTemp2 = Omit<Omit<Omit<IRule, 'model'>, 'variable'>, 'roles'>

export interface IFormedRule extends IRuleTemp2 {
  model: IRuleModel
  action: IRuleAction
  variable: IRuleVariable[]
  roles: IRuleRole[]
}

export interface ISqlValidation {
  code: number
  message: string
}

export interface IRuleLoading {
  rule: boolean
  table: boolean
  modal: boolean
  execute: boolean
  copy: boolean
}

export interface IExecuteSqlParams {
  sourceId: number
  sql: string
  limit: number
  variables: IRuleVariableBase[]
}

export interface ISqlColumn {
  name: string
  type: SqlTypes
}

export interface IComponentSqlResponse {
  columns: ISqlColumn[]
  totalCount: number
  resultList: Array<{[key: string]: string | number}>
}

export interface IExecuteSqlResponse {
  key: IComponentSqlResponse
  value: IComponentSqlResponse
}

export interface IRuleModelProps {
  name: string
  sqlType: SqlTypes,
  visualType: RuleModelVisualTypes,
  modelType: RuleModelTypes
}

export interface IRuleModel {
  [name: string]: Omit<IRuleModelProps, 'name'>
}

export interface IRuleAction {
  type: number,
  sql: string,
  python: string
}

interface IRuleVariableChannel {
  bizId: number
  name: string
  tenantId: number
}

interface IRuleVariableBase {
  name: string
  type: RuleVariableTypes
  valueType: RuleVariableValueTypes
  defaultValues: Array<string | number | boolean>
  channel?: IRuleVariableChannel
  udf: boolean
}

export interface IRuleVariable extends IRuleVariableBase {
  key: string
  alias: string
  fromService: boolean
}

export interface IRuleCorrelation {
  key: string
  alias: string
  fromService: boolean
  expression: string
  expressionPair: Array<{[key: string]: string | number}>
  condition: string
}

export interface IRuleToolbox {
  key: string
  alias: string
  slide: string
}

export interface IRuleRoleRaw {
  roleId: number
  columnAuth: string
  rowAuth: string
}

export interface IRuleRoleRowAuth {
  name: string
  values: Array<string | number | boolean>
  enable: boolean
}

export interface IRuleRole {
  roleId: number
  /**
   * rule columns name
   * @type {string[]}
   * @memberof IRuleRole
   */
  columnAuth: string[]

  /**
   * query variable values
   * @type {(Array<string | number>)}
   * @memberof IRuleRole
   */
  rowAuth: IRuleRoleRowAuth[]
}

export interface IRuleInfo {
  model: IRuleModel
  action: IRuleAction
  variable: IRuleVariable[]
  roles: IRuleRole[]
  correlation: IRuleCorrelation
  toolbox: IRuleToolbox
}

export interface IFormedRules {
  [ruleId: number]: IFormedRule
}

export type IDacChannel = string
export interface IDacTenant {
  id: number
  name: string
}
export interface IDacBiz {
  id: number
  name: string
}

export interface IRuleState {
  rules: IRuleBase[]
  formedRules: IFormedRules
  editingRule: IRule
  editingRuleInfo: IRuleInfo
  sources: ISourceBase[]
  schema: ISchema
  sqlValidation: ISqlValidation
  sqlDataSource: IExecuteSqlResponse
  sqlLimit: number
  loading: IRuleLoading

  channels: IDacChannel[]
  tenants: IDacTenant[]
  bizs: IDacBiz[]

  cancelTokenSources: CancelTokenSource[]
}
