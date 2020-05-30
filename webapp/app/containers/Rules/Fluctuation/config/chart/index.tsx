
import { IChartInfo } from 'containers/Widget/components/Widget'

import table from './table'
import line from './line'
import bar from './bar'
import scatter from './scatter'
import pie from './pie'
import funnel from './funnel'
import radar from './radar'
import sankey from './sankey'
import parallel from './parallel'
import map from './map'
import wordCloud from './wordCloud'
import waterfall from './waterfall'
import scorecard from './scorecard'
import gauge from './gauge'
import iframe from './iframe'
import richText from './richText'
import doubleYAxis from './doubleYAxis'

const widgetlibs: IChartInfo[] = [
  table,
  scorecard,
  line,
  bar,
  scatter,
  pie,
  funnel,
  radar,
  sankey,
  parallel,
  map,
  wordCloud,
  waterfall,
  iframe,
  richText,
  doubleYAxis,
  gauge
]

export default widgetlibs
