
import * as React from 'react'

const styles = require('./Box.less')

interface IBoxProps {
  children: React.ReactNode
}

export class Box extends React.Component<IBoxProps, {}> {

  public static Header = (props) => (
    <div className={styles.header}>
      {props.children}
    </div>
  )

  public static Title = (props) => (
    <h3 className={styles.title}>
      {props.children}
    </h3>
  )

  public static Tools = (props) => (
    <div className={styles.tools}>
      {props.children}
    </div>
  )

  public static Body = (props) => (
    <div className={styles.body}>
      {props.children}
    </div>
  )

  public render () {
    return (
      <div className={styles.box}>
        {this.props.children}
      </div>
    )
  }
}

export default Box
