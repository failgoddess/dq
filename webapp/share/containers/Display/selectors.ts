
import { createSelector } from 'reselect'

const selectShare = (state) => state.get('shareDisplay')

const makeSelectTitle = () => createSelector(
  selectShare,
  (shareState) => shareState.get('title')
)

const makeSelectDisplay = () => createSelector(
  selectShare,
  (shareState) => shareState.get('display')
)

const makeSelectSlide = () => createSelector(
  selectShare,
  (shareState) => shareState.get('slide')
)

const makeSelectLayers = () => createSelector(
  selectShare,
  (shareState) => shareState.get('layers')
)

const makeSelectWidgets = () => createSelector(
  selectShare,
  (shareState) => shareState.get('widgets')
)

const makeSelectLayersInfo = () => createSelector(
  selectShare,
  (shareState) => shareState.get('layersInfo')
)

export {
  selectShare,
  makeSelectTitle,
  makeSelectDisplay,
  makeSelectSlide,
  makeSelectLayers,
  makeSelectWidgets,
  makeSelectLayersInfo
}
