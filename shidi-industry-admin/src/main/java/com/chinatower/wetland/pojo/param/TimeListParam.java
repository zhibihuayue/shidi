package com.chinatower.wetland.pojo.param;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>折线图-时间横坐标</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/28 zyx
 * <p>
 * @see
 */
@Data
@ApiModel(value = "折线图-时间横坐标")
public class TimeListParam {


    @ApiModelProperty(value = "年份")
    private Integer year;

    @ApiModelProperty(value = "月份")
    private Integer month;

}