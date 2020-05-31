import React from 'react'
import { List, Icon, Tooltip, Popconfirm, Tag, Divider, Radio } from 'antd'

import { IRuleToolbox } from 'containers/Rules/types'
import { RuleVariableTypes } from '../constants'
import { SearchOutlined } from '@ant-design/icons';
import Styles from '../Rule.less'
import { FormComponentProps } from 'antd/lib/form/Form'
import { RuleToolboxValueTypes } from 'containers/Rules/constants'

export interface IToolboxModalProps {
  toolbox: IRuleToolbox
  onChange?: (toolbox: IRuleToolbox) => void
}

interface IToolboxModalStates {
  slide: RuleToolboxValueTypes
}

const defaultToolbox: IRuleToolbox = {
  key: '',
  name: '',
  alias: '',
  slide:'combine'
}

export class ToolboxModal extends React.Component<IToolboxModalProps,IToolboxModalStates> {
  public state: Readonly<IToolboxModalStates> = {
    slide: RuleToolboxValueTypes.String
  }

  public componentDidUpdate (prevProps: IToolboxModalProps) {
    const { toolbox } = this.props
    if (toolbox !== prevProps.toolbox) {
      this.setState({
        slide: typeof(toolbox) != "undefined" && typeof(toolbox.slide) != "undefined" ? toolbox.slide : defaultToolbox.slide
      })
    }
  }

  private onChange = e => {
  	const { onChange } = this.props
    const toolbox = {}
    toolbox["slide"] = e.target.value
    onChange(toolbox)
  };

  public render () {
  	 const { slide } = this.state
  	
     return (
      <div className={Styles.iconsList}>
        <Radio.Group onChange={this.onChange} value={slide} size="small">
      		<Radio.Button icon={<SearchOutlined />} value="combine" >组合</Radio.Button>
      		<Radio.Button icon={<SearchOutlined />} value="list">列表</Radio.Button>
    	</Radio.Group>
    	<Divider type="vertical" />
  	  </div>
    )
  }

}

export default ToolboxModal
