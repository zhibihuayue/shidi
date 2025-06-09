package com.chinatower.wetland.pojo.enums;

import com.chinatower.wetland.exception.BaseBizException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>保护级别枚举</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/21 luojun
 * <p>
 * @see
 */
@AllArgsConstructor
@Getter
public enum ProtectionLevelEnum {
    COUNTRY_LEVEL(1, "国家级"),
    PROVINCIAL_LEVEL(2, "省级"),
    GENERAL_LEVEL(3, "一般");

    private final Integer code;
    private final String desc;

    //通过code获取枚举值
    public static ProtectionLevelEnum getByCode(Integer code) {
        if (code == null) {
            throw new BaseBizException("保护级别不存在");
        }
        for (ProtectionLevelEnum v : values()) {
            if (v.code.equals(code)) {
                return v;
            }
        }
        throw new BaseBizException("保护级别不存在");
    }
}
