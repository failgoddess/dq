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

package dq.service.impl;

import com.alibaba.druid.util.StringUtils;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import dq.core.exception.NotFoundException;
import dq.core.exception.ServerException;
import dq.core.exception.UnAuthorizedExecption;
import dq.core.model.Dict;
import dq.core.model.Paginate;
import dq.core.model.PaginateWithQueryColumns;
import dq.core.utils.CollectionUtils;
import dq.core.utils.MD5Util;
import dq.core.utils.RedisUtils;
import dq.core.utils.SqlUtils;
import dq.core.common.Constants;
import dq.core.enums.LogNameEnum;
import dq.core.enums.SqlVariableTypeEnum;
import dq.core.enums.SqlVariableValueTypeEnum;
import dq.core.enums.UserPermissionEnum;
import dq.core.model.SqlEntity;
import dq.core.model.SqlFilter;
import dq.core.utils.SqlParseUtils;
import dq.dao.RelRoleViewMapper;
import dq.dao.SourceMapper;
import dq.dao.ViewMapper;
import dq.dao.WidgetMapper;
import dq.dto.projectDto.ProjectDetail;
import dq.dto.projectDto.ProjectPermission;
import dq.dto.sourceDto.SourceBaseInfo;
import dq.dto.viewDto.*;
import dq.model.*;
import dq.service.ProjectService;
import dq.service.ViewService;
import dq.service.excel.SQLContext;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.stringtemplate.v4.ST;
import org.stringtemplate.v4.STGroup;
import org.stringtemplate.v4.STGroupFile;

import java.sql.SQLException;
import java.util.*;
import java.util.Map.Entry;
import java.util.concurrent.*;
import java.util.stream.Collectors;

import static dq.core.consts.Consts.COMMA;
import static dq.core.consts.Consts.MINUS;
import static dq.core.common.Constants.NO_AUTH_PERMISSION;
import static dq.core.enums.SqlVariableTypeEnum.AUTHVARE;
import static dq.core.enums.SqlVariableTypeEnum.QUERYVAR;

@Slf4j
@Service("viewService")
public class ViewServiceImpl implements ViewService {

    private static final Logger optLogger = LoggerFactory.getLogger(LogNameEnum.BUSINESS_OPERATION.getName());

    @Autowired
    private ViewMapper viewMapper;

    @Autowired
    private SourceMapper sourceMapper;

    @Autowired
    private WidgetMapper widgetMapper;

    @Autowired
    private RelRoleViewMapper relRoleViewMapper;

    @Autowired
    private SqlUtils sqlUtils;

    @Autowired
    private RedisUtils redisUtils;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private SqlParseUtils sqlParseUtils;

    @Value("${sql_template_delimiter:$}")
    private String sqlTempDelimiter;

    private static final String SQL_VARABLE_KEY = "name";

    @Override
    public synchronized boolean isExist(String name, Long id, Long projectId) {
        Long viewId = viewMapper.getByNameWithProjectId(name, projectId);
        if (null != id && null != viewId) {
            return !id.equals(viewId);
        }
        return null != viewId && viewId.longValue() > 0L;
    }

    /**
     * 获取View列表
     *
     * @param projectId
     * @param user
     * @return
     */
    @Override
    public List<ViewBaseInfo> getViews(Long projectId, User user) throws NotFoundException, UnAuthorizedExecption, ServerException {

        ProjectDetail projectDetail = null;
        try {
            projectDetail = projectService.getProjectDetail(projectId, user, false);
        } catch (NotFoundException e) {
            throw e;
        } catch (UnAuthorizedExecption e) {
            return null;
        }

        List<ViewBaseInfo> views = viewMapper.getViewBaseInfoByProject(projectId);

        if (null != views) {
            ProjectPermission projectPermission = projectService.getProjectPermission(projectDetail, user);
            if (projectPermission.getVizPermission() == UserPermissionEnum.HIDDEN.getPermission() &&
                    projectPermission.getWidgetPermission() == UserPermissionEnum.HIDDEN.getPermission() &&
                    projectPermission.getViewPermission() == UserPermissionEnum.HIDDEN.getPermission()) {
                return null;
            }
        }

        return views;
    }

