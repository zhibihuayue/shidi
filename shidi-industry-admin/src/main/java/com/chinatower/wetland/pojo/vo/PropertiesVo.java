package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;

/**
 * <p>气候分析数据-大屏统计</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024-11-01
 * <p>
 * @see
 */
@Data
@ApiModel(value = "图层管理-PropertiesVo")
public class PropertiesVo {

    @ApiModelProperty("tbbh")
    private String tbbh;

    @ApiModelProperty("面积--公顷")
    private BigDecimal area;

    @ApiModelProperty("年份")
    private String year;

    @ApiModelProperty("图层类型 生态构成-（1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地）" +
            "适应性评估-（1-适宜生境 2-较适宜生境 3-不适宜生境）---status")
    private Integer type;

    @ApiModelProperty("动物类型 1-丹顶鹤 2-东方白鹳 3-天鹅---type  SuitableTypeEnum")
    private Integer animal;



    @ApiModelProperty("租户id")
    private String tenantId;

    @ApiModelProperty("行业编码")
    private String industryCode;

    @ApiModelProperty("行业版本")
    private String appVerCode;

}
