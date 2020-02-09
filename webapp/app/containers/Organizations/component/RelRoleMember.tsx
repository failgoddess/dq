
import * as React from 'react'
import { Form, Row, Col, Input, Radio, Steps, Transfer } from 'antd'

interface IRoleFormProps {
  form: any
  groupSource?: any[]
  groupTarget?: any[]
  onGroupChange?: (targets) => any
  organizationMembers?: any[]
}

export class RelRoleMember extends React.PureComponent<IRoleFormProps, {}> {

  private getTransferRowKey = (g) => g.user.id
  private transferRender = (item) => item.user.username
  private onTransferChange = (cb) => (nextTargetKeys, direction, moveKeys) => {
    cb(nextTargetKeys)
  }

  public render () {
    const {
      organizationMembers,
      groupTarget,
      onGroupChange
    } = this.props

    const groupTransfer =
    (
        <Transfer
          showSearch
          titles={['列表', '已选']}
          listStyle={{width: '210px'}}
          dataSource={organizationMembers}
          rowKey={this.getTransferRowKey}
          targetKeys={groupTarget}
          render={this.transferRender}
          onChange={this.onTransferChange(onGroupChange)}
        />
    )

    return (
      <Row>
        <Col span={24}>
          {groupTransfer}
        </Col>
      </Row>
    )
  }
}

export default Form.create()(RelRoleMember)






