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
import dq.dto.projectDto.ProjectDetail;
import dq.dto.viewDto.ViewExecuteParam;
import dq.dto.widgetDto.WidgetCreate;
import dq.dto.widgetDto.WidgetUpdate;
import dq.model.User;
import dq.model.Widget;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface WidgetService extends CheckEntityService {
    List<Widget> getWidgets(Long projectId, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    Widget createWidget(WidgetCreate widgetCreate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    boolean updateWidget(WidgetUpdate widgetUpdate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    boolean deleteWidget(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    String shareWidget(Long id, User user, String username) throws NotFoundException, UnAuthorizedExecption, ServerException;

    Widget getWidget(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    String generationFile(Long id, ViewExecuteParam executeParam, User user, String type) throws NotFoundException, ServerException, UnAuthorizedExecption;

    File writeExcel(Set<Widget> widgets, ProjectDetail projectDetail, Map<Long, ViewExecuteParam> executeParamMap, String filePath, User user, boolean containType) throws Exception;
}
