import { createSelector } from 'reselect'
import { SourceStateType } from './reducer'

const selectSource = (state) => state.get('source')

const makeSelectSources = () => createSelector(
  selectSource,
  (sourceState: SourceStateType) => sourceState.get('sources')
)

const makeSelectListLoading = () => createSelector(
  selectSource,
  (sourceState: SourceStateType) => sourceState.get('listLoading')
)

const makeSelectFormLoading = () => createSelector(
  selectSource,
  (sourceState: SourceStateType) => sourceState.get('formLoading')
)

const makeSelectTestLoading = () => createSelector(
  selectSource,
  (sourceState: SourceStateType) => sourceState.get('testLoading')
  )

const makeSelectResetLoading = () => createSelector(
  selectSource,
  (sourceState: SourceStateType) => sourceState.get('resetLoading')
)

const makeSelectDatasourcesInfo = () => createSelector(
  selectSource,
  (sourceState: SourceStateType) => sourceState.get('datasourcesInfo')
)

export {
  selectSource,
  makeSelectSources,
  makeSelectListLoading,
  makeSelectFormLoading,
  makeSelectTestLoading,
  makeSelectResetLoading,
  makeSelectDatasourcesInfo
}
