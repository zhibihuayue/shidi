package com.chinatower.wetland.pojo.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>名木古树信息类别及数量</p>
 *
 * @author  wanglin
 * @author  其它作者姓名
 * @version 1.00 2024/06/20 wanglin
 * <p>
 * @see
 */
@Data
@ApiModel(value = "名木古树信息类别及数量")
public class AncientAndRareTreesLevelVo {

    @ApiModelProperty(value = "一级古树")
    private Integer oneLevelTreeCount = 0;

    @ApiModelProperty(value = "二级古树")
    private Integer twoLevelTreeCount = 0;

    @ApiModelProperty(value = "三级古树")
    private Integer threeLevelTreeCount = 0;

    @ApiModelProperty(value = "名木")
    private Integer woodCount = 0;
}
