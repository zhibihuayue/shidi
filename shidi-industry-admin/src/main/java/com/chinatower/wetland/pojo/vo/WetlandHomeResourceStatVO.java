package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * 功能描述:首页湿地资源统计Model
 *
 * @author wangman
 * @date 2024-06-18
 */
@Data
@ApiModel("首页湿地资源统计Model")
public class WetlandHomeResourceStatVO {

    @ApiModelProperty(value = "湿地id-用于查询详情")
    private String wetlandId;

    @ApiModelProperty(value = "资源面积")
    private String resourceArea;

    @ApiModelProperty(value = "资源名称")
    private String resourceName;

    @ApiModelProperty(value = "资源单位")
    private String resourceUnit;

    @ApiModelProperty(value = "资源type")
    private String resourceType;
}
