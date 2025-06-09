package com.chinatower.wetland.pojo.vo;

import com.alibaba.excel.annotation.ExcelProperty;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>湿地信息导出</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Data
public class ImportVO{
    @ApiModelProperty(value = "序号")
    @ExcelProperty(value = "序号", index = 0)
    private Integer sort;

    @ApiModelProperty(value = "湿地名称")
    @ExcelProperty(value = "湿地名称", index = 1)
    private String wetlandName;

    @ApiModelProperty(value = "所在区域")
    @ExcelProperty(value = "所在区域", index = 2)
    private String regionName;

    @ApiModelProperty(value = "经纬度")
    @ExcelProperty(value = "所在区域", index = 3)
    private String latitudeLongitude;

    @ApiModelProperty(value = "湿地类型")
    @ExcelProperty(value = "湿地类型", index = 4)
    private String wetlandTypeString;

    @ApiModelProperty(value = "湿地面积")
    @ExcelProperty(value = "湿地面积", index = 5)
    private String wetlandAreaString;

    @ApiModelProperty(value = "气候类型")
    @ExcelProperty(value = "气候类型", index = 6)
    private String climateTypeString;

    @ApiModelProperty(value = "建立时间")
    @ExcelProperty(value = "气候类型", index = 7)
    private String establishmentTime;

    @ApiModelProperty(value = "所属单位")
    @ExcelProperty(value = "所属单位", index = 8)
    private String ownerUnit;

    @ApiModelProperty(value = "保护级别,1-国家级，2-省级，3-一般")
    @ExcelProperty(value = "保护级别", index = 9)
    private String protectionLevelString;

    @ApiModelProperty(value = "图片")
    @ExcelProperty(value = "图片", index = 10)
    private String image;

    @ApiModelProperty(value = "区域类型")
    @ExcelProperty(value = "区域类型", index = 11)
    private String region;

    @ApiModelProperty(value = "区域面积")
    @ExcelProperty(value = "区域面积", index = 12)
    private String regionArea;

    @ApiModelProperty(value = "植被类型")
    @ExcelProperty(value = "植被类型", index = 13)
    private String vegetation;

    @ApiModelProperty(value = "植被面积")
    @ExcelProperty(value = "植被面积", index = 14)
    private String vegetationArea;
  //  水域类型 水域面积	建筑类型	建筑面积	人类活动类型	人类活动面积

    @ApiModelProperty(value = "水域类型")
    @ExcelProperty(value = "水域类型", index = 15)
    private String waterRegion;

    @ApiModelProperty(value = "水域面积")
    @ExcelProperty(value = "水域面积", index = 16)
    private String waterRegionArea;

    @ApiModelProperty(value = "建筑类型")
    @ExcelProperty(value = "建筑类型", index = 17)
    private String constructionRegion;

    @ApiModelProperty(value = "建筑面积")
    @ExcelProperty(value = "建筑面积", index = 18)
    private String constructionRegionArea;


    @ApiModelProperty(value = "人类活动类型")
    @ExcelProperty(value = "人类活动类型", index = 19)
    private String humanActivitiesRegion;

    @ApiModelProperty(value = "人类活动面积")
    @ExcelProperty(value = "人类活动面积", index = 20)
    private String humanActivitiesRegionArea;


    @ApiModelProperty(value = "丰水期")
    @ExcelProperty(value = "丰水期", index = 21)
    private String highWaterPeriod;

    @ApiModelProperty(value = "平均水位")
    @ExcelProperty(value = "平均水位", index = 22)
    private String averageWaterLevel;

    @ApiModelProperty(value = "枯水期")
    @ExcelProperty(value = "枯水期", index = 23)
    private String lowWaterPeriod;

    @ApiModelProperty(value = "平均水位")
    @ExcelProperty(value = "平均水位", index = 24)
    private String averageLowWaterLevel;

    @ApiModelProperty(value = "平水期")
    @ExcelProperty(value = "平水期", index = 25)
    private String normalWaterPeriod;

    @ApiModelProperty(value = "平均水位")
    @ExcelProperty(value = "平均水位", index = 26)
    private String averageNormalWaterLevel;



}