
import { call, put, all, takeLatest, takeEvery } from 'redux-saga/effects'
import { ActionTypes } from './constants'
import { RuleActions, RuleActionType } from './actions'
import omit from 'lodash/omit'

import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import request, { IDQResponse } from 'utils/request'
import api from 'utils/api'
import { errorHandler, getErrorMessage } from 'utils/util'

import { IRuleBase, IRule, IExecuteSqlResponse, IExecuteSqlParams, IRuleVariable } from './types'
import { IDistinctValueReqeustParams } from 'app/components/Filters/types'

export function* getRules (action: RuleActionType) {
  if (action.type !== ActionTypes.LOAD_RULES) { return }
  const { payload } = action
  const { rulesLoaded, loadRulesFail } = RuleActions
  let rules: IRuleBase[]
  try {
    const asyncData = yield call(request, `${api.rule}?projectId=${payload.projectId}`)
    rules = asyncData.payload
    yield put(rulesLoaded(rules))
  } catch (err) {
    yield put(loadRulesFail())
    errorHandler(err)
  } finally {
    if (payload.resolve) {
      payload.resolve(rules)
    }
  }
}

export function* getRulesDetail (action: RuleActionType) {
  if (action.type !== ActionTypes.LOAD_RULES_DETAIL) { return }
  const { payload } = action
  const { rulesDetailLoaded, loadRulesDetailFail } = RuleActions
  const { ruleIds, resolve, isEditing } = payload
  try {
    // @FIXME make it be a single request
    const asyncData = yield all(ruleIds.map((ruleId) => (call(request, `${api.rule}/${ruleId}`))))
    const rules: IRule[] = asyncData.map((item) => item.payload)
    yield put(rulesDetailLoaded(rules, isEditing))
    if (resolve) { resolve() }
  } catch (err) {
    yield put(loadRulesDetailFail())
    errorHandler(err)
  }
}

export function* addRule (action: RuleActionType) {
  if (action.type !== ActionTypes.ADD_RULE) { return }
  const { payload } = action
  const { rule, resolve } = payload
  const { ruleAdded, addRuleFail } = RuleActions
  try {
    const asyncData = yield call<AxiosRequestConfig>(request, {
      method: 'post',
      url: api.rule,
      data: rule
    })
    yield put(ruleAdded(asyncData.payload))
    resolve()
  } catch (err) {
    yield put(addRuleFail())
    errorHandler(err)
  }
}

export function* editRule (action: RuleActionType) {
  if (action.type !== ActionTypes.EDIT_RULE) { return }
  const { payload } = action
  const { rule, resolve } = payload
  const { ruleEdited, editRuleFail } = RuleActions
  try {
    yield call<AxiosRequestConfig>(request, {
      method: 'put',
      url: `${api.rule}/${rule.id}`,
      data: rule
    })
    yield put(ruleEdited(rule))
    resolve()
  } catch (err) {
    yield put(editRuleFail())
    errorHandler(err)
  }
}

export function* deleteRule (action: RuleActionType) {
  if (action.type !== ActionTypes.DELETE_RULE) { return }
  const { payload } = action
  const { ruleDeleted, deleteRuleFail } = RuleActions
  try {
    yield call<AxiosRequestConfig>(request, {
      method: 'delete',
      url: `${api.rule}/${payload.id}`
    })
    yield put(ruleDeleted(payload.id))
    payload.resolve(payload.id)
  } catch (err) {
    yield put(deleteRuleFail())
    errorHandler(err)
  }
}

export function* copyRule (action: RuleActionType) {
  if (action.type !== ActionTypes.COPY_RULE) { return }
  const { rule, resolve } = action.payload
  const { ruleCopied, copyRuleFail } = RuleActions
  try {
    const fromRuleResponse = yield call(request, `${api.rule}/${rule.id}`)
    const fromRule = fromRuleResponse.payload
    const copyRule: IRule = { ...fromRule, name: rule.name, description: rule.description }
    const asyncData = yield call<AxiosRequestConfig>(request, {
      method: 'post',
      url: api.rule,
      data: copyRule
    })
    yield put(ruleCopied(fromRule.id, asyncData.payload))
    resolve()
  } catch (err) {
    yield put(copyRuleFail())
    errorHandler(err)
  }
}

