package dq.controller;

import dq.core.annotation.CurrentUser;
import dq.core.model.Dict;
import dq.core.model.Paginate;
import dq.core.model.PaginateWithQueryColumns;
import dq.common.controller.BaseController;
import dq.core.common.Constants;
import dq.core.common.ResultMap;
import dq.core.utils.DacChannelUtil;
import dq.dto.viewDto.*;
import dq.model.DacChannel;
import dq.model.User;
import dq.service.ViewService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@Api(value = "/rules", tags = "rules", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@ApiResponses(@ApiResponse(code = 404, message = "rule not found"))
@Slf4j
@RestController
@RequestMapping(value = Constants.BASE_API_PATH + "/rules", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class RuleController extends BaseController {

    @Autowired
    private ViewService viewService;

    @Autowired
    private DacChannelUtil dacChannelUtil;

    /**
     * 获取rule
     *
     * @param projectId
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "get rules")
    @GetMapping
    public ResponseEntity getRules(@RequestParam Long projectId,
                                   @ApiIgnore @CurrentUser User user,
                                   HttpServletRequest request) {

        if (invalidId(projectId)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid project id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        List<ViewBaseInfo> rules = viewService.getViews(projectId, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payloads(rules));
    }


    /**
     * get rule info
     *
     * @param id
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "get rule info")
    @GetMapping("/{id}")
    public ResponseEntity getRule(@PathVariable Long id,
                                  @ApiIgnore @CurrentUser User user,
                                  HttpServletRequest request) {

        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid rule id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        ViewWithSourceBaseInfo rule = viewService.getView(id, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(rule));
    }


    /**
     * 新建rule
     *
     * @param rule
     * @param bindingResult
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "create rule")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createRule(@Valid @RequestBody ViewCreate view,
                                     @ApiIgnore BindingResult bindingResult,
                                     @ApiIgnore @CurrentUser User user,
                                     HttpServletRequest request) {

        if (bindingResult.hasErrors()) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message(bindingResult.getFieldErrors().get(0).getDefaultMessage());
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        ViewWithSourceBaseInfo ruleWithSourceBaseInfo = viewService.createView(view, user);

        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(ruleWithSourceBaseInfo));
    }


    /**
     * 修改Rule
     *
     * @param id
     * @param ruleUpdate
     * @param bindingResult
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "update rule")
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateRule(@PathVariable Long id,
                                     @Valid @RequestBody ViewUpdate viewUpdate,
                                     @ApiIgnore BindingResult bindingResult,
                                     @ApiIgnore @CurrentUser User user,
                                     HttpServletRequest request) {


        if (invalidId(id) || !id.equals(viewUpdate.getId())) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid rule id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        if (bindingResult.hasErrors()) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message(bindingResult.getFieldErrors().get(0).getDefaultMessage());
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        viewService.updateView(viewUpdate, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request));
    }


    /**
     * 删除Rule
     *
     * @param id
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "delete rule")
    @DeleteMapping("/{id}")
    public ResponseEntity deleteRule(@PathVariable Long id,
                                     @ApiIgnore @CurrentUser User user,
                                     HttpServletRequest request) {
        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid rule id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        viewService.deleteView(id, user);

        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request));
    }


    /**
     * 执行sql
     *
     * @param executeSql
     * @param bindingResult
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "executesql")
    @PostMapping(value = "/executesql", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity executeSql(@Valid @RequestBody ViewExecuteSql executeSql,
                                     @ApiIgnore BindingResult bindingResult,
                                     @ApiIgnore @CurrentUser User user,
                                     HttpServletRequest request) {

        if (bindingResult.hasErrors()) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message(bindingResult.getFieldErrors().get(0).getDefaultMessage());
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        Dict<PaginateWithQueryColumns,PaginateWithQueryColumns> paginateWithQueryColumns = viewService.executeSqlDict(executeSql, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(paginateWithQueryColumns));
    }


    /**
     * 获取当前rule对应的源数据
     *
     * @param id
     * @param executeParam
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "get data")
    @PostMapping(value = "/{id}/getdata", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getData(@PathVariable Long id,
                                  @RequestBody(required = false) ViewExecuteParam executeParam,
                                  @ApiIgnore @CurrentUser User user,
                                  HttpServletRequest request) throws SQLException {
        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid rule id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        Paginate<Map<String, Object>> paginate = viewService.getData(id, executeParam, user);
        return ResponseEntity.ok().cacheControl(CacheControl.noCache()).body(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(paginate));
    }


    @ApiOperation(value = "get distinct value")
    @PostMapping(value = "/{id}/getdistinctvalue", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getDistinctValue(@PathVariable Long id,
                                           @Valid @RequestBody DistinctParam param,
                                           @ApiIgnore BindingResult bindingResult,
                                           @ApiIgnore @CurrentUser User user,
                                           HttpServletRequest request) {
        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid rule id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        if (bindingResult.hasErrors()) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message(bindingResult.getFieldErrors().get(0).getDefaultMessage());
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        List<Map<String, Object>> distinctValue = viewService.getDistinctValue(id, param, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payloads(distinctValue));
    }


    @ApiOperation(value = "get dac channels")
    @GetMapping("/dac/channels")
    public ResponseEntity getDacChannels(@ApiIgnore @CurrentUser User user, HttpServletRequest request) {
        Map<String, DacChannel> dacMap = DacChannelUtil.dacMap;
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payloads(dacMap.keySet()));
    }

    @ApiOperation(value = "get dac tenants")
    @GetMapping("/dac/{dacName}/tenants")
    public ResponseEntity getDacTannets(@PathVariable String dacName, @ApiIgnore @CurrentUser User user, HttpServletRequest request) {

        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payloads(dacChannelUtil.getTenants(dacName)));
    }


    @ApiOperation(value = "get dac bizs")
    @GetMapping("/dac/{dacName}/tenants/{tenantId}/bizs")
    public ResponseEntity getDacBizs(@PathVariable String dacName,
                                     @PathVariable String tenantId,
                                     @ApiIgnore @CurrentUser User user,
                                     HttpServletRequest request) {
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payloads(dacChannelUtil.getBizs(dacName, tenantId)));
    }
}
