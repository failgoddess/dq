
import line from './line'
import bar from './bar'
import scatter from './scatter'
import pie from './pie'
import { IDrawingData } from '../../components/Pivot/Pivot'
import { DimetionType } from '../../components/Widget'

interface IChartOptions {
  chartOption: object
  stackOption?: boolean
  calcPieCenterAndRadius? (
    dimetionAxis: DimetionType,
    containerWidth: number,
    containerHeight: number,
    elementSize: number,
    unitMetricLengthArr: number[],
    horizontalRecordCountOfCol: number,
    verticalRecordCountOfRow: number,
    lineRecordSum: number,
    lineCount: number,
    unitCount: number,
    metricCount: number,
    recordCount: number,
    lineIndex: number,
    unitIndex: number,
    metricIndex: number,
    recordIndex: number
  ): { center: string[], radius: string[]}
  getSymbolSize? (name: string, size: number): number
}

export default function (type, drawingData?: IDrawingData): IChartOptions {
  switch (type) {
    case 'line': return line()
    case 'bar': return bar(drawingData.elementSize)
    case 'scatter': return scatter(drawingData.sizeRate)
    case 'pie': return pie()
  }
}
