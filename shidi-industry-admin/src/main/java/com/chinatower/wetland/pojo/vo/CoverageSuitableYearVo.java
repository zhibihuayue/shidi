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
 * @version 1.6.90 2024/09/25 zyx
* <p>
 * @see
 */
@Data
public class CoverageSuitableYearVo extends BasicsEntity {

    @ApiModelProperty(value = "图层年份")
    private Integer coverageYear;


    @ApiModelProperty(value = "面积总数")
    private BigDecimal allArea;

    @ApiModelProperty(value = "面积总数")
    private String allAreaStr;



}