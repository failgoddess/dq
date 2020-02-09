

/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react'

import styles from './NotFound.less'

export default function NotFound () {
  return (
    <div className={styles.notFound}>
      <i className="iconfont icon-found" />
      <h1>您来到了没有数据的地方</h1>
    </div>
  )
}
