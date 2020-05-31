import React from 'react'
import { areComponentsEqual } from 'react-hot-loader'
import classnames from 'classnames'
import memoizeOne from 'memoize-one'
import { Table, Tabs, Radio, Checkbox, Select, Row, Col, Button, Tag, Tooltip, Icon, Popconfirm } from 'antd'
const { Column } = Table
const { TabPane } = Tabs
const RadioGroup = Radio.Group
const { Option } = Select
import { RadioChangeEvent } from 'antd/lib/radio'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { TableProps, ColumnProps } from 'antd/lib/table'
import SqlEditor from './SqlEditor'
import PythonEditor from './PythonEditor'
import { IRuleVariable, IRuleModelProps, IRuleModel, IExecuteSqlResponse, IRuleRole, IRuleRoleRowAuth, IRuleAction } from '../types'
import {
  RuleModelTypesLocale,
  RuleVariableValueTypes,
  RuleModelVisualTypesLocale,
  RuleVariableTypes
} from '../constants'

import OperatorTypes from 'utils/operatorTypes'
import ConditionValuesControl, { ConditionValueTypes } from 'components/ConditionValuesControl'
import ModelAuthModal from './ModelAuthModal'
import Styles from '../Rule.less'

interface IRuleRoleRowAuthConverted {
  name: string
  values: Array<string | number | boolean>
  enable: boolean
  variable: IRuleVariable
}

interface IRuleRoleConverted {
  roleId: number
  roleName: string
  roleDesc: string
  columnAuth: string[]
  rowAuthConverted: {
    [variableName: string]: IRuleRoleRowAuthConverted
  }
}

interface IModelAuthProps {
  visible: boolean
  model: IRuleModel
  action: IRuleAction
  variable: IRuleVariable[]
  sqlColumns: IExecuteSqlResponse['columns']
  roles: any[] // @FIXME role typing
  ruleRoles: IRuleRole[]
  onActionChange: (partialModel: IRuleAction) => void
  onRuleRoleChange: (ruleRole: IRuleRole) => void
  onStepChange: (stepChange: number) => void
}

interface IModelAuthStates {
  modalVisible: boolean
  selectedRoleId: number
  selectedColumnAuth: string[]
  isAction: boolean
  actionType: number
  editorHeight: number
}

export class ModelAuth extends React.PureComponent<IModelAuthProps, IModelAuthStates> {
  private editor = React.createRef<HTMLDivElement>()
  
  public state: Readonly<IModelAuthStates> = {
    modalVisible: false,
    selectedRoleId: 0,
    selectedColumnAuth: [],
    isAction: true,
    actionType: 0,
    editorHeight: 0
  }

  private modelTypeOptions = Object.entries(RuleModelTypesLocale).map(([value, label]) => ({
    label,
    value
  }))

  private visualTypeOptions = Object.entries(RuleModelVisualTypesLocale).map(([visualType, text]) => (
    <Option key={visualType} value={visualType}>{text}</Option>
  ))

  private stepChange = (step: number,type: number) => () => {
    this.props.onStepChange(step, type)
  }

  private setColumnAuth = (ruleRole: IRuleRoleConverted) => () => {
    const { roleId, columnAuth } = ruleRole
    const { model } = this.props
    this.setState({
      modalVisible: true,
      selectedRoleId: roleId,
      selectedColumnAuth: columnAuth.filter((column) => !!model[column])
    })
  }

  private rowAuthCheckedChange = (roleId: number, rowAuthConverted: IRuleRoleRowAuthConverted) => (e: CheckboxChangeEvent) => {
    const checked = e.target.checked
    const { name, values } = rowAuthConverted
    const updatedRoleAuth: IRuleRoleRowAuth = {
      name,
      values,
      enable: checked
    }
    this.ruleRoleChange(roleId, updatedRoleAuth)
  }

  private rowAuthValuesChange = (roleId: number, rowAuthConverted: IRuleRoleRowAuthConverted) => (values: Array<string | number | boolean>) => {
    const { name, enable } = rowAuthConverted
    const updatedRoleAuth: IRuleRoleRowAuth = {
      name,
      values,
      enable
    }
    this.ruleRoleChange(roleId, updatedRoleAuth)
  }

  private ruleRoleChange = (roleId: number, updatedRoleAuth: IRuleRoleRowAuth) => {
    const { onRuleRoleChange, ruleRoles } = this.props
    let ruleRole = ruleRoles.find((v) => v.roleId === roleId)
    if (!ruleRole) {
      ruleRole = {
        roleId,
        columnAuth: [],
        rowAuth: [updatedRoleAuth]
      }
    } else {
      const variableIdx = ruleRole.rowAuth.findIndex((auth) => auth.name === updatedRoleAuth.name)
      if (variableIdx < 0) {
        ruleRole.rowAuth.push(updatedRoleAuth)
      } else {
        ruleRole.rowAuth[variableIdx].values = updatedRoleAuth.values
        ruleRole.rowAuth[variableIdx].enable = updatedRoleAuth.enable
      }
    }
    onRuleRoleChange({ ...ruleRole })
  }

