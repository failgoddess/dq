
import { createSelector } from 'reselect'

const selectDashboard = (state) => state.get('dashboard')
const selectForm = (state) => state.get('form')

const makeSelectDashboards = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('dashboards')
)

const makeSelectCurrentDashboard = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('currentDashboard')
)
const makeSelectCurrentDashboardLoading = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('currentDashboardLoading')
)
const makeSelectCurrentDashboardShareInfo = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('currentDashboardShareInfo')
)
const makeSelectCurrentDashboardSecretInfo = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('currentDashboardSecretInfo')
)
const makeSelectCurrentDashboardShareInfoLoading = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('currentDashboardShareInfoLoading')
)
const makeSelectCurrentDashboardSelectOptions = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('currentDashboardSelectOptions')
)
const makeSelectCurrentItems = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('currentItems')
)
const makeSelectCurrentItemsInfo = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('currentItemsInfo')
)
const makeSelectModalLoading = () => createSelector(
  selectDashboard,
  (dashboardState) => dashboardState.get('modalLoading')
)

const makeSelectControlForm = () => createSelector(
  selectForm,
  (formState) => formState.controlForm
)

const makeSelectCurrentLinkages = () => createSelector(
  selectDashboard,
  (dashboardState) => {
    const currentDashboard = dashboardState.get('currentDashboard')
    const currentItemsInfo = dashboardState.get('currentItemsInfo')
    if (!currentDashboard && !currentItemsInfo) { return [] }

    const emptyConfig = '{}'
    const { linkages } = JSON.parse(currentDashboard.config || emptyConfig)
    if (!linkages) { return [] }
    const validLinkages = linkages.filter((l) => {
      const { linkager, trigger } = l
      return currentItemsInfo[linkager[0]] && currentItemsInfo[trigger[0]]
    })
    return validLinkages
  }
)

export {
  selectDashboard,
  selectForm,
  makeSelectDashboards,
  makeSelectCurrentDashboard,
  makeSelectCurrentDashboardLoading,
  makeSelectCurrentItems,
  makeSelectCurrentItemsInfo,
  makeSelectCurrentDashboardShareInfo,
  makeSelectCurrentDashboardSecretInfo,
  makeSelectCurrentDashboardShareInfoLoading,
  makeSelectCurrentDashboardSelectOptions,
  makeSelectModalLoading,
  makeSelectCurrentLinkages,
  makeSelectControlForm
}
