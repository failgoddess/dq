import React from 'react'
import { Modal, Form, Button, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { IRuleBase } from '../types'
const FormItem = Form.Item

interface ICopyModalProps extends FormComponentProps<IRuleBase> {
  visible: boolean
  loading: boolean
  fromRule: IRuleBase
  onCheckUniqueName: (ruleName: string, resolve: () => void, reject: (err: string) => void) => void
  onCopy: (rule: IRuleBase) => void
  onCancel: () => void
}

export class CopyModal extends React.PureComponent<ICopyModalProps> {
  private formItemStyle = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
  }

  private save = () => {
    const { form, fromRule, onCopy } = this.props
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) { return }
      const copyRule: IRuleBase = { ...fieldsValue, id: fromRule.id }
      onCopy(copyRule)
    })
  }

  private checkName = (_, value, callback) => {
    const { onCheckUniqueName } = this.props
    onCheckUniqueName(value, () => {
      callback()
    }, (err) => {
      callback(err)
    })
  }

  private clearFieldsValue = () => {
    this.props.form.resetFields()
  }

  public render () {
    const { form, visible, loading, fromRule, onCancel } = this.props
    const { getFieldDecorator } = form
    if (!fromRule) { return null }

    const modalButtons = [(
      <Button
        key="back"
        size="large"
        onClick={onCancel}
      >
        取 消
      </Button>
    ), (
      <Button
        disabled={loading}
        key="submit"
        size="large"
        type="primary"
        onClick={this.save}
      >
        保 存
      </Button>
    )]

    return (
      <Modal
        title="复制 Rule"
        wrapClassName="ant-modal-small"
        visible={visible}
        footer={modalButtons}
        onCancel={onCancel}
        afterClose={this.clearFieldsValue}
      >
        <Form>
          <FormItem label="新名称" {...this.formItemStyle}>
            {getFieldDecorator<IRuleBase>('name', {
              validateFirst: true,
              rules: [
                { required: true, message: '不能为空' },
                { validator: this.checkName }
              ],
              initialValue: `${fromRule.name}_copy`
            })(<Input />)}
          </FormItem>
          <FormItem label="描述" {...this.formItemStyle}>
            {getFieldDecorator<IRuleBase>('description', {
              initialValue: fromRule.description
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<ICopyModalProps>()(CopyModal)
