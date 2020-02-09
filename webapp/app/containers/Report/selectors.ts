
import { createSelector } from 'reselect'

const selectReport = () => (state) => state.get('report')

const selectSidebar = () => createSelector(
  selectReport(),
  (reportState) => reportState.get('sidebar')
)

export {
  selectReport,
  selectSidebar
}
