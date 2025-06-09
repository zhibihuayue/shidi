package com.chinatower.wetland.service.impl;

import com.chinatower.analysis.api.AnalysisAPI;
import com.chinatower.analysis.api.AnalysisExportAPI;
import com.chinatower.analysis.api.entity.AnalysisVO;
import com.chinatower.analysis.api.entity.DeviceStatisticsVO;
import com.chinatower.analysis.api.entity.IotDeviceStatisticsVo;
import com.chinatower.bdm.api.LayerApi;
import com.chinatower.common.core.dto.bdm.LayerResponseDTO;
import com.chinatower.common.core.web.domain.AjaxResult;
import com.chinatower.common.core.web.domain.ApiResult;
import com.chinatower.common.entity.Result;
import com.chinatower.common.page.TableDataInfo;
import com.chinatower.device.api.IHornDeviceService;
import com.chinatower.device.api.ITowerDeviceService;
import com.chinatower.device.entity.vo.IotDeviceVO;
import com.chinatower.device.entity.vo.IotTTDeviceVO;
import com.chinatower.file.feign.client.FileObsFeignClient;
import com.chinatower.file.request.FileObsEncryptRequest;
import com.chinatower.file.response.FileObsEncryptResponse;
import com.chinatower.forestry.emengercy.api.AncientTreeScreenAPI;
import com.chinatower.forestry.emengercy.api.TrapAPI;
import com.chinatower.forestry.emengercy.api.WildProtectionCameraAPI;
import com.chinatower.forestry.emengercy.api.entity.*;
import com.chinatower.gis.api.GisLayerAPI;
import com.chinatower.gis.api.entity.layer.LayerParcelQueryDTO;
import com.chinatower.platform.entity.admin.SysArea;
import com.chinatower.platform.entity.admin.SysUser;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.system.api.feign.client.RemoteUserSecurityService;
import com.chinatower.system.api.feign.client.SystemFeignClient;
import com.chinatower.system.api.model.AuthObjDataVO;
import com.chinatower.system.api.request.file.ObsEncryptRequest;
import com.chinatower.system.api.resp.ObsEncryptResponse;
import com.chinatower.wetland.feign.LocalAPIFeign;
import com.chinatower.wetland.feign.SystemClient;
import com.chinatower.wetland.service.RpcService;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
public class RpcServiceImpl implements RpcService {

    private final LocalAPIFeign localAPIFeign;

    private final AnalysisAPI analysisAPI;

    private final WildProtectionCameraAPI wildProtectionCameraAPI;

    private final AnalysisExportAPI analysisExportAPI;

    private final TrapAPI trapAPI;

    private final RemoteUserSecurityService userSecurityService;

    private final AncientTreeScreenAPI ancientTreeScreen;

    private final Boolean localTestToZuul;

    private final SystemFeignClient systemFeignClient;

    private final FileObsFeignClient obsEncryptFeignClient;

    private final GisLayerAPI gisLayerAPI;

    private final LayerApi layerApi;
    @Autowired
    private ITowerDeviceService iTowerDeviceService;

    @Autowired
    private IHornDeviceService iHornDeviceService;
    @Autowired
    private SystemClient systemClient;


    RpcServiceImpl(LocalAPIFeign localAPIFeign, AnalysisAPI analysisAPI, WildProtectionCameraAPI wildProtectionCameraAPI,
                   AnalysisExportAPI analysisExportAPI, TrapAPI trapAPI, RemoteUserSecurityService userSecurityService,
                   AncientTreeScreenAPI ancientTreeScreen, @Value("${localTestToZuul}") Boolean localTestToZuul,
                   SystemFeignClient systemFeignClient, FileObsFeignClient obsEncryptFeignClient, GisLayerAPI gisLayerAPI,
                   LayerApi layerApi) {
        this.localAPIFeign = localAPIFeign;
        this.analysisAPI = analysisAPI;
        this.wildProtectionCameraAPI = wildProtectionCameraAPI;
        this.analysisExportAPI = analysisExportAPI;
        this.trapAPI = trapAPI;
        this.userSecurityService = userSecurityService;
        this.ancientTreeScreen = ancientTreeScreen;
        this.localTestToZuul = localTestToZuul;
        this.systemFeignClient = systemFeignClient;
        this.obsEncryptFeignClient = obsEncryptFeignClient;
        this.gisLayerAPI = gisLayerAPI;
        this.layerApi = layerApi;
    }

