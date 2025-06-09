package com.chinatower.wetland.pojo.enums;

import com.chinatower.wetland.exception.BaseBizException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>区域类型枚举</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90_上线需求迭代 2024-09-21 zyx
 * <p>
 * @see
 */
@AllArgsConstructor
@Getter
public enum RegionTypeEnum {
    //水域面积
    REGION_TYPE_0(0, "水域面积", "water"),
    //湿地建筑物
    REGION_TYPE_1(1, "湿地建筑物", "construction"),
    //人类活动
    REGION_TYPE_2(2, "人类活动", "humanActivities"),
    //区域信息
    REGION_TYPE_3(3, "区域信息", "region"),
    ;


    private final Integer code;
    private final String desc;
    private final String type;

    //通过code获取枚举值
    public static RegionTypeEnum getByCode(Integer code) {
        if (code == null) {
            throw new BaseBizException("区域类型编码传入为空");
        }
        for (RegionTypeEnum v : values()) {
            if (v.code.equals(code)) {
                return v;
            }
        }
        throw new BaseBizException("区域类型编码不存在");
    }

    public static RegionTypeEnum getByType(String type) {
        if (type == null) {
            throw new BaseBizException("区域类型传入为空");
        }
        for (RegionTypeEnum v : values()) {
            if (v.type.equals(type)) {
                return v;
            }
        }
        throw new BaseBizException("区域类型不存在");
    }
}
