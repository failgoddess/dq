package dq.controller;


import dq.core.annotation.CurrentUser;
import dq.common.controller.BaseController;
import dq.core.common.Constants;
import dq.core.common.ResultMap;
import dq.dto.viewDto.ViewExecuteParam;
import dq.dto.widgetDto.WidgetCreate;
import dq.dto.widgetDto.WidgetUpdate;
import dq.model.User;
import dq.model.Widget;
import dq.service.WidgetService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

@Api(value = "/widgets", tags = "widgets", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@ApiResponses(@ApiResponse(code = 404, message = "widget not found"))
@Slf4j
@RestController
@RequestMapping(value = Constants.BASE_API_PATH + "/widgets", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class WidgetController extends BaseController {

    @Autowired
    private WidgetService widgetService;

    /**
     * 获取widget列表
     *
     * @param projectId
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "get widgets")
    @GetMapping
    public ResponseEntity getWidgets(@RequestParam Long projectId,
                                     @ApiIgnore @CurrentUser User user,
                                     HttpServletRequest request) {
        if (invalidId(projectId)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid project id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        List<Widget> widgets = widgetService.getWidgets(projectId, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payloads(widgets));
    }


    /**
     * 获取widget列表
     *
     * @param id
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "get widget info")
    @GetMapping("/{id}")
    public ResponseEntity getWidgetInfo(@PathVariable Long id,
                                        @ApiIgnore @CurrentUser User user,
                                        HttpServletRequest request) {
        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }
        Widget widget = widgetService.getWidget(id, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(widget));
    }


    /**
     * 新建widget
     *
     * @param widget
     * @param bindingResult
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "create widget")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity createWidgets(@Valid @RequestBody WidgetCreate widget,
                                        @ApiIgnore BindingResult bindingResult,
                                        @ApiIgnore @CurrentUser User user,
                                        HttpServletRequest request) {
        if (bindingResult.hasErrors()) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message(bindingResult.getFieldErrors().get(0).getDefaultMessage());
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        Widget newWidget = widgetService.createWidget(widget, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(newWidget));
    }


    /**
     * 修改widget
     *
     * @param id
     * @param widget
     * @param bindingResult
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "update widget")
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity updateWidget(@PathVariable Long id,
                                       @Valid @RequestBody WidgetUpdate widget,
                                       @ApiIgnore BindingResult bindingResult,
                                       @ApiIgnore @CurrentUser User user,
                                       HttpServletRequest request) {

        if (bindingResult.hasErrors()) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message(bindingResult.getFieldErrors().get(0).getDefaultMessage());
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        if (invalidId(id) || !id.equals(widget.getId())) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        widgetService.updateWidget(widget, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request));
    }


    /**
     * 删除widget
     *
     * @param id
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "delete widget")
    @DeleteMapping("/{id}")
    public ResponseEntity deleteWidget(@PathVariable Long id,
                                       @ApiIgnore @CurrentUser User user,
                                       HttpServletRequest request) {

        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        widgetService.deleteWidget(id, user);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request));
    }


    /**
     * 下载widget
     *
     * @param id
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "download widget")
    @PostMapping("/{id}/{type}")
    public ResponseEntity downloadWidget(@PathVariable("id") Long id,
                                         @PathVariable("type") String type,
                                         @Valid @RequestBody ViewExecuteParam executeParam,
                                         @ApiIgnore BindingResult bindingResult,
                                         @ApiIgnore @CurrentUser User user,
                                         HttpServletRequest request) {
        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        if (bindingResult.hasErrors()) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message(bindingResult.getFieldErrors().get(0).getDefaultMessage());
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        String filePath = widgetService.generationFile(id, executeParam, user, type);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(filePath));
    }


    /**
     * 分享widget
     *
     * @param id
     * @param username
     * @param user
     * @param request
     * @return
     */
    @ApiOperation(value = "share widget")
    @GetMapping("/{id}/share")
    public ResponseEntity shareWidget(@PathVariable Long id,
                                      @RequestParam(required = false) String username,
                                      @ApiIgnore @CurrentUser User user,
                                      HttpServletRequest request) {
        if (invalidId(id)) {
            ResultMap resultMap = new ResultMap(tokenUtils).failAndRefreshToken(request).message("Invalid id");
            return ResponseEntity.status(resultMap.getCode()).body(resultMap);
        }

        String shareToken = widgetService.shareWidget(id, user, username);
        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request).payload(shareToken));
    }

}
