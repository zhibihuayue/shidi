package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * @author zyx
 */
@Data
public class PestHomeStatisticsVo {

    @ApiModelProperty("x轴-日期数据及昆虫数量")
    private List<PestForecastOutcomeVo> outcomeVos;

    @ApiModelProperty("y轴-病虫害预测规则")
    private PestControlForecastVo forecastVo;

}
