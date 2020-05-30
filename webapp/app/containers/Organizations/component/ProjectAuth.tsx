
import * as React from 'react'
import * as classnames from 'classnames'
import { Icon, Button, Row, Col, Input, Select, Popconfirm, Table, Modal, Form, Radio } from 'antd'
const FormItem = Form.Item
const InputGroup = Input.Group
const RadioGroup = Radio.Group
const Option = Select.Option
const styles = require('../Project.less')
import { uuid } from 'utils/util'
const utilStyles =  require('assets/less/util.less')

interface IAuthProps {
  vizs?: any
  form?: any
  currentProjectRole?: object
  onChangeModulePermission?: (event: any, record: object) => any
  onChangeVizPermission?: (event: any, record: object) => any
}

export class Auth extends React.Component <IAuthProps, {}> {
  constructor (props) {
    super(props)
  }
  public render () {
    const role = 1
    const authModules = [ 'viz', 'view', 'source', 'widget', 'schedule', 'share', 'download', 'rule']
    console.log("--------111---------")
    console.log(this.props.currentProjectRole)
    const organizationMembers = authModules.map((auth, index) => {
      return {
        user: auth,
        permission: this.props.currentProjectRole ? this.props.currentProjectRole['permission'][`${auth}Permission`] : void 0
      }
    })
    const columns = [
      {
        dataIndex: 'user',
        key: 'user',
        render: (text) => text.toUpperCase()
      },
      {
          dataIndex: 'permission',
         // className: isHidden ? utilStyles.hide : '',
          key: 'settings',
          width: '59%',
          render: (text, record) => {
            switch (record.user) {
              case 'share':
              case 'download':
                return (
                  <Radio.Group size="small" disabled={!role} value={text} onChange={this.props.onChangeModulePermission.bind(this, record)}>
                    <Radio value={false}>禁止</Radio>
                    <Radio value={true}>允许</Radio>
                  </Radio.Group>
                )
              default:
                return (
                  <Radio.Group size="small" disabled={!role} value={text} onChange={this.props.onChangeModulePermission.bind(this, record)}>
                    <Radio value={0}>隐藏</Radio>
                    <Radio value={1}>只读</Radio>
                    <Radio value={2}>修改</Radio>
                    <Radio value={3}>删除</Radio>
                  </Radio.Group>
                )
            }
          }
      }]

    const dvColumns = [
    {
      dataIndex: 'key',
      key: `name${uuid(8, 16)}`
    },
    {
      dataIndex: 'name',
      key: `key${uuid(8, 16)}`,
      width: '59%',
      render: (text, record) => {
        const isTitle = record.isTitle
        if (!isTitle) {
          return (
            <Radio.Group size="small" value={record.permission} onChange={this.props.onChangeVizPermission.bind(this, record)}>
              <Radio value={0}>隐藏</Radio>
              <Radio value={1}>显示</Radio>
            </Radio.Group>
          )
        }
      }
    }
  ]

    return (
      <div className={styles.auth}>
        <div className={styles.module}>
          <div className={styles.title}>
            功能权限设置
          </div>
          <Table
              bordered
              showHeader={false}
              columns={columns}
              pagination={false}
              dataSource={organizationMembers}
          />
        </div>
        <div className={styles.dv}>
          <div className={styles.title}>
            可视化权限设置
          </div>
          <Table
              bordered
              rowKey="key"
              showHeader={false}
              columns={dvColumns}
              dataSource={this.props.vizs}
              pagination={false}
              defaultExpandAllRows={true}
          />
        </div>
      </div>
    )
  }
}

export default Auth





