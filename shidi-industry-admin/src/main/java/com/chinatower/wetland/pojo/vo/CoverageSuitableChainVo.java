package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.BasicsEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;

/**
 * <p>鸟类栖息地分析</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
* <p>
 * @see
 */
@Data
public class CoverageSuitableChainVo {


    /**
     * 图层年份
     */
    @ApiModelProperty(value = "图层年份")
    private String coverageYear;

    @ApiModelProperty(value = "斑块总数")
    private Integer plaqueCount;

    @ApiModelProperty(value = "斑块环比-值")
    private Integer plaqueDiff;


    @ApiModelProperty(value = "面积总数")
    private BigDecimal allArea = new BigDecimal("0");

    @ApiModelProperty(value = "面积总数")
    private String allAreaStr;

    @ApiModelProperty(value = "面积环比-率")
    private BigDecimal areaRate = new BigDecimal("0");

    @ApiModelProperty(value = "面积环比-值")
    private String areaDiffStr;

}