package com.chinatower.wetland.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chinatower.wetland.pojo.entity.PestControlForecast;
import com.chinatower.wetland.pojo.entity.PestLight;
import com.chinatower.wetland.pojo.entity.PestLightRecord;

import java.util.List;

/**
 * <p>虫情灯记录表Service接口</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 2024/03/12
 * <p>
 * @see
 */
public interface IPestLightRecordService extends IService<PestLightRecord> {


    void getPestLightRecord();

    List<PestLight> pestLightDevice();

    void pestLightDeviceAll();

    void getPestLightRecordThreeMonth();
}
