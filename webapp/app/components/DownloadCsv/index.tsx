
import * as React from 'react'
import { Icon } from 'antd'

export interface IDownloadCsvProps {
  id?: number
  type?: string
  itemId?: number
  shareInfo: string
  shareInfoLoading?: boolean
  downloadCsvLoading: boolean
  onDownloadCsv: () => void
}

export function DownloadCsv (props: IDownloadCsvProps) {
  const { shareInfoLoading, downloadCsvLoading } = props
  const iconType = shareInfoLoading || downloadCsvLoading ? 'loading' : 'download'
  return (
    <Icon type={iconType} onClick={getShareInfo(props)} />
  )
}

function getShareInfo (props) {
  return function () {
    props.onDownloadCsv()
  }
}

export default DownloadCsv
