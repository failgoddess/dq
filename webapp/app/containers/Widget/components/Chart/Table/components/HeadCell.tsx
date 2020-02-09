import React from 'react'
import { ColumnProps } from 'antd/lib/table'
import { Resizable } from 'libs/react-resizable'
import { IResizeCallbackData } from 'libs/react-resizable/lib/Resizable'
import { ITableHeaderConfig, DefaultTableCellStyle } from 'containers/Widget/components/Config/Table'
import { textAlignAdapter, traverseConfig } from '../util'

interface IHeadCellProps {
  onResize: (e: any, data: IResizeCallbackData) => any
  width: number
  config: ITableHeaderConfig
}

function HeadCell (props: IHeadCellProps) {
  const { onResize, width, config, ...rest } = props
  const cellStyle = config ? config.style : DefaultTableCellStyle
  const { fontColor: color, fontFamily, fontSize, fontStyle, fontWeight, backgroundColor, justifyContent } = cellStyle || DefaultTableCellStyle
  const cellCssStyle: React.CSSProperties = {
    color,
    fontFamily,
    fontSize: `${fontSize}px`,
    fontStyle,
    fontWeight: fontWeight as React.CSSProperties['fontWeight'],
    backgroundColor,
    textAlign: textAlignAdapter(justifyContent)
  }
  return (
    <Resizable width={width} height={0} onResize={onResize}>
      <th style={cellCssStyle} {...rest} />
    </Resizable>
  )
}

export function resizeTableColumns (columns: Array<ColumnProps<any>>, columnIndex: number, width: number) {
  const nextColumns = [...columns]
  const resizedColumn = nextColumns[columnIndex]
  const ratio = Number((width / (+resizedColumn.width)).toFixed(2))
  nextColumns[columnIndex] = {
    ...resizedColumn,
    width
  }
  traverseConfig(resizedColumn.children, 'children', (childColumn) => {
    childColumn.width = ratio * (+childColumn.width)
  })
  return nextColumns
}

export default HeadCell
