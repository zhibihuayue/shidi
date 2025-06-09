package com.chinatower.wetland.pojo.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>气候类型枚举</p>
 *
 * @author  wanglin
 * @author  其它作者姓名
 * @version 1.00 2024/06/21 wanglin
 * <p>
 * @see
 */
@AllArgsConstructor
@Getter
public enum AncientAndRareTreesTypeEnum {

    WOOD(0,"名木"),
    ONE_LEVE_TREE(1,"一级古树"),
    TWO_LEVE_TREE(2,"二级古树"),
    THREE_LEVE_TREE(3,"二级古树");

    private final Integer code;
    private final String desc;

}
