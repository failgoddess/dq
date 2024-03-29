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


import dq.core.exception.ServerException;
import dq.core.common.ResultMap;
import dq.core.service.CheckEntityService;
import dq.dto.userDto.UserBaseInfo;
import dq.dto.userDto.UserLogin;
import dq.dto.userDto.UserRegist;
import dq.model.User;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

public interface UserService extends CheckEntityService {

    User getByUsername(String username);

    User userLogin(UserLogin userLogin) throws ServerException;

    List<UserBaseInfo> getUsersByKeyword(String keyword, User user, Long orgId, Boolean includeSelf);

    boolean updateUser(User user) throws ServerException;

    User regist(UserRegist userRegist) throws ServerException;

//    ResultMap activateUser(User user, String token, HttpServletRequest request);

    boolean sendMail(String email, User user) throws ServerException;

    ResultMap changeUserPassword(User user, String oldPassword, String password, HttpServletRequest request);

    ResultMap uploadAvatar(User user, MultipartFile file, HttpServletRequest request);

    ResultMap activateUserNoLogin(String token, HttpServletRequest request);

    ResultMap getUserProfile(Long id, User user, HttpServletRequest request);
}
