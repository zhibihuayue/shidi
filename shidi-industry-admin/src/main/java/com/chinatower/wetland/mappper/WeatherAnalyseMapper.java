package com.chinatower.wetland.mappper;


import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chinatower.wetland.pojo.entity.WeatherAnalyse;
import com.chinatower.wetland.pojo.entity.WetlandInfo;
import com.chinatower.wetland.pojo.param.WeatherAnalyseSelectParam;
import com.chinatower.wetland.pojo.vo.WeatherStatisticsVo;
import com.chinatower.wetland.pojo.vo.WeatherTimeVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * <p>气候分析数据Mapper</p>
 *
 * @author zyx
 * @author 其它作者姓名
 * @version 1.6.90 2024/09/24 zyx
 * <p>
 * @see
 */
@Mapper
public interface WeatherAnalyseMapper extends BaseMapper<WeatherAnalyse> {

    WeatherStatisticsVo statisticsMonth(@Param("industryCode") String industryCode,
                                        @Param("tenantId") String tenantId,
                                        @Param("appVerCode") String appVerCode,
                                        @Param("startTime") Date startTime, @Param("endTime") Date endTime);


    List<WeatherTimeVo> statisticsTimeList(@Param("param") WeatherAnalyseSelectParam param);

    @InterceptorIgnore(tenantLine = "true")
    WeatherAnalyse getOneWeather(@Param("param") WetlandInfo wetlandInfo, @Param("startTime") Date day, @Param("endTime") Date day1);

    @InterceptorIgnore(tenantLine = "true")
    void saveWeather(@Param("param") WeatherAnalyse one);

    @InterceptorIgnore(tenantLine = "true")
    void saveWeatherHf(@Param("param") WeatherAnalyse one);

    @InterceptorIgnore(tenantLine = "true")
    void updatePrecipitation(@Param("param") WeatherAnalyse one);

    void removeByLoginData(@Param("tenantId") String tenantId,
                           @Param("industryCode") String industryCode,
                           @Param("appVerCode") String appVerCode);
}





















