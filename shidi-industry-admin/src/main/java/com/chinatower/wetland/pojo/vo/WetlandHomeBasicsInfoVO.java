package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.util.List;

/**
 * 功能描述:首页湿地基础信息Model
 *
 * @author wangman
 * @date 2024-06-17
 */
@Data
@ApiModel("首页湿地基础信息Model")
public class WetlandHomeBasicsInfoVO {

    @ApiModelProperty(value = "湿地名称")
    private String wetlandName;

    @ApiModelProperty(value = "地区名称")
    private String regionName;

    @ApiModelProperty(value = "保护级别")
    private String protectionLevel;

    @ApiModelProperty(value = "湿地面积")
    private String wetlandArea;

    @ApiModelProperty(value = "湿地面积单位")
    private String areaUnit;

    @ApiModelProperty(value = "图片集合")
    private List<String> imageList;
}
