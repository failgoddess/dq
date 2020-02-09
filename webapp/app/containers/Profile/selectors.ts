
import { createSelector } from 'reselect'

const selectProfile = (state) => state.get('profile')

const makeSelectUserProfile = () => createSelector(
  selectProfile,
  (state) => state.get('userProfile')
)

const makeSelectLoading = () => createSelector(
  selectProfile,
  (state) => state.get('loading')
)


export {
  makeSelectLoading,
  makeSelectUserProfile
}
