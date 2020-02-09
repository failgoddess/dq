
import { createSelector } from 'reselect'

const selectProject = (state) => state.get('project')

const makeSelectProjects = () => createSelector(
  selectProject,
  (projectState) => projectState.get('projects')
)

const makeSelectCurrentProject = () => createSelector(
  selectProject,
  (projectState) => projectState.get('currentProject')
)

const makeSelectSearchProject = () => createSelector(
  selectProject,
  (projectState) => projectState.get('searchProject')
)

const makeSelectStarUserList = () => createSelector(
  selectProject,
  (projectState) => projectState.get('starUserList')
)

const makeSelectCollectProjects = () => createSelector(
  selectProject,
  (projectState) => projectState.get('collectProjects')
)

const makeSelectCurrentProjectRole = () => createSelector(
  selectProject,
  (projectState) => projectState.get('currentProjectRole')
)

const makeSelectProjectRoles = () => createSelector(
  selectProject,
  (projectState) => projectState.get('projectRoles')
)

export {
  selectProject,
  makeSelectProjects,
  makeSelectSearchProject,
  makeSelectCurrentProject,
  makeSelectStarUserList,
  makeSelectCollectProjects,
  makeSelectCurrentProjectRole,
  makeSelectProjectRoles
}
