package com.chinatower.wetland.pojo.param;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;

/**
 * <p>气候分析数据-大屏查询</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
 * <p>
 * @see
 */
@Data
@ApiModel(value = "气候分析数据-大屏查询")
public class WeatherAnalyseSelectParam {


    @ApiModelProperty(value = "时间类型 0-月 1-年 2-日/自定义")
    @NotBlank(message = "时间类型不能为空")
    private Integer timeType;

    @ApiModelProperty(value = "开始时间")
    @NotEmpty(message = "开始时间不能为空")
    private String startTime;

    @ApiModelProperty(value = "结束时间")
    @NotEmpty(message = "结束时间不能为空")
    private String endTime;


    @ApiModelProperty(value = "开始时间")
    private Integer year;

    @ApiModelProperty(value = "结束时间")
    private Integer month;



    @ApiModelProperty(value = "行业编码")
    String industryCode;

    @ApiModelProperty(value = "租户id")
    String tenantId;

    @ApiModelProperty(value = "行业版本")
    String appVerCode;

}