    @Override
    public ViewWithSourceBaseInfo getView(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException {
        ViewWithSourceBaseInfo view = viewMapper.getViewWithSourceBaseInfo(id);
        if (null == view) {
            throw new NotFoundException("view is not found");
        }

        ProjectDetail projectDetail = projectService.getProjectDetail(view.getProjectId(), user, false);
        ProjectPermission projectPermission = projectService.getProjectPermission(projectDetail, user);
        if (projectPermission.getVizPermission() == UserPermissionEnum.HIDDEN.getPermission() &&
                projectPermission.getWidgetPermission() == UserPermissionEnum.HIDDEN.getPermission() &&
                projectPermission.getViewPermission() == UserPermissionEnum.HIDDEN.getPermission()) {
            throw new UnAuthorizedExecption("Insufficient permissions");
        }

        List<RelRoleView> relRoleViews = relRoleViewMapper.getByView(view.getId());
        view.setRoles(relRoleViews);

        return view;
    }

    @Override
    public SQLContext getSQLContext(boolean isMaintainer, ViewWithSource viewWithSource, ViewExecuteParam executeParam, User user) {
        if (null == executeParam || (CollectionUtils.isEmpty(executeParam.getGroups()) && CollectionUtils.isEmpty(executeParam.getAggregators()))) {
            return null;
        }
        if (null == viewWithSource.getSource()) {
            throw new NotFoundException("source is not found");
        }
        if (StringUtils.isEmpty(viewWithSource.getLeftSql()) && StringUtils.isEmpty(viewWithSource.getRightSql())) {
            throw new NotFoundException("sql is not found");
        }

        SQLContext context = new SQLContext();
        //解析变量
        List<SqlVariable> variables = viewWithSource.getVariables();
        //解析sql
        SqlEntity leftSqlEntity = sqlParseUtils.parseSql(viewWithSource.getLeftSql(), variables, sqlTempDelimiter);
        SqlEntity rightSqlEntity = sqlParseUtils.parseSql(viewWithSource.getRightSql(), variables, sqlTempDelimiter);

        //列权限（只记录被限制访问的字段）
        Set<String> excludeColumns = new HashSet<>();

        packageParams(isMaintainer, viewWithSource.getId(), leftSqlEntity, variables, executeParam.getParams(), excludeColumns, user);
        packageParams(isMaintainer, viewWithSource.getId(), rightSqlEntity, variables, executeParam.getParams(), excludeColumns, user);


        String leftSrcSql = sqlParseUtils.replaceParams(leftSqlEntity.getSql(), leftSqlEntity.getQuaryParams(), leftSqlEntity.getAuthParams(), sqlTempDelimiter);
        String rightSrcSql = sqlParseUtils.replaceParams(rightSqlEntity.getSql(), rightSqlEntity.getQuaryParams(), rightSqlEntity.getAuthParams(), sqlTempDelimiter);
        
        context.setExecuteSqlDict(new Dict<>(sqlParseUtils.getSqls(leftSrcSql,Boolean.FALSE),sqlParseUtils.getSqls(rightSrcSql,Boolean.FALSE)));

        List<String> leftQuerySqlList = sqlParseUtils.getSqls(leftSrcSql, Boolean.TRUE);
        List<String> rightQuerySqlList = sqlParseUtils.getSqls(leftSrcSql, Boolean.TRUE);
        if (!CollectionUtils.isEmpty(leftQuerySqlList) || !CollectionUtils.isEmpty(rightQuerySqlList)) {
            Source source = viewWithSource.getSource();
            
            buildQuerySql(leftQuerySqlList, source, executeParam);
            buildQuerySql(rightQuerySqlList, source, executeParam);
            
            executeParam.addExcludeColumn(excludeColumns, source.getJdbcUrl(), source.getDbVersion());
            
            context.setQuerySqlDict(new Dict<>(leftQuerySqlList,rightQuerySqlList));
            context.setViewExecuteParam(executeParam);
        }
        if (!CollectionUtils.isEmpty(excludeColumns)) {
            List<String> excludeList = excludeColumns.stream().collect(Collectors.toList());
            context.setExcludeColumns(excludeList);
        }
        return context;
    }

    /**
     * 新建View
     *
     * @param viewCreate
     * @param user
     * @return
     */
    @Override
    @Transactional
    public ViewWithSourceBaseInfo createView(ViewCreate viewCreate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException {
        ProjectDetail projectDetail = projectService.getProjectDetail(viewCreate.getProjectId(), user, false);
        ProjectPermission projectPermission = projectService.getProjectPermission(projectDetail, user);

        if (projectPermission.getViewPermission() < UserPermissionEnum.WRITE.getPermission()) {
            throw new UnAuthorizedExecption("you have not permission to create view");
        }

        if (isExist(viewCreate.getName(), null, viewCreate.getProjectId())) {
            log.info("the view {} name is already taken", viewCreate.getName());
            throw new ServerException("the view name is already taken");
        }

        Source source = sourceMapper.getById(viewCreate.getSourceId());
        if (null == source) {
            log.info("source (:{}) not found", viewCreate.getSourceId());
            throw new NotFoundException("source is not found");
        }

        //测试连接
        boolean testConnection = sqlUtils.init(source).testConnection();

        if (testConnection) {
            View view = new View().createdBy(user.getId());
            BeanUtils.copyProperties(viewCreate, view);

            int insert = viewMapper.insert(view);
            if (insert > 0) {
                optLogger.info("view ({}) is create by user (:{})", view.toString(), user.getId());
                if (!CollectionUtils.isEmpty(viewCreate.getRoles()) && !StringUtils.isEmpty(viewCreate.getVariable())) {
                    checkAndInsertRoleParam(viewCreate.getVariable(), viewCreate.getRoles(), user, view);
                }

                SourceBaseInfo sourceBaseInfo = new SourceBaseInfo();
                BeanUtils.copyProperties(source, sourceBaseInfo);

                ViewWithSourceBaseInfo viewWithSource = new ViewWithSourceBaseInfo();
                BeanUtils.copyProperties(view, viewWithSource);
                viewWithSource.setSource(sourceBaseInfo);
                return viewWithSource;
            } else {
                throw new ServerException("create view fail");
            }
        } else {
            throw new ServerException("get source connection fail");
        }
    }


    /**
     * 更新View
     *
     * @param viewUpdate
     * @param user
     * @return
     */
    @Override
    @Transactional
    public boolean updateView(ViewUpdate viewUpdate, User user) throws NotFoundException, UnAuthorizedExecption, ServerException {

        View view = viewMapper.getById(viewUpdate.getId());
        if (null == view) {
            throw new NotFoundException("view is not found");
        }

        ProjectDetail projectDetail = projectService.getProjectDetail(view.getProjectId(), user, false);

        ProjectPermission projectPermission = projectService.getProjectPermission(projectDetail, user);
        if (projectPermission.getViewPermission() < UserPermissionEnum.WRITE.getPermission()) {
            throw new UnAuthorizedExecption("you have not permission to update this view");
        }

        if (isExist(viewUpdate.getName(), viewUpdate.getId(), view.getProjectId())) {
            log.info("the view {} name is already taken", viewUpdate.getName());
            throw new ServerException("the view name is already taken");
        }

        Source source = sourceMapper.getById(viewUpdate.getSourceId());
        if (null == source) {
            log.info("source not found");
            throw new NotFoundException("source is not found");
        }

        //测试连接
        boolean testConnection = sqlUtils.init(source).testConnection();

        if (testConnection) {

            String originStr = view.toString();
            BeanUtils.copyProperties(viewUpdate, view);
            view.updatedBy(user.getId());

            int update = viewMapper.update(view);
            if (update > 0) {
                optLogger.info("view ({}) is updated by user(:{}), origin: ({})", view.toString(), user.getId(), originStr);
                if (CollectionUtils.isEmpty(viewUpdate.getRoles())) {
                    relRoleViewMapper.deleteByViewId(viewUpdate.getId());
                } else if (!StringUtils.isEmpty(viewUpdate.getVariable())) {
                    checkAndInsertRoleParam(viewUpdate.getVariable(), viewUpdate.getRoles(), user, view);
                }

                return true;
            } else {
                throw new ServerException("update view fail");
            }
        } else {
            throw new ServerException("get source connection fail");
        }
    }


    /**
     * 删除View
     *
     * @param id
     * @param user
     * @return
     */
    @Override
    @Transactional
    public boolean deleteView(Long id, User user) throws NotFoundException, UnAuthorizedExecption, ServerException {

        View view = viewMapper.getById(id);

        if (null == view) {
            log.info("view (:{}) not found", id);
            throw new NotFoundException("view is not found");
        }

        ProjectDetail projectDetail = null;
        try {
            projectDetail = projectService.getProjectDetail(view.getProjectId(), user, false);
        } catch (NotFoundException e) {
            throw e;
        } catch (UnAuthorizedExecption e) {
            throw new UnAuthorizedExecption("you have not permission to delete this view");
        }

        ProjectPermission projectPermission = projectService.getProjectPermission(projectDetail, user);
        if (projectPermission.getViewPermission() < UserPermissionEnum.DELETE.getPermission()) {
            throw new UnAuthorizedExecption("you have not permission to delete this view");
        }

        List<Widget> widgets = widgetMapper.getWidgetsByWiew(id);
        if (!CollectionUtils.isEmpty(widgets)) {
            throw new ServerException("The current view has been referenced, please delete the reference and then operate");
        }

        int i = viewMapper.deleteById(id);
        if (i > 0) {
            optLogger.info("view ( {} ) delete by user( :{} )", view.toString(), user.getId());
            relRoleViewMapper.deleteByViewId(id);
        }

        return true;
    }


    /**
     * 执行sql
     *
     * @param executeSql
     * @param user
     * @return
     */
    @Override
    public Dict<PaginateWithQueryColumns,PaginateWithQueryColumns> executeSql(ViewExecuteSql executeSql, User user) throws NotFoundException, UnAuthorizedExecption, ServerException {

        Source source = sourceMapper.getById(executeSql.getSourceId());
        if (null == source) {
            throw new NotFoundException("source is not found");
        }

        ProjectDetail projectDetail = projectService.getProjectDetail(source.getProjectId(), user, false);

        ProjectPermission projectPermission = projectService.getProjectPermission(projectDetail, user);

        if (projectPermission.getSourcePermission() == UserPermissionEnum.HIDDEN.getPermission()
                || projectPermission.getViewPermission() < UserPermissionEnum.WRITE.getPermission()) {
            throw new UnAuthorizedExecption("you have not permission to execute sql");
        }

        //结构化Sql
        PaginateWithQueryColumns leftPaginateWithQueryColumns = new PaginateWithQueryColumns();
        PaginateWithQueryColumns rightPaginateWithQueryColumns = new PaginateWithQueryColumns();
        try {
            Dict<SqlEntity,SqlEntity> sqlDictEntity = new Dict<>(sqlParseUtils.parseSql(executeSql.getLeftSql(), executeSql.getVariables(), sqlTempDelimiter),sqlParseUtils.parseSql(executeSql.getRightSql(), executeSql.getVariables(), sqlTempDelimiter));
            if (null != sqlUtils) {
                if ((null != sqlDictEntity.getKey() && !StringUtils.isEmpty(sqlDictEntity.getKey().getSql()))) {

                    if (isMaintainer(user, projectDetail)) {
                    	sqlDictEntity.getKey().setAuthParams(null);
                    }

                    if (!CollectionUtils.isEmpty(sqlDictEntity.getKey().getQuaryParams())) {
                    	sqlDictEntity.getKey().getQuaryParams().forEach((k, v) -> {
                            if (v instanceof List && ((List) v).size() > 0) {
                                v = ((List) v).stream().collect(Collectors.joining(COMMA)).toString();
                            }
                            sqlDictEntity.getKey().getQuaryParams().put(k, v);
                        });
                    }

                    String srcSql = sqlParseUtils.replaceParams(sqlDictEntity.getKey().getSql(), sqlDictEntity.getKey().getQuaryParams(), sqlDictEntity.getKey().getAuthParams(), sqlTempDelimiter);
                    
                    SqlUtils sqlUtils = this.sqlUtils.init(source);

                    List<String> executeSqlList = sqlParseUtils.getSqls(srcSql, false);

                    List<String> querySqlList = sqlParseUtils.getSqls(srcSql, true);

                    if (!CollectionUtils.isEmpty(executeSqlList)) {
                        executeSqlList.forEach(dict -> {sqlUtils.execute(dict);});
                    }
                    if (!CollectionUtils.isEmpty(querySqlList)) {
                        for (String str : querySqlList) {
                        	leftPaginateWithQueryColumns = sqlUtils.syncQuery4Paginate(str, null, null, null, executeSql.getLimit(), null);
                        }
                    }
                }
                                
                if (null != sqlDictEntity.getValue() && !StringUtils.isEmpty(sqlDictEntity.getValue().getSql())) {

                    if (isMaintainer(user, projectDetail)) {
                    	sqlDictEntity.getValue().setAuthParams(null);
                    }

                    if (!CollectionUtils.isEmpty(sqlDictEntity.getValue().getQuaryParams())) {
                    	sqlDictEntity.getValue().getQuaryParams().forEach((k, v) -> {
                            if (v instanceof List && ((List) v).size() > 0) {
                                v = ((List) v).stream().collect(Collectors.joining(COMMA)).toString();
                            }
                            sqlDictEntity.getValue().getQuaryParams().put(k, v);
                        });
                    }

                    String srcSql = sqlParseUtils.replaceParams(sqlDictEntity.getValue().getSql(), sqlDictEntity.getValue().getQuaryParams(), sqlDictEntity.getValue().getAuthParams(), sqlTempDelimiter);
                    
                    SqlUtils sqlUtils = this.sqlUtils.init(source);

                    List<String> executeSqlList = sqlParseUtils.getSqls(srcSql, false);

                    List<String> querySqlList = sqlParseUtils.getSqls(srcSql, true);

                    if (!CollectionUtils.isEmpty(executeSqlList)) {
                        executeSqlList.forEach(dict -> {sqlUtils.execute(dict);});
                    }
                    if (!CollectionUtils.isEmpty(querySqlList)) {
                        for (String str : querySqlList) {
                        	rightPaginateWithQueryColumns = sqlUtils.syncQuery4Paginate(str, null, null, null, executeSql.getLimit(), null);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerException(e.getMessage());
        }
        
        if(!(StringUtils.isEmpty(executeSql.getCondition()))) {
        	Dict<List<String>,List<String>> andCondition = SqlUtils.pareseConditionColumn(executeSql.getCondition());
        	// 后面引入antlr，将条件追加到下发sql中，这段逻辑还得改
        	Map<String,Dict<Integer,Integer>> mapDict = new HashMap<String,Dict<Integer,Integer>>();
        	
        	int length = (int)Math.max(leftPaginateWithQueryColumns.getTotalCount(),rightPaginateWithQueryColumns.getTotalCount());
        	for(int i=0;i<length;i++) {
            	Map<String,Object> leftMap = leftPaginateWithQueryColumns.getResultList().get(i);
            	Map<String,Object> rightMap = rightPaginateWithQueryColumns.getResultList().get(i);
            	
            	if(leftMap!=null) {
            		StringBuilder sb = new StringBuilder();
            		for(String key : andCondition.getKey()){
            			sb.append(leftMap.getOrDefault(key, ""));
            		}
            		if(mapDict.containsKey(sb.toString())){
            			mapDict.get(sb.toString()).setKey(i);
            		}else{
            			mapDict.put(sb.toString(), new Dict(i,-1));
            		}
            	}
            	
            	if(rightMap!=null) {
            		StringBuilder sb = new StringBuilder();
            		for(String key : andCondition.getValue()){
            			sb.append(rightMap.getOrDefault(key, ""));
            		}
            		if(mapDict.containsKey(sb.toString())){
            			mapDict.get(sb.toString()).setValue(i);
            		}else{
            			mapDict.put(sb.toString(), new Dict(-1,i));
            		}
            	}
            }
        	List<Map<String,Object>> leftResultList = new ArrayList<Map<String,Object>>();
        	List<Map<String,Object>> rightResultList = new ArrayList<Map<String,Object>>();
        	for(Entry<String,Dict<Integer,Integer>> entry : mapDict.entrySet()){
        		if(entry.getValue().getKey() ==-1){
        			leftResultList.add(new HashMap<String,Object>());
        			rightResultList.add(rightPaginateWithQueryColumns.getResultList().get(entry.getValue().getValue()));
        		}else if(entry.getValue().getValue() ==-1){
        			leftResultList.add(leftPaginateWithQueryColumns.getResultList().get(entry.getValue().getKey()));
        			rightResultList.add(new HashMap<String,Object>());
        		}else{
        			leftResultList.add(leftPaginateWithQueryColumns.getResultList().get(entry.getValue().getKey()));
        			rightResultList.add(rightPaginateWithQueryColumns.getResultList().get(entry.getValue().getValue()));
        		}
        	}
        	
        	leftPaginateWithQueryColumns.setResultList(leftResultList);
        	rightPaginateWithQueryColumns.setResultList(rightResultList);
        }
        return new Dict<>(leftPaginateWithQueryColumns,rightPaginateWithQueryColumns);
    }

    private boolean isMaintainer(User user, ProjectDetail projectDetail) {
        return projectService.isMaintainer(projectDetail, user);
    }

    /**
     * 返回view源数据集
     *
     * @param id
     * @param executeParam
     * @param user
     * @return
     */
    @Override
    public Paginate<Map<String, Object>> getData(Long id, ViewExecuteParam executeParam, User user) throws NotFoundException, UnAuthorizedExecption, ServerException, SQLException {
        if (null == executeParam || (CollectionUtils.isEmpty(executeParam.getGroups()) && CollectionUtils.isEmpty(executeParam.getAggregators()))) {
            return null;
        }

        ViewWithSource viewWithSource = viewMapper.getViewWithSource(id);
        if (null == viewWithSource) {
            log.info("view (:{}) not found", id);
            throw new NotFoundException("view is not found");
        }

        ProjectDetail projectDetail = projectService.getProjectDetail(viewWithSource.getProjectId(), user, false);

        boolean allowGetData = projectService.allowGetData(projectDetail, user);

        if (!allowGetData) {
            throw new UnAuthorizedExecption("you have not permission to get data");
        }

        boolean maintainer = projectService.isMaintainer(projectDetail, user);
        return getResultDataList(maintainer, viewWithSource, executeParam, user);
    }


    public void buildQuerySql(List<String> querySqlList, Source source, ViewExecuteParam executeParam) {
        if (null != executeParam) {
            //构造参数， 原有的被传入的替换
            STGroup stg = new STGroupFile(Constants.SQL_TEMPLATE);
            ST st = stg.getInstanceOf("querySql");
            st.add("nativeQuery", executeParam.isNativeQuery());
            st.add("groups", executeParam.getGroups());

            if (executeParam.isNativeQuery()) {
            	st.add("aggregators", executeParam.getAggregators());
            } else {
            	st.add("aggregators", executeParam.getAggregators(source.getJdbcUrl(), source.getDbVersion()));
            }
            st.add("orders", executeParam.getOrders(source.getJdbcUrl(), source.getDbVersion()));
            st.add("filters", convertFilters(executeParam.getFilters(), source));
            st.add("keywordPrefix", sqlUtils.getKeywordPrefix(source.getJdbcUrl(), source.getDbVersion()));
            st.add("keywordSuffix", sqlUtils.getKeywordSuffix(source.getJdbcUrl(), source.getDbVersion()));

            for (int i = 0; i < querySqlList.size(); i++) {                                 
            	st.add("sql", querySqlList.get(i));                     
            	querySqlList.set(i, st.render());                                                                  
            }
        }
    }

	public List<String> convertFilters(List<String> filterStrs, Source source){
        List<String> whereClauses = new ArrayList<>();
        List<SqlFilter> filters = new ArrayList<>();
        try{
            if(null == filterStrs || filterStrs.isEmpty()){
                return null;
            }

            for(String str : filterStrs){
                SqlFilter obj = JSON.parseObject(str, SqlFilter.class);
                if(!StringUtils.isEmpty(obj.getName())){
                    obj.setName(ViewExecuteParam.getField(obj.getName(), source.getJdbcUrl(), source.getDbVersion()));
                }
                filters.add(obj);
            }
            filters.forEach(filter -> whereClauses.add(SqlFilter.dealFilter(filter)));

        }catch (Exception e){
            log.error("convertFilters error . filterStrs = {}, source = {}, filters = {} , whereClauses = {} ",
                    JSON.toJSON(filterStrs), JSON.toJSON(source), JSON.toJSON(filters), JSON.toJSON(whereClauses));
            throw e;
        }
        return whereClauses;
    }


    /**
     * 获取结果集
     *
     * @param isMaintainer
     * @param viewWithSource
     * @param executeParam
     * @param user
     * @return
     * @throws ServerException
     */
    @Override
    public PaginateWithQueryColumns getResultDataList(boolean isMaintainer, ViewWithSource viewWithSource, ViewExecuteParam executeParam, User user) throws ServerException, SQLException {
        PaginateWithQueryColumns paginate = null;

        if (null == executeParam || (CollectionUtils.isEmpty(executeParam.getGroups()) && CollectionUtils.isEmpty(executeParam.getAggregators()))) {
            return null;
        }

        if (null == viewWithSource.getSource()) {
            throw new NotFoundException("source is not found");
        }

        String cacheKey = null;
        try {

            if (!StringUtils.isEmpty(viewWithSource.getLeftSql())) {
                //解析变量
                List<SqlVariable> variables = viewWithSource.getVariables();
                //解析sql
                SqlEntity sqlEntity = sqlParseUtils.parseSql(viewWithSource.getLeftSql(), variables, sqlTempDelimiter);
                //列权限（只记录被限制访问的字段）
                Set<String> excludeColumns = new HashSet<>();
                packageParams(isMaintainer, viewWithSource.getId(), sqlEntity, variables, executeParam.getParams(), excludeColumns, user);
                
                String leftSrcSql = sqlParseUtils.replaceParams(sqlEntity.getSql(), sqlEntity.getQuaryParams(), sqlEntity.getAuthParams(), sqlTempDelimiter);
//                String rightSrcSql = sqlParseUtils.replaceParams(sqlEntity.getRightSql(), sqlEntity.getQuaryParams(), sqlEntity.getAuthParams(), sqlTempDelimiter);

                Source source = viewWithSource.getSource();

                List<String> executeSqlList = sqlParseUtils.getSqls(leftSrcSql, false);
                if (!CollectionUtils.isEmpty(executeSqlList)) {
                    executeSqlList.forEach(dict -> {sqlUtils.execute(dict);});
                }

                List<String> querySqlList = sqlParseUtils.getSqls(leftSrcSql, true);
                if (!CollectionUtils.isEmpty(querySqlList)) {
                    buildQuerySql(querySqlList, source, executeParam);
                    executeParam.addExcludeColumn(excludeColumns, source.getJdbcUrl(), source.getDbVersion());

                    if (null != executeParam
                            && null != executeParam.getCache()
                            && executeParam.getCache()
                            && executeParam.getExpired() > 0L) {

                        StringBuilder slatBuilder = new StringBuilder();
                        slatBuilder.append(executeParam.getPageNo());
                        slatBuilder.append(MINUS);
                        slatBuilder.append(executeParam.getLimit());
                        slatBuilder.append(MINUS);
                        slatBuilder.append(executeParam.getPageSize());
                        excludeColumns.forEach(slatBuilder::append);

                        cacheKey = MD5Util.getMD5(slatBuilder.toString() + querySqlList.get(querySqlList.size() - 1), true, 32);

                        if (!executeParam.getFlush()) {
                            try {
                                Object object = redisUtils.get(cacheKey);
                                if (null != object && executeParam.getCache()) {
                                    paginate = (PaginateWithQueryColumns) object;
                                    return paginate;
                                }
                            } catch (Exception e) {
                                log.warn("get data by cache: {}", e.getMessage());
                            }
                        }
                    }

                    for (String sql : querySqlList) {
                        paginate = sqlUtils.syncQuery4Paginate(
                                sql,
                                executeParam.getPageNo(),
                                executeParam.getPageSize(),
                                executeParam.getTotalCount(),
                                executeParam.getLimit(),
                                excludeColumns);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerException(e.getMessage());
        }

        if (null != executeParam.getCache()
                && executeParam.getCache()
                && executeParam.getExpired() > 0L
                && null != paginate && !CollectionUtils.isEmpty(paginate.getResultList())) {
            redisUtils.set(cacheKey, paginate, executeParam.getExpired(), TimeUnit.SECONDS);
        }

        return paginate;
    }


    @Override
    public List<Map<String, Object>> getDistinctValue(Long id, DistinctParam param, User user) throws NotFoundException, ServerException, UnAuthorizedExecption {
        ViewWithSource viewWithSource = viewMapper.getViewWithSource(id);
        if (null == viewWithSource) {
            log.info("view (:{}) not found", id);
            throw new NotFoundException("view is not found");
        }

        ProjectDetail projectDetail = projectService.getProjectDetail(viewWithSource.getProjectId(), user, false);

        boolean allowGetData = projectService.allowGetData(projectDetail, user);

        if (!allowGetData) {
            throw new UnAuthorizedExecption();
        }

        return getDistinctValueData(projectService.isMaintainer(projectDetail, user), viewWithSource, param, user);
    }


    @Override
    public List<Map<String, Object>> getDistinctValueData(boolean isMaintainer, ViewWithSource viewWithSource, DistinctParam param, User user) throws ServerException {
        try {
            if(StringUtils.isEmpty(viewWithSource.getLeftSql())) {
                return null;
            }
            
            List<SqlVariable> variables = viewWithSource.getVariables();
            SqlEntity sqlEntity = sqlParseUtils.parseSql(viewWithSource.getLeftSql(), variables, sqlTempDelimiter);
            packageParams(isMaintainer, viewWithSource.getId(), sqlEntity, variables, param.getParams(), null, user);

            String leftSrcSql = sqlParseUtils.replaceParams(sqlEntity.getSql(), sqlEntity.getQuaryParams(), sqlEntity.getAuthParams(), sqlTempDelimiter);
//            String rightSrcSql = sqlParseUtils.replaceParams(sqlEntity.getRightSql(), sqlEntity.getQuaryParams(), sqlEntity.getAuthParams(), sqlTempDelimiter);
            
            Source source = viewWithSource.getSource();

            SqlUtils sqlUtils = this.sqlUtils.init(source);

            List<String> executeSqlList = sqlParseUtils.getSqls(leftSrcSql, false);
            if (!CollectionUtils.isEmpty(executeSqlList)) {
                executeSqlList.forEach(dict -> {sqlUtils.execute(dict);});
            }

            List<String> querySqlList = sqlParseUtils.getSqls(leftSrcSql, true);
            if (!CollectionUtils.isEmpty(querySqlList)) {
                String cacheKey = null;
                if (null != param) {
                    STGroup stg = new STGroupFile(Constants.SQL_TEMPLATE);
                    ST leftST = stg.getInstanceOf("queryDistinctSql");
                    leftST.add("columns", param.getColumns());
                    leftST.add("filters", convertFilters(param.getFilters(), source));
                    leftST.add("sql", querySqlList.get(querySqlList.size() - 1));
                    leftST.add("keywordPrefix", SqlUtils.getKeywordPrefix(source.getJdbcUrl(), source.getDbVersion()));
                    leftST.add("keywordSuffix", SqlUtils.getKeywordSuffix(source.getJdbcUrl(), source.getDbVersion()));
                    
//                    ST rightST = stg.getInstanceOf("queryDistinctSql");
//                    rightST.add("columns", param.getColumns());
//                    rightST.add("filters", convertFilters(param.getFilters(), source));
//                    rightST.add("sql", querySqlList.get(querySqlList.size() - 1).getValue());
//                    rightST.add("keywordPrefix", SqlUtils.getKeywordPrefix(source.getJdbcUrl(), source.getDbVersion()));
//                    rightST.add("keywordSuffix", SqlUtils.getKeywordSuffix(source.getJdbcUrl(), source.getDbVersion()));

//                    String sql = st.render();
//                    querySqlList.get(querySqlList.size() - 1).setKey(leftST);
//                    querySqlList.set(querySqlList.size() - 1, sql);
                    String leftSql = leftST.render();
//                    String rightSql = rightST.render();
                    querySqlList.set(querySqlList.size() - 1,leftSql);
//                    querySqlList.get(querySqlList.size() - 1).setValue(rightSql);

                    if (null != param.getCache() && param.getCache() && param.getExpired().longValue() > 0L) {
                        cacheKey = MD5Util.getMD5("DISTINCI" + querySqlList.get(querySqlList.size() - 1), true, 32);

                        try {
                            Object object = redisUtils.get(cacheKey);
                            if (null != object) {
                                return (List) object;
                            }
                        } catch (Exception e) {
                            log.warn("get distinct value by cache: {}", e.getMessage());
                        }
                    }
                }
                List<Map<String, Object>> list = null;
                for (String sql : querySqlList) {
                    list = sqlUtils.query4List(sql, -1);
                }

                if (null != param.getCache() && param.getCache() && param.getExpired().longValue() > 0L) {
                    redisUtils.set(cacheKey, list, param.getExpired(), TimeUnit.SECONDS);
                }

                if (null != list) {
                    return list;
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new ServerException(e.getMessage());
        }

        return null;
    }


    private Set<String> getExcludeColumnsViaOneView(List<RelRoleView> roleViewList) {
        if (!CollectionUtils.isEmpty(roleViewList)) {
            Set<String> columns = new HashSet<>();
            boolean isFullAuth = false;
            for (RelRoleView r : roleViewList) {
                if (!StringUtils.isEmpty(r.getColumnAuth())) {
                    columns.addAll(JSONObject.parseArray(r.getColumnAuth(), String.class));
                } else {
                    isFullAuth = true;
                    break;
                }
            }
            return isFullAuth ? null : columns;
        }
        return null;
    }


    private List<SqlVariable> getQueryVariables(List<SqlVariable> variables) {
        if (!CollectionUtils.isEmpty(variables)) {
            return variables.stream().filter(v -> QUERYVAR == SqlVariableTypeEnum.typeOf(v.getType())).collect(Collectors.toList());
        }
        return null;
    }

    private List<SqlVariable> getAuthVariables(List<RelRoleView> roleViewList, List<SqlVariable> variables) {
        if (!CollectionUtils.isEmpty(variables)) {

            List<SqlVariable> list = new ArrayList<>();

            variables.forEach(v -> {
                if (null != v.getChannel()) {
                    list.add(v);
                }
            });

            if (!CollectionUtils.isEmpty(roleViewList)) {
                Map<String, SqlVariable> map = new HashMap<>();

                List<SqlVariable> authVarables = variables.stream().filter(v -> AUTHVARE == SqlVariableTypeEnum.typeOf(v.getType())).collect(Collectors.toList());
                authVarables.forEach(v -> map.put(v.getName(), v));
                List<SqlVariable> dacVars = authVarables.stream().filter(v -> null != v.getChannel() && !v.getChannel().getBizId().equals(0L)).collect(Collectors.toList());

                roleViewList.forEach(r -> {
                    if (!StringUtils.isEmpty(r.getRowAuth())) {
                        List<AuthParamValue> authParamValues = JSONObject.parseArray(r.getRowAuth(), AuthParamValue.class);
                        authParamValues.forEach(v -> {
                            if (map.containsKey(v.getName())) {
                                SqlVariable sqlVariable = map.get(v.getName());
                                if (v.isEnable()) {
                                    if (CollectionUtils.isEmpty(v.getValues())) {
                                        List values = new ArrayList<>();
                                        values.add(NO_AUTH_PERMISSION);
                                        sqlVariable.setDefaultValues(values);
                                    } else {
                                        List<Object> values = sqlVariable.getDefaultValues() == null ? new ArrayList<>() : sqlVariable.getDefaultValues();
                                        values.addAll(v.getValues());
                                        sqlVariable.setDefaultValues(values);
                                    }
                                } else {
                                    sqlVariable.setDefaultValues(new ArrayList<>());
                                }
                                list.add(sqlVariable);
                            }
                        });
                    } else {
                        dacVars.forEach(v -> list.add(v));
                    }
                });
            }
            return list;
        }
        return null;
    }


    private void packageParams(boolean isProjectMaintainer, Long viewId, SqlEntity sqlEntity, List<SqlVariable> variables, List<Param> paramList, Set<String> excludeColumns, User user) {

        List<SqlVariable> queryVariables = getQueryVariables(variables);
        List<SqlVariable> authVariables = null;

        if (!isProjectMaintainer) {
            List<RelRoleView> roleViewList = relRoleViewMapper.getByUserAndView(user.getId(), viewId);
            authVariables = getAuthVariables(roleViewList, variables);
            if (null != excludeColumns) {
                Set<String> eclmns = getExcludeColumnsViaOneView(roleViewList);
                if (!CollectionUtils.isEmpty(eclmns)) {
                    excludeColumns.addAll(eclmns);
                }
            }
        }

        //查询参数
        if (!CollectionUtils.isEmpty(queryVariables) && !CollectionUtils.isEmpty(sqlEntity.getQuaryParams())) {
            if (!CollectionUtils.isEmpty(paramList)) {
                Map<String, List<SqlVariable>> map = queryVariables.stream().collect(Collectors.groupingBy(SqlVariable::getName));
                paramList.forEach(p -> {
                    if (map.containsKey(p.getName())) {
                        List<SqlVariable> list = map.get(p.getName());
                        if (!CollectionUtils.isEmpty(list)) {
                            SqlVariable v = list.get(list.size() - 1);
                            if (null == sqlEntity.getQuaryParams()) {
                                sqlEntity.setQuaryParams(new HashMap<>());
                            }
                            sqlEntity.getQuaryParams().put(p.getName().trim(), SqlVariableValueTypeEnum.getValue(v.getValueType(), p.getValue(), v.isUdf()));
                        }
                    }
                });
            }

            sqlEntity.getQuaryParams().forEach((k, v) -> {
                if (v instanceof List && ((List) v).size() > 0) {
                    v = ((List) v).stream().collect(Collectors.joining(COMMA)).toString();
                }
                sqlEntity.getQuaryParams().put(k, v);
            });
        }

        //如果当前用户是project的维护者，直接不走行权限
        if (isProjectMaintainer) {
            sqlEntity.setAuthParams(null);
            return;
        }

        //权限参数
        if (!CollectionUtils.isEmpty(authVariables)) {
            ExecutorService executorService = Executors.newFixedThreadPool(8);
            CountDownLatch countDownLatch = new CountDownLatch(authVariables.size());
            Map<String, Set<String>> map = new Hashtable<>();
            List<Future> futures = new ArrayList<>(authVariables.size());
            try {
                authVariables.forEach(sqlVariable -> {
                    try {
                        futures.add(executorService.submit(() -> {
                            if (null != sqlVariable) {
                                Set<String> vSet = null;
                                if (map.containsKey(sqlVariable.getName().trim())) {
                                    vSet = map.get(sqlVariable.getName().trim());
                                } else {
                                    vSet = new HashSet<>();
                                }

                                List<String> values = sqlParseUtils.getAuthVarValue(sqlVariable, user.getEmail());
                                if (null == values) {
                                    vSet.add(NO_AUTH_PERMISSION);
                                } else if (!values.isEmpty()) {
                                    vSet.addAll(values);
                                }
                                map.put(sqlVariable.getName().trim(), vSet);
                            }
                        }));
                    } finally {
                        countDownLatch.countDown();
                    }
                });
                try {
                    for (Future future : futures) {
                        future.get();
                    }
                    countDownLatch.await();
                } catch (ExecutionException e) {
                    executorService.shutdownNow();
                    throw (ServerException) e.getCause();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                executorService.shutdown();
            }

            if (!CollectionUtils.isEmpty(map)) {
                if (null == sqlEntity.getAuthParams()) {
                    sqlEntity.setAuthParams(new HashMap<>());
                }
                map.forEach((k, v) -> sqlEntity.getAuthParams().put(k, new ArrayList<String>(v)));
            }
        } else {
            sqlEntity.setAuthParams(null);
        }
    }


    private void checkAndInsertRoleParam(String sqlVarible, List<RelRoleViewDto> roles, User user, View view) {
        List<SqlVariable> variables = JSONObject.parseArray(sqlVarible, SqlVariable.class);

        if (CollectionUtils.isEmpty(roles)) {
            relRoleViewMapper.deleteByViewId(view.getId());
        } else {
            new Thread(() -> {
                Set<String> vars = null, columns = null;

                if (!CollectionUtils.isEmpty(variables)) {
                    vars = variables.stream().map(SqlVariable::getName).collect(Collectors.toSet());
                }
                if (!StringUtils.isEmpty(view.getModel())) {
                    columns = JSONObject.parseObject(view.getModel(), HashMap.class).keySet();
                }

                Set<String> finalColumns = columns;
                Set<String> finalVars = vars;

                List<RelRoleView> relRoleViews = new ArrayList<>();
                roles.forEach(r -> {
                    if (r.getRoleId().longValue() > 0L) {
                        String rowAuth = null, columnAuth = null;
                        if (!StringUtils.isEmpty(r.getRowAuth())) {
                            JSONArray rowAuthArray = JSONObject.parseArray(r.getRowAuth());
                            if (!CollectionUtils.isEmpty(rowAuthArray)) {
                                JSONArray newArray = new JSONArray();
                                for (int i = 0; i < rowAuthArray.size(); i++) {
                                    JSONObject jsonObject = rowAuthArray.getJSONObject(i);
                                    String name = jsonObject.getString(SQL_VARABLE_KEY);
                                    if (finalVars.contains(name)) {
                                        newArray.add(jsonObject);
                                    }
                                }
                                rowAuth = newArray.toJSONString();
                                newArray.clear();
                            }
                        }

                        if (null != finalColumns && !StringUtils.isEmpty(r.getColumnAuth())) {
                            List<String> clms = JSONObject.parseArray(r.getColumnAuth(), String.class);
                            List<String> collect = clms.stream().filter(c -> finalColumns.contains(c)).collect(Collectors.toList());
                            columnAuth = JSONObject.toJSONString(collect);
                        }

                        RelRoleView relRoleView = new RelRoleView(view.getId(), r.getRoleId(), rowAuth, columnAuth)
                                .createdBy(user.getId());
                        relRoleViews.add(relRoleView);
                    }
                });
                if (!CollectionUtils.isEmpty(relRoleViews)) {
                    relRoleViewMapper.insertBatch(relRoleViews);
                }
            }).start();
        }
    }


}

