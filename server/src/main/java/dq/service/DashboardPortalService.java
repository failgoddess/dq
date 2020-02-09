/*
 * <<
 *  dq
 *  ==
 *  Copyright (C) 2016 - 2019 EDP
 *  ==
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *        http://www.apache.org/licenses/LICENSE-2.0
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *  >>
 *
 */

package dq.service;

import dq.core.exception.NotFoundException;
import dq.core.exception.ServerException;
import dq.core.exception.UnAuthorizedExecption;
import dq.core.service.CheckEntityService;
import dq.dto.dashboardDto.DashboardPortalCreate;
import dq.dto.dashboardDto.DashboardPortalUpdate;
import dq.dto.roleDto.VizVisibility;
import dq.model.DashboardPortal;
import dq.model.Role;
import dq.model.User;

import java.util.List;

public interface DashboardPortalService extends CheckEntityService {
    List<DashboardPortal> getDashboardPortals(Long projectId, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    DashboardPortal createDashboardPortal(DashboardPortalCreate dashboardPortalCreate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    DashboardPortal updateDashboardPortal(DashboardPortalUpdate dashboardPortalUpdate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    boolean deleteDashboardPortal(Long id, User user) throws NotFoundException, UnAuthorizedExecption;

    List<Long> getExcludeRoles(Long id);

    boolean postPortalVisibility(Role role, VizVisibility vizVisibility, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;
}
