package com.chinatower.wetland.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chinatower.wetland.pojo.entity.WeatherAnalyse;
import com.chinatower.wetland.pojo.param.WeatherAnalyseSelectParam;
import com.chinatower.wetland.pojo.vo.WeatherStatisticsVo;

/**
 * <p>气候分析数据Service</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
 * <p>
 * @see
 */
public interface IWeatherAnalyseService extends IService<WeatherAnalyse> {


    WeatherStatisticsVo statistics(WeatherAnalyseSelectParam param);

    Boolean setWeatherNow();
}
