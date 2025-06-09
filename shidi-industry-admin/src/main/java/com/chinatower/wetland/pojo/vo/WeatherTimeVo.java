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
public class WeatherTimeVo {

    @ApiModelProperty("年份")
    private String years;

    @ApiModelProperty("月份")
    private String times;

    @ApiModelProperty("日期")
    private String days;

    @ApiModelProperty("每日日期")
    private String dayDateTime;

    @ApiModelProperty("平均气温")
    private Double temperature;

    @ApiModelProperty("平均降水")
    private Double precipitation;

}