export function* executeSql (action: RuleActionType) {
  if (action.type !== ActionTypes.EXECUTE_SQL) { return }
  const { params } = action.payload
  const { variables, ...rest } = params
  const omitKeys: Array<keyof IRuleVariable> = ['key', 'alias', 'fromService']
  const variableParam = variables.map((v) => omit(v, omitKeys))
  const { sqlExecuted, executeSqlFail } = RuleActions
  try {
    const asyncData: IDQResponse<IExecuteSqlResponse> = yield call<AxiosRequestConfig>(request, {
      method: 'post',
      url: `${api.rule}/executesql`,
      data: {
        ...rest,
        variables: variableParam
      }
    })
    yield put(sqlExecuted(asyncData))
  } catch (err) {
    const { response } = err as AxiosError
    const { data } = response as AxiosResponse<IDQResponse<any>>
    yield put(executeSqlFail(data.header))
  }

}

/** Rule sagas for external usages */
export function* getRuleData (action: RuleActionType) {
  if (action.type !== ActionTypes.LOAD_RULE_DATA) { return }
  const { id, requestParams, resolve, reject } = action.payload
  const { ruleDataLoaded, loadRuleDataFail } = RuleActions
  try {
    const asyncData = yield call(request, {
      method: 'post',
      url: `${api.rule}/${id}/getdata`,
      data: requestParams
    })
    yield put(ruleDataLoaded())
    const { resultList } = asyncData.payload
    asyncData.payload.resultList = (resultList && resultList.slice(0, 600)) || []
    resolve(asyncData.payload)
  } catch (err) {
    const { response } = err as AxiosError
    const { data } = response as AxiosResponse<IDQResponse<any>>
    yield put(loadRuleDataFail(err))
    reject(data.header)
  }
}

export function* getSelectOptions (action: RuleActionType) {
  if (action.type !== ActionTypes.LOAD_SELECT_OPTIONS) { return }
  const { payload } = action
  const { selectOptionsLoaded, loadSelectOptionsFail } = RuleActions
  try {
    const { controlKey, requestParams, itemId, cancelTokenSource } = payload
    const requestParamsMap: Array<[string, IDistinctValueReqeustParams]> = Object.entries(requestParams)
    const requests = requestParamsMap.map(([ruleId, params]: [string, IDistinctValueReqeustParams]) => {
      const { columns, filters, variables, cache, expired } = params
      return call(request, {
        method: 'post',
        url: `${api.bizlogic}/${ruleId}/getdistinctvalue`,
        data: {
          columns,
          filters,
          params: variables,
          cache,
          expired
        },
        cancelToken: cancelTokenSource.token
      })
    })
    const results = yield all(requests)
    const values = results.reduce((payloads, r, index) => {
      const { columns } = requestParamsMap[index][1]
      if (columns.length === 1) {
        return payloads.concat(r.payload.map((obj) => obj[columns[0]]))
      }
      return payloads
    }, [])
    yield put(selectOptionsLoaded(controlKey, Array.from(new Set(values)), itemId))
  } catch (err) {
    yield put(loadSelectOptionsFail(err))
    // errorHandler(err)
  }
}

export function* getRuleDistinctValue (action: RuleActionType) {
  if (action.type !== ActionTypes.LOAD_RULE_DISTINCT_VALUE) { return }
  const { ruleId, params, resolve } = action.payload
  const { ruleDistinctValueLoaded, loadRuleDistinctValueFail } = RuleActions
  try {
    const result = yield call(request, {
      method: 'post',
      url: `${api.rule}/${ruleId}/getdistinctvalue`,
      data: {
        cache: false,
        expired: 0,
        ...params
      }
    })
    const list = params.columns.reduce((arr, col) => {
      return arr.concat(result.payload.map((item) => item[col]))
    }, [])
    yield put(ruleDistinctValueLoaded(Array.from(new Set(list))))
    if (resolve) {
      resolve(result.payload)
    }
  } catch (err) {
    yield put(loadRuleDistinctValueFail(err))
    errorHandler(err)
  }
}

