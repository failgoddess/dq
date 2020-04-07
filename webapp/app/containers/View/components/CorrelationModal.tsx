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
import { ViewCorrelationValueTypes } from 'containers/View/constants'

export interface ICorrelationModalProps {
  visible?: boolean
  correlation: IViewCorrelation

  channels: IDacChannel[]
  tenants: IDacTenant[]
  bizs: IDacBiz[]

  onCancel?: () => void
  onSave?: (correlation: IViewCorrelation) => void
  
  onLoadDacTenants: (channelName: string) => void
  onLoadDacBizs: (channelName: string, tenantId: number) => void
}

interface ICorrelationModalStates {
  expression: ViewCorrelationValueTypes
}

const defaultCorrelation: IViewCorrelation = {
  key: '',
  name: '',
  alias: '',
  correlation:{
  	expression:'',
    expressionPair:{}
  }
}

export class CorrelationModal extends React.Component<ICorrelationModalProps & FormComponentProps, ICorrelationModalStates> {

  private formItemStyle = {
    labelCol: { span: 3 },
    wrapperCol: { span: 21 }
  }

  public state: Readonly<ICorrelationModalStates> = {
    expression: ViewCorrelationValueTypes.String
  }

  public componentDidUpdate (prevProps: ICorrelationModalProps & FormComponentProps) {
    const { form, visible, channels, correlation } = this.props
    if (visible !== prevProps.visible || correlation !== prevProps.correlation) {
      const { expression } = correlation || defaultCorrelation
      this.setState({
        expression: expression
      }, () => {
        form.setFieldsValue(correlation || defaultCorrelation)
      })
    }
  }
  
  private singleExpressionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({"expression":e.target.value})
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
        correlation["expressionPair"] = this.strToPair(this.state.expression)
        onSave(correlation)
      }
    })
  }
  
  private strToPair = (expression: string) => {
  	var expressionPair = {}
  	if (typeof(expression) != "undefined") {
  		var expressionArr = expression.split(",")
		for(var i in expressionArr){
    		var pa = expressionArr[i].split(/ +as +/)
    		if(pa.length>1){
    			expressionPair[pa[1].trim()] =  pa[0].trim()
    		}else{
    			expressionPair[pa[0].trim()] =  pa[0].trim()
    		}
    	}
	}
	return expressionPair
  }

  public render () {
  	console.log("--------------------")
    const { visible, onCancel, form, channels, tenants, bizs, onLoadDacTenants,correlation } = this.props
    const { isFromService,expression } = this.state

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
        title={`${correlation && correlation.key ? '修改' : '新增'}关联关系`}
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
