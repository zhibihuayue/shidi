package com.chinatower.wetland.pojo.enums;

import com.chinatower.wetland.exception.BaseBizException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>湿地类型枚举</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/20 luojun
 * <p>
 * @see
 */
@AllArgsConstructor
@Getter
public enum WetlandTypeEnum {
    WETLAND_TYPE_1(1, "沼泽湿地"),
    WETLAND_TYPE_2(2, "湖泊湿地"),
    WETLAND_TYPE_3(3, "河流湿地"),
    WETLAND_TYPE_4(4, "滨海湿地"),
    WETLAND_TYPE_5(5, "人工湿地");

    private final Integer code;
    private final String desc;

    //通过code获取枚举值
    public static WetlandTypeEnum getByCode(Integer code) {
        if (code == null) {
            throw new BaseBizException("湿地类型不存在");
        }
        for (WetlandTypeEnum v : values()) {
            if (v.code.equals(code)) {
                return v;
            }
        }
        throw new BaseBizException("湿地类型不存在");
    }
}
