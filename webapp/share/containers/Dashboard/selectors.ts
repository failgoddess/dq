import { createSelector } from 'reselect'

const selectShare = (state) => state.get('shareDashboard')

const makeSelectDashboard = () => createSelector(
  selectShare,
  (shareState) => shareState.get('dashboard')
)

const makeSelectTitle = () => createSelector(
  selectShare,
  (shareState) => shareState.get('title')
)
const makeSelectConfig = () => createSelector(
  selectShare,
  (shareState) => shareState.get('config')
)
const makeSelectWidgets = () => createSelector(
  selectShare,
  (shareState) => shareState.get('widgets')
)
const makeSelectItems = () => createSelector(
  selectShare,
  (shareState) => shareState.get('items')
)
const makeSelectItemsInfo = () => createSelector(
  selectShare,
  (shareState) => shareState.get('itemsInfo')
)
const makeSelectDashboardSelectOptions = () => createSelector(
  selectShare,
  (shareState) => shareState.get('dashboardSelectOptions')
)

const makeSelectShareParams = () => createSelector(
  selectShare,
  (shareState) => shareState.get('shareParams')
)

const makeSelectLinkages = () => createSelector(
  selectShare,
  (shareState) => {
    const config = shareState.get('config')
    if (!config) { return [] }

    const emptyConfig = {}
    const { linkages } = JSON.parse(config || emptyConfig)
    if (!linkages) { return [] }

    const itemsInfo = shareState.get('itemsInfo')
    const validLinkages = linkages.filter((l) => {
      const { linkager, trigger } = l
      return itemsInfo[linkager[0]] && itemsInfo[trigger[0]]
    })
    return validLinkages
  }
)

const makeSelectDownloadList = () => createSelector(
  selectShare,
  (globalState) => globalState.get('downloadList')
)

const makeSelectDownloadListLoading = () => createSelector(
  selectShare,
  (globalState) => globalState.get('downloadListLoading')
)


export {
  selectShare,
  makeSelectDashboard,
  makeSelectTitle,
  makeSelectConfig,
  makeSelectDashboardSelectOptions,
  makeSelectWidgets,
  makeSelectItems,
  makeSelectItemsInfo,
  makeSelectLinkages,
  makeSelectDownloadList,
  makeSelectDownloadListLoading,
  makeSelectShareParams
}
