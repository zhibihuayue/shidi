package com.chinatower.wetland.service;

import com.chinatower.wetland.pojo.vo.AncientAndRareTreesSortStatisticsVo;

import java.util.List;

/**
 * <p>古树名木统计Service接口</p>
 *
 * @author  wanglin
 * @author  其它作者姓名
 * @version 1.00 2024/06/18 wanglin
 * <p>
 * @see
 */
public interface IAncientAndRareTreesService {

    List<AncientAndRareTreesSortStatisticsVo> getClassifiedStatistic();

}
