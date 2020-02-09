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
import dq.dto.cronJobDto.CronJobBaseInfo;
import dq.dto.cronJobDto.CronJobInfo;
import dq.dto.cronJobDto.CronJobUpdate;
import dq.model.CronJob;
import dq.model.User;

import java.util.List;

public interface CronJobService extends CheckEntityService {
    List<CronJob> getCronJobs(Long projectId, User user);

    CronJob getCronJob(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    CronJobInfo createCronJob(CronJobBaseInfo cronJobBaseInfo, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    boolean updateCronJob(CronJobUpdate cronJobUpdate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    boolean deleteCronJob(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    CronJob startCronJob(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    CronJob stopCronJob(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException;

    void startAllJobs();
}
