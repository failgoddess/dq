
export default function (sizeRate: {[key: string]: number}) {
  return {
    chartOption: {
      type: 'scatter'
    },
    getSymbolSize (metricName, size) {
      return sizeRate ? Math.ceil(size / sizeRate[metricName]) : size
    }
  }
}