  private getAuthTableColumns = memoizeOne((model: IRuleModel, variables: IRuleVariable[]) => {
    const columnsChildren = variables
      .filter((v) => (v.type === RuleVariableTypes.Authorization && !v.fromService))
      .map<ColumnProps<IRuleRoleConverted>>((variable) => ({
        title: `${variable.alias || variable.name}`,
        dataIndex: 'rowAuthConverted',
        width: 250,
        render: (_, record: IRuleRoleConverted) => {
          const { name: variableName, valueType } = variable
          const { roleId, rowAuthConverted } = record
          const { values: rowAuthValues, enable } = rowAuthConverted[variableName]
          const operatorType = (valueType === RuleVariableValueTypes.Boolean ? OperatorTypes.Equal : OperatorTypes.In)
          return (
            <div className={Styles.cellVarValue}>
              <Tooltip title={enable ? '禁用' : '启用'}>
                <Checkbox
                  checked={enable}
                  className={Styles.cellVarCheckbox}
                  onChange={this.rowAuthCheckedChange(roleId, rowAuthConverted[variableName])}
                />
              </Tooltip>
              {enable && (
                <ConditionValuesControl
                  className={Styles.cellVarInput}
                  size="default"
                  visualType={valueType}
                  operatorType={operatorType}
                  conditionValues={rowAuthValues}
                  onChange={this.rowAuthValuesChange(roleId, rowAuthConverted[variableName])}
                />
              )}
            </div>
          )
        }
      }))
    const columns: Array<ColumnProps<IRuleRoleConverted>> = [{
      title: '角色',
      dataIndex: 'roleName',
      width: 300,
      render: (roleName: string, record: IRuleRoleConverted) => (
        <span>
          {roleName}
          {record.roleDesc && (
            <Tooltip title={record.roleDesc}>
              <Icon className={Styles.cellIcon} type="info-circle" />
            </Tooltip>
          )}
        </span>
      )
    }]
    if (columnsChildren.length > 0) {
      columns.push({
        title: '权限变量值设置',
        children: columnsChildren
      })
    }
    columns.push({
      title: '可见字段',
      dataIndex: 'columnAuth',
      width: 120,
      render: (columnAuth: string[], record) => {
        if (columnAuth.length === 0) {
          return (<Tag onClick={this.setColumnAuth(record)}>全部可见</Tag>)
        }
        if (columnAuth.length === Object.keys(model).length) {
          return (<Tag onClick={this.setColumnAuth(record)} color="#f50">不可见</Tag>)
        }
        return (<Tag color="green" onClick={this.setColumnAuth(record)}>部分可见</Tag>)
      }
    })
    return columns
  })

  private getAuthTableScroll = memoizeOne((columns: Array<ColumnProps<any>>) => {
    const scroll: TableProps<any>['scroll'] = {}
    const columnsTotalWidth = columns.reduce((acc, c) => acc + (c.width as number), 0)
    scroll.x = columnsTotalWidth
    return scroll
  })

  private getAuthDatasource = (roles: any[], varibles: IRuleVariable[], ruleRoles: IRuleRole[]) => {
    if (!Array.isArray(roles)) { return [] }

    const authDatasource = roles.map<IRuleRoleConverted>((role) => {
      const { id: roleId, name: roleName, description: roleDesc } = role
      const ruleRole = ruleRoles.find((v) => v.roleId === roleId)
      const columnAuth = ruleRole ? ruleRole.columnAuth : []
      const rowAuthConverted = varibles.reduce<IRuleRoleConverted['rowAuthConverted']>((obj, variable) => {
        const { name: variableName, type, fromService } = variable
        if (type === RuleVariableTypes.Query) { return obj }
        if (type === RuleVariableTypes.Authorization && fromService) { return obj }

        const authIdx = ruleRole ? ruleRole.rowAuth.findIndex((auth) => auth.name === variableName) : -1
        obj[variableName] = {
          name: variableName,
          values: [],
          enable: false,
          variable
        }
        if (authIdx >= 0) {
          const { enable, values } = ruleRole.rowAuth[authIdx]
          obj[variableName] = {
            ...obj[variableName],
            enable,
            values
          }
        }
        return obj
      }, {})
      return {
        roleId,
        roleName,
        roleDesc,
        columnAuth,
        rowAuthConverted
      }
    })
    return authDatasource
  }

  private renderColumnModelType = (text: string, record) => (
    <RadioGroup
      options={this.modelTypeOptions}
      value={text}
      onChange={this.modelChange(record, 'modelType')}
    />
  )

  private renderColumnVisualType = (text: string, record) => (
    <Select
      className={Styles.tableControl}
      value={text}
      onChange={this.modelChange(record, 'visualType')}
    >
      {this.visualTypeOptions}
    </Select>
  )

