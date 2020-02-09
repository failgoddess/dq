
import { createSelector } from 'reselect'

/**
 * Direct selector to the schedule state domain
 */
const selectSchedule = (state) => state.get('schedule')

/**
 * Other specific selectors
 */

/**
 * Default selector used by Schedule
 */

const makeSelectSchedules = () => createSelector(
  selectSchedule,
  (scheduleState) => scheduleState.schedules
)

const makeSelectEditingSchedule = () => createSelector(
  selectSchedule,
  (scheduleState) => scheduleState.editingSchedule
)

const makeSelectLoading = () => createSelector(
  selectSchedule,
  (scheduleState) => scheduleState.loading
)

const makeSelectSuggestMails = () => createSelector(
  selectSchedule,
  (scheduleState) => scheduleState.suggestMails
)

const makeSelectPortalDashboards = () => createSelector(
  selectSchedule,
  (scheduleState) => scheduleState.portalDashboards
)

const makeSelectVizs = () => createSelector(
  selectSchedule,
  (scheduleState) => scheduleState.vizs
)

export {
  selectSchedule,
  makeSelectSchedules,
  makeSelectEditingSchedule,
  makeSelectLoading,
  makeSelectSuggestMails,
  makeSelectPortalDashboards,
  makeSelectVizs
}
