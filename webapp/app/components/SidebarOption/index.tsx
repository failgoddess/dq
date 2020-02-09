
import * as React from 'react'
import * as classnames from 'classnames'
import { Link } from 'react-router'

const styles = require('../Sidebar/Sidebar.less')


interface ISidebarOptionProps {
  route: any[]
  active: boolean
  children: React.ReactNode
  params: any
}

export class SidebarOption extends React.PureComponent <ISidebarOptionProps, {}> {
  public render () {
    const optionClass = classnames(
      { [styles.option]: true },
      { [styles.active]: this.props.active }
    )
   // const linkRoute = `/report/${this.props.route[0]}`
    const linkRoute = `/project/${this.props.params.pid}/${this.props.route[0]}`

    return (
      <div className={optionClass}>
        <Link to={linkRoute}>
          {this.props.children}
        </Link>
      </div>
    )
  }
}

export default SidebarOption