export function* getRuleDataFromVizItem (action: RuleActionType) {
  if (action.type !== ActionTypes.LOAD_RULE_DATA_FROM_VIZ_ITEM) { return }
  const { renderType, itemId, ruleId, requestParams, vizType, cancelTokenSource } = action.payload
  const { ruleDataFromVizItemLoaded, loadRuleDataFromVizItemFail } = RuleActions
  const {
    filters,
    tempFilters,
    linkageFilters,
    globalFilters,
    variables,
    linkageVariables,
    globalVariables,
    pagination,
    ...rest
  } = requestParams
  const { pageSize, pageNo } = pagination || { pageSize: 0, pageNo: 0 }

  try {
    const asyncData = yield call(request, {
      method: 'post',
      url: `${api.rule}/${ruleId}/getdata`,
      data: {
        ...omit(rest, 'customOrders'),
        filters: filters.concat(tempFilters).concat(linkageFilters).concat(globalFilters),
        params: variables.concat(linkageVariables).concat(globalVariables),
        pageSize,
        pageNo
      },
      cancelToken: cancelTokenSource.token
    })
    const { resultList } = asyncData.payload
    asyncData.payload.resultList = (resultList && resultList.slice(0, 600)) || []
    yield put(ruleDataFromVizItemLoaded(renderType, itemId, requestParams, asyncData.payload, vizType, action.statistic))
  } catch (err) {
    yield put(loadRuleDataFromVizItemFail(itemId, vizType, getErrorMessage(err)))
  }
}
/** */

/** Rule sagas for fetch external authorization variables values */
export function* getDacChannels (action: RuleActionType) {
  if (action.type !== ActionTypes.LOAD_DAC_CHANNELS) { return }
  const { dacChannelsLoaded, loadDacChannelsFail } = RuleActions
  try {
    const asyncData = yield call(request, `${api.rule}/dac/channels`)
    const channels = asyncData.payload
    yield put(dacChannelsLoaded(channels))
  } catch (err) {
    yield put(loadDacChannelsFail())
    errorHandler(err)
  }
}
export function* getDacTenants (action: RuleActionType) {
  if (action.type !== ActionTypes.LOAD_DAC_TENANTS) { return }
  const { dacTenantsLoaded, loadDacTenantsFail } = RuleActions
  const { channelName } = action.payload
  try {
    const asyncData = yield call(request, `${api.rule}/dac/${channelName}/tenants`)
    const tenants = asyncData.payload
    yield put(dacTenantsLoaded(tenants))
  } catch (err) {
    yield put(loadDacTenantsFail())
    errorHandler(err)
  }
}
export function* getDacBizs (action: RuleActionType) {
  if (action.type !== ActionTypes.LOAD_DAC_BIZS) { return }
  const { dacBizsLoaded, loadDacBizsFail } = RuleActions
  const { channelName, tenantId } = action.payload
  try {
    const asyncData = yield call(request, `${api.rule}/dac/${channelName}/tenants/${tenantId}/bizs`)
    const bizs = asyncData.payload
    yield put(dacBizsLoaded(bizs))
  } catch (err) {
    yield put(loadDacBizsFail())
    errorHandler(err)
  }
}
/** */

export default function* rootRuleSaga () {
  yield all([
    takeLatest(ActionTypes.LOAD_RULES, getRules),
    takeEvery(ActionTypes.LOAD_RULES_DETAIL, getRulesDetail),
    takeLatest(ActionTypes.ADD_RULE, addRule),
    takeEvery(ActionTypes.EDIT_RULE, editRule),
    takeEvery(ActionTypes.DELETE_RULE, deleteRule),
    takeEvery(ActionTypes.COPY_RULE, copyRule),
    takeLatest(ActionTypes.EXECUTE_SQL, executeSql),

    takeEvery(ActionTypes.LOAD_RULE_DATA, getRuleData),
    takeEvery(ActionTypes.LOAD_SELECT_OPTIONS, getSelectOptions),
    takeEvery(ActionTypes.LOAD_RULE_DISTINCT_VALUE, getRuleDistinctValue),
    takeEvery(ActionTypes.LOAD_RULE_DATA_FROM_VIZ_ITEM, getRuleDataFromVizItem),

    takeEvery(ActionTypes.LOAD_DAC_CHANNELS, getDacChannels),
    takeEvery(ActionTypes.LOAD_DAC_TENANTS, getDacTenants),
    takeEvery(ActionTypes.LOAD_DAC_BIZS, getDacBizs)
  ])
}
