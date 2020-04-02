import React from 'react'
import { List, Icon, Tooltip, Popconfirm, Tag } from 'antd'

import { IViewVariable } from 'containers/View/types'
import { ViewVariableTypes } from '../constants'

import Styles from '../View.less'

export interface ISpacebarModalProps {
  variables: IViewVariable[]
  className?: string
  onAdd?: () => void
  onDelete?: (key: string) => void
  onEdit?: (variable: IViewVariable) => void
}

export class SpacebarModal extends React.Component<ISpacebarModalProps> {

  private onAdd = () => {
  	console.log("------------100---------")
  	console.log(this)
    this.setState({
      editingVariable: null,
      variableModalVisible: true
    })
  }

  public render () {
    const { className, onAdd } = this.props
    console.log("-----------90---")
    console.log(this.props)
     return (
      <div className="icons-list">
    	<Icon type="code" title="代码生成" />
    	<Icon type="table" onClick={this.onAdd} title="关联关系" />
  	  </div>
    )
  }

}

export default SpacebarModal
