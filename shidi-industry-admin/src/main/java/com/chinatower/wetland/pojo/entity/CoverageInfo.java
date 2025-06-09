package com.chinatower.wetland.pojo.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

/**
 * <p>图层信息</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
* <p>
 * @see
 */
@Data
@TableName("coverage_info")
public class CoverageInfo extends BasicsEntity {

    /**
     * 租户id
     */
    private String tenantId;

    /**
     * 行业编码
     */
    private String industryCode;

    /**
     * 行业版本
     */
    private String appVerCode;



    /**
     * 图层类型 生态构成-（1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地）
     * 适应性评估-（0-丹顶鹤 1-东方白鹳 2-天鹅） 动物分布-（0-丹顶鹤 1-东方白鹳 2-天鹅）
     */
    private Integer type;

    /**
     * 图层名称
     */
    private String coverageName;

    /**
     * 图层类型 0-适应性评估 1-生态构成 2-动物分布
     */
    private Integer coverageType;

    /**
     * 默认套合图层 0-否 1-是
     */
    private Integer defaultNesting;

    /**
     * 图层面积 平方米
     */
    private BigDecimal coverageArea;

    /**
     * 图层年份
     */
    private Integer coverageYear;



}