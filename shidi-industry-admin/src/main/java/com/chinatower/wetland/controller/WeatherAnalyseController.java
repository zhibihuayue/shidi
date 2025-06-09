package com.chinatower.wetland.controller;

import com.chinatower.common.entity.Result;
import com.chinatower.wetland.pojo.param.WeatherAnalyseSelectParam;
import com.chinatower.wetland.pojo.vo.WeatherStatisticsVo;
import com.chinatower.wetland.service.IWeatherAnalyseService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * <p>气候分析数据Controller</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
 * <p>
 * @see
 */
@Slf4j
@Api(tags = "森林智保-气候统计分析")
@RequestMapping("/weather-analyse")
@RestController
@Validated
@RequiredArgsConstructor
public class WeatherAnalyseController {

    private final IWeatherAnalyseService weatherAnalyseService;

    @ApiOperation("大屏-气候统计分析")
    @PostMapping("/statistics")
    public Result<WeatherStatisticsVo> statistics(@RequestBody WeatherAnalyseSelectParam param) {
        WeatherStatisticsVo statisticsVo = weatherAnalyseService.statistics(param);
        return Result.data(statisticsVo);
    }

    @ApiOperation("大屏-添加天气")
    @GetMapping("/setWeatherNow")
    public Result statistics() {
        Boolean b = weatherAnalyseService.setWeatherNow();
        if (Boolean.TRUE.equals(b)){
            return Result.data(Boolean.TRUE);
        }
        return Result.fail();
    }

}
