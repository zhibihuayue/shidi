package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.BasicsEntity;
import com.chinatower.wetland.pojo.entity.CoverageInfoArea;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * <p>图层信息</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
* <p>
 * @see
 */
@Data
public class CoverageInfoVo extends BasicsEntity {

    /**
     * 租户id
     */
    @ApiModelProperty(value = "租户id")
    private String tenantId;

    /**
     * 行业编码
     */
    @ApiModelProperty(value = "行业编码")
    private String industryCode;

    /**
     * 行业版本
     */
    @ApiModelProperty(value = "行业版本")
    private String appVerCode;


    /**
     * 图层类型 1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地
     */
    @ApiModelProperty(value = "图层类型 1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地")
    private Integer type;

    /**
     * 图层名称
     */
    @ApiModelProperty(value = "图层名称")
    private String coverageName;

    /**
     * 图层类型
     */
    @ApiModelProperty(value = "图层类型")
    private String coverageType;

    /**
     * 默认套合图层 0-否 1-是
     */
    @ApiModelProperty(value = "默认套合图层 0-否 1-是")
    private Integer defaultNesting;

    @ApiModelProperty(value = "图层面积 平方米")
    private BigDecimal coverageArea;

    /**
     * 图层年份
     */
    @ApiModelProperty(value = "图层年份")
    private Integer coverageYear;


    @ApiModelProperty(value = "经纬度区域信息")
    private List<CoverageInfoArea> areaList;

}