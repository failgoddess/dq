
import { createSelector } from 'reselect'

const selectGroup = (state) => state.get('group')

const makeSelectGroups = () => createSelector(
  selectGroup,
  (groupState) => groupState.get('groups')
)

const makeSelectTableLoading = () => createSelector(
  selectGroup,
  (groupState) => groupState.get('tableLoading')
)

const makeSelectFormLoading = () => createSelector(
  selectGroup,
  (groupState) => groupState.get('formLoading')
)

export {
  selectGroup,
  makeSelectGroups,
  makeSelectTableLoading,
  makeSelectFormLoading
}
