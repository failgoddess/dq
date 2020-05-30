
import line from './line'
import bar from './bar'
import scatter from './scatter'
import pie from './pie'
import area from './area'
import funnel from './funnel'
import map from './map'
import radar from './radar'
import sankey from './sankey'
import parallel from './parallel'
import wordCloud from './wordCloud'
import waterfall from './waterfall'
import doubleYAxis from './doubleYAxis'
import gauge from './gauge'
import { EChartOption } from 'echarts'
import { IChartProps } from '../../components/Chart'

export default function (type, chartProps: IChartProps, drillOptions?: any): EChartOption {
  switch (type) {
    case 'line': return line(chartProps, drillOptions)
    case 'bar': return bar(chartProps, drillOptions)
    case 'scatter': return scatter(chartProps, drillOptions)
    case 'pie': return pie(chartProps, drillOptions)
    case 'funnel': return funnel(chartProps, drillOptions)
    // case 'area': return area(chartProps)
    case 'radar': return radar(chartProps)
    case 'sankey': return sankey(chartProps)
    case 'parallel': return parallel(chartProps)
    case 'map': return map(chartProps)
    case 'wordCloud': return wordCloud(chartProps)
    case 'waterfall': return waterfall(chartProps)
    case 'doubleYAxis': return doubleYAxis(chartProps, drillOptions)
    case 'gauge': return gauge(chartProps, drillOptions)
  }
}
