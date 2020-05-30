
import * as React from 'react'
import { IChartProps } from './'

const styles = require('./Chart.less')

export class Iframe extends React.PureComponent<IChartProps, {}> {

  public render () {
    const { chartStyles } = this.props
    const { iframe } = chartStyles
    const { src } = iframe
    return (
      <iframe className={styles.iframePage} src={src} />
    )
  }
}

export default Iframe
