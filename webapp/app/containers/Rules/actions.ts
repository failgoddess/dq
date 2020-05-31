
import axios from 'axios'
import { ActionTypes } from './constants'
import { returnType } from 'utils/redux'
import { IDQResponse } from 'utils/request'
import {
  IRuleBase, IRule, IExecuteSqlParams, IExecuteSqlResponse, IRuleInfo,
  IDacChannel, IDacTenant, IDacBiz
} from './types'
import { IDataRequestParams } from 'containers/Dashboard/Grid'
import { RenderType } from 'containers/Widget/components/Widget'
import { IDistinctValueReqeustParams } from 'app/components/Filters/types'
const CancelToken = axios.CancelToken

export const RuleActions = {
  rulesLoaded (rules: IRuleBase[]) {
    return {
      type: ActionTypes.LOAD_RULES_SUCCESS,
      payload: {
        rules
      }
    }
  },
  loadRules (projectId: number, resolve?: (rules: IRuleBase[]) => void) {
    console.log("------------------125---")
    console.log(projectId)
    console.log(resolve)
    return {
      type: ActionTypes.LOAD_RULES,
      payload: {
        projectId,
        resolve
      }
    }
  },
  loadRulesFail () {
    return {
      type: ActionTypes.LOAD_RULES_FAILURE,
      payload: {}
    }
  },

  rulesDetailLoaded (rules: IRule[], isEditing: boolean) {
    return {
      type: ActionTypes.LOAD_RULES_DETAIL_SUCCESS,
      payload: {
        rules,
        isEditing
      }
    }
  },
  loadRulesDetail (ruleIds: number[], resolve?: () => void, isEditing: boolean = false) {
    return {
      type: ActionTypes.LOAD_RULES_DETAIL,
      payload: {
        ruleIds,
        isEditing,
        resolve
      }
    }
  },
  loadRulesDetailFail () {
    return {
      type: ActionTypes.LOAD_RULES_DETAIL_FAILURE,
      payload: {}
    }
  },

  addRule (rule: IRule, resolve: () => void) {
    return {
      type: ActionTypes.ADD_RULE,
      payload: {
        rule,
        resolve
      }
    }
  },
  ruleAdded (result: IRule) {
    return {
      type: ActionTypes.ADD_RULE_SUCCESS,
      payload: {
        result
      }
    }
  },
  addRuleFail () {
    return {
      type: ActionTypes.ADD_RULE_FAILURE,
      payload: {}
    }
  },

  editRule (rule: IRule, resolve: () => void) {
    return {
      type: ActionTypes.EDIT_RULE,
      payload: {
        rule,
        resolve
      }
    }
  },
  ruleEdited (result: IRule) {
    return {
      type: ActionTypes.EDIT_RULE_SUCCESS,
      payload: {
        result
      }
    }
  },
  editRuleFail () {
    return {
      type: ActionTypes.EDIT_RULE_FAILURE,
      payload: {}
    }
  },

  deleteRule (id: number, resolve: (id: number) => void) {
    return {
      type: ActionTypes.DELETE_RULE,
      payload: {
        id,
        resolve
      }
    }
  },
  ruleDeleted (id: number) {
    return {
      type: ActionTypes.DELETE_RULE_SUCCESS,
      payload: {
        id
      }
    }
  },
  deleteRuleFail () {
    return {
      type: ActionTypes.DELETE_RULE_FAILURE,
      payload: {}
    }
  },

  copyRule (rule: IRuleBase, resolve: () => void) {
    return {
      type: ActionTypes.COPY_RULE,
      payload: {
        rule,
        resolve
      }
    }
  },
  ruleCopied (fromRuleId: number, result: IRule) {
    return {
      type: ActionTypes.COPY_RULE_SUCCESS,
      payload: {
        fromRuleId,
        result
      }
    }
  },
  copyRuleFail () {
    return {
      type: ActionTypes.COPY_RULE_FAILURE,
      payload: {}
    }
  },

  executeSql (params: IExecuteSqlParams) {
    return {
      type: ActionTypes.EXECUTE_SQL,
      payload: {
        params
      }
    }
  },
  sqlExecuted (result: IDQResponse<IExecuteSqlResponse>) {
    return {
      type: ActionTypes.EXECUTE_SQL_SUCCESS,
      payload: {
        result
      }
    }
  },
  executeSqlFail (err: IDQResponse<any>['header']) {
    return {
      type: ActionTypes.EXECUTE_SQL_FAILURE,
      payload: {
        err
      }
    }
  },

  updateEditingRule (rule: IRule) {
    return {
      type: ActionTypes.UPDATE_EDITING_RULE,
      payload: {
        rule
      }
    }
  },
  updateEditingRuleInfo (ruleInfo: IRuleInfo) {
    return {
      type: ActionTypes.UPDATE_EDITING_RULE_INFO,
      payload: {
        ruleInfo
      }
    }
  },

  setSqlLimit (limit: number) {
    return {
      type: ActionTypes.SET_SQL_LIMIT,
      payload: {
        limit
      }
    }
  },

  resetRuleState () {
    return {
      type: ActionTypes.RESET_RULE_STATE,
      payload: {}
    }
  },

  /** Actions for fetch external authorization variables values */
  loadDacChannels () {
    return {
      type: ActionTypes.LOAD_DAC_CHANNELS,
      payload: {}
    }
  },
  dacChannelsLoaded (channels: IDacChannel[]) {
    return {
      type: ActionTypes.LOAD_DAC_CHANNELS_SUCCESS,
      payload: {
        channels
      }
    }
  },
  loadDacChannelsFail () {
    return {
      type: ActionTypes.LOAD_DAC_CHANNELS_FAILURE,
      payload: {}
    }
  },

  loadDacTenants (channelName: string) {
    return {
      type: ActionTypes.LOAD_DAC_TENANTS,
      payload: {
        channelName
      }
    }
  },
  dacTenantsLoaded (tenants: IDacTenant[]) {
    return {
      type: ActionTypes.LOAD_DAC_TENANTS_SUCCESS,
      payload: {
        tenants
      }
    }
  },
  loadDacTenantsFail () {
    return {
      type: ActionTypes.LOAD_DAC_TENANTS_FAILURE,
      payload: {}
    }
  },

  loadDacBizs (channelName: string, tenantId: number) {
    return {
      type: ActionTypes.LOAD_DAC_BIZS,
      payload: {
        channelName,
        tenantId
      }
    }
  },
  dacBizsLoaded (bizs: IDacBiz[]) {
    return {
      type: ActionTypes.LOAD_DAC_BIZS_SUCCESS,
      payload: {
        bizs
      }
    }
  },
  loadDacBizsFail () {
    return {
      type: ActionTypes.LOAD_DAC_BIZS_FAILURE,
      payload: {}
    }
  },
  /** */

  /** Actions for external usages */
  loadSelectOptions (controlKey: string, requestParams: { [ruleId: string]: IDistinctValueReqeustParams }, itemId?: number) {
    return {
      type: ActionTypes.LOAD_SELECT_OPTIONS,
      payload: {
        controlKey,
        requestParams,
        itemId,
        cancelTokenSource: CancelToken.source()
      }
    }
  },
  selectOptionsLoaded (controlKey: string, values: any[], itemId?: number) {
    return {
      type: ActionTypes.LOAD_SELECT_OPTIONS_SUCCESS,
      payload: {
        controlKey,
        values,
        itemId
      }
    }
  },
  loadSelectOptionsFail (err) {
    return {
      type: ActionTypes.LOAD_SELECT_OPTIONS_FAILURE,
      payload: {
        err
      }
    }
  },

  loadRuleData (
    id: number,
    requestParams: IDataRequestParams,
    resolve: (data: any[]) => void,
    reject: (error) => void
  ) {
    return {
      type: ActionTypes.LOAD_RULE_DATA,
      payload: {
        id,
        requestParams,
        resolve,
        reject
      }
    }
  },
  ruleDataLoaded () {
    return {
      type: ActionTypes.LOAD_RULE_DATA_SUCCESS
    }
  },
  loadRuleDataFail (err) {
    return {
      type: ActionTypes.LOAD_RULE_DATA_FAILURE,
      payload: {
        err
      }
    }
  },

  loadRuleDistinctValue (ruleId: number, params: Partial<IDistinctValueReqeustParams>, resolve?: any) {
    return {
      type: ActionTypes.LOAD_RULE_DISTINCT_VALUE,
      payload: {
        ruleId,
        params,
        resolve
      }
    }
  },
  ruleDistinctValueLoaded (data: any[]) {
    return {
      type: ActionTypes.LOAD_RULE_DISTINCT_VALUE_SUCCESS,
      payload: {
        data
      }
    }
  },
  loadRuleDistinctValueFail (err) {
    return {
      type: ActionTypes.LOAD_RULE_DISTINCT_VALUE_FAILURE,
      payload: {
        err
      }
    }
  },

  loadRuleDataFromVizItem (
    renderType: RenderType,
    itemId: number,
    ruleId: number,
    requestParams: IDataRequestParams,
    vizType: 'dashboard' | 'display',
    statistic
  ) {
    return {
      type: ActionTypes.LOAD_RULE_DATA_FROM_VIZ_ITEM,
      payload: {
        renderType,
        itemId,
        ruleId,
        requestParams,
        vizType,
        cancelTokenSource: CancelToken.source()
      },
      statistic
    }
  },
  ruleDataFromVizItemLoaded (
    renderType: RenderType,
    itemId: number,
    requestParams: IDataRequestParams,
    result: any[],
    vizType: 'dashboard' | 'display',
    statistic
  ) {
    return {
      type: ActionTypes.LOAD_RULE_DATA_FROM_VIZ_ITEM_SUCCESS,
      payload: {
        renderType,
        itemId,
        requestParams,
        result,
        vizType
      },
      statistic
    }
  },
  loadRuleDataFromVizItemFail (itemId: number, vizType: 'dashboard' | 'display', errorMessage: string) {
    return {
      type: ActionTypes.LOAD_RULE_DATA_FROM_VIZ_ITEM_FAILURE,
      payload: {
        itemId,
        vizType,
        errorMessage
      }
    }
  }
  /** */
}
const mockAction = returnType(RuleActions)
export type RuleActionType = typeof mockAction

export default RuleActions
