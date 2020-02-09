
import * as React from 'react'

const styles = require('./Container.less')

interface IContainerProps {
  grid?: boolean
  card?: boolean
  children: React.ReactNode,
  align?: any
}

export class Title extends React.Component<IContainerProps, {}> {
  public render () {
    return (
      <div className={styles.title}>
        {this.props.children}
      </div>
    )
  }
}

export default Title
