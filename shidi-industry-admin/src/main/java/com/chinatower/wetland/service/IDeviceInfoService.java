package com.chinatower.wetland.service;

import com.chinatower.analysis.api.entity.AnalysisVO;
import com.chinatower.wetland.pojo.vo.AnalysisParamVo;
import com.chinatower.wetland.pojo.vo.DeviceStatisticsVo;

/**
 * <p>设备信息Service接口</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 2024/06/17 zyx
 * <p>
 * @see
 */
public interface IDeviceInfoService{


    DeviceStatisticsVo statistics(AnalysisParamVo analysisVO);


}
