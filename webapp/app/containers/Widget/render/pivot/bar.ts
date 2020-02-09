export default function (elementSize) {
  return {
    chartOption: {
      type: 'bar',
      barWidth: elementSize * .8
    },
    stackOption: true
  }
}
