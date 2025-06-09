package com.chinatower.wetland.pojo.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

/**
 * <p>图层区域经纬度信息</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
* <p>
 * @see
 */
@Data
@TableName("coverage_info_area")
public class CoverageInfoArea extends BasicsEntity {

    /**
     * 图层id
     */
    private String coverageId;

    /**
     * 经纬度类型 0-点 1-线 2-面
     */
    private Integer type;

    /**
     * 经度
     */
    private String longitude;

    /**
     * 纬度
     */
    private String latitude;

    /**
     * 经纬度面积-仅为面拥有其他为0 平方米
     */
    private BigDecimal coverageArea;

    /**
     * 面积状态 0-适宜生境 1-较适宜生境 2-不适宜生境 3-暂无数据
     */
    private Integer status;


}