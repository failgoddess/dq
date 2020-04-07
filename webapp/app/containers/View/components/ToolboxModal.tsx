import React from 'react'
import { List, Icon, Tooltip, Popconfirm, Tag } from 'antd'

import { IViewVariable } from 'containers/View/types'
import { ViewVariableTypes } from '../constants'

import Styles from '../View.less'

export interface IToolboxModalProps {
  variables: IViewVariable[]
  className?: string
  onAdd?: () => void
  onDelete?: (key: string) => void
  onEdit?: (variable: IViewVariable) => void
}

export class ToolboxModal extends React.Component<IToolboxModalProps> {

  private onAdd = () => {
  	console.log("------------100---------")
  	console.log(this)
    
  }

  public render () {
    const { className, onAdd } = this.props
     return (
      <span>  <Icon type="filter"  title="过滤" /></span>
    )
  }

}

export default ToolboxModal
