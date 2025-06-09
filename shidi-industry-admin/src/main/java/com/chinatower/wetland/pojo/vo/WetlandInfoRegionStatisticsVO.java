package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModel;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;

/**
 * <p>湿地信息</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Data
@ApiModel(value = "湿地信息")
public class WetlandInfoRegionStatisticsVO {
    /**
     * 区域类型
     */
    @NotBlank(message = "区域类型 见枚举RegionTypeEnum")
    private Integer regionType;

    /**
     * 面积单位
     */
    private String areaUnit;

    /**
     * 区域面积
     */
    private BigDecimal regionArea;
}