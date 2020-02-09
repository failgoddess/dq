
import { createSelector } from 'reselect'

const selectGlobal = (state) => state.get('global')

const makeSelectLogged = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('logged')
)

const makeSelectLoginUser = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loginUser')
)

const makeSelectLoginLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('loginLoading')
)

const makeSelectNavigator = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('navigator')
)

const makeSelectDownloadList = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('downloadList')
)

const makeSelectDownloadListLoading = () => createSelector(
  selectGlobal,
  (globalState) => globalState.get('downloadListLoading')
)

const makeSelectLocationState = () => {
  let prevRoutingState
  let prevRoutingStateJS

  return (state) => {
    const routingState = state.get('route') // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }

    return prevRoutingStateJS
  }
}

export {
  selectGlobal,
  makeSelectLogged,
  makeSelectLoginUser,
  makeSelectLoginLoading,
  makeSelectNavigator,
  makeSelectLocationState,
  makeSelectDownloadList,
  makeSelectDownloadListLoading
}
