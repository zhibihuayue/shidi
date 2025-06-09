package com.chinatower.wetland.controller;

import com.chinatower.common.entity.Result;
import com.chinatower.wetland.pojo.param.CoverageInfoSelectParam;
import com.chinatower.wetland.pojo.vo.*;
import com.chinatower.wetland.service.ICoverageInfoService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * <p>图层信息Controller</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
 * <p>
 * @see
 */
@Slf4j
@Api(tags = "森林智保-图层信息")
@RequestMapping("/weather-analyse")
@RestController
@Validated
@RequiredArgsConstructor
public class CoverageInfoController {

    private final ICoverageInfoService coverageInfoService;

    @ApiOperation("大屏-生态系统最小最大年份")
    @GetMapping("/suitableYear")
    public Result<List<String>> suitableYear() {
        List<String> list = coverageInfoService.suitableYear();
        return Result.data(list);
    }

    @ApiOperation("大屏-生态系统变化")
    @PostMapping("/statisticsChain")
    public Result<List<CoverageChainVo>> statisticsChain(@RequestBody CoverageInfoSelectParam param) {
        List<CoverageChainVo> list = coverageInfoService.statisticsChain(param);
        return Result.data(list);
    }

    @ApiOperation("大屏-景观格局特征")
    @PostMapping("/statisticsFeature")
    public Result<List<CoverageFeatureVo>> statisticsFeature(@RequestBody CoverageInfoSelectParam param) {
        List<CoverageFeatureVo> list = coverageInfoService.statisticsFeature(param);
        return Result.data(list);
    }

    @ApiOperation("大屏-生态转移矩阵")
    @PostMapping("/statisticsMatrix")
    public Result<Map<Integer, Map<Integer, BigDecimal>>> statisticsMatrix(@RequestBody CoverageInfoSelectParam param) {
        Map<Integer, Map<Integer, BigDecimal>> result = coverageInfoService.statisticsMatrix(param);
        return Result.data(result);
    }

    @ApiOperation("大屏-综合动态度 转移指数")
    @PostMapping("/statisticsDynamicIndex")
    public Result<CoverageDynamicIndexVo> statisticsDynamicIndex(@RequestBody CoverageInfoSelectParam param) {
        CoverageDynamicIndexVo result = coverageInfoService.statisticsDynamicIndex(param);
        return Result.data(result);
    }



    @ApiOperation("大屏-栖息地变化动物类型")
    @GetMapping("/suitableAnimal")
    public Result<Map<Integer, String>> suitableAnimal() {
        Map<Integer, String> list = coverageInfoService.suitableAnimal();
        return Result.data(list);
    }


    @ApiOperation("大屏-鸟类栖息地分析")
    @PostMapping("/statisticsSuitableAnalyse")
    public Result<List<CoverageSuitableAnalyseVo>> statisticsSuitableAnalyse(@RequestBody CoverageInfoSelectParam param) {
        List<CoverageSuitableAnalyseVo> vo = coverageInfoService.statisticsSuitableAnalyse(param);
        return Result.data(vo);
    }

    @ApiOperation("大屏-栖息地变化")
    @PostMapping("/statisticsSuitableChain")
    public Result<List<CoverageSuitableChainVo>> statisticsSuitableChain(@RequestBody CoverageInfoSelectParam param) {
        List<CoverageSuitableChainVo> list = coverageInfoService.statisticsSuitableChain(param);
        return Result.data(list);
    }



}
