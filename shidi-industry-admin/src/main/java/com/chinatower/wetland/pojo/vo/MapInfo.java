package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class MapInfo{
    @ApiModelProperty(value = "地图id")
    private String mapId;

    @ApiModelProperty(value = "地图uuid")
    private String mapUuid;

    @ApiModelProperty(value = "地图名称")
    private String mapName;

    @ApiModelProperty(value = "地图数据")
    private String mapData;
}
