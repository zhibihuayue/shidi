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
public enum PestTypeEnum {
    ZERO(0, "东亚飞蝗"),
    ONE(1, "芦苇尖蛾"),
    TWO(2, "松墨天牛"),
    THREE(3, "稻蓟马");

    private final Integer code;
    private final String desc;

    //通过code获取枚举值
    public static PestTypeEnum getByCode(Integer code) {
        if (code == null) {
            throw new BaseBizException("病虫害类型不存在");
        }
        for (PestTypeEnum v : values()) {
            if (v.code.equals(code)) {
                return v;
            }
        }
        throw new BaseBizException("病虫害类型不存在");
    }

    public static PestTypeEnum getByDesc(String desc) {
        if (desc == null) {
            throw new BaseBizException("病虫害类型不存在");
        }
        for (PestTypeEnum v : values()) {
            if (v.desc.equals(desc)) {
                return v;
            }
        }
        throw new BaseBizException("病虫害类型不存在");
    }
}