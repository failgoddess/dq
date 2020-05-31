import React from 'react'
import { List, Icon, Tooltip, Popconfirm, Tag } from 'antd'

import { IRuleVariable } from 'containers/Rules/types'
import { RuleVariableTypes } from '../constants'

import Styles from '../Rule.less'

export interface ISpacebarModalProps {
  className?: string
  addCorrelation?: () => void
  onDelete?: (key: string) => void
  onEdit?: (variable: IRuleVariable) => void
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
