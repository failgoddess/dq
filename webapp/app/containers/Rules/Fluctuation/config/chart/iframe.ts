
import ChartTypes from './ChartTypes'
import { IChartInfo } from 'containers/Widget/components/Widget'

const iframe: IChartInfo = {
  id: ChartTypes.Iframe,
  name: 'iframe',
  title: '内嵌网页',
  icon: 'icon-iframe',
  coordinate: 'other',
  rules: [{ dimension: 0, metric: 0 }],
  data: {
    cols: {
      title: '列',
      type: 'category'
    },
    rows: {
      title: '行',
      type: 'category'
    },
    metrics: {
      title: '指标',
      type: 'value'
    },
    filters: {
      title: '筛选',
      type: 'all'
    }
  },
  style: {
    iframe: {
      src: ''
    },
    spec: {

    }
  }
}

export default iframe
