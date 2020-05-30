import { IProjectPermission } from 'app/containers/Projects'

export function initializePermission (currentProject, permissionItem) {
  let isShow
  if (currentProject && currentProject.permission) {
    const currentPermission = currentProject.permission[permissionItem]
    isShow = (currentPermission === 0 || currentPermission === 1) ? false : true
  } else {
    isShow = false
  }
  return isShow
}

export function hasOnlyVizPermission (permission: IProjectPermission) {
  const {
    vizPermission,
    widgetPermission,
    viewPermission,
    rulePermission,
    sourcePermission,
    schedulePermission
  } = permission
  return !widgetPermission
    && !viewPermission
    && !rulePermission
    && !sourcePermission
    && !schedulePermission
    && vizPermission
}

export function hasVizEditPermission (permission: IProjectPermission) {
  const { vizPermission } = permission
  return vizPermission > 1
}
