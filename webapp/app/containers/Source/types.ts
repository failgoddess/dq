
import { SqlTypes } from 'app/globalConstants'
import { SourceProperty } from './components/types'
export { SourceResetConnectionProperties } from './components/types'

export type SourceType = 'csv' | 'jdbc'

export interface ISourceSimple {
  id: number
  name: string
}

export interface ISourceBase extends ISourceSimple {
  type: SourceType
  description: string
  projectId: number
}

export interface ISourceRaw extends ISourceBase {
  config: string
}

export interface ISource extends ISourceBase {
  config: {
    username: string
    password: string
    url: string
    properties: SourceProperty[]
    ext?: boolean
    version?: string
  }
}

export interface ISourceFormValues extends ISourceBase {
  datasourceInfo: string[]
  config: {
    username: string
    password: string
    url: string
    properties: SourceProperty[]
  }
}

export type IDatabase = string

export interface ITable {
  name: string,
  type: 'TABLE' | 'VIEW'
}

export interface IColumn {
  name: string
  type: SqlTypes
}

export interface ISourceDatabases {
  databases: IDatabase[]
  sourceId: number
}

export interface IMapSourceDatabases {
  [sourceId: number]: IDatabase[]
}

export interface IDatabaseTables {
  tables: ITable[]
  dbName: IDatabase
  sourceId: number
}

export interface IMapDatabaseTables {
  [mapKey: string]: IDatabaseTables
}

export interface ITableColumns {
  columns: IColumn[]
  primaryKeys: string[]
  tableName: string
  sourceId: number
  dbName: string
}

export interface IMapTableColumns {
  [mapKey: string]: ITableColumns
}

export interface ISchema {
  mapDatabases: IMapSourceDatabases
  mapTables: IMapDatabaseTables
  mapColumns: IMapTableColumns
}

export interface ICSVMetaInfo {
  sourceId: number
  tableName: string
  replaceMode: number
  primaryKeys: string
  indexKeys: string
}

export interface ISourceState {
  sources: ISourceBase[]
  listLoading: boolean
  formLoading: boolean
  testLoading: boolean
  resetLoading: boolean
  datasourcesInfo: IDatasourceInfo[]
}

export interface IDatasourceInfo {
  name: string
  prefix: string
  versions: string[]
}
