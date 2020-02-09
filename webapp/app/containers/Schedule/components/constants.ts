

import { FormItemProps } from 'antd/lib/form'
import { SchedulePeriodUnit } from './types'

export const DefaultSchedulePeriodExpression: {
  [key in SchedulePeriodUnit]: string
} = {
  // Every 10 minutes
  Minute: '0 */10 * * * ?',

  // At second :00 of minute :00 of every hour
  Hour: '0 0 * * * ?',

  // At 00:00:00am every day
  Day: '0 0 0 * * ?',

  // At 00:00:00am, on every Monday, every month
  Week: '0 0 0 ? * 1',

  // At 00:00:00am, on the 1st day, every month
  Month: '0 0 0 1 * ?',

  // At 00:00:00am, on the 1st day, in January
  Year: '0 0 0 1 1 ?'
}

export const DefaultMailImageWidth = 1920

export const DefaultEmailContent = 'This email comes from cron job on the dq.'

export const FormItemStyle: Partial<FormItemProps> = {
  labelCol: { xl: 8, lg: 10, md: 14, sm: 8 },
  wrapperCol: { xl: 14, lg: 12, md: 10, sm: 14 }
}

export const LongFormItemStyle: Partial<FormItemProps> = {
  labelCol: { xl: 4, lg: 5, md: 7, sm: 4 },
  wrapperCol: { xl: 19, lg: 18, md: 17, sm: 19 }
}
