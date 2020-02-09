import * as React from 'react'

const styles = require('./Sidebar.less')

interface ISidebarProps {
  children: React.ReactNode
}

export function Sidebar (props: ISidebarProps) {
  return (
    <div className={styles.sidebar}>
      {props.children}
    </div>
  )
}

export default Sidebar
