
import { createSelector } from 'reselect'

const selectOrganization = (state) => state.get('organization')

const makeSelectOrganizations = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('organizations')
)

const makeSelectInviteMemberList = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('inviteMemberLists')
)

const makeSelectCurrentOrganizations = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('currentOrganization')
)

const makeSelectCurrentOrganizationProjects = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('currentOrganizationProjects')
)

const makeSelectCurrentOrganizationProjectsDetail = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('currentOrganizationProjectsDetail')
)

const makeSelectCurrentOrganizationRole = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('currentOrganizationRole')
)

const makeSelectCurrentOrganizationMembers = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('currentOrganizationMembers')
)

const makeSelectRoleModalLoading = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('roleModalLoading')
)

const makeSelectCurrentOrganizationProject = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('projectDetail')
)

const makeSelectCurrentOrganizationProjectAdmins = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('projectAdmins')
)

const makeSelectCurrentOrganizationProjectRoles = () => createSelector(
  selectOrganization,
  (organizationState) => organizationState.get('projectRoles')
)


export {
  selectOrganization,
  makeSelectOrganizations,
  makeSelectCurrentOrganizations,
  makeSelectCurrentOrganizationProjects,
  makeSelectCurrentOrganizationProjectsDetail,
  makeSelectCurrentOrganizationRole,
  makeSelectCurrentOrganizationMembers,
  makeSelectInviteMemberList,
  makeSelectRoleModalLoading,
  makeSelectCurrentOrganizationProject,
  makeSelectCurrentOrganizationProjectAdmins,
  makeSelectCurrentOrganizationProjectRoles
}
