import React from 'react'
import { List, Icon, Tooltip, Popconfirm, Tag, Divider, Radio } from 'antd'

import { IViewToolbox } from 'containers/View/types'
import { ViewVariableTypes } from '../constants'
import { SearchOutlined } from '@ant-design/icons';
import Styles from '../View.less'
import { FormComponentProps } from 'antd/lib/form/Form'
import { ViewToolboxValueTypes } from 'containers/View/constants'

export interface IToolboxModalProps {
  toolbox: IViewToolbox
  onChange?: (toolbox: IViewToolbox) => void
}

interface IToolboxModalStates {
  slide: ViewToolboxValueTypes
}

const defaultToolbox: IViewToolbox = {
  key: '',
  name: '',
  alias: '',
  slide:'combine'
}

export class ToolboxModal extends React.Component<IToolboxModalProps,IToolboxModalStates> {
  public state: Readonly<IToolboxModalStates> = {
    slide: ViewToolboxValueTypes.String
  }

  public componentDidUpdate (prevProps: IToolboxModalProps) {
    const { toolbox } = this.props
    if (toolbox !== prevProps.toolbox) {
      this.setState({
        slide: typeof(toolbox.slide) != "undefined" ? toolbox.slide : defaultToolbox.slide
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
