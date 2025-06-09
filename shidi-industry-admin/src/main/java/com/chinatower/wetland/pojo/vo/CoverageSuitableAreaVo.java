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
public class CoverageSuitableAreaVo extends BasicsEntity {

    @ApiModelProperty(value = "面积状态 0-适宜生境 1-较适宜生境 2-不适宜生境 3-暂无数据")
    private Integer status;

    @ApiModelProperty(value = "总数")
    private BigDecimal allArea;

    @ApiModelProperty(value = "占比")
    private Double areaRate;

}