package com.chinatower.wetland.service;

import com.chinatower.analysis.api.entity.AnalysisVO;
import com.chinatower.analysis.api.entity.DeviceStatisticsVO;
import com.chinatower.analysis.api.entity.IotDeviceStatisticsVo;
import com.chinatower.common.core.dto.bdm.LayerResponseDTO;
import com.chinatower.common.core.web.domain.AjaxResult;
import com.chinatower.common.core.web.domain.ApiResult;
import com.chinatower.common.entity.Result;
import com.chinatower.common.page.TableDataInfo;
import com.chinatower.device.entity.vo.IotDeviceVO;
import com.chinatower.device.entity.vo.IotTTDeviceVO;
import com.chinatower.file.request.FileObsEncryptRequest;
import com.chinatower.file.response.FileObsEncryptResponse;
import com.chinatower.forestry.emengercy.api.entity.*;
import com.chinatower.gis.api.entity.layer.LayerParcelQueryDTO;
import com.chinatower.platform.entity.admin.SysArea;
import com.chinatower.platform.entity.admin.SysUser;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.system.api.model.AuthObjDataVO;
import com.chinatower.system.api.request.file.ObsEncryptRequest;
import com.chinatower.system.api.resp.ObsEncryptResponse;
import com.github.pagehelper.PageInfo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface RpcService {

    /**
     * 获取 摄像机 统计数据
     *
     * @return
     */
    Result<DeviceStatisticsVO> getDeviceStatistics(AnalysisVO analysisVO);

    /**
     * 获取 气象站 统计数据
     *
     * @return
     */
    Result<IotDeviceStatisticsVo> getIotDeviceStatistics(AnalysisVO analysisVO);

    /**
     * 获取 诱捕器 统计数据
     *
     * @return
     */
    Result<TrapStatisticsDTO> statistics();

    /**
     * 查询诱捕器
     *
     */
    Result<PageInfo<TrapVO>> queryTrapList(TrapVO trapVO);

    /**
     * 查询诱捕器采集记录
     *
     */
    Result<PageInfo<TrapGatherVO>> queryTrapGatherList(TrapGatherVO trapGatherVO);
    /**
     * 获取 野保相机 统计数据
     *
     * @return
     */
    Result<DeviceStaticsVO> countWildProtectionCamera();

    /**
     * 获取古木名数分类统计信息
     *
     * @param vo
     * @return
     */
    Result statisticsLevel(AncientTreeVO vo);

    /**
     * 获取登录用户信息
     *
     * @return 用户信息
     */
    LoginUser getLoginUser();

    /**
     * 上传文件
     *
     * @return 文件地址url
     */
    AjaxResult uploadFile(MultipartFile file);

    /**
     * 获取区域
     *
     * @param sysArea
     * @return
     */
    Result<List<SysArea>> getRegion(SysArea sysArea);

    /**
     * 加密后的图片地址
     *
     * @param fileObsEncryptRequest
     * @return
     */
    public ApiResult<List<FileObsEncryptResponse>> getObsEncryptUrls(FileObsEncryptRequest fileObsEncryptRequest);


    /**
     * 获取 对应图层详细接口
     *
     * @param filter
     * @return
     */
    Result layerParcelQuery(LayerParcelQueryDTO filter);


    /**
     * 获取 图层列表
     *
     * @param abbreviation 图层名字
     * @param layerTypeId
     * @return
     */
    Result<List<LayerResponseDTO>> selectLayerList(String abbreviation, String layerTypeId);


    /**
     * 获取 设备信息
     *
     */
    TableDataInfo queryIotDeviceListPage(@RequestBody IotTTDeviceVO deviceInfoVO);


   TableDataInfo queryIotDevicePage(@RequestBody IotDeviceVO deviceInfoVO);

    Result<AuthObjDataVO> getDataScopeObjBySysUser(@RequestBody SysUser user);

}
