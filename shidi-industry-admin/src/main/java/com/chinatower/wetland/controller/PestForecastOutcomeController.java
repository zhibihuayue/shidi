package com.chinatower.wetland.controller;

import com.chinatower.common.entity.Result;
import com.chinatower.wetland.pojo.param.PestOutcomeParam;
import com.chinatower.wetland.pojo.vo.PestForecastOutcomeVo;
import com.chinatower.wetland.pojo.vo.PestHomeStatisticsVo;
import com.chinatower.wetland.service.IPestForecastOutcomeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

/**
 * <p>病虫害预测结果表Controller</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 2024/03/12
 * <p>
 * @see
 */
@Slf4j
@Api(tags = "铁塔-病虫害预测结果")
@RequestMapping("/pestForecastOutcome")
@RestController
@Validated
@RequiredArgsConstructor
public class PestForecastOutcomeController {

    private final IPestForecastOutcomeService outcomeService;

    @ApiOperation("大屏-病虫害预测")
    @PostMapping("/pestPrediction")
    public Result<PestHomeStatisticsVo> pestPrediction(@RequestBody @Valid PestOutcomeParam param) {
        PestHomeStatisticsVo list = outcomeService.pestPrediction(param);
        return Result.data(list);
    }

    @ApiOperation("大屏-病虫害预测-时间下拉框")
    @GetMapping("/pestTimeList")
    public Result<List<String>> pestTimeList() {
        List<String> list = outcomeService.pestTimeList();
        return Result.data(list);
    }

    @ApiOperation("大屏-病虫害预测-所选虫情灯下所有最后一天数据")
    @PostMapping("/pestLightLastDay")
    public Result<List<PestForecastOutcomeVo>> pestLightLastDay(@RequestBody @Valid PestOutcomeParam param) {
        List<PestForecastOutcomeVo> list = outcomeService.pestLightLastDay(param);
        return Result.data(list);
    }
}