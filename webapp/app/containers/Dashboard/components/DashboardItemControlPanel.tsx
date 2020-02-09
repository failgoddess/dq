import * as React from 'react'
import * as classnames from 'classnames'

const styles = require('../Dashboard.less')

interface IDashboardItemControlPanelProps {
  show: boolean
  onClose: () => void
  children: React.ReactNode
}

export function DashboardItemControlPanel (props: IDashboardItemControlPanelProps) {
  const panelClass = classnames({
    [styles.controlPanel]: true,
    [styles.show]: props.show
  })

  const formClass = classnames({
    [styles.form]: true,
    [styles.show]: props.show
  })

  return (
    <div className={panelClass} onClick={props.onClose}>
      <div className={formClass} onClick={stopPPG}>
        {props.children}
      </div>
    </div>
  )
}

export default DashboardItemControlPanel

function stopPPG (e) {
  e.stopPropagation()
}
