package com.chinatower.wetland.pojo.entity;

import lombok.Data;

@Data
public class PestLight {
    private String id;
    private String deviceName;
    private String deviceCode;
    private String deviceType;
    private String longitude;
    private String latitude;
    private String provinceCode;
    private String provinceName;
    private String cityCode;
    private String cityName;
    private String countyCode;
    private String countyName;
    private String townCode;
    private String townName;
    private String deviceAddress;
    private String createTime;
    private String tenantId;
    private String industryCode;
    private String appVerCode;
}