  private saveModelAuth = (columnAuth: string[]) => {
    const { onRuleRoleChange, ruleRoles } = this.props
    const { selectedRoleId } = this.state
    let ruleRole = ruleRoles.find((v) => v.roleId === selectedRoleId)
    if (!ruleRole) {
      ruleRole = {
        roleId: selectedRoleId,
        columnAuth,
        rowAuth: []
      }
    } else {
      ruleRole = {
        ...ruleRole,
        columnAuth
      }
    }
    onRuleRoleChange(ruleRole)
    this.closeModelAuth()
  }

  private closeModelAuth = () => {
    this.setState({ modalVisible: false })
  }
  
  private sqlChange = (sql: string) => {
    const { onActionChange } = this.props
    const action = {sql: sql} as IRuleAction
	onActionChange(action)
  }
  
  private tabActionSelect = (key) => {
    if('action' == key){
    	this.setState({ isAction: true })
    }else{
    	this.setState({ isAction: false })
    }
  }
  
  private getChildren = (props: IEditorContainerProps, state: IEditorContainerStates) => {
    let sqlEditor: React.ReactElement<any>
    let pythonEditor: React.ReactElement<any>

    React.Children.forEach(props.children, (child) => {
      const c = child as React.ReactElement<any>
      const type = c.type as React.ComponentClass<any>
      if (areComponentsEqual(type, SqlEditor)) {
        // sqlEditor = c
        sqlEditor = React.cloneElement<ISqlEditorProps>(c, { id: "sql",name:"sql",styleDict: {"padding":"0px 0px 0px 16px"}, onSqlChange: this.sqlChange })
      } else if (areComponentsEqual(type, PythonEditor)) {
        pythonEditor = c
      }
       
    })

    return { sqlEditor, pythonEditor }
  }
  
  public componentDidMount () {
    window.addEventListener('resize', this.setEditorHeight, false)
    // @FIX for this init height, 64px is the height of the hidden navigator in Main.tsx
    const editorHeight = this.editor.current.clientHeight
    this.setState({
      editorHeight
    })
  }

  public render () {
    console.log("--------------------")
    const { visible, model, variable, ruleRoles, sqlColumns, roles, action } = this.props
    const { modalVisible, selectedColumnAuth, selectedRoleId, isAction, editorHeight } = this.state    
    const modelDatasource = Object.entries(model).map(([name, value]) => ({ name, ...value }))
    const authColumns = this.getAuthTableColumns(model, variable)
    const authScroll = this.getAuthTableScroll(authColumns)
    const authDatasource = this.getAuthDatasource(roles, variable, ruleRoles)
    const styleCls = classnames({
      [Styles.containerHorizontal]: true,
      [Styles.modelAuth]: true
    })
	const { sqlEditor, pythonEditor } = this.getChildren(this.props, this.state)
    const style = visible ? {} : { display: 'none' }
    return (
      <div className={styleCls} style={style}>
        <Tabs defaultActiveKey="action" className={Styles.authTab} onChange={this.tabActionSelect}>
          <TabPane tab="Action" key="action">
         	 <div className={Styles.actionEditor}>
          		<Tabs defaultActiveKey="sql" type="card" size="small" >
          			 <TabPane tab="SQL" key="sql">
              			<div className={Styles.containerVertical} style={{ height: '100%' }} ref={this.editor}>
          					{sqlEditor}
						</div>
          		 	</TabPane>
          		 	<TabPane tab="Python" key="python">
          		 		<div className={Styles.containerHorizontal} ref={this.editor}>
          		 			{pythonEditor}
              			</div>
          		 	</TabPane>
          		</Tabs>
          	</div>
          </TabPane>
          <TabPane tab="Auth" key="auth">
            <div className={Styles.authTable}>
              <Table
                bordered
                rowKey="roleId"
                pagination={false}
                columns={authColumns}
                scroll={authScroll}
                dataSource={authDatasource}
              />
            </div>
            <ModelAuthModal
              visible={modalVisible}
              model={model}
              roleId={selectedRoleId}
              auth={selectedColumnAuth}
              onSave={this.saveModelAuth}
              onCancel={this.closeModelAuth}
            />
          </TabPane>
        </Tabs>
        <Row className={Styles.bottom} type="flex" align="middle" justify="end">
          <Col span={12} className={Styles.toolBtns}>
            <Button type="primary" onClick={this.stepChange(-1,0)}>上一步</Button>
            <Button onClick={this.stepChange(-2,0)}>取消</Button>
            <Button onClick={this.stepChange(1,0)}>保存</Button>
            { isAction ? <Popconfirm key="executeSave" title="确定保存并执行执行吗？" placement="left" onConfirm={this.stepChange(3,3)} > <Button>保存并执行</Button> </Popconfirm> : '' }
          </Col>
        </Row>
      </div>
    )
  }
}

export default ModelAuth
