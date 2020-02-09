
import * as React from 'react'
import * as classnames from 'classnames'
import { connect } from 'react-redux'
import { Form, Row, Col, Input, Radio, Steps, Transfer } from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group
const Step = Steps.Step

// import { checkNameAction } from '../App/actions'
const utilStyles = require('assets/less/util.less')

interface IRoleFormProps {
  form: any
  type: string
  groupSource?: any[]
  groupTarget?: any[]
  onGroupChange?: (targets) => any
  organizationMembers?: any[]
  onCheckName?: (
    id: number,
    name: string,
    type: string,
    param?: any,
    resolve?: (res: any) => void,
    reject?: (err: any) => void
  ) => any
}

export class RoleForm extends React.PureComponent<IRoleFormProps, {}> {
  public render () {
    const {
      form,
      type
    } = this.props

    const { getFieldDecorator } = form
    const commonFormItemStyle = {
      labelCol: { span: 6 },
      wrapperCol: { span: 15 }
    }

    return (
      <Form>
        <Row>
          <Col span={24}>
            <FormItem className={utilStyles.hide}>
              {getFieldDecorator('id', {
                hidden: type === 'add'
              })(
                <Input />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="名称" {...commonFormItemStyle}>
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [{
                    required: true,
                    message: 'Name 不能为空'
                  }]
              })(
                <Input placeholder="Name" />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="描述" {...commonFormItemStyle}>
              {getFieldDecorator('description', {
                initialValue: ''
              })(
                <Input.TextArea placeholder="description" />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create()(RoleForm)






