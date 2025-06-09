package com.chinatower.wetland.pojo.vo;

import com.baomidou.mybatisplus.annotation.TableName;
import com.chinatower.wetland.pojo.entity.BasicsEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.Date;

/**
 * <p>病虫害预测结果表</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2025/03/12
* <p>
 * @see
 */

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("pest_forecast_outcome")
public class PestForecastOutcomeVo extends BasicsEntity {

    @ApiModelProperty("租户id")
    private String tenantId;

    @ApiModelProperty("行业编码")
    private String industryCode;

    @ApiModelProperty("行业版本")
    private String appVerCode;


    @ApiModelProperty("预测时间")
    private Date forecastDate;

    @ApiModelProperty("虫情灯id")
    private String lightId;

    @ApiModelProperty("虫情灯名称")
    private String lightName;

    @ApiModelProperty("病虫害类型 0-东亚飞蝗 1-芦苇尖蛾 2-松墨天牛 3-稻蓟马")
    private Integer pestType;

    @ApiModelProperty("虫数量")
    private BigDecimal pestNum;

    @ApiModelProperty("病虫害等级")
    private Integer pestLevel;

    @ApiModelProperty("经度")
    private String longitude;

    @ApiModelProperty("维度")
    private String latitude;





}