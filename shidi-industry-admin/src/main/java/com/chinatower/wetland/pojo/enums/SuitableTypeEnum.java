package com.chinatower.wetland.pojo.enums;

import com.chinatower.wetland.exception.BaseBizException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>适宜生境动物类型枚举</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 2024-11-04
 * <p>
 * @see
 */
@AllArgsConstructor
@Getter
public enum SuitableTypeEnum {
    CLIMATE_TYPE_1(1, "丹顶鹤"),
    CLIMATE_TYPE_2(2, "东方白鹳"),
    CLIMATE_TYPE_3(3, "天鹅"),

    ;

    private final Integer code;
    private final String desc;

    //通过code获取枚举值
    public static SuitableTypeEnum getByCode(Integer code) {
        if (code == null) {
            throw new BaseBizException("动物类型不存在");
        }
        for (SuitableTypeEnum v : values()) {
            if (v.code.equals(code)) {
                return v;
            }
        }
        throw new BaseBizException("动物类型不存在");
    }
}
