package com.chinatower.wetland.pojo.param;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * <p>图层信息-大屏查询</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
 * <p>
 * @see
 */
@Data
@ApiModel(value = "图层信息-大屏查询")
public class CoverageInfoSelectParam {

    @ApiModelProperty(value = "开始时间")
    private String startTime;

    @ApiModelProperty(value = "结束时间")
    private String endTime;

    @ApiModelProperty(value = "后端使用-年份集合")
    private List<Integer> years;

    @ApiModelProperty(value = "图层类型 0-适应性评估 1-生态构成 2-动物分布")
    private Integer coverageType;

    @ApiModelProperty(value = "图层类型 生态构成-（1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地） " +
            "适应性评估-（1-丹顶鹤 2-东方白鹳 3-天鹅） 动物分布-（1-丹顶鹤 2-东方白鹳 3-天鹅）")
    private Integer type;



    @ApiModelProperty(value = "行业编码")
    String industryCode;

    @ApiModelProperty(value = "租户id")
    String tenantId;

    @ApiModelProperty(value = "行业版本")
    String appVerCode;

}