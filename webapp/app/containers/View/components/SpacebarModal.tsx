import React from 'react'
import { List, Icon, Tooltip, Popconfirm, Tag } from 'antd'

import { IViewVariable } from 'containers/View/types'
import { ViewVariableTypes } from '../constants'

import Styles from '../View.less'

export interface ISpacebarModalProps {
  className?: string
  addCorrelation?: () => void
  onDelete?: (key: string) => void
  onEdit?: (variable: IViewVariable) => void
}
export class SpacebarModal extends React.Component<ISpacebarModalProps> {

  public render () {
    const { className, addCorrelation } = this.props
     return (
      <div className={Styles.verticalIconsList}>
    	<Icon type="code" title="代码生成" style={{padding:"0px 3px 3px 3px"}} />
    	<Icon type="table" onClick={addCorrelation} title="关联关系" style={{padding:"0px 3px 3px 3px"}} />
  	  </div>
    )
  }

}

export default SpacebarModal
