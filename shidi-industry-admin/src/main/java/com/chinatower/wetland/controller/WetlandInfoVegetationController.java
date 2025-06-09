package com.chinatower.wetland.controller;

import cn.hutool.core.text.CharSequenceUtil;
import com.chinatower.common.entity.Result;
import com.chinatower.wetland.service.IWetlandInfoVegetationService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>湿地植被信息Controller</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Slf4j
@Api(tags = "铁塔-湿地植被信息")
@RequestMapping("/wetland-info/vegatation")
@RestController
@Validated
@RequiredArgsConstructor
public class WetlandInfoVegetationController {
    private final IWetlandInfoVegetationService vegetationService;

    @ApiOperation("删除数据")
    @GetMapping("/deleteById")
    public Result<Boolean> deleteById(@RequestParam(required = false) String id) {
        if (CharSequenceUtil.isNotBlank(id)){
            vegetationService.removeById(id);
        }
        return Result.data(Boolean.TRUE);
    }
}
