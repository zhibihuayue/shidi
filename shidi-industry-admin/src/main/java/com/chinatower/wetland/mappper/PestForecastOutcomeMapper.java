package com.chinatower.wetland.mappper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chinatower.wetland.pojo.entity.PestControlForecast;
import com.chinatower.wetland.pojo.entity.PestForecastOutcome;
import com.chinatower.wetland.pojo.param.PestOutcomeParam;
import com.chinatower.wetland.pojo.vo.PestForecastOutcomeVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>病虫害预测表mapper</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Mapper
public interface PestForecastOutcomeMapper extends BaseMapper<PestForecastOutcome> {


    List<PestForecastOutcomeVo> listByParam(@Param("param") PestOutcomeParam param);

    List<PestForecastOutcomeVo> pestLightLastDay(@Param("param") PestOutcomeParam param);

    List<String> listTime();

}





















