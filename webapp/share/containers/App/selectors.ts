
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
  makeSelectLocationState
}
