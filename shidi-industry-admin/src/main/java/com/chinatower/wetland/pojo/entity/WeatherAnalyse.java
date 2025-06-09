package com.chinatower.wetland.pojo.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

/**
 * <p>气候分析数据</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
* <p>
 * @see
 */
@Data
@TableName("weather_analyse")
public class WeatherAnalyse extends BasicsEntity {

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



    /**
     * 气温 摄氏度
     */
    private BigDecimal temperature;

    /**
     * 气温来源
     */
    private Integer temperatureFrom;
    /**
     * 降水量 mm
     */
    private BigDecimal precipitation;

    /**
     * 降水量来源
     */
    private Integer precipitationFrom;

}