    @Override
    public Result<DeviceStatisticsVO> getDeviceStatistics(AnalysisVO analysisVO) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.getDeviceStatistics(analysisVO);
        }
        return analysisAPI.getDeviceStatistics(analysisVO);
    }

    @Override
    public Result<IotDeviceStatisticsVo> getIotDeviceStatistics(AnalysisVO analysisVO) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.getIotDeviceStatistics(analysisVO);
        }
        return analysisExportAPI.getIotDeviceStatistics(analysisVO);
    }

    @Override
    public Result<TrapStatisticsDTO> statistics() {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.statistics();
        }
        return trapAPI.statistics();
    }

    @Override
    public Result<PageInfo<TrapVO>> queryTrapList(TrapVO trapVO) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.queryTrapList(trapVO);
        }
        return trapAPI.queryTrapList(trapVO);
    }

    @Override
    public Result<PageInfo<TrapGatherVO>> queryTrapGatherList(TrapGatherVO trapGatherVO) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.queryTrapGatherList(trapGatherVO);
        }
        return trapAPI.queryTrapGatherList(trapGatherVO);
    }

    @Override
    public Result<DeviceStaticsVO> countWildProtectionCamera() {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.countWildProtectionCamera();
        }
        return wildProtectionCameraAPI.countWildProtectionCamera();
    }

    @Override
    public Result statisticsLevel(AncientTreeVO vo) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.statisticsLevel(vo);
        }
        return ancientTreeScreen.statisticsLevel(vo);
    }

    @Override
    public LoginUser getLoginUser() {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.getLoginUser();
        }
        return userSecurityService.getLoginUser();
    }

    @Override
    public AjaxResult uploadFile(MultipartFile file) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.uploadFile(file);
        }
        return systemFeignClient.uploadFile(file);
    }

    @Override
    public Result<List<SysArea>> getRegion(SysArea sysArea) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            return localAPIFeign.getRegion(sysArea);
        }
        return systemFeignClient.getRegion(sysArea);
    }

    @Override
    public ApiResult<List<FileObsEncryptResponse>> getObsEncryptUrls(FileObsEncryptRequest fileObsEncryptRequest) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            log.info(fileObsEncryptRequest.toString());
            return localAPIFeign.getObsEncryptUrls(fileObsEncryptRequest);
        }
        return obsEncryptFeignClient.getObsEncryptUrls(fileObsEncryptRequest);
    }

    @Override
    public Result layerParcelQuery(LayerParcelQueryDTO filter) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            log.info(filter.toString());
            return localAPIFeign.layerParcelQuery(filter);
        }
        return gisLayerAPI.layerParcelQuery(filter);
    }

    @Override
    public Result<List<LayerResponseDTO>> selectLayerList(String abbreviation, String layerTypeId) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            log.info(abbreviation + "----" + layerTypeId);
            return localAPIFeign.selectLayerList(abbreviation, layerTypeId);
        }
        return layerApi.selectLayerList(abbreviation, layerTypeId);
    }

    @Override
    public TableDataInfo queryIotDeviceListPage(IotTTDeviceVO deviceInfoVO) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            log.info(deviceInfoVO.toString());
            return localAPIFeign.queryIotDeviceListPage(deviceInfoVO);
        }
        return iTowerDeviceService.queryIotDeviceListPage(deviceInfoVO);
    }

    @Override
    public TableDataInfo queryIotDevicePage(IotDeviceVO deviceInfoVO) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            log.info(deviceInfoVO.toString());
            return localAPIFeign.queryIotDevicePage(deviceInfoVO);
        }
        return iHornDeviceService.queryIotDevicePage(deviceInfoVO);
    }

    @Override
    public Result<AuthObjDataVO> getDataScopeObjBySysUser(SysUser user) {
        if (Boolean.TRUE.equals(localTestToZuul)) {
            log.info(user.toString());
            return localAPIFeign.getDataScopeObjBySysUser(user);
        }
        log.warn("feign对象：" + systemClient);
        return systemClient.getDataScopeObjBySysUser(user);
    }
}
