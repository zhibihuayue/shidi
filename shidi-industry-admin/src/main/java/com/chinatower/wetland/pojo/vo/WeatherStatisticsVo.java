package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * <p>气候分析数据-大屏统计</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
 * <p>
 * @see
 */
@Data
@ApiModel(value = "气候分析数据-大屏统计")
public class WeatherStatisticsVo {

    @ApiModelProperty(value = "月均气温")
    private BigDecimal temperatureMonth;

    @ApiModelProperty(value = "月均降水")
    private BigDecimal precipitationMonth;


    @ApiModelProperty(value = "年均气温")
    private BigDecimal temperatureYear;

    @ApiModelProperty(value = "年均降水")
    private BigDecimal precipitationYear;

    @ApiModelProperty(value = "日气温")
    private BigDecimal temperatureDay;

    @ApiModelProperty(value = "日降水")
    private BigDecimal precipitationDay;


    @ApiModelProperty(value = "气温-柱状图")
    private List<WeatherTimeVo> temperatureList;

    @ApiModelProperty(value = "降水量-柱状图")
    private List<WeatherTimeVo> precipitationList;

}
