
import React from 'react'
import { compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import memoizeOne from 'memoize-one'
import Helmet from 'react-helmet'
import { Link, RouteComponentProps } from 'react-router'

import injectReducer from 'utils/injectReducer'
import injectSaga from 'utils/injectSaga'
import reducer from './reducer'
import sagas from './sagas'

import { checkNameUniqueAction } from 'containers/App/actions'
import { RuleActions, RuleActionType } from './actions'
import { makeSelectRules, makeSelectLoading } from './selectors'
import { makeSelectCurrentProject } from 'containers/Projects/selectors'

import ModulePermission from '../Account/components/checkModulePermission'
import { initializePermission } from '../Account/components/checkUtilPermission'

import { Table, Tooltip, Button, Row, Col, Breadcrumb, Icon, Popconfirm, message, Dropdown, Menu } from 'antd'
import { ColumnProps, PaginationConfig, SorterResult } from 'antd/lib/table'
import { ButtonProps } from 'antd/lib/button'
import Container from 'components/Container'
import Box from 'components/Box'
import SearchFilterDropdown from 'components/SearchFilterDropdown'
import CopyModal from './components/CopyModal'

import { IRouteParams } from 'app/routes'
import { IRuleBase, IRule, IRuleLoading } from './types'
import { IProject } from '../Projects'

import utilStyles from 'assets/less/util.less'

interface IRuleListStateProps {
  rules: IRuleBase[]
  currentProject: IProject
  loading: IRuleLoading
}

interface IRuleListDispatchProps {
  onLoadRules: (projectId: number) => void
  onDeleteRule: (ruleId: number, resolve: () => void) => void
  onCopyRule: (rule: IRuleBase, resolve: () => void) => void
  onCheckName: (data, resolve, reject) => void
}

type IRuleListProps = IRuleListStateProps & IRuleListDispatchProps & RouteComponentProps<{}, IRouteParams>

interface IRuleListStates {
  screenWidth: number
  tempFilterRuleName: string
  filterRuleName: string
  filterDropdownVisible: boolean
  tableSorter: SorterResult<IRuleBase>

  copyModalVisible: boolean
  copyFromRule: IRuleBase
}

export class RuleList extends React.PureComponent<IRuleListProps, IRuleListStates> {

  public state: Readonly<IRuleListStates> = {
    screenWidth: document.documentElement.clientWidth,
    tempFilterRuleName: '',
    filterRuleName: '',
    filterDropdownVisible: false,
    tableSorter: null,

    copyModalVisible: false,
    copyFromRule: null
  }

  public componentWillMount () {
    this.loadRules()
    window.addEventListener('resize', this.setScreenWidth, false)
  }

  private loadRules = () => {
    const { onLoadRules, params } = this.props
    const { pid: projectId } = params
    if (projectId) {
      onLoadRules(+projectId)
    }
  }

  public componentWillUnmount () {
    window.removeEventListener('resize', this.setScreenWidth, false)
  }

  private setScreenWidth = () => {
    this.setState({ screenWidth: document.documentElement.clientWidth })
  }

  private getFilterRules = memoizeOne((ruleName: string, rules: IRuleBase[]) => {
    if (!Array.isArray(rules) || !rules.length) { return [] }
    const regex = new RegExp(ruleName, 'gi')
    const filterRules = rules.filter((v) => v.name.match(regex) || v.description.match(regex))
    return filterRules
  })

  private static getRulePermission = memoizeOne((project: IProject) => ({
    rulePermission: initializePermission(project, 'rulePermission'),
    AdminButton: ModulePermission<ButtonProps>(project, 'rule', true)(Button),
    EditButton: ModulePermission<ButtonProps>(project, 'rule', false)(Button)
  }))

  private getTableColumns = (
    { rulePermission, AdminButton, EditButton }: ReturnType<typeof RuleList.getRulePermission>
  ) => {
    const { rules } = this.props
    const { tempFilterRuleName, filterRuleName, filterDropdownVisible, tableSorter } = this.state
    const sourceNames = rules.map(({ sourceName }) => sourceName)

    const columns: Array<ColumnProps<IRuleBase>> = [{
      title: '名称',
      dataIndex: 'name',
      filterDropdown: (
        <SearchFilterDropdown
          placeholder="名称"
          value={tempFilterRuleName}
          onChange={this.filterRuleNameChange}
          onSearch={this.searchRule}
        />
      ),
      filterDropdownVisible,
      onFilterDropdownVisibleChange: (visible: boolean) => this.setState({ filterDropdownVisible: visible }),
      sorter: (a, b) => (a.name > b.name ? 1 : -1),
      sortOrder: tableSorter && tableSorter.columnKey === 'name' ? tableSorter.order : void 0
    }, {
      title: '描述',
      dataIndex: 'description'
    }, {
      title: 'Source',
      dataIndex: 'sourceName',
      filterMultiple: false,
      onFilter: (val, record) => record.sourceName === val,
      filters: sourceNames
        .filter((name, idx) => sourceNames.indexOf(name) === idx)
        .map((name) => ({ text: name, value: name }))
    }]

    if (filterRuleName) {
      const regex = new RegExp(`(${filterRuleName})`, 'gi')
      columns[0].render = (text: string) => (
        <span
          dangerouslySetInnerHTML={{
            __html: text.replace(regex, `<span class="${utilStyles.highlight}">$1</span>`)
          }}
        />
      )
    }

    if (rulePermission) {
      columns.push({
        title: '操作',
        width: 150,
        className: utilStyles.textAlignCenter,
        render: (_, record) => (
          <span className="ant-table-action-column">
            <Tooltip title="复制">
              <EditButton icon="copy" shape="circle" type="ghost" onClick={this.copyRule(record)} />
            </Tooltip>
            <Tooltip title="修改">
              <EditButton icon="edit" shape="circle" type="ghost" onClick={this.editRule(record.id)} />
            </Tooltip>
            <Popconfirm
              title="确定删除？"
              placement="bottom"
              onConfirm={this.deleteRule(record.id)}
            >
              <Tooltip title="删除">
                <AdminButton icon="delete" shape="circle" type="ghost" />
              </Tooltip>
            </Popconfirm>
          </span>
        )
      })
    }

    return columns
  }

  private tableChange = (_1, _2, sorter: SorterResult<IRuleBase>) => {
    this.setState({ tableSorter: sorter })
  }

  private filterRuleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      tempFilterRuleName: e.target.value,
      filterRuleName: ''
    })
  }

  private searchRule = (value: string) => {
    this.setState({
      filterRuleName: value,
      filterDropdownVisible: false
    })
    window.event.preventDefault()
  }

  private basePagination: PaginationConfig = {
    defaultPageSize: 20,
    showSizeChanger: true
  }

  // private addRule = () => {
  //  const { router, params } = this.props
  //  router.push(`/project/${params.pid}/rule`)
  // }

  private copyRule = (fromRule: IRuleBase) => () => {
    this.setState({
      copyModalVisible: true,
      copyFromRule: fromRule
    })
  }

  private copy = (rule: IRuleBase) => {
    const { onCopyRule } = this.props
    onCopyRule(rule, () => {
      this.setState({
        copyModalVisible: false
      })
      message.info('Rule 复制成功')
    })
  }

  private cancelCopy = () => {
    this.setState({ copyModalVisible: false })
  }

  private editRule = (ruleId: number) => () => {
    const { router, params } = this.props
    router.push(`/project/${params.pid}/rule/${ruleId}`)
  }

  private deleteRule = (ruleId: number) => () => {
    const { onDeleteRule } = this.props
    onDeleteRule(ruleId, () => {
      this.loadRules()
    })
  }

  private checkRuleUniqueName = (ruleName: string, resolve: () => void, reject: (err: string) => void) => {
    const { currentProject, onCheckName } = this.props
    onCheckName({ name: ruleName, projectId: currentProject.id }, resolve, reject)
  }
  
  private getRuleMenus = () => {
  	const { router, params } = this.props
    const menu = (
    	<Menu>
		<Menu.Item key='difference' style={{ fontSize: '16px' }}>
			<Link to={`/project/${params.pid}/rule`}>
				<i className={`iconfont ${'sortascending'}`}/> 差异检查
        	</Link>
      	</Menu.Item>
      	<Menu.Item key='fluctuate' style={{ fontSize: '16px' }}>
			<Link to={`/project/${params.pid}/fluctuates`}>
				<i className={`iconfont ${'sortdescending'}`}/> 波动检查
        	</Link>
      	</Menu.Item>
  		</Menu>
	);

    return menu
  }

  public render () {
    const { currentProject, rules, loading } = this.props
    const { screenWidth, filterRuleName } = this.state
    const { rulePermission, AdminButton, EditButton } = RuleList.getRulePermission(currentProject)
    const tableColumns = this.getTableColumns({ rulePermission, AdminButton, EditButton })
    const tablePagination: PaginationConfig = {
      ...this.basePagination,
      simple: screenWidth <= 768
    }
    const filterRules = this.getFilterRules(filterRuleName, rules)
    const ruleMenus = this.getRuleMenus()
    const { copyModalVisible, copyFromRule } = this.state

    return (
      <>
        <Container>
          <Helmet title="Rule" />
          <Container.Title>
            <Row>
              <Col span={24}>
                <Breadcrumb className={utilStyles.breadcrumb}>
                  <Breadcrumb.Item>
                    <Link to="">Rule</Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
          </Container.Title>
          <Container.Body>
            <Box>
              <Box.Header>
                <Box.Title>
                  <Icon type="bars" />
                  列表
                </Box.Title>
                <Box.Tools>
                  <Tooltip placement="topLeft" title="新增">
                  	<Dropdown overlay={ruleMenus} placement="bottomLeft">
      					<AdminButton type="primary" icon="plus"/>
    				</Dropdown>
                  </Tooltip>
                </Box.Tools>
              </Box.Header>
              <Box.Body>
                <Row>
                  <Col span={24}>
                    <Table
                      bordered
                      rowKey="id"
                      loading={loading.rule}
                      dataSource={filterRules}
                      columns={tableColumns}
                      pagination={tablePagination}
                      onChange={this.tableChange}
                    />
                  </Col>
                </Row>
              </Box.Body>
            </Box>
          </Container.Body>
        </Container>
        <CopyModal
          visible={copyModalVisible}
          loading={loading.copy}
          fromRule={copyFromRule}
          onCheckUniqueName={this.checkRuleUniqueName}
          onCopy={this.copy}
          onCancel={this.cancelCopy}
        />
      </>
    )
  }

}

const mapDispatchToProps = (dispatch: Dispatch<RuleActionType>) => ({
  onLoadRules: (projectId) => dispatch(RuleActions.loadRules(projectId)),
  onDeleteRule: (ruleId, resolve) => dispatch(RuleActions.deleteRule(ruleId, resolve)),
  onCopyRule: (rule, resolve) => dispatch(RuleActions.copyRule(rule, resolve)),
  onCheckName: (data, resolve, reject) => dispatch(checkNameUniqueAction('rule', data, resolve, reject))
})

const mapStateToProps = createStructuredSelector({
  rules: makeSelectRules(),
  currentProject: makeSelectCurrentProject(),
  loading: makeSelectLoading()
})

const withConnect = connect<IRuleListStateProps, IRuleListDispatchProps, RouteComponentProps<{}, IRouteParams>>(mapStateToProps, mapDispatchToProps)
const withReducer = injectReducer({ key: 'rule', reducer })
const withSaga = injectSaga({ key: 'rule', saga: sagas })

export default compose(
  withReducer,
  withSaga,
  withConnect
)(RuleList)
