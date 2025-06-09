package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;

/**
 * <p>名木古树信息分类统计数据</p>
 *
 * @author  wanglin
 * @author  其它作者姓名
 * @version 1.00 2024/06/18 wanglin
 * <p>
 * @see
 */
@Data
@ApiModel(value = "名木古树信息分类统计数据")
public class AncientAndRareTreesSortStatisticsVo {

    @ApiModelProperty(value = "1-一级古树 2-二级古树 3-三级古树 0-名木")
    private Integer gradeType;

    @ApiModelProperty(value = "1-一级古树 2-二级古树 3-三级古树 0-名木")
    private String gradeName;

    @ApiModelProperty(value = "数量")
    private Integer count = 0;

    @ApiModelProperty(value = "比例")
    private BigDecimal proportion;

}
