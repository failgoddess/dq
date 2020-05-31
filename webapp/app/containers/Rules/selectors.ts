
import { createSelector } from 'reselect'
import { IRuleState } from './types'

const selectRule = (state) => state.get('rule')

const makeSelectRules = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.rules
)

const makeSelectEditingRule = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.editingRule
)

const makeSelectEditingRuleInfo = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.editingRuleInfo
)

const makeSelectFormedRules = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.formedRules
)

const makeSelectSources = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.sources
)

const makeSelectSchema = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.schema
)

const makeSelectSqlValidation = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.sqlValidation
)

const makeSelectSqlDataSource = () => createSelector(
	selectRule,
	(ruleState: IRuleState) => ruleState.sqlDataSource
)

const makeSelectSqlLimit = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.sqlLimit
)

const makeSelectLoading = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.loading
)

const makeSelectChannels = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.channels
)
const makeSelectTenants = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.tenants
)
const makeSelectBizs = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.bizs
)

const makeSelectCorrelation = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.correlation
)

const makeSelectToolbox = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.toolbox
)

const makeSelectAction = () => createSelector(
  selectRule,
  (ruleState: IRuleState) => ruleState.action
)

export {
  selectRule,
  makeSelectRules,
  makeSelectEditingRule,
  makeSelectEditingRuleInfo,
  makeSelectFormedRules,
  makeSelectSources,
  makeSelectSchema,
  makeSelectSqlValidation,
  makeSelectSqlDataSource,
  makeSelectSqlLimit,
  makeSelectLoading,

  makeSelectChannels,
  makeSelectTenants,
  makeSelectBizs,
  
  makeSelectCorrelation,
  makeSelectToolbox,
  makeSelectAction
}
