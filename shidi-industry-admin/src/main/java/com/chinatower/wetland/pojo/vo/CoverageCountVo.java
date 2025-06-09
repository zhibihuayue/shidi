package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.BasicsEntity;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.models.auth.In;
import lombok.Data;

import java.math.BigDecimal;

/**
 * <p>图层管理-图层分类的 总面积 斑块总数</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024-11-01 zyx
* <p>
 * @see
 */
@Data
public class CoverageCountVo extends BasicsEntity {


    @ApiModelProperty("图层类型 生态构成-（1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地）" +
            "适应性评估-（1-丹顶鹤 2-东方白鹳 3-天鹅）" +
            "动物分布-（1-丹顶鹤 2-东方白鹳 3-天鹅） ")
    private Integer type;

    @ApiModelProperty("年份")
    private String year;

    @ApiModelProperty("面积状态 0-适宜生境 1-较适宜生境 2-不适宜生境 3-暂无数据")
    private Integer status;

    @ApiModelProperty("总面积")
    private BigDecimal layerArea = BigDecimal.valueOf(0.0);

    @ApiModelProperty("图斑总数")
    private Integer polygonCount = 0;

}