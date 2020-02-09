
import React from 'react'
import { EditableCellInputTypes } from './types'
import { Input, Form, InputNumber, Checkbox } from 'antd'
const FormItem = Form.Item
import { WrappedFormUtils } from 'antd/lib/form/Form'
import { EditableContext } from './util'

const renderInputControl = (inputType: EditableCellInputTypes, autoFocus: boolean) => {
  switch (inputType) {
    case 'input':
      return <Input autoFocus={autoFocus} />
    case 'inputNumber':
      return <InputNumber />
    case 'checkbox':
      return <Checkbox />
    // @TODO other inputType cell render
    default:
      return <Input autoFocus={autoFocus}/>
  }
}

interface IEditableCellProps<T> {
  editing: boolean
  dataIndex: string
  inputType: EditableCellInputTypes
  record: T
  index: number
  autoFocus: boolean
}

const EditableCell: React.FC<IEditableCellProps<object>> = (props) => {

  const { editing, dataIndex, inputType, record, index, autoFocus, children, ...restProps } = props

  const renderCell = (form: WrappedFormUtils) => (
    <td {...restProps}>
      {editing ? (
        <FormItem style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [{ required: true, message: '不能为空' }],
            initialValue: record[dataIndex],
            valuePropName: inputType === 'checkbox' ? 'checked' : 'value'
          })(renderInputControl(inputType, !!autoFocus))}
        </FormItem>
      ) : children}
    </td>
  )

  return (
    <EditableContext.Consumer>
      {renderCell}
    </EditableContext.Consumer>
  )
}

export default EditableCell
