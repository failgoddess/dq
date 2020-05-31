import { IRuleModel, ISqlColumn, IRule, IFormedRule, IRuleRoleRaw, IRuleRole } from './types'

import { SqlTypes } from 'app/globalConstants'
import { ModelTypeSqlTypeSetting, VisualTypeSqlTypeSetting, RuleModelVisualTypes, RuleModelTypes } from './constants'

export function getFormedRule (rule: IRule): IFormedRule {
  const { model, variable, roles, correlation, toolbox, action } = rule
  const formedRule = {
    ...rule,
    model: JSON.parse((model || '{}')),
    action: JSON.parse((action || '{}')),
    variable: JSON.parse((variable || '[]')),
    correlation: JSON.parse((correlation || '{}')),
    toolbox: JSON.parse((toolbox || '{}')),
    roles: (roles as IRuleRoleRaw[]).map<IRuleRole>(({ roleId, columnAuth, rowAuth }) => ({
      roleId,
      columnAuth: JSON.parse(columnAuth || '[]'),
      rowAuth: JSON.parse(rowAuth || '[]')
    }))
  }
  return formedRule
}

function getMapKeyByValue (value: SqlTypes, map: typeof VisualTypeSqlTypeSetting | typeof ModelTypeSqlTypeSetting) {
  let result
  Object.entries(map).some(([key, values]) => {
    if (values.includes(value)) {
      result = key
      return true
    }
  })
  return result
}

export function getValidModel (model: IRuleModel, sqlColumns: ISqlColumn[]) {
  if (!Array.isArray(sqlColumns)) { return {} }

  const validModel = sqlColumns.reduce<IRuleModel>((accModel, column) => {
    const { name: columnName, type: columnType } = column
    const modelItem = model[columnName]
    if (!modelItem) {
      accModel[columnName] = {
        sqlType: columnType,
        visualType: getMapKeyByValue(columnType, VisualTypeSqlTypeSetting) || RuleModelVisualTypes.String,
        modelType: getMapKeyByValue(columnType, ModelTypeSqlTypeSetting) || RuleModelTypes.Category
      }
    } else {
      accModel[columnName] = { ...modelItem }
      // @TODO verify modelType & visualType are valid by the sqlType or not
      // if (!VisualTypeSqlTypeSetting[item.visualType].includes(columnType)) {
      //   needNotify = true
      //   item.visualType = getMapKeyByValue(columnType, VisualTypeSqlTypeSetting)
      // }
      // if (!ModelTypeSqlTypeSetting[item.modelType].includes(columnType)) {
      //   needNotify = true
      //   item.modelType = getMapKeyByValue(columnType, ModelTypeSqlTypeSetting)
      // }
    }
    return accModel
  }, {})

  return validModel
}

export function getValidRoleModelNames (model: IRuleModel, modelNames: string[]) {
  if (!Array.isArray(modelNames)) { return [] }

  const validModelNames = modelNames.filter((name) => !!model[name])
  return validModelNames
}
