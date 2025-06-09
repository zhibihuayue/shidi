package com.chinatower.wetland.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chinatower.wetland.pojo.entity.PestControlForecast;
import com.chinatower.wetland.pojo.param.PestControlForecastEditParam;
import com.chinatower.wetland.pojo.param.PestControlForecastInsertParam;
import com.chinatower.wetland.pojo.vo.PestControlForecastExportVo;
import com.chinatower.wetland.pojo.vo.PestControlForecastVo;

import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * <p>病虫害预测表Service接口</p>
 *
 * @author zyx
 * @author 其它作者姓名
 * @version 1.00 2024/03/12
 * <p>
 * @see
 */
public interface IPestControlForecastService extends IService<PestControlForecast> {


    boolean insert(PestControlForecastInsertParam param);

    boolean edit(PestControlForecastEditParam param);

    List<PestControlForecastVo> index();

    List<PestControlForecastExportVo> getVoByPestType();

    PestControlForecastVo getVoById(String id);

    boolean deleteById(String id);


    void export(HttpServletResponse response);


}
