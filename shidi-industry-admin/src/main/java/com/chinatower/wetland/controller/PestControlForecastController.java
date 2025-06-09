package com.chinatower.wetland.controller;

import com.chinatower.common.entity.Result;
import com.chinatower.wetland.pojo.entity.PestControlForecast;
import com.chinatower.wetland.pojo.param.PestControlForecastEditParam;
import com.chinatower.wetland.pojo.param.PestControlForecastInsertParam;
import com.chinatower.wetland.pojo.param.WetlandInfoEditParam;
import com.chinatower.wetland.pojo.param.WetlandInfoInsertParam;
import com.chinatower.wetland.pojo.vo.PestControlForecastExportVo;
import com.chinatower.wetland.pojo.vo.PestControlForecastVo;
import com.chinatower.wetland.pojo.vo.WetlandInfoDetailVO;
import com.chinatower.wetland.service.IPestControlForecastService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.List;

/**
 * <p>病虫害预测表Controller</p>
 *
 * @author zyx
 * @author 其它作者姓名
 * @version 1.00 2024/03/12
 * <p>
 * @see
 */
@Slf4j
@Api(tags = "铁塔-病虫害预测")
@RequestMapping("/pestControlForecast")
@RestController
@Validated
@RequiredArgsConstructor
public class PestControlForecastController {

    private final IPestControlForecastService forecastService;

    @ApiOperation("新增数据")
    @PostMapping("/insert")
    public Result<Boolean> insert(@RequestBody @Valid PestControlForecastInsertParam param) {
        boolean b = forecastService.insert(param);
        if (b) {
            return Result.data(Boolean.TRUE);
        }
        return Result.fail();
    }

    @ApiOperation("编辑数据")
    @PostMapping("/edit")
    public Result<Boolean> edit(@RequestBody @Valid PestControlForecastEditParam param) {
        boolean b = forecastService.edit(param);
        if (b) {
            return Result.data(Boolean.TRUE);
        }
        return Result.fail();
    }

    @ApiOperation("列表")
    @GetMapping("/index")
    public Result<List<PestControlForecastVo>> index() {
        List<PestControlForecastVo> list = forecastService.index();
        return Result.data(list);
    }

    @ApiOperation("大屏-根据病虫害类型获取预测信息")
    @GetMapping("/getVoByPestType")
    public Result<List<PestControlForecastExportVo>> getVoByPestType() {
        List<PestControlForecastExportVo> vo = forecastService.getVoByPestType();
        return Result.data(vo);
    }

    @ApiOperation("根据id获取单条数据")
    @GetMapping("/getVoById")
    public Result<PestControlForecastVo> getVoById(@RequestParam String id) {
        PestControlForecastVo result = forecastService.getVoById(id);
        return Result.data(result);
    }

    @ApiOperation("删除数据")
    @GetMapping("/deleteById")
    public Result<Boolean> deleteById(@RequestParam String id) {
        return Result.data(forecastService.deleteById(id));
    }

    @ApiOperation("列表导出")
    @GetMapping("/export")
    public void export(HttpServletResponse response) {
        forecastService.export(response);
    }

}