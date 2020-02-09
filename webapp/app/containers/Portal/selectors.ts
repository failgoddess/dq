
import { createSelector } from 'reselect'

const selectPortal = (state) => state.get('portal')

const makeSelectPortals = () => createSelector(
  selectPortal,
  (portalState) => portalState.get('portals')
)
const makeSelectTeams = () => createSelector(
  selectPortal,
  (portalState) => portalState.get('selectTeams')
)

export {
  selectPortal,
  makeSelectPortals,
  makeSelectTeams
}
