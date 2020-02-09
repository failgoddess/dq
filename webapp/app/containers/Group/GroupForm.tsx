

import React from 'react'
import { connect } from 'react-redux'
import { checkNameAction } from '../App/actions'
import { Form, Row, Col, Input } from 'antd'
const FormItem = Form.Item
const TextArea = Input.TextArea

const utilStyles = require('assets/less/util.less')

interface IGroupFormProps {
  type: string
  form: any
  onCheckName: (id: number, name: string, type: string, param?: any, resolve?: (res: any) => void, reject?: (err: any) => void) => any
}

export class GroupForm extends React.PureComponent<IGroupFormProps, {}> {
  private checkNameUnique = (rule, value = '', callback) => {
    const { onCheckName, type } = this.props
    const { getFieldsValue } = this.props.form
    const { id } = getFieldsValue()
    const idName = type === 'add' ? '' : id
    const typeName = 'group'
    onCheckName(idName, value, typeName,
      () => {
        callback()
      }, (err) => {
        callback(err)
      })
  }

  public render () {
    const { getFieldDecorator } = this.props.form
    const commonFormItemStyle = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }

    return (
      <Form>
        <Row gutter={8}>
          <Col span={24}>
            <FormItem className={utilStyles.hide}>
              {getFieldDecorator('id', {
                hidden: this.props.type === 'add'
              })(
                <Input />
              )}
            </FormItem>
            <FormItem label="名称" {...commonFormItemStyle}>
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: 'Name 不能为空'
                }, {
                  validator: this.checkNameUnique
                }]
              })(
                <Input placeholder="Name" />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem label="描述" {...commonFormItemStyle}>
              {getFieldDecorator('desc', {
                initialValue: ''
              })(
                <TextArea
                  placeholder="Description"
                  autosize={{minRows: 2, maxRows: 6}}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onCheckName: (id, name, type, param, resolve, reject) => dispatch(checkNameAction(id, name, type, param, resolve, reject))
  }
}

export default Form.create()(connect(null, mapDispatchToProps)(GroupForm))
