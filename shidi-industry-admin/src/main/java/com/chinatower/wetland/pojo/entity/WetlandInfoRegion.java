package com.chinatower.wetland.pojo.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.chinatower.wetland.pojo.vo.MapInfo;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

/**
 * <p>湿地区域信息实体类</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Data
@TableName("wetland_info_region")
public class WetlandInfoRegion extends BasicsEntity{
    /**
     * 湿地区域名称
     */
    @NotBlank(message = "区域名称不能为空")
    private String regionName;

    /**
     * 区域类型
     */
    @NotBlank(message = "区域类型 见枚举RegionTypeEnum")
    private Integer regionType;

    /**
     * 区域颜色
     */
    private String mapColor;

    /** 
     * 区域面积
     */
    private BigDecimal regionArea;

    /**
     * 面积单位
     */
    private String areaUnit;

    /**
     * 备注
     */
    private String remark;

    /**
     * 湿地信息id
     */
    private String wetlandInfoId;

    /**
     * 地图数据
     */
    private String mapData;

    /**
     * 排序
     */
    @NotNull(message = "排序不能为空")
    private Long sort;

    /**
     * 地图数据
     */
    @TableField(exist = false)
    private List<MapInfo> mapDataList;


    @ApiModelProperty(value = "是否为新增数据 0-编辑数据 1-新增数据")
    @TableField(exist = false)
    private Integer updateOrNew;

    /**
     * 租户id
     */
    private String tenantId;

    /**
     * 行业编码
     */
    private String industryCode;

    /**
     * 行业版本
     */
    private String appVerCode;

}