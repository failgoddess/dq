
import config, { env } from '../globalConfig'

const host = config[env].host

export default {
  login: `${host}/login`,
  group: `${host}/groups`,
  user: `${host}/users`,
  changepwd: `${host}/changepwd`,
  source: `${host}/sources`,
  bizlogic: `${host}/views`,
  view: `${host}/views`,
  // bizdata: `${host}/bizdatas`,
  widget: `${host}/widgets`,
  display: `${host}/displays`,
  share: `${host}/share`,
  checkName: `${host}/check`,
  projectsCheckName: `${host}/check/`,
  uploads: `${host}/uploads`,
  schedule: `${host}/cronjobs`,
  signup: `${host}/users`,
  organizations: `${host}/organizations`,
  checkNameUnique: `${host}/check`,
  projects: `${host}/projects`,
  teams: `${host}/teams`,
  roles: `${host}/roles`,
  portal: `${host}/dashboardPortals`,
  star: `${host}/star`,
  download: `${host}/download`,
  buriedPoints: `${host}/statistic`
}
