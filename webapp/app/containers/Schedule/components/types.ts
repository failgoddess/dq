
export type JobStatus = 'new' | 'failed' | 'started' | 'stopped'
export type JobType = 'email'
export type ScheduleType = 'image' | 'excel' | 'imageAndExcel'
export type SchedulePeriodUnit =
  | 'Minute'
  | 'Hour'
  | 'Day'
  | 'Week'
  | 'Month'
  | 'Year'

export interface IScheduleBase {
  id: number
  name: string
  description: string
  projectId: number
  startDate: string
  endDate: string
  cronExpression: string
  jobStatus: JobStatus
  jobType: JobType
  execLog: string
}

export interface IScheduleRaw extends IScheduleBase {
  config: string
}

export interface IScheduleVizItem {
  contentType: 'portal' | 'display'
  id: number
  items: number[]
}

export interface IScheduleMailConfig {
  subject: string
  content: string
  to: string
  cc: string
  bcc: string
  type: ScheduleType
  imageWidth: number
  contentList: IScheduleVizItem[]
}

export interface ISchedule extends IScheduleBase {
  config: IScheduleMailConfig
}

export interface IUserInfo {
  id: number
  username: string
  email: string
  avatar: string
}

export interface ICronExpressionPartition {
  periodUnit: SchedulePeriodUnit
  minute: number
  hour: number
  day: number
  month: number
  weekDay: number
}
