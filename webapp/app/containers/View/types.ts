
import { SqlTypes } from 'app/globalConstants'
import { ISourceSimple, ISourceBase, ISchema } from 'containers/Source/types'
import { ViewModelTypes, ViewModelVisualTypes, ViewVariableTypes, ViewVariableValueTypes } from './constants'
import { CancelTokenSource } from 'axios'

export interface IViewBase {
  id: number
  name: string
  description: string
  sourceName: string
}

type IViewTemp = Omit<IViewBase, 'sourceName'>

export interface IView extends IViewTemp {
  sql: string
  leftSql: string
  rightSql: string
  model: string
  variable: string
  config: string
  projectId: number
  source?: ISourceSimple
  sourceId: number
  roles: IViewRoleRaw[]
}

type IViewTemp2 = Omit<Omit<Omit<IView, 'model'>, 'variable'>, 'roles'>

export interface IFormedView extends IViewTemp2 {
  model: IViewModel
  variable: IViewVariable[]
  roles: IViewRole[]
}

export interface ISqlValidation {
  code: number
  message: string
}

export interface IViewLoading {
  view: boolean
  table: boolean
  modal: boolean
  execute: boolean
  copy: boolean
}

export interface IExecuteSqlParams {
  sourceId: number
  sql: string
  limit: number
  variables: IViewVariableBase[]
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

export interface IViewModelProps {
  name: string
  sqlType: SqlTypes,
  visualType: ViewModelVisualTypes,
  modelType: ViewModelTypes
}

export interface IViewModel {
  [name: string]: Omit<IViewModelProps, 'name'>
}

interface IViewVariableChannel {
  bizId: number
  name: string
  tenantId: number
}

interface IViewVariableBase {
  name: string
  type: ViewVariableTypes
  valueType: ViewVariableValueTypes
  defaultValues: Array<string | number | boolean>
  channel?: IViewVariableChannel
  udf: boolean
}

export interface IViewVariable extends IViewVariableBase {
  key: string
  alias: string
  fromService: boolean
}

export interface IViewCorrelation {
  key: string
  alias: string
  fromService: boolean
  expression: string
  expressionPair: Array<{[key: string]: string | number}>
}

export interface IViewRoleRaw {
  roleId: number
  columnAuth: string
  rowAuth: string
}

export interface IViewRoleRowAuth {
  name: string
  values: Array<string | number | boolean>
  enable: boolean
}

export interface IViewRole {
  roleId: number
  /**
   * view columns name
   * @type {string[]}
   * @memberof IViewRole
   */
  columnAuth: string[]

  /**
   * query variable values
   * @type {(Array<string | number>)}
   * @memberof IViewRole
   */
  rowAuth: IViewRoleRowAuth[]
}

export interface IViewInfo {
  model: IViewModel
  variable: IViewVariable[]
  roles: IViewRole[]
  correlation: IViewCorrelation
}

export interface IFormedViews {
  [viewId: number]: IFormedView
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

export interface IViewState {
  views: IViewBase[]
  formedViews: IFormedViews
  editingView: IView
  editingViewInfo: IViewInfo
  sources: ISourceBase[]
  schema: ISchema
  sqlValidation: ISqlValidation
  sqlDataSource: IExecuteSqlResponse
  sqlLimit: number
  loading: IViewLoading

  channels: IDacChannel[]
  tenants: IDacTenant[]
  bizs: IDacBiz[]

  cancelTokenSources: CancelTokenSource[]
}
