import React from 'react'
import { Modal, Form, Input, Select, Checkbox, Button, Row, Col,Tabs } from 'antd'
const FormItem = Form.Item
const TextArea = Input.TextArea
const { Option } = Select
const { TabPane } = Tabs
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
    expressionPair:{},
    condition:''
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
  
  private singleConditionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({"condition":e.target.value})
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
        correlation["condition"] = this.state.condition
        correlation["conditionDict"] = this.state.condition
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
  
  private strToDict = (condition: string) => {
  	var expressionDict = {}
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
  
  private callback = (key) => {
  	console.log(key);
  }

  public render () {
    const { visible, onCancel, form, channels, tenants, bizs, onLoadDacTenants, correlation } = this.props
    const { isFromService,expression,condition } = this.state

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
	console.log("--------------------")
	console.log(correlation)
    return (
      <Modal
        title={`${correlation ? '修改' : '新增'}关联关系`}
        wrapClassName="ant-modal-small"
        maskClosable={false}
        visible={visible}
        footer={modalButtons}
        onCancel={onCancel}
        afterClose={this.clearFieldsValue}
         bodyStyle={{ padding: "0px 24px" }}
      >
      	<Tabs defaultActiveKey="condition" onChange={this.callback} >
    		<TabPane tab="关联条件" key="condition">
      			<Form>
            		<FormItem {...this.formItemStyle}>
              			<TextArea placeholder="请输入关联条件" value={condition} onChange={this.singleConditionChange} rows={6} />
            		</FormItem>
        		</Form>
    		</TabPane>
    		<TabPane tab="表达式" key="expression">
      			<Form>
            		<FormItem {...this.formItemStyle}>
              			<TextArea placeholder="请输入表达式" value={expression} onChange={this.singleExpressionChange} rows={6} />
            		</FormItem>
        		</Form>
    		</TabPane>
  		</Tabs>
        
      </Modal>
    )
  }
}

export default Form.create<ICorrelationModalProps & FormComponentProps>()(CorrelationModal)
