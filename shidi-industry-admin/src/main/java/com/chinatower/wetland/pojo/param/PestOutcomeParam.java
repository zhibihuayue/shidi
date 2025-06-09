package com.chinatower.wetland.pojo.param;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.checkerframework.checker.formatter.qual.Format;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * <p>病虫害预测表</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2025/03/12
* <p>
 * @see
 */

@Data
public class PestOutcomeParam {

    @ApiModelProperty("租户id")
    private String tenantId;

    @ApiModelProperty("行业编码")
    private String industryCode;

    @ApiModelProperty("行业版本")
    private String appVerCode;
    

    @ApiModelProperty("病虫害类型 0-东亚飞蝗 1-芦苇尖蛾 2-松墨天牛 3-稻蓟马")
    @NotNull(message = "病虫害类型不能为空")
    private Integer pestType;

    @ApiModelProperty("虫情灯id")
    private String lightId;

    @ApiModelProperty("虫情灯i-多个")
    private List<String> lightIds;

    @ApiModelProperty("创建时间")
    private String createTime;

    @ApiModelProperty("开始时间")
    private String startTime;

    @ApiModelProperty("结束时间")
    private String endTime;

}