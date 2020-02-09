
import { DownloadStatus } from './types'

export const LOGIN = 'dq/App/LOGIN'
export const LOGGED = 'dq/App/LOGGED'
export const LOGIN_ERROR = 'dq/App/LOGIN_ERROR'
export const ACTIVE = 'dq/App/ACTIVE'
export const ACTIVE_SUCCESS = 'dq/App/ACTIVE_SUCCESS'
export const ACTIVE_ERROR = 'dq/App/ACTIVE_ERROR'

export const JOIN_ORGANIZATION = 'dq/App/JOIN_ORGANIZATION'
export const JOIN_ORGANIZATION_SUCCESS = 'dq/App/JOIN_ORGANIZATION_SUCCESS'
export const JOIN_ORGANIZATION_ERROR = 'dq/App/JOIN_ORGANIZATION_ERROR'

export const LOGOUT = 'dq/App/LOGOUT'
export const GET_LOGIN_USER = 'dq/App/GET_LOGIN_USER'
export const GET_LOGIN_USER_ERROR = 'dq/App/GET_LOGIN_USER_ERROR'
export const SHOW_NAVIGATOR = 'dq/App/SHOW_NAVIGATOR'
export const HIDE_NAVIGATOR = 'dq/App/HIDE_NAVIGATOR'
export const CHECK_NAME = 'dq/App/CHECK_NAME'

export const UPDATE_PROFILE = 'dq/App/UPDATE_PROFILE'
export const UPDATE_PROFILE_SUCCESS = 'dq/App/UPDATE_PROFILE_SUCCESS'
export const UPDATE_PROFILE_ERROR = 'dq/App/UPDATE_PROFILE_ERROR'

export const UPLOAD_AVATAR_SUCCESS = 'dq/App/UPLOAD_AVATAR_SUCCESS'

export const CHANGE_USER_PASSWORD = 'dq/User/CHANGE_USER_PASSWORD'
export const CHANGE_USER_PASSWORD_SUCCESS = 'dq/User/CHANGE_USER_PASSWORD_SUCCESS'
export const CHANGE_USER_PASSWORD_FAILURE = 'dq/User/CHANGE_USER_PASSWORD_FAILURE'

export const LOAD_DOWNLOAD_LIST = 'dq/Download/LOAD_DOWNLOAD_LIST'
export const LOAD_DOWNLOAD_LIST_SUCCESS = 'dq/Download/LOAD_DOWNLOAD_LIST_SUCCESS'
export const LOAD_DOWNLOAD_LIST_FAILURE = 'dq/Download/LOAD_DOWNLOAD_LIST_FAILURE'
export const DOWNLOAD_FILE = 'dq/Download/DOWNLOAD_FILE'
export const DOWNLOAD_FILE_SUCCESS = 'dq/Download/DOWNLOAD_FILE_SUCCESS'
export const DOWNLOAD_FILE_FAILURE = 'dq/Download/DOWNLOAD_FILE_FAILURE'
export const INITIATE_DOWNLOAD_TASK = 'dq/Download/INITIATE_DOWNLOAD_TASK'
export const INITIATE_DOWNLOAD_TASK_SUCCESS = 'dq/Download/INITIATE_DOWNLOAD_TASK_SUCCESS'
export const INITIATE_DOWNLOAD_TASK_FAILURE = 'dq/Download/INITIATE_DOWNLOAD_TASK_FAILURE'

export const CREATE_ORGANIZATION_PROJECT = 'dq/permission/CREATE_ORGANIZATION_PROJECT'
export const DELETE_ORGANIZATION_PROJECT = 'dq/permission/DELETE_ORGANIZATION_PROJECT'
export const INVITE_ORGANIZATION_MEMBER = 'dq/permission/CREATE_ORGANIZATION_PROJECT'
export const CHANGE_ORGANIZATION_MEMBER_ROLE = 'dq/permission/CHANGE_ORGANIZATION_MEMBER_ROLE'
export const DELETE_ORGANIZATION_MEMBER = 'dq/permission/DELETE_ORGANIZATION_MEMBER'
export const CREATE_ORGANIZATION_TEAM = 'dq/permission/CREATE_ORGANIZATION_TEAM'
export const UPDATE_ORGANIZATION = 'dq/permission/UPDATE_ORGANIZATION'
export const UPDATE_PROJECT_VISIBILITY = 'dq/permission/UPDATE_PROJECT_VISIBILITY'
export const DELETE_ORGANIZATION = 'dq/permission/DELETE_ORGANIZATION'
export const TRANSFER_PROJECT_TO_ORGANIZATION = 'dq/permission/TRANSFER_PROJECT_TO_ORGANIZATION'
export const ADD_TEAM_MEMBER = 'dq/permission/ADD_TEAM_MEMBER'
export const CHANGE_TEAM_MEMBER_ROLE = 'dq/permission/CHANGE_TEAM_MEMBER_ROLE'
export const DELETE_TEAM_MEMBER = 'dq/permission/DELETE_TEAM_MEMBER'
export const ADD_TEAM_PROJECT = 'dq/permission/ADD_TEAM_PROJECT'
export const DELETE_TEAM_PROJECT = 'dq/permission/DELETE_TEAM_PROJECT'
export const UPDATE_TEAM_PROJECT_PERMISSION = 'dq/permission/UPDATE_TEAM_PROJECT_PERMISSION'
export const UPDATE_TEAM = 'dq/permission/UPDATE_TEAM'
export const DELETE_TEAM = 'dq/permission/DELETE_TEAM'

export const DOWNLOAD_STATUS_COLORS = {
  [DownloadStatus.Processing]: 'blue',
  [DownloadStatus.Success]: 'green',
  [DownloadStatus.Failed]: 'red',
  [DownloadStatus.Downloaded]: 'grey'
}

export const DOWNLOAD_STATUS_LOCALE = {
  [DownloadStatus.Processing]: '处理中',
  [DownloadStatus.Success]: '成功',
  [DownloadStatus.Failed]: '失败',
  [DownloadStatus.Downloaded]: '已下载'
}
