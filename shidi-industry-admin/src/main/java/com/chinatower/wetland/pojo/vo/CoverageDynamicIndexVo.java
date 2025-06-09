package com.chinatower.wetland.pojo.vo;

import com.chinatower.wetland.pojo.entity.BasicsEntity;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

/**
 * <p>生态转移矩阵</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2025-03-25 zyx
* <p>
 * @see
 */
@Data
public class CoverageDynamicIndexVo extends BasicsEntity {


    /**
     * 综合动态度
     */
    @ApiModelProperty("综合动态度")
    private BigDecimal dynamic;

    /**
     * 转入指数
     */
    @ApiModelProperty("转入指数")
    private BigDecimal transferInIndex;

    /**
     * 转出指数
     */
    @ApiModelProperty("转出指数")
    private BigDecimal transferOutIndex;

}