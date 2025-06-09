package com.chinatower.wetland.service.impl;


import com.chinatower.analysis.api.entity.AnalysisVO;
import com.chinatower.analysis.api.entity.DeviceStatisticsVO;
import com.chinatower.analysis.api.entity.IotDeviceStatisticsVo;
import com.chinatower.common.core.utils.StringUtils;
import com.chinatower.common.entity.Result;
import com.chinatower.forestry.emengercy.api.entity.DeviceStaticsVO;
import com.chinatower.forestry.emengercy.api.entity.TrapStatisticsDTO;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.wetland.pojo.enums.DeviceTypeEnum;
import com.chinatower.wetland.pojo.vo.AnalysisParamVo;
import com.chinatower.wetland.pojo.vo.DeviceStatisticsVo;
import com.chinatower.wetland.service.IDeviceInfoService;
import com.chinatower.wetland.service.RpcService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * @Description : 设备信息
 * @Author : zyx
 * @Date: 2024-06-17
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class DeviceInfoServiceImpl implements IDeviceInfoService {

    private final RpcService rpcService;

    @Override
    public DeviceStatisticsVo statistics(AnalysisParamVo analysisParamVo) {
        DeviceStatisticsVo result = new DeviceStatisticsVo();  //返回值

        LoginUser loginUser = rpcService.getLoginUser();  //客户信息

        /*查询 摄像头 统计*/
        this.getCameraCount(result, loginUser, analysisParamVo);
        /*查询 气象站 统计*/
        this.getWeatherStationCount(result, loginUser, analysisParamVo);
        /*查询 诱捕器 统计*/
        this.getTrapCount(result, analysisParamVo);
        /*查询 野保相机 统计*/
        this.getWildProtectionCamera(result, analysisParamVo);

        return result;
    }

    /**
     * 调用 feign 获取 摄像机 统计
     *
     * @param result    统计返回值
     * @param loginUser 客户数据
     */
    private void getCameraCount(DeviceStatisticsVo result, LoginUser loginUser, AnalysisParamVo analysisParamVo) {
        AnalysisVO analysisVO = new AnalysisVO();
        analysisVO.setTenantId(loginUser.getUser().getTenantId());
        analysisVO.setIndustryCode(loginUser.getUser().getIndustryCode());
        if (StringUtils.isNotBlank(analysisParamVo.getScreenId())) {
            log.info("大屏数据权限参数,screenId " + analysisParamVo.getScreenId());
            analysisVO.setScreenId(analysisParamVo.getScreenId());
        }
        if (StringUtils.isNotBlank(analysisParamVo.getScreenType())) {
            log.info("大屏数据权限参数,screenType " + analysisParamVo.getScreenType());
            analysisVO.setScreenType(analysisParamVo.getScreenType());
        }
        Result<DeviceStatisticsVO> apiResult = this.rpcService.getDeviceStatistics(analysisVO);
        if (Objects.nonNull(apiResult.getData())) {
            DeviceStatisticsVO data = apiResult.getData();
            result.setDevCountOffline(data.getDevCountOffline());
            result.setDevCountOnline(data.getDevCountOnline());
            result.setDeviceCountTotal(data.getDeviceCountTotal());
        }
    }

    /**
     * 调用 feign 获取 气象站 统计
     *
     * @param result    统计返回值
     * @param loginUser 客户数据
     */
    private void getWeatherStationCount(DeviceStatisticsVo result, LoginUser loginUser, AnalysisParamVo analysisParamVo) {
        AnalysisVO analysisVO = new AnalysisVO();
        analysisVO.setTenantId(loginUser.getUser().getTenantId());
        analysisVO.setIndustryCode(loginUser.getUser().getIndustryCode());
        if (StringUtils.isNotBlank(analysisParamVo.getScreenId())) {
            log.info("大屏数据权限参数,screenId " + analysisParamVo.getScreenId());
            analysisVO.setScreenId(analysisParamVo.getScreenId());
        }
        if (StringUtils.isNotBlank(analysisParamVo.getScreenType())) {
            log.info("大屏数据权限参数,screenType " + analysisParamVo.getScreenType());
            analysisVO.setScreenType(analysisParamVo.getScreenType());
        }
        List<String> deviceTypeList = new ArrayList<>();

        deviceTypeList.add(DeviceTypeEnum.DEVICE_TYPE_2022.getDesc());
        analysisVO.setDeviceTypeList(deviceTypeList);
        Result<IotDeviceStatisticsVo> apiResult = this.rpcService.getIotDeviceStatistics(analysisVO);
        if (Objects.nonNull(apiResult.getData())) {
            IotDeviceStatisticsVo data = apiResult.getData();
            result.setIotDeviceCount(data.getIotDeviceCount());
            result.setIotDeviceOnlineCount(data.getIotDeviceOnlineCount());
            result.setIotDeviceOfflineCount(data.getIotDeviceOfflineCount());
        }
    }

    /**
     * .0
     * 调用 feign 获取 诱捕器 统计
     *
     * @param result 统计返回值
     */
    private void getTrapCount(DeviceStatisticsVo result, AnalysisParamVo analysisParamVo) {
        Result<TrapStatisticsDTO> apiResult = this.rpcService.statistics();
        if (Objects.nonNull(apiResult.getData())) {
            TrapStatisticsDTO data = apiResult.getData();
            result.setTrapCount(data.getTrapCount());
        }
    }

    /**
     * 调用 feign 获取 野保相机 统计
     *
     * @param result 统计返回值
     */
    private void getWildProtectionCamera(DeviceStatisticsVo result, AnalysisParamVo analysisParamVo) {
        Result<DeviceStaticsVO> apiResult = this.rpcService.countWildProtectionCamera();
        if (Objects.nonNull(apiResult.getData())) {
            DeviceStaticsVO data = apiResult.getData();
            result.setWildProtectionCameraCount(data.getDeviceTotal());
        }
    }

}
