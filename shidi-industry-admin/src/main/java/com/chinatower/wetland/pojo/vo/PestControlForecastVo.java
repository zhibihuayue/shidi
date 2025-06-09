package com.chinatower.wetland.pojo.vo;

import com.baomidou.mybatisplus.annotation.TableName;
import com.chinatower.wetland.pojo.entity.BasicsEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

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
@EqualsAndHashCode(callSuper = true)
@TableName("pest_control_forecast")
public class PestControlForecastVo extends BasicsEntity {

    @ApiModelProperty("租户id")
    private String tenantId;

    @ApiModelProperty("行业编码")
    private String industryCode;

    @ApiModelProperty("行业版本")
    private String appVerCode;
    

    @ApiModelProperty("病虫害类型 0-东亚飞蝗 1-芦苇尖蛾 2-松墨天牛 3-稻蓟马")
    private Integer pestType;

    @ApiModelProperty("正常低值")
    private BigDecimal normalLow;

    @ApiModelProperty("正常高值")
    private BigDecimal normalHigh;

    @ApiModelProperty("预警低值")
    private BigDecimal earlyLow;

    @ApiModelProperty("预警高值")
    private BigDecimal earlyHigh;

    @ApiModelProperty("警戒低值")
    private BigDecimal warnLow;

    @ApiModelProperty("警戒高值")
    private BigDecimal warnHigh;

    @ApiModelProperty("风险低值")
    private BigDecimal riskLow;

    @ApiModelProperty("食物丰富度 0-无 1-低 2-一般 3-中等 4-高")
    private Integer foodLevel;

    @ApiModelProperty("天敌情况 0-无 1-极少 2-少 3-中 4-多")
    private Integer enemyLevel;

    @ApiModelProperty("正常防治建议")
    private String normalAdvice;

    @ApiModelProperty("正常推荐药物")
    private String normalMedicine;

    @ApiModelProperty("预警防治建议")
    private String earlyAdvice;

    @ApiModelProperty("预警推荐药物")
    private String earlyMedicine;

    @ApiModelProperty("警戒防治建议")
    private String warnAdvice;

    @ApiModelProperty("警戒推荐药物")
    private String warnMedicine;

    @ApiModelProperty("风险防治建议")
    private String riskAdvice;

    @ApiModelProperty("风险推荐药物")
    private String riskMedicine;

}