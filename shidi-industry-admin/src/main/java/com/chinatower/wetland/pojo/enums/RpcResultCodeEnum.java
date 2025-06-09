package com.chinatower.wetland.pojo.enums;

import com.chinatower.wetland.exception.BaseBizException;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>rpc调用返回值枚举</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 20241115 zyx
 * <p>
 * @see
 */
@AllArgsConstructor
@Getter
public enum RpcResultCodeEnum {

    RESULT_200( 200, "normal");

    private final Integer code;
    private final String desc;

    //通过code获取枚举值
    public static RpcResultCodeEnum getByCode(Integer code) {
        if (code == null) {
            throw new BaseBizException("rpc调用返回值枚举类型不存在");
        }
        for (RpcResultCodeEnum v : values()) {
            if (v.code.equals(code)) {
                return v;
            }
        }
        throw new BaseBizException("rpc调用返回值枚举类型不存在");
    }
}
