package com.chinatower.wetland.pojo.enums;

import com.chinatower.wetland.exception.BaseBizException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>设备类型枚举</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 2024/06/21 zyx
 * <p>
 * @see
 */
@AllArgsConstructor
@Getter
public enum DeviceTypeEnum {

    DEVICE_TYPE_2022( 2022, "400800010001");

    private final Integer code;
    private final String desc;

    //通过code获取枚举值
    public static DeviceTypeEnum getByCode(Integer code) {
        if (code == null) {
            throw new BaseBizException("湿地类型不存在");
        }
        for (DeviceTypeEnum v : values()) {
            if (v.code.equals(code)) {
                return v;
            }
        }
        throw new BaseBizException("湿地类型不存在");
    }
}
