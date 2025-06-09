package com.chinatower.wetland.pojo.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;
import java.util.Date;

/**
 * <p>湿地信息实体类</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Data
@TableName("wetland_info")
public class WetlandInfo extends BasicsEntity{
    /**
     * 湿地名称
     */
    private String wetlandName;


    /**
     * 地区编码
     */
    private String regionCode;

    /**
     * 地区名称
     */
    private String regionName;

    /**
     * 纬度、经度
     */
    private String latitudeLongitude;

    /**
     * 区域颜色
     */
    private String mapColor;

    /**
     * 地图数据
     */
    private String mapData;


    /**
     * 湿地类型
     */
    private String wetlandType;

    /**
     * 湿地面积
     */
    private BigDecimal wetlandArea;

    /**
     * 湿地面积单位
     */
    private String areaUnit;

    /**
     * 气候类型,多选
     */
    private String climateType;

    /**
     * 建立时间
     */
    private Date establishmentTime;

    /**
     * 所属单位
     */
    private String ownerUnit;

    /**
     * 保护级别,保护级别,1-国家级，2-省级，3-一般
     */
    private Integer protectionLevel;

    /**
     * 图片
     */
    private String wetlandImage;


    /**
     * 丰水期
     */
    private String highWaterPeriod;

    /**
     * 平均水位
     */
    private String averageWaterLevel;

    /**
     *  枯水期
     */
    private String lowWaterPeriod;

    /**
     * 平均枯水位
     */
    private String averageLowWaterLevel;

    /**
     * 平水期
     */
    private String normalWaterPeriod;

    /**
     * 平均平水位
     */
    private String averageNormalWaterLevel;

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