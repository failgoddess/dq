
import ChartTypes from './ChartTypes'

import { IChartInfo } from 'containers/Widget/components/Widget'

const richText: IChartInfo = {
  id: ChartTypes.RichText,
  name: 'richText',
  title: '富文本',
  icon: 'icon-text',
  coordinate: 'other',
  rules: [{ dimension: [0, 9999], metric: [0, 9999] }],
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
    richText: {
      content: ''
    },
    spec: {}
  }
}

export default richText
