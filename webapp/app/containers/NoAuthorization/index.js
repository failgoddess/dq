
/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 */

import React from 'react'
import { Button } from 'antd'
import styles from './NoAuthorization.less'

export default function NoAuthorization () {
  return (
    <div className={styles.NoAuthorization}>
      <i className="iconfont icon-found" />
      <h1>您没有权限访问当前页面</h1>
      <Button size="large" style={{marginTop: '16px'}} onClick={() => history.go(-1)}>返回上一页</Button>
    </div>
  )
}
