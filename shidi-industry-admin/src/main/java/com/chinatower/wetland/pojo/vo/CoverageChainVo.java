package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.BasicsEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;

/**
 * <p>生态系统变化</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
* <p>
 * @see
 */
@Data
public class CoverageChainVo extends BasicsEntity {


    /**
     * 图层类型 1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地
     */
    @ApiModelProperty(value = "图层类型 1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地")
    private Integer type;

    @ApiModelProperty(value = "图层面积差值 公顷")
    private BigDecimal areaDiff;

    @ApiModelProperty(value = "图层面积比值")
    private BigDecimal areaRate;


}