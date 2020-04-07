
import { createSelector } from 'reselect'
import { IViewState } from './types'

const selectView = (state) => state.get('view')

const makeSelectViews = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.views
)

const makeSelectEditingView = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.editingView
)

const makeSelectEditingViewInfo = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.editingViewInfo
)

const makeSelectFormedViews = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.formedViews
)

const makeSelectSources = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.sources
)

const makeSelectSchema = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.schema
)

const makeSelectSqlValidation = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.sqlValidation
)

const makeSelectSqlDataSource = () => createSelector(
	selectView,
	(viewState: IViewState) => viewState.sqlDataSource
)

const makeSelectSqlLimit = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.sqlLimit
)

const makeSelectLoading = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.loading
)

const makeSelectChannels = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.channels
)
const makeSelectTenants = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.tenants
)
const makeSelectBizs = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.bizs
)

const makeSelectCorrelation = () => createSelector(
  selectView,
  (viewState: IViewState) => viewState.correlation
)

export {
  selectView,
  makeSelectViews,
  makeSelectEditingView,
  makeSelectEditingViewInfo,
  makeSelectFormedViews,
  makeSelectSources,
  makeSelectSchema,
  makeSelectSqlValidation,
  makeSelectSqlDataSource,
  makeSelectSqlLimit,
  makeSelectLoading,

  makeSelectChannels,
  makeSelectTenants,
  makeSelectBizs,
  
  makeSelectCorrelation
}
