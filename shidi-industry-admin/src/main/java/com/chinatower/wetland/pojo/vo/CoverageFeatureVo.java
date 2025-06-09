package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.BasicsEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;

/**
 * <p>景观格局特征</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
* <p>
 * @see
 */
@Data
public class CoverageFeatureVo extends BasicsEntity {
    /**
     * 生态构成-（1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地）
     */
    @ApiModelProperty(value = "生态构成-（1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地）")
    private Integer type;

    @ApiModelProperty(value = "斑块数")
    private Integer plaqueCount;

    @ApiModelProperty(value = "总面积 公顷")
    private BigDecimal allArea = new BigDecimal("0");

    @ApiModelProperty(value = "平均斑块面积 公顷")
    private BigDecimal avgArea= new BigDecimal("0");



}