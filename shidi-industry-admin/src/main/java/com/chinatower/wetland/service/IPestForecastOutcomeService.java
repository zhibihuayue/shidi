package com.chinatower.wetland.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chinatower.wetland.pojo.entity.PestForecastOutcome;
import com.chinatower.wetland.pojo.param.PestOutcomeParam;
import com.chinatower.wetland.pojo.vo.PestForecastOutcomeVo;
import com.chinatower.wetland.pojo.vo.PestHomeStatisticsVo;

import java.util.List;

/**
 * <p>病虫害预测结果表Service接口</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 2024/03/12
 * <p>
 * @see
 */
public interface IPestForecastOutcomeService extends IService<PestForecastOutcome> {


    PestHomeStatisticsVo pestPrediction(PestOutcomeParam param);

    List<String> pestTimeList();

    List<PestForecastOutcomeVo> pestLightLastDay(PestOutcomeParam param);
}
