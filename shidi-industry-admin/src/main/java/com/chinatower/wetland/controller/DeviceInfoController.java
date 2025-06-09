package com.chinatower.wetland.controller;

import com.chinatower.common.entity.Result;
import com.chinatower.wetland.pojo.param.CoverageInfoSelectParam;
import com.chinatower.wetland.pojo.vo.AnalysisParamVo;
import com.chinatower.wetland.pojo.vo.DeviceStatisticsVo;
import com.chinatower.wetland.service.IDeviceInfoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>设备信息Controller</p>
 *
 * @author zyx
 * @author 其它作者姓名
 * @version 1.00 2024/06/17 zyx
 * <p>
 * @see
 */
@Slf4j
@Api(tags = "森林智保-设备信息")
@RequestMapping("/device-info")
@RestController
@Validated
@RequiredArgsConstructor
public class DeviceInfoController {

    private final IDeviceInfoService deviceInfoService;

    @ApiOperation("设备信息统计")
    @GetMapping("/statistics")
    public Result<DeviceStatisticsVo> statistics(AnalysisParamVo param) {
        if(param!=null){
            log.info("大屏数据权限参数 "+param.getScreenId()+param.getScreenType());
        }
        DeviceStatisticsVo statisticsVo = deviceInfoService.statistics(param);
        return Result.data(statisticsVo);
    }



}
