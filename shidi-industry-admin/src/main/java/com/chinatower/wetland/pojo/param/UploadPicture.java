package com.chinatower.wetland.pojo.param;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UploadPicture {
    @ApiModelProperty(value = "图片")
    private String file;

    @ApiModelProperty(value = "图片类型 如：png/jpg/gif/jpeg")
    private String fileType;
}
