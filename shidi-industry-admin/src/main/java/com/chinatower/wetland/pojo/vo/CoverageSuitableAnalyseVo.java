package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.BasicsEntity;
import com.chinatower.wetland.util.BigSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

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
public class CoverageSuitableAnalyseVo {

    @ApiModelProperty(value = "总面积")
    @JsonSerialize(using = BigSerializer.class)
    private BigDecimal allArea = new BigDecimal("0");

    @ApiModelProperty(value = "总面积")
    private String allAreaStr = "0";


    @ApiModelProperty(value = "适宜生境 占比")
    private Double mostSuitableRate = 0.0;

    @ApiModelProperty(value = "适宜生境 总数")
    @JsonSerialize(using = BigSerializer.class)
    private BigDecimal mostSuitableCount = new BigDecimal("0");

    @ApiModelProperty(value = "适宜生境 总数")
    private String mostSuitableCountStr;


    @ApiModelProperty(value = "较适宜生境 占比")
    private Double moreSuitableRate = 0.0;

    @ApiModelProperty(value = "较适宜生境 总数")
    @JsonSerialize(using = BigSerializer.class)
    private BigDecimal moreSuitableCount= new BigDecimal("0");

    @ApiModelProperty(value = "较适宜生境 总数")
    private String moreSuitableCountStr = "0";


    @ApiModelProperty(value = "不适宜生境 占比")
    private Double notSuitableRate = 0.0;

    @ApiModelProperty(value = "不适宜生境 总数")
    @JsonSerialize(using = BigSerializer.class)
    private BigDecimal notSuitableCount = new BigDecimal("0");

    @ApiModelProperty(value = "不适宜生境 总数")
    private String notSuitableCountStr = "0";


    @ApiModelProperty(value = "暂无数据 占比")
    private Double notDataRate = 0.0;

    @ApiModelProperty(value = "暂无数据 总数")
    @JsonSerialize(using = BigSerializer.class)
    private BigDecimal notDataCount = new BigDecimal("0");

    @ApiModelProperty(value = "暂无数据 总数")
    private String notDataCountStr="0";

    @ApiModelProperty(value = "图层年份")
    private Integer coverageYear;


}