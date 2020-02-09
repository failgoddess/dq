
import React, { PureComponent } from 'react'

import { Form, Input, Modal, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
const FormItem = Form.Item
const TextArea = Input.TextArea

const styles = require('../filter.less')

interface IOptionSettingFormProps {
  visible: boolean
  options: string
  onSave: () => void
  onCancel: () => void
}

export class OptionSettingForm extends PureComponent<IOptionSettingFormProps & FormComponentProps, {}> {

  public componentDidUpdate (prevProps: IOptionSettingFormProps & FormComponentProps) {
    const { form, options } = this.props
    if (options !== prevProps.options) {
      form.setFieldsValue({ options })
    }
  }

  public render () {
    const { form, visible, onSave, onCancel } = this.props
    const { getFieldDecorator } = form
    const placeholder = `请输入选项文本与值，用回车分隔，例如：\n北京 1\n上海 2\n天津 Tianjin\n`
    return (
      <Modal
        title="编辑自定义选项"
        visible={visible}
        wrapClassName={`ant-modal-small ${styles.optionsModal}`}
        onOk={onSave}
        onCancel={onCancel}
      >
        <Form>
          <FormItem className={styles.formItem}>
            {getFieldDecorator('options', {})(
              <TextArea
                placeholder={placeholder}
                autosize={{minRows: 5, maxRows: 10}}
              />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<IOptionSettingFormProps & FormComponentProps>()(OptionSettingForm)
