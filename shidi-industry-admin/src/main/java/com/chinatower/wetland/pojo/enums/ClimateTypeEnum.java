package com.chinatower.wetland.pojo.enums;

import com.chinatower.wetland.exception.BaseBizException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>气候类型枚举</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/20 luojun
 * <p>
 * @see
 */
@AllArgsConstructor
@Getter
public enum ClimateTypeEnum {
    CLIMATE_TYPE_1(1, "热带雨林气候"),
    CLIMATE_TYPE_2(2, "热带草原气候"),
    CLIMATE_TYPE_3(3, "热带沙漠气候"),
    CLIMATE_TYPE_4(4, "热带季风气候"),
    CLIMATE_TYPE_5(5, "亚热带季风气候"),
    CLIMATE_TYPE_6(6, "地中海气候"),
    CLIMATE_TYPE_7(7,"温带海洋性气候"),
    CLIMATE_TYPE_8(8,"温带季风气候"),
    CLIMATE_TYPE_9(9,"温带大陆性气候"),
    CLIMATE_TYPE_10(10,"亚寒带针叶林气候"),
    CLIMATE_TYPE_11(11,"极地气候"),
    CLIMATE_TYPE_12(12,"高原山地气候");

    private final Integer code;
    private final String desc;

    //通过code获取枚举值
    public static ClimateTypeEnum getByCode(Integer code) {
        if (code == null) {
            throw new BaseBizException("气候类型不存在");
        }
        for (ClimateTypeEnum v : values()) {
            if (v.code.equals(code)) {
                return v;
            }
        }
        throw new BaseBizException("气候类型不存在");
    }
}
