
import * as React from 'react'
import { Icon, Breadcrumb } from 'antd'

export interface IDataDrillHistoryProps {
  itemId?: number
  widgetId: number
  drillHistory?: any
  onSelectDrillHistory?: (history?: any, item?: number, itemId?: number, widgetId?: number) => void
}

export function DataDrillHistory (props: IDataDrillHistoryProps) {
  const {drillHistory, onSelectDrillHistory, itemId, widgetId} = props
  return (
    <Breadcrumb separator=">">
      {<Breadcrumb.Item onClick={drill(false, -1)} key={`dhall`}>返回</Breadcrumb.Item>}
      {
        drillHistory && drillHistory.length ? drillHistory.map((history, index) => (
          <Breadcrumb.Item onClick={drill(history, index)} key={`dh${index}`}>
            {history.name}<Icon type={`${history.type === 'up' ? 'arrow-up' : 'arrow-down'}`} />
          </Breadcrumb.Item>
        )) : ''
      }
    </Breadcrumb>
  )
  function drill (history, item) {
    return function () {
      if (item === drillHistory.length - 1) {
        return
      }
      if (onSelectDrillHistory) {
        onSelectDrillHistory(history, item, itemId, widgetId)
      }
    }
  }
}



export default DataDrillHistory
