
import * as React from 'react'
import * as classnames from 'classnames'

const styles = require('./Container.less')

interface IContainerProps {
  grid?: boolean
  card?: boolean
  report?: boolean
  children: React.ReactNode
}

export class Body extends React.Component<IContainerProps, {}> {
  public render () {
    const { grid, card, children, report} = this.props
    const bodyClass = classnames({
      [styles.body]: true,
      [styles.grid]: grid,
      [styles.card]: card,
      [styles.report]: report
    })
    return (
      <div className={bodyClass}>
        {children}
      </div>
    )
  }
}

export default Body
