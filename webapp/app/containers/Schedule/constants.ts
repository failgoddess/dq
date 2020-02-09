
import { createTypes } from 'utils/redux'
import {
  DefaultSchedulePeriodExpression,
  DefaultEmailContent,
  DefaultMailImageWidth
} from './components/constants'
import { ISchedule } from './types'

enum Types {
  LOAD_SCHEDULES = 'app/Schedule/LOAD_SCHEDULES',
  LOAD_SCHEDULES_SUCCESS = 'app/Schedule/LOAD_SCHEDULES_SUCCESS',
  LOAD_SCHEDULES_FAILURE = 'app/Schedule/LOAD_SCHEDULES_FAILURE',

  LOAD_SCHEDULE_DETAIL = 'app/Schedule/LOAD_SCHEDULE_DETAIL',
  LOAD_SCHEDULE_DETAIL_SUCCESS = 'app/Schedule/LOAD_SCHEDULE_DETAIL_SUCCESS',
  LOAD_SCHEDULE_DETAIL_FAILURE = 'app/Schedule/LOAD_SCHEDULE_DETAIL_FAILURE',

  ADD_SCHEDULE = 'app/Schedule/ADD_SCHEDULE',
  ADD_SCHEDULE_SUCCESS = 'app/Schedule/ADD_SCHEDULE_SUCCESS',
  ADD_SCHEDULE_FAILURE = 'app/Schedule/ADD_SCHEDULE_FAILURE',

  EDIT_SCHEDULE = 'app/Schedule/EDIT_SCHEDULE',
  EDIT_SCHEDULE_SUCCESS = 'app/Schedule/EDIT_SCHEDULE_SUCCESS',
  EDIT_SCHEDULE_FAILURE = 'app/Schedule/EDIT_SCHEDULE_FAILURE',

  DELETE_SCHEDULE = 'app/Schedule/DELETE_SCHEDULE',
  DELETE_SCHEDULE_SUCCESS = 'app/Schedule/DELETE_SCHEDULE_SUCCESS',
  DELETE_SCHEDULE_FAILURE = 'app/Schedule/DELETE_SCHEDULE_FAILURE',

  CHANGE_SCHEDULE_STATUS = 'app/Schedule/CHANGE_SCHEDULE_STATUS',
  CHANGE_SCHEDULE_STATUS_SUCCESS = 'app/Schedule/CHANGE_SCHEDULE_STATUS_SUCCESS',
  CHANGE_SCHEDULE_STATUS_FAILURE = 'app/Schedule/CHANGE_SCHEDULE_STATUS_FAILURE',

  RESET_SCHEDULE_STATE = 'dq/View/RESET_SCHEDULE_STATE',

  LOAD_SUGGEST_MAILS = 'app/Schedule/LOAD_SUGGEST_MAILS',
  LOAD_SUGGEST_MAILS_SUCCESS = 'app/Schedule/LOAD_SUGGEST_MAILS_SUCCESS',
  LOAD_SUGGEST_MAILS_FAILURE = 'app/Schedule/LOAD_SUGGEST_MAILS_FAILURE',

  LOAD_PORTAL_DASHBOARDS_SUCCESS = 'app/Schedule/LOAD_PORTAL_DASHBOARDS_SUCCESS',

  // @FIXME need refactor
  LOAD_VIZS = 'app/Schedule/LOAD_VIZS',
  LOAD_VIZS_SUCCESS = 'app/Schedule/LOAD_VIZS_SUCCESS',
  LOAD_VIZS_FAILUER = 'app/Schedule/LOAD_VIZS_FAILUER'
}

export const ActionTypes = createTypes(Types)

export const EmptySchedule: ISchedule = {
  id: 0,
  name: '',
  description: '',
  projectId: 0,
  startDate: '',
  endDate: '',
  cronExpression: DefaultSchedulePeriodExpression.Day,
  jobStatus: 'new',
  jobType: 'email',
  execLog: '',
  config: {
    subject: '',
    content: DefaultEmailContent,
    to: '',
    cc: '',
    bcc: '',
    type: 'image',
    imageWidth: DefaultMailImageWidth,
    contentList: []
  }
}
