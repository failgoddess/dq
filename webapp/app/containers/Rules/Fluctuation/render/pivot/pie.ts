
import { DimetionType } from '../../components/Widget'

export default function () {
  return {
    chartOption: {
      type: 'pie'
    },
    calcPieCenterAndRadius (
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
    ): { center: string[], radius: string[]} {
      let center
      let radius
      if (dimetionAxis === 'col') {
        const verticalPer = 100 / lineCount / metricCount
        const horizontalPer = 100 / horizontalRecordCountOfCol
        center = [
          `${horizontalPer * (recordIndex + lineRecordSum + 1) - horizontalPer / 2}%`,
          `${verticalPer * (metricIndex + metricCount * lineIndex + 1) - verticalPer / 2}%`
        ]
        if (containerWidth > containerHeight) {
          const rate = Math.min(elementSize / unitMetricLengthArr[0], 1)
          radius = ['0%', `${100 / metricCount / lineCount * rate * .75}%`]
        } else {
          const rate = Math.min(unitMetricLengthArr[0] / elementSize, 1)
          radius = ['0%', `${100 / horizontalRecordCountOfCol * rate * .75}%`]
        }
      } else {
        const verticalPer = 100 / verticalRecordCountOfRow
        const horizontalPer = 100 / unitCount / metricCount
        center = [
          `${horizontalPer * (metricIndex + metricCount * unitIndex + 1) - horizontalPer / 2}%`,
          `${verticalPer * (verticalRecordCountOfRow - recordIndex - lineIndex * recordCount) - verticalPer / 2}%`
        ]
        if (containerWidth > containerHeight) {
          const rate = Math.min(unitMetricLengthArr[1] / elementSize, 1)
          radius = ['0%', `${100 / verticalRecordCountOfRow * rate * .75}%`]
        } else {
          const rate = Math.min(elementSize / unitMetricLengthArr[1], 1)
          radius = ['0%', `${100 / metricCount / unitCount * rate * .75}%`]
        }
      }
      return { center, radius }
    }
  }
}
