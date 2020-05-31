import React from 'react'
import { compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import memoizeOne from 'memoize-one'
import Helmet from 'react-helmet'
import { RouteComponentProps } from 'react-router'

import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import reducer from './reducer'
import sagas from './sagas'
import reducerSource from 'containers/Source/reducer'
import sagasSource from 'containers/Source/sagas'
import reducerProject from 'containers/Projects/reducer'
import sagasProject from 'containers/Projects/sagas'

import { IRouteParams } from 'app/routes'
import { hideNavigator } from '../App/actions'
import { RuleActions, RuleActionType } from './actions'
import { SourceActions, SourceActionType } from 'containers/Source/actions'
import {
  makeSelectEditingRule,
  makeSelectEditingRuleInfo,
  makeSelectSources,
  makeSelectSchema,
  makeSelectSqlDataSource,
  makeSelectSqlLimit,
  makeSelectSqlValidation,
  makeSelectLoading,

  makeSelectChannels,
  makeSelectTenants,
  makeSelectBizs,
  makeSelectCorrelation,
  makeSelectToolbox,
  makeSelectAction
} from './selectors'

import { loadProjectRoles } from 'containers/Organizations/actions'
import { makeSelectProjectRoles } from 'containers/Projects/selectors'

import {
  IRule, IRuleModel, IRuleRoleRaw, IRuleRole, IRuleVariable, IRuleInfo,
  IExecuteSqlParams, IExecuteSqlResponse, IRuleLoading, ISqlValidation,
  IDacChannel, IDacTenant, IDacBiz } from './types'
import { ISource, ISchema } from '../Source/types'
import { RuleVariableTypes } from './constants'

import { message, notification, Tooltip } from 'antd'
import EditorSteps from './components/EditorSteps'
import EditorContainer from './components/EditorContainer'
import ModelAuth from './components/ModelAuth'
import SourceTable from './components/SourceTable'
import SqlEditor from './components/SqlEditor'
import SqlPrerule from './components/SqlPrerule'
import EditorBottom from './components/EditorBottom'
import RuleVariableList from './components/RuleVariableList'
import VariableModal from './components/VariableModal'
import CorrelationModal from './components/CorrelationModal'
import ToolboxModal from './components/ToolboxModal'
import SpacebarModal from './components/SpacebarModal'

import Styles from './Rule.less'

interface IRuleEditorStateProps {
  editingRule: IRule
  editingRuleInfo: IRuleInfo
  sources: ISource[]
  schema: ISchema
  sqlDataSource: IExecuteSqlResponse
  sqlLimit: number
  sqlValidation: ISqlValidation
  loading: IRuleLoading
  projectRoles: any[]

  channels: IDacChannel[]
  tenants: IDacTenant[]
  bizs: IDacBiz[]
  
  correlation: IRuleCorrelation
  toolbox: IRuleToolbox
  action: IRuleAction
}

interface IRuleEditorDispatchProps {
  onHideNavigator: () => void
  onLoadRuleDetail: (ruleId: number) => void
  onLoadSources: (projectId: number) => void
  onLoadSourceDatabases: (sourceId: number) => void
  onLoadDatabaseTables: (sourceId: number, databaseName: string) => void
  onLoadTableColumns: (sourceId: number, databaseName: string, tableName: string) => void
  onExecuteSql: (params: IExecuteSqlParams) => void
  onAddRule: (rule: IRule, resolve: () => void) => void
  onEditRule: (rule: IRule, resolve: () => void) => void
  onUpdateEditingRule: (rule: IRule) => void
  onUpdateEditingRuleInfo: (ruleInfo: IRuleInfo) => void
  onSetSqlLimit: (limit: number) => void

  onLoadDacChannels: () => void,
  onLoadDacTenants: (channelName: string) => void,
  onLoadDacBizs: (channelName: string, tenantId: number) => void,

  onResetState: () => void
  onLoadProjectRoles: (projectId: number) => void
}

type IRuleEditorProps = IRuleEditorStateProps & IRuleEditorDispatchProps & RouteComponentProps<{}, IRouteParams>

interface IRuleEditorStates {
  containerHeight: number
  sqlValidationCode: number
  init: boolean
  currentStep: number
  lastSuccessExecutedSql: string
}


export class RuleEditor extends React.Component<IRuleEditorProps, IRuleEditorStates> {

  public state: Readonly<IRuleEditorStates> = {
    containerHeight: 0,
    currentStep: 0,
    sqlValidationCode: null,
    init: true,
    lastSuccessExecutedSql: null
  }

  public constructor (props: IRuleEditorProps) {
    super(props)
    const { onLoadSources, onLoadRuleDetail, onLoadProjectRoles, onLoadDacChannels, params } = this.props
    const { ruleId, pid: projectId } = params
    if (projectId) {
      onLoadSources(+projectId)
      onLoadProjectRoles(+projectId)
    }
    if (ruleId) {
      onLoadRuleDetail(+ruleId)
    }
    onLoadDacChannels()
  }

  public static getDerivedStateFromProps:
    React.GetDerivedStateFromProps<IRuleEditorProps, IRuleEditorStates>
  = (props, state) => {
    const { params, editingRule, sqlValidation } = props
    const { ruleId } = params
    const { init, sqlValidationCode } = state
    let lastSuccessExecutedSql = state.lastSuccessExecutedSql
    if (sqlValidationCode !== sqlValidation.code && sqlValidation.code) {
      notification.destroy()
      sqlValidation.code === 200
        ? notification.success({
          message: '执行成功',
          duration: 3
        })
        : notification.error({
          message: '执行失败',
          description: (
            <Tooltip
              placement="bottom"
              trigger="click"
              title={sqlValidation.message}
              overlayClassName={Styles.errorMessage}
            >
              <a>点击查看错误信息</a>
            </Tooltip>
          ),
          duration: null
        })
      if (sqlValidation.code === 200) {
        lastSuccessExecutedSql = editingRule.leftSql
      }
    }
    if (editingRule && editingRule.id === +ruleId) {
      if (init) {
        props.onLoadSourceDatabases(editingRule.sourceId)
        lastSuccessExecutedSql = editingRule.leftSql
        return {
          init: false,
          sqlValidationCode: sqlValidation.code,
          lastSuccessExecutedSql
        }
      }
    }
    return { sqlValidationCode: sqlValidation.code, lastSuccessExecutedSql }
  }

  public componentDidMount () {
    this.props.onHideNavigator()
  }

  public componentWillUnmount () {
    this.props.onResetState()
    notification.destroy()
  }

  private executeSql = () => {
    RuleEditor.ExecuteSql(this.props)
  }

  private static ExecuteSql = (props: IRuleEditorProps) => {
    const { onExecuteSql, editingRule, editingRuleInfo, sqlLimit } = props
    const { sourceId, leftSql, rightSql } = editingRule
    const { variable,correlation } = editingRuleInfo
    const { condition } = correlation
    const updatedParams: IExecuteSqlParams = {
      sourceId,
      leftSql,
      rightSql,
      limit: sqlLimit,
      variables: variable,
      condition: condition
    }
    onExecuteSql(updatedParams)
  }

  private stepChange = (step: number,type: number) => {
    const { currentStep } = this.state
    if (currentStep + step < 0) {
      this.goToRuleList()
      return
    }
    const { editingRule } = this.props
    const { name, sourceId, leftSql, rightSql } = editingRule
    const errorMessages = ['名称不能为空', '请选择数据源', 'sql不能同时为空']
    const sql = leftSql || rightSql
    const fieldsValue = [name, sourceId, sql]
    const hasError = fieldsValue.some((val, idx) => {
      if (!val) {
        message.error(errorMessages[idx])
        return true
      }
    })
    if (hasError) { return }
    this.setState({ currentStep: currentStep + step,type: type }, () => {
      if (this.state.currentStep > 1) {
        this.saveRule()
      }
    })
  }
  
  private saveRule = () => {
    const { onAddRule, onEditRule, editingRule, editingRuleInfo, projectRoles, params } = this.props
    const { pid: projectId } = params
    const { model, variable, roles, correlation, toolbox ,action} = editingRuleInfo
    const { type } = this.state
    const { id: ruleId } = editingRule
    const validRoles = roles.filter(({ roleId }) => projectRoles && projectRoles.findIndex(({ id }) => id === roleId) >= 0)
    action['type'] = type
    const updatedRule: IRule = {
      ...editingRule,
      projectId: +projectId,
      model: JSON.stringify(model),
      action: JSON.stringify(action),
      variable: JSON.stringify(variable),
      correlation: JSON.stringify(correlation),
      toolbox: JSON.stringify(toolbox),
      roles: validRoles.map<IRuleRoleRaw>(({ roleId, columnAuth, rowAuth }) => {
        const validColumnAuth = columnAuth.filter((c) => !!model[c])
        const validRowAuth = rowAuth.filter((r) => {
          const v = variable.find((v) => v.name === r.name)
          if (!v) { return false }
          return (v.type === RuleVariableTypes.Authorization && !v.fromService)
        })
        return {
          roleId,
          columnAuth: JSON.stringify(validColumnAuth),
          rowAuth: JSON.stringify(validRowAuth)
        }
      })
    }
    ruleId ? onEditRule(updatedRule, this.goToRuleList) : onAddRule(updatedRule, this.goToRuleList)
  }

  private goToRuleList = () => {
    const { router, params } = this.props
    const { pid: projectId } = params
    router.push(`/project/${projectId}/rules`)
  }

  private ruleChange = (leftPropName: keyof IRule, leftSql: string | number,rightPropName: keyof IRule, rightSql: string | number) => {
    const { editingRule, onUpdateEditingRule } = this.props
    if(leftSql==null){
    	leftSql = editingRule.leftSql
    }
    if(rightSql==null){
    	rightSql = editingRule.rightSql
    }
    const updatedRule = {
      ...editingRule,
      [leftPropName]: leftSql,
      [rightPropName]: rightSql
    }
    onUpdateEditingRule(updatedRule)
  }

  private sqlGroupChange = (leftSql: string,rightSql: string) => {
    this.ruleChange('leftSql', leftSql,'rightSql', rightSql)
  }

  private actionChange = (partialModel: IRuleAction) => {
    const { editingRuleInfo, onUpdateEditingRuleInfo } = this.props
    const { action } = editingRuleInfo
    const updatedRuleInfo: IRuleInfo = {
      ...editingRuleInfo,
      action: { ...action, ...partialModel }
    }
    onUpdateEditingRuleInfo(updatedRuleInfo)
  }

  private variableChange = (updatedVariable: IRuleVariable[]) => {
    const { editingRuleInfo, onUpdateEditingRuleInfo } = this.props
    const updatedRuleInfo: IRuleInfo = {
      ...editingRuleInfo,
      variable: updatedVariable
    }
    onUpdateEditingRuleInfo(updatedRuleInfo)
  }
  
  private correlationChange = (updatedCorrelation: IRuleCorrelation) => {
    const { editingRuleInfo, onUpdateEditingRuleInfo } = this.props
    const updatedRuleInfo: IRuleInfo = {
      ...editingRuleInfo,
      correlation: updatedCorrelation
    }
    onUpdateEditingRuleInfo(updatedRuleInfo)
  }
  
  private toolboxChange = (updatedToolbox: IRuleToolbox) => {
  	const { editingRuleInfo, onUpdateEditingRuleInfo } = this.props
    const updatedRuleInfo: IRuleInfo = {
      ...editingRuleInfo,
      toolbox: updatedToolbox
    }
    onUpdateEditingRuleInfo(updatedRuleInfo)
  }

  private ruleRoleChange = (ruleRole: IRuleRole) => {
    const { editingRuleInfo, onUpdateEditingRuleInfo } = this.props
    const { roles } = editingRuleInfo
    const updatedRoles = roles.filter((role) => role.roleId !== ruleRole.roleId)
    updatedRoles.push(ruleRole)
    const updatedRuleInfo = {
      ...editingRuleInfo,
      roles: updatedRoles
    }
    onUpdateEditingRuleInfo(updatedRuleInfo)
  }

  private getSqlHints = memoizeOne((sourceId: number, schema: ISchema, variables: IRuleVariable[]) => {
    if (!sourceId) { return {} }

    const variableHints = variables.reduce((acc, v) => {
      acc[`$${v.name}$`] = []
      return acc
    }, {})
    const { mapDatabases, mapTables, mapColumns } = schema
    if (!mapDatabases[sourceId]) { return {} }

    const tableHints: { [tableName: string]: string[] } = Object.values(mapTables).reduce((acc, tablesInfo) => {
      if (tablesInfo.sourceId !== sourceId) { return acc }

      tablesInfo.tables.forEach(({ name: tableName }) => {
        acc[tableName] = []
      })
      return acc
    }, {})

    Object.values(mapColumns).forEach((columnsInfo) => {
      if (columnsInfo.sourceId !== sourceId) { return }
      const { tableName, columns } = columnsInfo
      if (tableHints[tableName]) {
        tableHints[tableName] = tableHints[tableName].concat(columns.map((col) => col.name))
      }
    })

    const hints = {
      ...variableHints,
      ...tableHints
    }
    return hints
  })

  public render () {
    const {
      sources, schema,
      sqlDataSource, sqlLimit, loading, projectRoles,
      channels, tenants, bizs,
      editingRule, editingRuleInfo,
      onLoadSourceDatabases, onLoadDatabaseTables, onLoadTableColumns, onSetSqlLimit,
      onLoadDacTenants, onLoadDacBizs } = this.props
    const { currentStep, lastSuccessExecutedSql } = this.state
    const { model, variable, roles: ruleRoles, correlation, toolbox, action } = editingRuleInfo
    const sqlHints = this.getSqlHints(editingRule.sourceId, schema, variable)
    const containerVisible = !currentStep
    const modelAuthVisible = !!currentStep
    
    const nextDisabled = (editingRule.leftSql !== lastSuccessExecutedSql)
    return (
      <>
        <Helmet title="Rule" />
        <div className={Styles.ruleEditor}>
          <div className={Styles.header}>
            <div className={Styles.steps}>
              <EditorSteps current={currentStep} />
            </div>
          </div>
          <EditorContainer
            visible={containerVisible}
            variable={variable}
            onVariableChange={this.variableChange}
            correlation={correlation} 
            onCorrelationChange={this.correlationChange}
            onToolboxChange={this.toolboxChange}
          >
            <SourceTable
              rule={editingRule}
              sources={sources}
              schema={schema}
              onRuleChange={this.ruleChange}
              onSourceSelect={onLoadSourceDatabases}
              onDatabaseSelect={onLoadDatabaseTables}
              onTableSelect={onLoadTableColumns}
            />
            <SqlEditor leftSql={editingRule.leftSql} rightSql={editingRule.rightSql} hints={sqlHints} onSqlGroupChange={this.sqlGroupChange} />
            <SpacebarModal channels={channels} tenants={tenants} bizs={bizs} onLoadDacTenants={onLoadDacTenants} onLoadDacBizs={onLoadDacBizs} />
            <CorrelationModal correlation={correlation} channels={channels} tenants={tenants} bizs={bizs} onLoadDacTenants={onLoadDacTenants} onLoadDacBizs={onLoadDacBizs} />
            <ToolboxModal toolbox={toolbox} channels={channels} tenants={tenants} bizs={bizs} onLoadDacTenants={onLoadDacTenants} onLoadDacBizs={onLoadDacBizs} />
            <VariableModal channels={channels} tenants={tenants} bizs={bizs} onLoadDacTenants={onLoadDacTenants} onLoadDacBizs={onLoadDacBizs} />
            <SqlPrerule size="small" loading={loading.execute} response={sqlDataSource} correlation={correlation} toolbox={toolbox} />
            <EditorBottom
              sqlLimit={sqlLimit}
              loading={loading.execute}
              nextDisabled={nextDisabled}
              onSetSqlLimit={onSetSqlLimit}
              onExecuteSql={this.executeSql}
              onStepChange={this.stepChange}
            />
            
          </EditorContainer>
          <ModelAuth visible={modelAuthVisible}
            	model={model}
            	action={action}
            	variable={variable}
            	sqlColumns={sqlDataSource.columns}
            	roles={projectRoles}
            	ruleRoles={ruleRoles}
            	onActionChange={this.actionChange}
            	onRuleRoleChange={this.ruleRoleChange}	
            	onStepChange={this.stepChange}
          	>
          		<SqlEditor sql={action.sql} currentStep={ currentStep } hints={sqlHints}  />
          	</ModelAuth>
        </div>
      </>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RuleActionType | SourceActionType | any>) => ({
  onHideNavigator: () => dispatch(hideNavigator()),
  onLoadRuleDetail: (ruleId: number) => dispatch(RuleActions.loadRulesDetail([ruleId], null, true)),
  onLoadSources: (projectId) => dispatch(SourceActions.loadSources(projectId)),
  onLoadSourceDatabases: (sourceId) => dispatch(SourceActions.loadSourceDatabases(sourceId)),
  onLoadDatabaseTables: (sourceId, databaseName) => dispatch(SourceActions.loadDatabaseTables(sourceId, databaseName)),
  onLoadTableColumns: (sourceId, databaseName, tableName) => dispatch(SourceActions.loadTableColumns(sourceId, databaseName, tableName)),
  onExecuteSql: (params) => dispatch(RuleActions.executeSql(params)),
  onAddRule: (rule, resolve) => dispatch(RuleActions.addRule(rule, resolve)),
  onEditRule: (rule, resolve) => dispatch(RuleActions.editRule(rule, resolve)),
  onUpdateEditingRule: (rule) => dispatch(RuleActions.updateEditingRule(rule)),
  onUpdateEditingRuleInfo: (ruleInfo: IRuleInfo) => dispatch(RuleActions.updateEditingRuleInfo(ruleInfo)),
  onSetSqlLimit: (limit: number) => dispatch(RuleActions.setSqlLimit(limit)),

  onLoadDacChannels: () => dispatch(RuleActions.loadDacChannels()),
  onLoadDacTenants: (channelName) => dispatch(RuleActions.loadDacTenants(channelName)),
  onLoadDacBizs: (channelName, tenantId) => dispatch(RuleActions.loadDacBizs(channelName, tenantId)),

  onResetState: () => dispatch(RuleActions.resetRuleState()),
  onLoadProjectRoles: (projectId) => dispatch(loadProjectRoles(projectId))
})

const mapStateToProps = createStructuredSelector({
  editingRule: makeSelectEditingRule(),
  editingRuleInfo: makeSelectEditingRuleInfo(),
  sources: makeSelectSources(),
  schema: makeSelectSchema(),
  sqlDataSource: makeSelectSqlDataSource(),
  sqlLimit: makeSelectSqlLimit(),
  sqlValidation: makeSelectSqlValidation(),
  loading: makeSelectLoading(),
  projectRoles: makeSelectProjectRoles(),

  correlation: makeSelectCorrelation(),
  toolbox: makeSelectToolbox(),
  action: makeSelectAction(),
  channels: makeSelectChannels(),
  tenants: makeSelectTenants(),
  bizs: makeSelectBizs()
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)
const withReducer = injectReducer({ key: 'rule', reducer })
const withSaga = injectSaga({ key: 'rule', saga: sagas })
const withReducerSource = injectReducer({ key: 'source', reducer: reducerSource })
const withSagaSource = injectSaga({ key: 'source', saga: sagasSource })
const withReducerProject = injectReducer({ key: 'project', reducer: reducerProject })
const withSagaProject = injectSaga({ key: 'project', saga: sagasProject })

export default compose(
  withReducer,
  withReducerSource,
  withSaga,
  withSagaSource,
  withReducerProject,
  withSagaProject,
  withConnect
)(RuleEditor)
