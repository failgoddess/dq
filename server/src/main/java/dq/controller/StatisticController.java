package dq.controller;

import dq.core.utils.TokenUtils;
import dq.common.model.ValidList;
import dq.core.common.Constants;
import dq.core.common.ResultMap;
import dq.dto.statistic.DqStatisticDurationInfo;
import dq.dto.statistic.DQStatisticTerminalInfo;
import dq.dto.statistic.DQStatisticVisitorOperationInfo;
import dq.service.BuriedPointsService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

@Api(value = "/statistic", tags = "statistic", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@ApiResponses(@ApiResponse(code = 404, message = "statistic not found"))
@Slf4j
@RestController
@RequestMapping(value = Constants.BASE_API_PATH + "/statistic", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class StatisticController {

    @Autowired
    private BuriedPointsService buriedPointsService;

    @Autowired
    public TokenUtils tokenUtils;

    @ApiOperation(value = "collect duration info ")
    @PostMapping(value = "/duration", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity collectDurationInfo(@Valid @RequestBody ValidList<DqStatisticDurationInfo> durationInfos,
                                              HttpServletRequest request){

        buriedPointsService.insert(durationInfos, DqStatisticDurationInfo.class);

        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request));
    }

    @ApiOperation(value = "collect terminal info ")
    @PostMapping(value = "/terminal", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity collectTerminalInfo(@Valid @RequestBody ValidList<DQStatisticTerminalInfo> terminalInfoInfos,
                                              HttpServletRequest request){

        buriedPointsService.insert(terminalInfoInfos, DQStatisticTerminalInfo.class);

        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request));
    }

    @ApiOperation(value = "collect visitor operation info ")
    @PostMapping(value = "/visitoroperation", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity collectVisitorOperationInfo(@Valid @RequestBody ValidList<DQStatisticVisitorOperationInfo> visitorOperationInfos,
                                              HttpServletRequest request){

        buriedPointsService.insert(visitorOperationInfos, DQStatisticVisitorOperationInfo.class);

        return ResponseEntity.ok(new ResultMap(tokenUtils).successAndRefreshToken(request));
    }

}
