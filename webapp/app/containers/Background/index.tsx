
import * as React from 'react'
import Canvas from './Canvas'

const styles = require('./Background.less')

export function Background (props) {
  return (
    <div className={styles.container}>
      {props.children}
    </div>
  )
}

export default Background
