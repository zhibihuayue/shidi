package com.chinatower.wetland.pojo.vo;

import lombok.Data;

import java.util.Date;

@Data
public class PestLightQueryVo {
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
     * 开始时间
     */
    private String startTime;

    /**
     * 结束时间
     */
    private String endTime;
}
