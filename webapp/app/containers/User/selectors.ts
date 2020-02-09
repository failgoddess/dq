
import { createSelector } from 'reselect'

const selectUser = (state) => state.get('user')

const makeSelectUsers = () => createSelector(
  selectUser,
  (userState) => userState.get('users')
)

const makeSelectTableLoading = () => createSelector(
  selectUser,
  (userState) => userState.get('tableLoading')
)

const makeSelectFormLoading = () => createSelector(
  selectUser,
  (userState) => userState.get('formLoading')
)

export {
  selectUser,
  makeSelectUsers,
  makeSelectTableLoading,
  makeSelectFormLoading
}
