import React from 'react'
import { Modal, Form, Input, Select, Checkbox, Button, Row, Col } from 'antd'
const FormItem = Form.Item
const TextArea = Input.TextArea
const { Option } = Select
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { FormComponentProps } from 'antd/lib/form/Form'
import ConditionValuesControl, { ConditionValueTypes } from 'components/ConditionValuesControl'
import {
  IViewCorrelation,
  IDacChannel, IDacTenant, IDacBiz
} from 'containers/View/types'
import OperatorTypes from 'utils/operatorTypes'
import { ViewVariableTypes, ViewVariableTypesLocale, ViewVariableValueTypes, ViewVariableValueTypesLocale } from 'containers/View/constants'

export interface ICorrelationModalProps {
  visible?: boolean
  correlation?: IViewCorrelation

  channels: IDacChannel[]
  tenants: IDacTenant[]
  bizs: IDacBiz[]

  onCancel?: () => void
  onSave?: (correlation: IViewCorrelation) => void
  
  onLoadDacTenants: (channelName: string) => void
  onLoadDacBizs: (channelName: string, tenantId: number) => void
}

interface ICorrelationModalStates {
  operatorType: OperatorTypes
  selectedType: ViewVariableTypes
  selectedValueType: ViewVariableValueTypes
  defaultValues: ConditionValueTypes[]
  isUdf: boolean
  isFromService: boolean
}

const defaultCorrelation: IViewCorrelation = {
  key: '',
  name: '',
  alias: '',
  type: ViewVariableTypes.Query,
  valueType: ViewVariableValueTypes.String,
  defaultValues: [],
  udf: false,
  fromService: false,
  expression: ''
}

export class CorrelationModal extends React.Component<ICorrelationModalProps & FormComponentProps, ICorrelationModalStates> {

  private formItemStyle = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
  }

  public state: Readonly<ICorrelationModalStates> = {
    operatorType: OperatorTypes.In,
    selectedType: ViewVariableTypes.Query,
    selectedValueType: ViewVariableValueTypes.String,
    defaultValues: [],
    isUdf: false,
    isFromService: false
  }

  public componentDidUpdate (prevProps: ICorrelationModalProps & FormComponentProps) {
    const { form, variable, visible, channels } = this.props
    if (variable !== prevProps.variable || visible !== prevProps.visible) {
      const { type, valueType, defaultValues, udf, fromService, channel } = variable || defaultCorrelation
      if (channel && visible) {
        const { name: channelName, tenantId } = channel
        const { onLoadDacTenants, onLoadDacBizs } = this.props
        onLoadDacTenants(channelName)
        onLoadDacBizs(channelName, tenantId)
      }
      this.setState({
        selectedType: type,
        selectedValueType: valueType,
        defaultValues: defaultValues || [],
        isUdf: udf,
        isFromService: fromService && channels.length > 0
      }, () => {
        form.setFieldsValue(variable || defaultCorrelation)
      })
    }
  }
  
  private singleExpressionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({ expression: e.target.value })
  }

  private clearFieldsValue = () => {
    this.props.form.resetFields()
  }

  private save = () => {
    const { form,onSave } = this.props
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (!err) {
        const correlation = fieldsValue as IViewCorrelation
        correlation["expression"] = this.state.expression
        onSave(correlation)
      }
    })
  }

  public render () {
    console.log("------------CorrelationModal--------------")
    const {
      visible, variable, onCancel, form,
      channels, tenants, bizs,
      onLoadDacTenants
    } = this.props
    const { getFieldDecorator } = form
    const { operatorType, selectedType, selectedValueType, defaultValues, isUdf, isFromService,expression } = this.state

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
        title={`${variable && variable.key ? '修改' : '新增'}关联关系`}
        wrapClassName="ant-modal-small"
        maskClosable={false}
        visible={visible}
        footer={modalButtons}
        onCancel={onCancel}
        afterClose={this.clearFieldsValue}
      >
        <Form>
            <FormItem label="表达式" {...this.formItemStyle}>
              <TextArea placeholder="请输入表达式" value={expression} onChange={this.singleExpressionChange} rows={3} />
            </FormItem>
        </Form>
      </Modal>
    )
  }

}

export default Form.create<ICorrelationModalProps & FormComponentProps>()(CorrelationModal)
