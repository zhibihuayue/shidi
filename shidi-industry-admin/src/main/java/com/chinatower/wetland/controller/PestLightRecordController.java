package com.chinatower.wetland.controller;

import com.chinatower.common.entity.Result;
import com.chinatower.wetland.pojo.entity.PestLight;
import com.chinatower.wetland.pojo.param.PestControlForecastEditParam;
import com.chinatower.wetland.pojo.param.PestControlForecastInsertParam;
import com.chinatower.wetland.pojo.vo.PestControlForecastVo;
import com.chinatower.wetland.pojo.vo.PestForecastOutcomeVo;
import com.chinatower.wetland.service.IPestControlForecastService;
import com.chinatower.wetland.service.IPestLightRecordService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * <p>虫情灯记录表Controller</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 2024/03/12
 * <p>
 * @see
 */
@Slf4j
@Api(tags = "铁塔-虫情灯记录")
@RequestMapping("/pestLightRecord")
@RestController
@Validated
@RequiredArgsConstructor
public class PestLightRecordController {


    @Autowired
    private IPestLightRecordService iPestLightRecordService;


    @ApiOperation("获取诱捕器数据-对接设备")
    @GetMapping("/pestLightData")
    public Result getPestLightRecord() {
        iPestLightRecordService.getPestLightRecord();
        return Result.data(Boolean.TRUE);
    }
    @ApiOperation("查询租户下所有的诱捕器设备")
    @GetMapping("/pestLightDevice")
    public Result<List<PestLight>> pestLightDevice() {
        List<PestLight> list = iPestLightRecordService.pestLightDevice();
        return Result.data(list);
    }

    @ApiOperation("获取诱捕器设备")
    @GetMapping("/pestLightDeviceAll")
    public Result pestLightDeviceAll() {
        iPestLightRecordService.pestLightDeviceAll();
        return Result.data(Boolean.TRUE);
    }


    @ApiOperation("获取诱捕器数据-获取三个月的数据")
    @GetMapping("/getPestLightThreeMonth")
    public Result getPestLightThreeMonth() {
        iPestLightRecordService.getPestLightRecordThreeMonth();
        return Result.data(Boolean.TRUE);
    }
}