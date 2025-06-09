package com.chinatower.wetland.controller;

import com.chinatower.common.entity.Result;
import com.chinatower.wetland.pojo.vo.AncientAndRareTreesSortStatisticsVo;
import com.chinatower.wetland.service.IAncientAndRareTreesService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * <p>古树名木统计 Controller</p>
 *
 * @author  wanglin
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 wanglin
 * <p>
 * @see
 */
@Slf4j
@Api(tags = "铁塔-古树名木统计")
@RequestMapping("/ancientAndRareTrees")
@RestController
@Validated
@RequiredArgsConstructor
public class AncientAndRareTreesController {

    private final IAncientAndRareTreesService ancientAndRareTreesService;

    @ApiOperation("获取名木古树信息分类统计数据")
    @GetMapping("/getClassifiedStatistic")
    public Result<List<AncientAndRareTreesSortStatisticsVo>> getClassifiedStatistic(){
        List<AncientAndRareTreesSortStatisticsVo> vos = ancientAndRareTreesService.getClassifiedStatistic();
        return Result.data(vos);
    }

}
