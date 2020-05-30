
import { createSelector } from 'reselect'

const selectWidget = (state) => state.get('widget')

const makeSelectWidgets = () => createSelector(
  selectWidget,
  (widgetState) => widgetState.get('widgets')
)

const makeSelectCurrentWidget = () => createSelector(
  selectWidget,
  (widgetState) => widgetState.get('currentWidget')
)

const makeSelectLoading = () => createSelector(
  selectWidget,
  (widgetState) => widgetState.get('loading')
)

const makeSelectDataLoading = () => createSelector(
  selectWidget,
  (widgetState) => widgetState.get('dataLoading')
)

const makeSelectDistinctColumnValues = () => createSelector(
  selectWidget,
  (widgetState) => widgetState.get('distinctColumnValues')
)

const makeSelectColumnValueLoading = () => createSelector(
  selectWidget,
  (widgetState) => widgetState.get('columnValueLoading')
)

export {
  selectWidget,
  makeSelectWidgets,
  makeSelectCurrentWidget,
  makeSelectLoading,
  makeSelectDataLoading,
  makeSelectDistinctColumnValues,
  makeSelectColumnValueLoading
}
