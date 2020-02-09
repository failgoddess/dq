
import React from 'react'
import classnames from 'classnames'
import { Icon, Empty, Popover, Tag, Badge } from 'antd'
import { IDownloadRecord, DownloadStatus } from 'app/containers/App/types'
import { DOWNLOAD_STATUS_COLORS, DOWNLOAD_STATUS_LOCALE } from 'app/containers/App/constants'

const styles = require('./DownloadList.less')

interface IDownloadListProps {
  downloadList: IDownloadRecord[]
  onLoadDownloadList: () => void
  onDownloadFile: (id) => void
}

export function DownloadList (props: IDownloadListProps) {
  const {
    downloadList
  } = props

  let listContent
  let downloadable = 0

  if (downloadList && downloadList.length) {
    downloadable = downloadList.filter((d) => d.status === DownloadStatus.Success).length
    const downloadListItems = downloadList.map((record) => {
      const { id, name, status } = record
      const titleClass = classnames({
        [styles.success]: status === DownloadStatus.Success,
        [styles.downloaded]: status === DownloadStatus.Downloaded
      })
      return (
        <li key={id} className={styles.item}>
          {/* <Icon type="loading" /> */}
          <p
            className={titleClass}
            onClick={download(props, record)}
          >
            {name}
          </p>
          <Tag color={DOWNLOAD_STATUS_COLORS[status]}>
            {DOWNLOAD_STATUS_LOCALE[status]}
          </Tag>
        </li>
      )
    })
    listContent = (
      <ul className={styles.downloadList}>
        {downloadListItems}
      </ul>
    )
  } else {
    listContent = (
      <Empty
        key="empty"
        className={styles.empty}
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <Popover
      content={listContent}
      trigger="click"
      placement="bottomRight"
      onVisibleChange={downloadListPanelVisibleChange}
    >
      <Badge count={downloadable}>
        <Icon type="cloud-download" onClick={getDownloadList(props)} />
      </Badge>
    </Popover>
  )
}

let downloadListPanelVisibleRecorder = false

function downloadListPanelVisibleChange (visible) {
  downloadListPanelVisibleRecorder = visible
}

function getDownloadList (props: IDownloadListProps) {
  return function () {
    if (!downloadListPanelVisibleRecorder) {
      props.onLoadDownloadList()
    }
  }
}

function download (props: IDownloadListProps, record: IDownloadRecord) {
  return function () {
    const { id, status } = record
    if (status === DownloadStatus.Success
        || status === DownloadStatus.Downloaded) {
      props.onDownloadFile(id)
    }
  }
}

export default DownloadList
