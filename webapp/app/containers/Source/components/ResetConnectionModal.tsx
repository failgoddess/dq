

import React, { useCallback, useRef, useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
const FormItem = Form.Item
import { FormComponentProps } from 'antd/lib/form'

import { SourceResetConnectionProperties } from './types'
import { ISource } from '../types'

const formItemStyle = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

interface IResetConnectionModalProps extends FormComponentProps {
  visible: boolean
  source: ISource
  onConfirm: (properties: SourceResetConnectionProperties) => void
  onCancel: () => void
}

const ResetConnectionModal: React.FC<IResetConnectionModalProps> = (props) => {
  const { form, source, visible, onConfirm, onCancel } = props
  if (!source) {
    return null
  }

  const usernameRef = useRef<Input>(null)
  useEffect(
    () => {
      if (visible && usernameRef.current) {
        usernameRef.current.focus()
      }
    },
    [visible]
  )

  const { getFieldDecorator } = form

  const save = useCallback(
    () => {
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        const { id: sourceId } = source
        const { username, password } = values
        onConfirm({ sourceId, username, password })
      })
    },
    [source, onConfirm]
  )

  const resetForm = useCallback(() => {
    form.resetFields()
  }, [])

  return (
    <Modal
      title={`重置 ${source.name} 连接`}
      wrapClassName="ant-modal-small"
      maskClosable={false}
      visible={visible}
      afterClose={resetForm}
      onCancel={onCancel}
      onOk={save}
    >
      <Form>
        <FormItem label="用户名" {...formItemStyle}>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: '用户名不能为空' }],
            initialValue: ''
          })(
            // use 'new-[fieldname]' to avoid auto complete in Chrome
            // https://bugs.chromium.org/p/chromium/issues/detail?id=370363#c7
            <Input ref={usernameRef} autoFocus autoComplete="new-username" />
          )}
        </FormItem>
        <FormItem label="密码" {...formItemStyle}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '密码不能为空' }],
            initialValue: ''
          })(<Input.Password autoComplete="new-password" />)}
        </FormItem>
      </Form>
    </Modal>
  )
}

export default Form.create<IResetConnectionModalProps>()(ResetConnectionModal)
