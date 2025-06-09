package com.chinatower.wetland.feign;


import com.chinatower.analysis.api.entity.AnalysisVO;
import com.chinatower.analysis.api.entity.DeviceStatisticsVO;
import com.chinatower.analysis.api.entity.IotDeviceStatisticsVo;
import com.chinatower.analysis.api.factory.AnalysisFallbackFactory;
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
import com.chinatower.wetland.config.FeignHeaderInterceptor;
import com.github.pagehelper.PageInfo;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@FeignClient(
        contextId = "AnalysisAPIFeign",
        value = "zuul",
        fallbackFactory = AnalysisFallbackFactory.class,
        configuration = FeignHeaderInterceptor.class
)
public interface LocalAPIFeign {


    @PostMapping({"/api/analysis/workbench/getDeviceStatistics"})
    Result<DeviceStatisticsVO> getDeviceStatistics(@RequestBody AnalysisVO analysisVO);

    @PostMapping({"/api/analysis/workbench/getIotDeviceStatistics"})
    Result<IotDeviceStatisticsVo> getIotDeviceStatistics(@RequestBody AnalysisVO analysisVO);

    @GetMapping({"/api/video-forestry-emengercy/trap/statistics"})
    Result<TrapStatisticsDTO> statistics();

    @PostMapping({"/trap/conditionQuery"})
    Result<PageInfo<TrapVO>> queryTrapList(@RequestBody TrapVO trapVO);

    @PostMapping({"/trapGather/conditionQuery"})
    Result<PageInfo<TrapGatherVO>> queryTrapGatherList(@RequestBody TrapGatherVO trapGatherVO);

    @GetMapping({"/api/video-forestry-emengercy/camera/count"})
    Result<DeviceStaticsVO> countWildProtectionCamera();

    @GetMapping({"/api/video-forestry-emengercy/ancientTreeScreen/statisticsLevel"})
    Result statisticsLevel(AncientTreeVO vo);

    @PostMapping({"/api/admin/system/security/getLoginUser"})
    LoginUser getLoginUser();

    @PostMapping(value = {"/api/admin/base/common/upload"}, consumes = {"multipart/form-data"})
    AjaxResult uploadFile(@RequestPart("file") MultipartFile file);

    @PostMapping(value = {"/api/admin/video/getRegion"}, consumes = {"application/json"})
    Result<List<SysArea>> getRegion(@RequestBody SysArea sysArea);

    @PostMapping(value = {"/api/admin/file/obsFiles/getObsEncryptUrls"},consumes = {"application/json"})
    ApiResult<List<FileObsEncryptResponse>> getObsEncryptUrls(@RequestBody FileObsEncryptRequest obsEncryptRequest);

    @PostMapping(value = {"/api/gis/getFeatures/layerParcelQuery"},consumes = {"application/json"})
    Result layerParcelQuery(@RequestBody LayerParcelQueryDTO filter);

    @GetMapping(value = {"/api/bdm/layer/selectLayerList"},consumes = {"application/json"})
    Result<List<LayerResponseDTO>> selectLayerList(@RequestParam(value = "abbreviation",required = false) String abbreviation, @RequestParam(value = "layerTypeId",required = false) String layerTypeId);

    @PostMapping({"/api/ttdevice/iotDeviceTT/ttview/device/queryIotDeviceListPage"})
    TableDataInfo queryIotDeviceListPage(@RequestBody IotTTDeviceVO deviceInfoVO);

    @PostMapping({"/api/device/iotdevice/queryIotDevicePage"})
    TableDataInfo queryIotDevicePage(IotDeviceVO deviceInfoVO);

    @PostMapping({"/api/admin/system/business/getDataScopeObjBySysUser"})
    Result<AuthObjDataVO> getDataScopeObjBySysUser(SysUser user);
}
