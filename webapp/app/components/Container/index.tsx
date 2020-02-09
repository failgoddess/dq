
import * as React from 'react'
import * as classnames from 'classnames'

const styles = require('./Container.less')

import Title from './Title'
import Body from './Body'

interface IContainerProps {
  grid?: boolean
  card?: boolean
  report?: boolean
  children: React.ReactNode
}

export class Container extends React.Component<IContainerProps, {}> {
  public static Title = Title

  public static Body = Body

  public render () {
    return (
      <div className={styles.container}>
        {this.props.children}
      </div>
    )
  }
}

export default Container
