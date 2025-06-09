package com.chinatower.wetland.pojo.entity;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.chinatower.wetland.pojo.vo.MapInfo;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

/**
 * <p>湿地植被信息实体类</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Data
@TableName("wetland_info_vegetation")
public class WetlandInfoVegetation extends BasicsEntity{
    /**
     * 植被类型
     */
    @NotBlank(message = "植被类型不能为空")
    private String vegetationType;

    /**
     * 区域颜色
     */
    private String mapColor;

    /**
     * 植被面积
     */
    private BigDecimal vegetationArea;

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