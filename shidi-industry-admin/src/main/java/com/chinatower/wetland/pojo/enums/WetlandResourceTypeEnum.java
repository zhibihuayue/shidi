package com.chinatower.wetland.pojo.enums;

import lombok.Getter;

/**
 * 功能描述:湿地资源类型枚举
 * @author wangman
 * @date 2024-06-17
 */
@Getter
public enum WetlandResourceTypeEnum {
    VEGETATION("vegetation","植被面积"),
    WATER("water","水域面积"),
    CONSTRUCTION("construction","湿地建筑物"),
    HUMAN_ACTIVITIES("humanActivities","人类活动"),
    REGION("region","区域信息"),


    OTHER("other","其它"),
    ;

    private final String type;
    private final String name;

    WetlandResourceTypeEnum(String type, String name) {
        this.type = type;
        this.name = name;
    }

    public static WetlandResourceTypeEnum getByName(String name) {
        for (WetlandResourceTypeEnum e : WetlandResourceTypeEnum.values()) {
            if (e.name.equals(name)) {
                return e;
            }
        }
        return OTHER;
    }
}
