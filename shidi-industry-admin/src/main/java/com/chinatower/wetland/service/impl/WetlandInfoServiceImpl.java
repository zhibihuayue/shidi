package com.chinatower.wetland.service.impl;


import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.text.CharSequenceUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinatower.common.core.utils.StringUtils;
import com.chinatower.common.core.web.domain.AjaxResult;
import com.chinatower.common.entity.Result;
import com.chinatower.common.page.TableDataInfo;
import com.chinatower.device.entity.vo.IotTTDeviceVO;
import com.chinatower.file.request.FileObsEncryptRequest;
import com.chinatower.file.response.FileObsEncryptResponse;
import com.chinatower.platform.common.utils.DateUtils;
import com.chinatower.platform.data.sdk.entity.AbstactEntity;
import com.chinatower.platform.data.sdk.entity.BasicResponse;
import com.chinatower.platform.entity.admin.SysUser;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.system.api.model.AuthObjDataVO;
import com.chinatower.system.api.model.DeviceVO;
import com.chinatower.system.api.request.file.ObsEncryptRequest;
import com.chinatower.system.api.resp.ObsEncryptResponse;
import com.chinatower.wetland.exception.BaseBizException;
import com.chinatower.wetland.mappper.WeatherAnalyseMapper;
import com.chinatower.wetland.mappper.WetlandInfoMapper;
import com.chinatower.wetland.pojo.entity.WeatherAnalyse;
import com.chinatower.wetland.pojo.entity.WetlandInfo;
import com.chinatower.wetland.pojo.entity.WetlandInfoRegion;
import com.chinatower.wetland.pojo.entity.WetlandInfoVegetation;
import com.chinatower.wetland.pojo.enums.*;
import com.chinatower.wetland.pojo.param.WetlandInfoEditParam;
import com.chinatower.wetland.pojo.param.WetlandInfoInsertParam;
import com.chinatower.wetland.pojo.vo.*;
import com.chinatower.wetland.service.IWetlandInfoRegionService;
import com.chinatower.wetland.service.IWetlandInfoService;
import com.chinatower.wetland.service.IWetlandInfoVegetationService;
import com.chinatower.wetland.service.RpcService;
import com.chinatower.wetland.util.AreaUtil;
import com.chinatower.wetland.util.RemindDateUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * <p>湿地信息Service</p>
 *
 * @author luojun
 * @author 其它作者姓名
 * @version 1.00 2024/06/19 luojun
 * <p>
 * @see
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class WetlandInfoServiceImpl extends ServiceImpl<WetlandInfoMapper, WetlandInfo> implements IWetlandInfoService {

    private final IWetlandInfoRegionService regionService;

    private final IWetlandInfoVegetationService vegetationService;

    private final RpcService rpcService;
    @Autowired
    WithoutTokenAuthenticationAPI withoutTokenAuthenticationAPI;
    private static final String LIMIT_ONE = " limit 1";
    @Autowired
    private WeatherAnalyseMapper weatherAnalyseMapper;


    private final String TEMPERATURE = "temperature";

    private final String RAINFALL = "rainfall";
    private final String RESPONSEBODY = "responseBody";
    private final String CURSOR = "cursor";
    private final String FIRSTBATCH = "firstBatch";
    private final String ETEMPERATURE = "Etemperature";
    private final String RAINADD = "RainAdd";
    private final String WEATHERSTATION = "400800010001";

    /**
     * 插入数据
     *
     * @param param
     * @return
     */
    @Override
    public boolean insert(WetlandInfoInsertParam param) {
        LoginUser loginUser = rpcService.getLoginUser();
        List<WetlandInfo> wetlandInfoList = this.list(new LambdaQueryWrapper<WetlandInfo>()
                .eq(WetlandInfo::getTenantId, loginUser.getUser().getTenantId()));
        if (!wetlandInfoList.isEmpty()) {
            throw new BaseBizException("最多只能新增一条数据");
        }
        Date time = new Date();
        WetlandInfo wetlandInfo = new WetlandInfo();
        BeanUtils.copyProperties(param, wetlandInfo);
        //储存租户信息及行业信息
        wetlandInfo.setTenantId(loginUser.getUser().getTenantId());
        wetlandInfo.setIndustryCode(loginUser.getUser().getIndustryCode());
        wetlandInfo.setAppVerCode(loginUser.getUser().getAppVerCode());
        //储存地区信息
        wetlandInfo.setRegionName(JSONUtil.toJsonStr(param.getRegionNameList()));
        wetlandInfo.setRegionCode(JSONUtil.toJsonStr(param.getRegionCodeList()));
        //地图数据
        wetlandInfo.setMapData(JSONUtil.toJsonStr(param.getMapDataList()));
        //湿地类型
        wetlandInfo.setWetlandType(JSONUtil.toJsonStr(param.getWetlandTypeList()));
        //储存气候类型
        wetlandInfo.setClimateType(JSONUtil.toJsonStr(param.getClimateTypeList()));
        //储存图片
        wetlandInfo.setWetlandImage(JSONUtil.toJsonStr(param.getImageList()));
        //三个水期
        wetlandInfo.setHighWaterPeriod(JSONUtil.toJsonStr(param.getHighWaterPeriodList()));
        wetlandInfo.setLowWaterPeriod(JSONUtil.toJsonStr(param.getLowWaterPeriodList()));
        wetlandInfo.setNormalWaterPeriod(JSONUtil.toJsonStr(param.getNormalWaterPeriodList()));
        //获取登录人信息
        String username = loginUser.getUsername();
        wetlandInfo.setCreateBy(username);
        wetlandInfo.setCreateTime(time);
        this.save(wetlandInfo);
        //插入区域信息-先分开为3部分-水域、建筑物、人类活动、区域信息
        //判断区域名字重复
        this.checkRegionName(wetlandInfo.getId(), param.getRegionList(),
                param.getWaterRegionList(),
                param.getConstructionRegionList(),
                param.getHumanActivitiesRegionList());
        insertBatchRegion(param.getRegionList(), username, time, wetlandInfo);
        insertBatchRegion(param.getWaterRegionList(), username, time, wetlandInfo);
        insertBatchRegion(param.getConstructionRegionList(), username, time, wetlandInfo);
        insertBatchRegion(param.getHumanActivitiesRegionList(), username, time, wetlandInfo);
        //插入植被信息
        if (CollUtil.isNotEmpty(param.getWetlandInfoVegetationList())) {
            insertBatchVegetation(param.getWetlandInfoVegetationList(), username, time, wetlandInfo);
        }
        return Boolean.TRUE;
    }

    private void checkRegionName(String wetlandInfoId, List<WetlandInfoRegion> regionList, List<WetlandInfoRegion> waterRegionList, List<WetlandInfoRegion> constructionRegionList, List<WetlandInfoRegion> humanActivitiesRegionList) {
        List<WetlandInfoRegion> allRegions = Stream.of(regionList, waterRegionList, constructionRegionList, humanActivitiesRegionList).flatMap(Collection::stream).collect(Collectors.toList());
        //判断内部列表中 区域名称 是否重复
        if (CollUtil.isNotEmpty(allRegions)) {
            List<String> regionNameList = allRegions.stream().map(WetlandInfoRegion::getRegionName).distinct().collect(Collectors.toList());
            if (regionNameList.size() < allRegions.size()) {
                throw new BaseBizException("区域名称重复");
            }
        }

        //查询当前 数据库中的 数据
        List<WetlandInfoRegion> dbRegionList = regionService.list(new LambdaQueryWrapper<WetlandInfoRegion>().eq(WetlandInfoRegion::getWetlandInfoId, wetlandInfoId)
                .eq(WetlandInfoRegion::getDeleted, 0));

        //找到 id为空的 新增
        List<WetlandInfoRegion> newRegionList = allRegions.stream().filter(item -> StringUtils.isEmpty(item.getId())).collect(Collectors.toList());
        if (CollUtil.isNotEmpty(newRegionList)) {
            List<String> newRegionNameList = newRegionList.stream().map(WetlandInfoRegion::getRegionName).collect(Collectors.toList());
            List<WetlandInfoRegion> dbRegionListByName = dbRegionList.stream().filter(item -> newRegionNameList.contains(item.getRegionName())).collect(Collectors.toList());
            if (!dbRegionListByName.isEmpty()) {
                throw new BaseBizException("新增的区域名称重复");
            }
        }

        //找到 id不为空的 修改
        List<WetlandInfoRegion> updateRegionList = allRegions.stream().filter(item -> StringUtils.isNotEmpty(item.getId())).collect(Collectors.toList());
        if (CollUtil.isNotEmpty(updateRegionList)) {
            for (WetlandInfoRegion wetlandInfoRegion : updateRegionList) {
                List<WetlandInfoRegion> collect = dbRegionList.stream().filter(x -> !Objects.equals(x.getId(), wetlandInfoRegion.getId())
                        && Objects.equals(x.getRegionName(), wetlandInfoRegion.getRegionName())).collect(Collectors.toList());
                if (!collect.isEmpty()) {
                    throw new BaseBizException("修改的区域名称重复");
                }
            }
        }

    }

    /**
     * 批量新增区域信息
     *
     * @param wetlandInfoRegionList
     * @param username
     * @param time
     * @param wetlandInfo
     */
    private void insertBatchRegion(List<WetlandInfoRegion> wetlandInfoRegionList, String username, Date time, WetlandInfo wetlandInfo) {
        //校验区域名称是否重复
        check(wetlandInfoRegionList);
        wetlandInfoRegionList.forEach(item -> {
            item.setWetlandInfoId(wetlandInfo.getId());
            item.setTenantId(wetlandInfo.getTenantId());
            item.setIndustryCode(wetlandInfo.getIndustryCode());
            item.setAppVerCode(wetlandInfo.getAppVerCode());
            item.setCreateBy(username);
            item.setCreateTime(time);
            if (CollUtil.isNotEmpty(item.getMapDataList())) {
                item.setMapData(JSONUtil.toJsonStr(item.getMapDataList()));
            }
        });
        regionService.saveBatch(wetlandInfoRegionList);
    }

    /**
     * 校验区域名称是否重复
     *
     * @param wetlandInfoRegionList
     */
    private void check(List<WetlandInfoRegion> wetlandInfoRegionList) {
        List<String> regionNames = wetlandInfoRegionList.stream().map(WetlandInfoRegion::getRegionName).collect(Collectors.toList());
        if (regionNames.size() != regionNames.stream().distinct().count()) {
            throw new BaseBizException("区域名称不允许重复");
        }
    }

    /**
     * 批量新增植被信息
     *
     * @param vegetationList
     * @param username
     * @param time
     * @param wetlandInfo
     */
    private void insertBatchVegetation(List<WetlandInfoVegetation> vegetationList, String username, Date time, WetlandInfo wetlandInfo) {
        vegetationList.forEach(item -> {
            item.setWetlandInfoId(wetlandInfo.getId());
            item.setTenantId(wetlandInfo.getTenantId());
            item.setIndustryCode(wetlandInfo.getIndustryCode());
            item.setAppVerCode(wetlandInfo.getAppVerCode());
            item.setCreateBy(username);
            item.setCreateTime(time);
            if (CollUtil.isNotEmpty(item.getMapDataList())) {
                item.setMapData(JSONUtil.toJsonStr(item.getMapDataList()));
            }
        });
        vegetationService.saveBatch(vegetationList);
    }

    /**
     * 编辑数据
     *
     * @param param
     * @return
     */
    @Override
    public boolean edit(WetlandInfoEditParam param) {
        Date time = new Date();
        WetlandInfo wetlandInfo = this.getById(param.getId());
        if (wetlandInfo == null) {
            throw new BaseBizException("数据不存在");
        }
        BeanUtils.copyProperties(param, wetlandInfo);
        //储存图片
        wetlandInfo.setWetlandImage(JSONUtil.toJsonStr(param.getImageList()));
        //储存地区信息
        wetlandInfo.setRegionName(JSONUtil.toJsonStr(param.getRegionNameList()));
        wetlandInfo.setRegionCode(JSONUtil.toJsonStr(param.getRegionCodeList()));
        //地图信息
        wetlandInfo.setMapData(JSONUtil.toJsonStr(param.getMapDataList()));
        //湿地类型
        wetlandInfo.setWetlandType(JSONUtil.toJsonStr(param.getWetlandTypeList()));
        //储存气候类型
        wetlandInfo.setClimateType(JSONUtil.toJsonStr(param.getClimateTypeList()));
        //三个水期
        wetlandInfo.setHighWaterPeriod(JSONUtil.toJsonStr(param.getHighWaterPeriodList()));
        wetlandInfo.setLowWaterPeriod(JSONUtil.toJsonStr(param.getLowWaterPeriodList()));
        wetlandInfo.setNormalWaterPeriod(JSONUtil.toJsonStr(param.getNormalWaterPeriodList()));
        //三个水位

        //获取登录人信息
        String username = rpcService.getLoginUser().getUsername();
        wetlandInfo.setUpdateBy(username);
        wetlandInfo.setUpdateTime(time);
        this.updateById(wetlandInfo);
        //编辑区域信息
        //判断区域名字重复
        this.checkRegionName(wetlandInfo.getId(), param.getRegionList(),
                param.getWaterRegionList(),
                param.getConstructionRegionList(),
                param.getHumanActivitiesRegionList());
        regionEdit(param, wetlandInfo, username, time);
        //编辑植被信息
        vegetationEdit(param, wetlandInfo, username, time);
        return Boolean.TRUE;
    }

    /**
     * 编辑区域信息
     *
     * @param param
     * @param wetlandInfo
     * @param username
     * @param time
     */
    private void regionEdit(WetlandInfoEditParam param, WetlandInfo wetlandInfo, String username, Date time) {
        //删除
        if (ObjectUtil.isNotEmpty(param.getDeleteRegionIdList())) {
            regionService.remove(new LambdaQueryWrapper<WetlandInfoRegion>().eq(WetlandInfoRegion::getDeleted, 0)
                    .in(WetlandInfoRegion::getId, param.getDeleteRegionIdList()));
        }

        //将4部分 区域合并
        List<WetlandInfoRegion> wetlandInfoRegionList = new ArrayList<>();
        wetlandInfoRegionList.addAll(ObjectUtil.isNotEmpty(param.getRegionList()) ? param.getRegionList() : new ArrayList<>());
        wetlandInfoRegionList.addAll(ObjectUtil.isNotEmpty(param.getWaterRegionList()) ? param.getWaterRegionList() : new ArrayList<>());
        wetlandInfoRegionList.addAll(ObjectUtil.isNotEmpty(param.getConstructionRegionList()) ? param.getConstructionRegionList() : new ArrayList<>());
        wetlandInfoRegionList.addAll(ObjectUtil.isNotEmpty(param.getHumanActivitiesRegionList()) ? param.getHumanActivitiesRegionList() : new ArrayList<>());

        List<WetlandInfoRegion> editRegionList = wetlandInfoRegionList.stream().filter(item -> Objects.equals(0, item.getUpdateOrNew())).collect(Collectors.toList());
        //校验区域名称是否重复
        check(wetlandInfoRegionList);
        //List<WetlandInfoRegion> editRegionList = wetlandInfoRegionList.stream().filter(item -> item.getId() != null).collect(Collectors.toList());
        editRegionList.forEach(item -> {
            item.setUpdateBy(username);
            item.setUpdateTime(time);
            item.setMapData(JSONUtil.toJsonStr(item.getMapDataList()));
        });
        regionService.updateBatchById(editRegionList);
        //判断有没新增
        List<WetlandInfoRegion> addRegionList = wetlandInfoRegionList.stream().filter(item -> Objects.equals(1, item.getUpdateOrNew())).collect(Collectors.toList());
        if (CollUtil.isNotEmpty(addRegionList)) {
            insertBatchRegion(addRegionList, username, time, wetlandInfo);
        }
    }

    /**
     * 编辑植被信息
     *
     * @param param
     * @param wetlandInfo
     * @param username
     * @param time
     */
    private void vegetationEdit(WetlandInfoEditParam param, WetlandInfo wetlandInfo, String username, Date time) {
        if (CollUtil.isNotEmpty(param.getWetlandInfoVegetationList())) {
            List<WetlandInfoVegetation> editVegetationList = param.getWetlandInfoVegetationList().stream().filter(item -> item.getId() != null).collect(Collectors.toList());
            if (CollUtil.isNotEmpty(editVegetationList)) {
                editVegetationList.forEach(item -> {
                    item.setUpdateBy(username);
                    item.setUpdateTime(time);
                    item.setMapData(JSONUtil.toJsonStr(item.getMapDataList()));
                });
                vegetationService.updateBatchById(editVegetationList);
            }
            //判断有没新增
            List<WetlandInfoVegetation> addVegetationList = param.getWetlandInfoVegetationList().stream().filter(item -> item.getId() == null).collect(Collectors.toList());
            if (CollUtil.isNotEmpty(addVegetationList)) {
                insertBatchVegetation(addVegetationList, username, time, wetlandInfo);
            }
        }
    }

    /**
     * 列表
     *
     * @return
     */
    @Override
    public List<WetlandInfoDetailVO> index() {
        LoginUser loginUser = rpcService.getLoginUser();
        List<WetlandInfoDetailVO> list = new ArrayList<>();
        /*WetlandInfo wetlandInfo = this.getOne(new LambdaQueryWrapper<WetlandInfo>().eq(WetlandInfo::getTenantId, loginUser.getUser().getTenantId())
                        .eq(WetlandInfo::getIndustryCode,  loginUser.getUser().getIndustryCode()).last(LIMIT_ONE));
        if (wetlandInfo == null) {
            return list;
        }
        //添加数据及数据转换
        WetlandInfoDetailVO vo = addSomeData(wetlandInfo);
        list.add(vo);*/

        //改成支持返回多个 后面要换回来
        List<WetlandInfo> wetlandInfos = this.list(new LambdaQueryWrapper<WetlandInfo>().eq(WetlandInfo::getTenantId, loginUser.getUser().getTenantId())
                .eq(WetlandInfo::getIndustryCode, loginUser.getUser().getIndustryCode()).last(LIMIT_ONE));
        if (wetlandInfos == null) {
            return list;
        }
        //添加数据及数据转换
        for (WetlandInfo wetlandInfo : wetlandInfos) {
            WetlandInfoDetailVO vo = addSomeData(wetlandInfo);
            list.add(vo);
        }

        return list;
    }

    /**
     * 通过id获取详情
     *
     * @param id
     * @return
     */
    @Override
    public WetlandInfoDetailVO detailById(String id, String wetlandResourceType) {
        WetlandInfo wetlandInfo = this.getById(id);
        if (wetlandInfo == null) {
            throw new BaseBizException("数据不存在");
        }
        WetlandInfoDetailVO vo = new WetlandInfoDetailVO();
        if (StringUtils.isNotEmpty(wetlandResourceType)) {
            vo = addRegion(wetlandInfo, wetlandResourceType);
        } else {
            vo = addSomeData(wetlandInfo);
        }
        return vo;
    }

    private WetlandInfoDetailVO addRegion(WetlandInfo wetlandInfo, String wetlandResourceType) {

        WetlandInfoDetailVO vo = new WetlandInfoDetailVO();
        BeanUtils.copyProperties(wetlandInfo, vo);

        //赋值区域信息,默认的排前面
        if (Objects.equals(wetlandResourceType, WetlandResourceTypeEnum.VEGETATION.getType())) {
            //赋值植被信息
            vo.setWetlandInfoVegetationList(vegetationList(wetlandInfo.getId()));
        } else {
            List<WetlandInfoRegion> regionList = regionList(wetlandInfo.getId(), wetlandResourceType);
            vo.setRegionList(regionList.stream().filter(x -> Objects.equals(x.getRegionType(), RegionTypeEnum.REGION_TYPE_3.getCode())).collect(Collectors.toList()));
            vo.setWaterRegionList(regionList.stream().filter(x -> Objects.equals(x.getRegionType(), RegionTypeEnum.REGION_TYPE_0.getCode())).collect(Collectors.toList()));
            vo.setConstructionRegionList(regionList.stream().filter(x -> Objects.equals(x.getRegionType(), RegionTypeEnum.REGION_TYPE_1.getCode())).collect(Collectors.toList()));
            vo.setHumanActivitiesRegionList(regionList.stream().filter(x -> Objects.equals(x.getRegionType(), RegionTypeEnum.REGION_TYPE_2.getCode())).collect(Collectors.toList()));
        }

        return vo;
    }

    /**
     * 湿地信息添加数据及数据转换
     *
     * @param wetlandInfo
     * @return
     */
    private WetlandInfoDetailVO addSomeData(WetlandInfo wetlandInfo) {
        WetlandInfoDetailVO vo = new WetlandInfoDetailVO();
        BeanUtils.copyProperties(wetlandInfo, vo);
        //气候类型
        List<Integer> climateTypeList = JSONUtil.toList(wetlandInfo.getClimateType(), Integer.class);
        vo.setClimateTypeList(climateTypeList);
        List<String> climateTypeStringList = new ArrayList<>();
        climateTypeList.forEach(item -> climateTypeStringList.add(ClimateTypeEnum.getByCode(item).getDesc()));
        vo.setClimateTypeString(climateTypeStringList.stream().collect(Collectors.joining(",")));
        //湿地类型
        List<Integer> wetlandTypeList = JSONUtil.toList(wetlandInfo.getWetlandType(), Integer.class);
        vo.setWetlandTypeList(wetlandTypeList);
        List<String> wetlandTypeStringList = new ArrayList<>();
        wetlandTypeList.forEach(item -> wetlandTypeStringList.add(WetlandTypeEnum.getByCode(item).getDesc()));
        vo.setWetlandTypeString(wetlandTypeStringList.stream().collect(Collectors.joining(",")));
        //图片加密返回
        FileObsEncryptRequest obsEncryptRequest = new FileObsEncryptRequest();
        obsEncryptRequest.setFileUrls(JSONUtil.toList(wetlandInfo.getWetlandImage(), String.class));
        List<FileObsEncryptResponse> data = rpcService.getObsEncryptUrls(obsEncryptRequest).getData();
        vo.setImageList(data.stream().map(FileObsEncryptResponse::getEncryptUrl).collect(Collectors.toList()));
        //数据转换
        vo.setHighWaterPeriodList(JSONUtil.toList(wetlandInfo.getHighWaterPeriod(), String.class));
        vo.setLowWaterPeriodList(JSONUtil.toList(wetlandInfo.getLowWaterPeriod(), String.class));
        vo.setNormalWaterPeriodList(JSONUtil.toList(wetlandInfo.getNormalWaterPeriod(), String.class));
        vo.setRegionCodeList(JSONUtil.toList(wetlandInfo.getRegionCode(), String.class));
        vo.setRegionNameList(JSONUtil.toList(wetlandInfo.getRegionName(), String.class));
        vo.setMapDataList(JSONUtil.toList(wetlandInfo.getMapData(), MapInfo.class));
        vo.setProtectionLevelString(ProtectionLevelEnum.getByCode(wetlandInfo.getProtectionLevel()).getDesc());
        //赋值区域信息,默认的排前面
        List<WetlandInfoRegion> regionList = regionList(wetlandInfo.getId(), null);
        vo.setRegionList(regionList.stream().filter(x -> Objects.equals(x.getRegionType(), RegionTypeEnum.REGION_TYPE_3.getCode())).collect(Collectors.toList()));
        vo.setWaterRegionList(regionList.stream().filter(x -> Objects.equals(x.getRegionType(), RegionTypeEnum.REGION_TYPE_0.getCode())).collect(Collectors.toList()));
        vo.setConstructionRegionList(regionList.stream().filter(x -> Objects.equals(x.getRegionType(), RegionTypeEnum.REGION_TYPE_1.getCode())).collect(Collectors.toList()));
        vo.setHumanActivitiesRegionList(regionList.stream().filter(x -> Objects.equals(x.getRegionType(), RegionTypeEnum.REGION_TYPE_2.getCode())).collect(Collectors.toList()));
        //赋值植被信息
        vo.setWetlandInfoVegetationList(vegetationList(wetlandInfo.getId()));
        //赋值所有的地图信息
        vo.setMapList(mapList(vo));
        return vo;
    }

    /**
     * 区域信息赋值
     *
     * @param id
     * @return
     */
    private List<WetlandInfoRegion> regionList(String id, String wetlandResourceType) {
        LambdaQueryWrapper<WetlandInfoRegion> wrapper = new LambdaQueryWrapper<WetlandInfoRegion>()
                .eq(WetlandInfoRegion::getWetlandInfoId, id).orderByAsc(WetlandInfoRegion::getSort);
        if (StringUtils.isNotEmpty(wetlandResourceType)) {
            wrapper.eq(WetlandInfoRegion::getRegionType, RegionTypeEnum.getByType(wetlandResourceType).getCode());
        }
        List<WetlandInfoRegion> list = regionService.list(wrapper);
        list.forEach(item -> {
            if (CharSequenceUtil.isNotBlank(item.getMapData())) {
                item.setMapDataList(JSONUtil.toList(item.getMapData(), MapInfo.class));
            }
        });
        return list;
    }

    /**
     * 植被信息赋值
     *
     * @param id
     * @return
     */
    private List<WetlandInfoVegetation> vegetationList(String id) {
        List<WetlandInfoVegetation> wetlandInfoVegetationList = vegetationService.list(new LambdaQueryWrapper<WetlandInfoVegetation>()
                .eq(WetlandInfoVegetation::getDeleted, 0).eq(WetlandInfoVegetation::getWetlandInfoId, id).orderByAsc(WetlandInfoVegetation::getSort));
        if (CollUtil.isNotEmpty(wetlandInfoVegetationList)) {
            wetlandInfoVegetationList.forEach(item -> {
                if (CharSequenceUtil.isNotBlank(item.getMapData())) {
                    item.setMapDataList(JSONUtil.toList(item.getMapData(), MapInfo.class));
                }
            });
            return wetlandInfoVegetationList;
        }
        return new ArrayList<>();
    }

    private List<MapInfo> mapList(WetlandInfoDetailVO vo) {
        List<MapInfo> list = new ArrayList<>(vo.getMapDataList());
        if (CollUtil.isNotEmpty(vo.getWaterRegionList())) {
            vo.getWaterRegionList().forEach(item -> {
                if (CollUtil.isNotEmpty(item.getMapDataList())) {
                    list.addAll(item.getMapDataList());
                }
            });
        }
        if (CollUtil.isNotEmpty(vo.getConstructionRegionList())) {
            vo.getConstructionRegionList().forEach(item -> {
                if (CollUtil.isNotEmpty(item.getMapDataList())) {
                    list.addAll(item.getMapDataList());
                }
            });
        }
        if (CollUtil.isNotEmpty(vo.getHumanActivitiesRegionList())) {
            vo.getHumanActivitiesRegionList().forEach(item -> {
                if (CollUtil.isNotEmpty(item.getMapDataList())) {
                    list.addAll(item.getMapDataList());
                }
            });
        }
        if (CollUtil.isNotEmpty(vo.getRegionList())) {
            vo.getRegionList().forEach(item -> {
                if (CollUtil.isNotEmpty(item.getMapDataList())) {
                    list.addAll(item.getMapDataList());
                }
            });
        }
        if (CollUtil.isNotEmpty(vo.getWetlandInfoVegetationList())) {
            vo.getWetlandInfoVegetationList().forEach(item -> {
                if (CollUtil.isNotEmpty(item.getMapDataList())) {
                    list.addAll(item.getMapDataList());
                }
            });
        }
        return list;
    }

    /**
     * 上传图片
     * `
     *
     * @param file 文件
     * @return 文件url
     */
    @Override
    public String uploadPicture(MultipartFile file) {
        AjaxResult ajaxResult = rpcService.uploadFile(file);
        if (ajaxResult == null) {
            log.error("feign调用失败返回内容为null");
            throw new BaseBizException("上传失败！");
        }
        if (!ajaxResult.ok()) {
            log.error("调用feign失败：{}", ajaxResult.get(AjaxResult.MSG_TAG));
            throw new BaseBizException("上传失败！");
        }
        return new JSONObject(ajaxResult.parseData(String.class)).getStr("fileUrl");
    }

    /**
     * 导出湿地基础信息
     *
     * @param response
     */
    @Override
    public void export(HttpServletResponse response) {
        List<WetlandInfoDetailVO> list = index();
        if (CollUtil.isEmpty(list)) {
            return;
        }
        List<ImportVO> importVOList;
        try {
            importVOList = toImportList(list.get(0));
            ClassPathResource resource = new ClassPathResource("excel/湿地基础信息导出文件.xlsx");
            InputStream inputStream = resource.getInputStream();
            // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
            response.setContentType("application/vnd.ms-excel");
            response.setCharacterEncoding("utf-8");
            // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
            String fileName = URLEncoder.encode("湿地基础信息导出文件", "utf-8");
            response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
            EasyExcelFactory.write(response.getOutputStream()).withTemplate(inputStream).sheet().doFill(importVOList);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 导出数据
     *
     * @param vo
     * @return
     * @throws MalformedURLException
     */
    private List<ImportVO> toImportList(WetlandInfoDetailVO vo) {
        List<ImportVO> vos = new ArrayList<>();

        //将4部分 区域合并
//        List<WetlandInfoRegion> wetlandInfoRegionList = new ArrayList<>();
//        wetlandInfoRegionList.addAll(ObjectUtil.isNotEmpty(vo.getRegionList()) ? vo.getRegionList() : new ArrayList<>());
//        wetlandInfoRegionList.addAll(ObjectUtil.isNotEmpty(vo.getWaterRegionList()) ? vo.getWaterRegionList() : new ArrayList<>());
//        wetlandInfoRegionList.addAll(ObjectUtil.isNotEmpty(vo.getConstructionRegionList()) ? vo.getConstructionRegionList() : new ArrayList<>());
//        wetlandInfoRegionList.addAll(ObjectUtil.isNotEmpty(vo.getHumanActivitiesRegionList()) ? vo.getHumanActivitiesRegionList() : new ArrayList<>());
//        int n = Stream.of(
//                Optional.ofNullable(vo.getImageList()).orElse(Collections.emptyList()).size(),
//                Optional.of(wetlandInfoRegionList).orElse(Collections.emptyList()).size(),
//                Optional.ofNullable(vo.getWetlandInfoVegetationList()).orElse(Collections.emptyList()).size()
//        ).max(Integer::compare).orElse(0);

        int n = Stream.of(
                Optional.ofNullable(vo.getImageList()).orElse(Collections.emptyList()).size(),
                Optional.of(vo.getRegionList()).orElse(Collections.emptyList()).size(),
                Optional.of(vo.getWaterRegionList()).orElse(Collections.emptyList()).size(),
                Optional.of(vo.getConstructionRegionList()).orElse(Collections.emptyList()).size(),
                Optional.of(vo.getHumanActivitiesRegionList()).orElse(Collections.emptyList()).size(),
                Optional.ofNullable(vo.getWetlandInfoVegetationList()).orElse(Collections.emptyList()).size()
        ).max(Integer::compare).orElse(0);

        ImportVO importVO = new ImportVO();
        BeanUtils.copyProperties(vo, importVO);
        importVO.setSort(1);
        importVO.setRegionName(vo.getRegionNameList().stream().collect(Collectors.joining(",")));
        importVO.setWetlandAreaString(vo.getWetlandArea() + vo.getAreaUnit());
        DateFormat dateFormat = new SimpleDateFormat("yyyy年");
        importVO.setEstablishmentTime(dateFormat.format(vo.getEstablishmentTime()));
        importVO.setImage(vo.getImageList().get(0));
//        if(ObjectUtil.isNotEmpty(wetlandInfoRegionList)){
//            importVO.setRegion(wetlandInfoRegionList.get(0).getRegionName());
//            importVO.setRegionArea(wetlandInfoRegionList.get(0).getRegionArea() + wetlandInfoRegionList.get(0).getAreaUnit());
//        }

        if (ObjectUtil.isNotEmpty(vo.getRegionList())) {
            importVO.setRegion(vo.getRegionList().get(0).getRegionName());
            importVO.setRegionArea(vo.getRegionList().get(0).getRegionArea() + vo.getRegionList().get(0).getAreaUnit());
        }


        if (ObjectUtil.isNotEmpty(vo.getWaterRegionList())) {
            importVO.setWaterRegion(vo.getWaterRegionList().get(0).getRegionName());
            importVO.setWaterRegionArea(vo.getWaterRegionList().get(0).getRegionArea() + vo.getWaterRegionList().get(0).getAreaUnit());
        }
        if (ObjectUtil.isNotEmpty(vo.getConstructionRegionList())) {
            importVO.setConstructionRegion(vo.getConstructionRegionList().get(0).getRegionName());
            importVO.setConstructionRegionArea(vo.getConstructionRegionList().get(0).getRegionArea() + vo.getConstructionRegionList().get(0).getAreaUnit());
        }
        if (ObjectUtil.isNotEmpty(vo.getHumanActivitiesRegionList())) {
            importVO.setHumanActivitiesRegion(vo.getHumanActivitiesRegionList().get(0).getRegionName());
            importVO.setHumanActivitiesRegionArea(vo.getHumanActivitiesRegionList().get(0).getRegionArea() + vo.getHumanActivitiesRegionList().get(0).getAreaUnit());
        }

        if (!vo.getWetlandInfoVegetationList().isEmpty()) {
            importVO.setVegetation(vo.getWetlandInfoVegetationList().get(0).getVegetationType());
            importVO.setVegetationArea(vo.getWetlandInfoVegetationList().get(0).getVegetationArea() + vo.getWetlandInfoVegetationList().get(0).getAreaUnit());
        }
        importVO.setHighWaterPeriod(vo.getHighWaterPeriodList().stream().collect(Collectors.joining(",")));
        importVO.setAverageWaterLevel(vo.getAverageWaterLevel() + "米");
        importVO.setLowWaterPeriod(vo.getLowWaterPeriodList().stream().collect(Collectors.joining(",")));
        importVO.setAverageLowWaterLevel(vo.getAverageLowWaterLevel() + "米");
        importVO.setNormalWaterPeriod(vo.getNormalWaterPeriodList().stream().collect(Collectors.joining(",")));
        importVO.setAverageNormalWaterLevel(vo.getAverageNormalWaterLevel() + "米");
        vos.add(importVO);
        //对第二排以上的数据组装
        if (n > 1) {
            for (int i = 1; i < n; i++) {
                ImportVO importVO1 = new ImportVO();
                if (i < vo.getImageList().size()) {
                    importVO1.setImage(vo.getImageList().get(i));
                }
//                if (i < wetlandInfoRegionList.size()) {
//                    importVO1.setRegion(wetlandInfoRegionList.get(i).getRegionName());
//                    importVO1.setRegionArea(wetlandInfoRegionList.get(i).getRegionArea() + wetlandInfoRegionList.get(i).getAreaUnit());
//                }
                if (i < vo.getRegionList().size()) {
                    importVO1.setRegion(vo.getRegionList().get(i).getRegionName());
                    importVO1.setRegionArea(vo.getRegionList().get(i).getRegionArea() + vo.getRegionList().get(i).getAreaUnit());
                }
                if (i < vo.getWaterRegionList().size()) {
                    importVO1.setWaterRegion(vo.getWaterRegionList().get(i).getRegionName());
                    importVO1.setWaterRegionArea(vo.getWaterRegionList().get(i).getRegionArea() + vo.getWaterRegionList().get(i).getAreaUnit());
                }
                if (i < vo.getConstructionRegionList().size()) {
                    importVO1.setConstructionRegion(vo.getConstructionRegionList().get(i).getRegionName());
                    importVO1.setConstructionRegionArea(vo.getConstructionRegionList().get(i).getRegionArea() + vo.getConstructionRegionList().get(i).getAreaUnit());
                }
                if (i < vo.getHumanActivitiesRegionList().size()) {
                    importVO1.setHumanActivitiesRegion(vo.getHumanActivitiesRegionList().get(i).getRegionName());
                    importVO1.setHumanActivitiesRegionArea(vo.getHumanActivitiesRegionList().get(i).getRegionArea() + vo.getHumanActivitiesRegionList().get(i).getAreaUnit());
                }
                if (i < vo.getWetlandInfoVegetationList().size()) {
                    importVO1.setVegetation(vo.getWetlandInfoVegetationList().get(i).getVegetationType());
                    importVO1.setVegetationArea(vo.getWetlandInfoVegetationList().get(i).getVegetationArea() + vo.getWetlandInfoVegetationList().get(i).getAreaUnit());
                }
                vos.add(importVO1);
            }
        }
        return vos;
    }

    /**
     * 查询首页湿地基础信息
     *
     * @return 首页湿地基础信息
     */
    @Override
    public WetlandHomeBasicsInfoVO queryHomeBasicsInfo() {
        LoginUser loginUser = rpcService.getLoginUser();
        WetlandHomeBasicsInfoVO result = new WetlandHomeBasicsInfoVO();
        WetlandInfo wetlandInfo = this.getOne(new LambdaQueryWrapper<WetlandInfo>().eq(WetlandInfo::getTenantId, loginUser.getUser().getTenantId())
                .eq(WetlandInfo::getIndustryCode, loginUser.getUser().getIndustryCode()).last(LIMIT_ONE));
        if (wetlandInfo == null) {
            return result;
        }
        BeanUtils.copyProperties(wetlandInfo, result, "protectionLevel");
        result.setWetlandArea(String.valueOf(wetlandInfo.getWetlandArea()));
        result.setProtectionLevel(ProtectionLevelEnum.getByCode(wetlandInfo.getProtectionLevel()).getDesc());
        result.setRegionName(JSONUtil.parseArray(wetlandInfo.getRegionName()).toList(String.class).stream().collect(Collectors.joining("/")));
        //图片加密返回
        FileObsEncryptRequest obsEncryptRequest = new FileObsEncryptRequest();
        obsEncryptRequest.setFileUrls(JSONUtil.toList(wetlandInfo.getWetlandImage(), String.class));
        List<FileObsEncryptResponse> data = rpcService.getObsEncryptUrls(obsEncryptRequest).getData();
        result.setImageList(data.stream().map(FileObsEncryptResponse::getEncryptUrl).collect(Collectors.toList()));
        return result;
    }

    /**
     * 查询首页湿地资源统计
     *
     * @return 首页湿地资源统计
     */
    @Override
    public List<WetlandHomeResourceStatVO> queryHomeResourceStat() {
        LoginUser loginUser = rpcService.getLoginUser();
        WetlandInfo wetlandInfo = this.getOne(new LambdaQueryWrapper<WetlandInfo>().eq(WetlandInfo::getTenantId, loginUser.getUser().getTenantId())
                .eq(WetlandInfo::getIndustryCode, loginUser.getUser().getIndustryCode()).last(LIMIT_ONE));
        if (wetlandInfo == null) {
            return this.defaultResourceStat();
        }

        //区域信息
        List<WetlandHomeResourceStatVO> result = this.getRegionResourceStat(wetlandInfo);

        //植被信息
        result.add(this.getVegetationResourceStat(wetlandInfo));
        return result;
    }

    @Override
    public Boolean deleteById(String id) {
        //删除区域信息
        regionService.remove(new LambdaQueryWrapper<WetlandInfoRegion>().eq(WetlandInfoRegion::getDeleted, 0)
                .eq(WetlandInfoRegion::getWetlandInfoId, id));
        //删除植被信息
        vegetationService.remove(new LambdaQueryWrapper<WetlandInfoVegetation>().eq(WetlandInfoVegetation::getDeleted, 0)
                .eq(WetlandInfoVegetation::getWetlandInfoId, id));

        //软删除 区域下的 天气
        LoginUser loginUser = this.rpcService.getLoginUser();
        this.weatherAnalyseMapper.removeByLoginData(loginUser.getUser().getTenantId(),
                loginUser.getUser().getIndustryCode(), loginUser.getUser().getAppVerCode());

        return this.removeById(id);
    }

    /**
     * 获取区域资源统计
     *
     * @param wetlandInfo 湿地信息
     * @return 区域资源统计
     */
    private List<WetlandHomeResourceStatVO> getRegionResourceStat(WetlandInfo wetlandInfo) {
        List<WetlandInfoRegion> regionList = regionService.list(new LambdaQueryWrapper<WetlandInfoRegion>().eq(WetlandInfoRegion::getDeleted, 0)
                .eq(WetlandInfoRegion::getWetlandInfoId, wetlandInfo.getId()));

        if (ObjectUtil.isEmpty(regionList)) {
            List<WetlandHomeResourceStatVO> result = new ArrayList<>();
            result.add(this.defaultOneResourceStat(WetlandResourceTypeEnum.WATER));
            result.add(this.defaultOneResourceStat(WetlandResourceTypeEnum.CONSTRUCTION));
            result.add(this.defaultOneResourceStat(WetlandResourceTypeEnum.HUMAN_ACTIVITIES));
            result.add(this.defaultOneResourceStat(WetlandResourceTypeEnum.REGION));
            return result;
        }
        List<WetlandHomeResourceStatVO> result = new ArrayList<>();
        Map<Integer, List<WetlandInfoRegion>> collect = regionList.stream().collect(Collectors.groupingBy(WetlandInfoRegion::getRegionType));

        //三个固定的不能少
        this.nullCheckDefault(regionList, RegionTypeEnum.REGION_TYPE_0, result);
        this.nullCheckDefault(regionList, RegionTypeEnum.REGION_TYPE_1, result);
        this.nullCheckDefault(regionList, RegionTypeEnum.REGION_TYPE_2, result);
        this.nullCheckDefault(regionList, RegionTypeEnum.REGION_TYPE_3, result);
        collect.forEach((k, v) -> result.add(this.handleOneRegionResourceStat(k, v)));

        return result;
    }


    /**
     * 处理一类区域资源统计
     *
     * @param regionType 区域类型
     * @param regionList 改区域所有资源
     * @return 区域资源统计
     */
    private WetlandHomeResourceStatVO handleOneRegionResourceStat(Integer regionType, List<WetlandInfoRegion> regionList) {
        RegionTypeEnum regionTypeEnum = RegionTypeEnum.getByCode(regionType);
        WetlandResourceTypeEnum wetlandResourceTypeEnum = WetlandResourceTypeEnum.getByName(regionTypeEnum.getDesc());
        WetlandHomeResourceStatVO result = this.defaultOneResourceStat(wetlandResourceTypeEnum);
        result.setWetlandId(regionList.get(0).getWetlandInfoId());
        /*if (wetlandResourceTypeEnum == WetlandResourceTypeEnum.OTHER) {
            result.setResourceName(WetlandResourceTypeEnum.OTHER.getName());
        }*/
        //是否有多个类型，多个用默认的亩单位，
        Map<String, List<WetlandInfoRegion>> collect = regionList.stream().collect(Collectors.groupingBy(WetlandInfoRegion::getAreaUnit));
        if (collect.size() == 1) {
            //获取一共有多少
            BigDecimal area = new BigDecimal("0");
            for (WetlandInfoRegion region : regionList) {
                area = area.add(region.getRegionArea());
            }
            result.setResourceArea(AreaUtil.showDataNum(area));
            result.setResourceUnit(regionList.get(0).getAreaUnit());
            return result;
        }

        //获取一共有多少亩
        BigDecimal area = new BigDecimal("0");
        for (WetlandInfoRegion region : regionList) {
            area = area.add(AreaUtil.convertToMu(region.getRegionArea(), region.getAreaUnit()));
        }
        //把面积转化为合适展示的单位 ：整数加小数最大展示4位数，整位超过4位数转换成万单位
        result.setResourceArea(AreaUtil.showDataNum(area));
        result.setResourceUnit("亩");

        return result;
    }

    /**
     * 获取植被资源统计
     *
     * @param wetlandInfo 湿地信息
     * @return 植被资源统计
     */
    private WetlandHomeResourceStatVO getVegetationResourceStat(WetlandInfo wetlandInfo) {
        List<WetlandInfoVegetation> vegetationList = vegetationService.list(new LambdaQueryWrapper<WetlandInfoVegetation>().eq(WetlandInfoVegetation::getDeleted, 0)
                .eq(WetlandInfoVegetation::getWetlandInfoId, wetlandInfo.getId()));
        WetlandHomeResourceStatVO result = this.defaultOneResourceStat(WetlandResourceTypeEnum.VEGETATION);
        result.setWetlandId(wetlandInfo.getId());
        if (ObjectUtil.isEmpty(vegetationList)) {
            return result;
        }
        //是否有多个类型，多个用默认的亩单位，
        Map<String, List<WetlandInfoVegetation>> collect = vegetationList.stream().collect(Collectors.groupingBy(WetlandInfoVegetation::getAreaUnit));
        if (collect.size() == 1) {
            //获取一共有多少
            BigDecimal area = new BigDecimal("0");
            for (WetlandInfoVegetation wetlandInfoVegetation : vegetationList) {
                area = area.add(wetlandInfoVegetation.getVegetationArea());
            }
            result.setResourceArea(AreaUtil.showDataNum(area));
            result.setResourceUnit(vegetationList.get(0).getAreaUnit());
            return result;
        }

        //获取一共有多少亩
        BigDecimal area = new BigDecimal("0");
        for (WetlandInfoVegetation wetlandInfoVegetation : vegetationList) {
            area = area.add(AreaUtil.convertToMu(wetlandInfoVegetation.getVegetationArea(), wetlandInfoVegetation.getAreaUnit()));
        }
        //把面积转化为合适展示的单位 ：整数加小数最大展示4位数，整位超过4位数转换成万单位
        result.setResourceArea(AreaUtil.showDataNum(area));
        result.setResourceUnit("亩");
        return result;
    }

    /**
     * 获取默认的资源类型统计
     *
     * @return 默认的几个资源类型统计
     */
    private List<WetlandHomeResourceStatVO> defaultResourceStat() {
        List<WetlandHomeResourceStatVO> result = new ArrayList<>();
        result.add(this.defaultOneResourceStat(WetlandResourceTypeEnum.VEGETATION));
        result.add(this.defaultOneResourceStat(WetlandResourceTypeEnum.WATER));
        result.add(this.defaultOneResourceStat(WetlandResourceTypeEnum.CONSTRUCTION));
        result.add(this.defaultOneResourceStat(WetlandResourceTypeEnum.HUMAN_ACTIVITIES));
        return result;
    }

    /**
     * 根据枚举创建一个的资源类型统计
     *
     * @param resourceTypeEnum 资源类型enum
     * @return 返回默认的资源类型
     */
    private WetlandHomeResourceStatVO defaultOneResourceStat(WetlandResourceTypeEnum resourceTypeEnum) {
        WetlandHomeResourceStatVO result = new WetlandHomeResourceStatVO();
        if (resourceTypeEnum != WetlandResourceTypeEnum.OTHER) {
            result.setResourceName(resourceTypeEnum.getName());
            result.setResourceType(resourceTypeEnum.getType());
        }
        result.setResourceArea("0");
        result.setResourceUnit("亩");
        return result;
    }

    /**
     * 检查某个固定值是否为null，为null就添加一个默认的值
     *
     * @param regionList     所有区域资源
     * @param regionTypeEnum 区域类型
     * @param result         加入的值
     */
    private void nullCheckDefault(List<WetlandInfoRegion> regionList, RegionTypeEnum regionTypeEnum, List<WetlandHomeResourceStatVO> result) {
        Map<Integer, List<WetlandInfoRegion>> collect = regionList.stream().collect(Collectors.groupingBy(WetlandInfoRegion::getRegionType));


        List<Integer> waterList = collect.keySet().stream().filter(x -> ObjectUtil.equal(x, regionTypeEnum.getCode())).collect(Collectors.toList());
        if (waterList.isEmpty()) {
            WetlandResourceTypeEnum wetlandResourceTypeEnum = WetlandResourceTypeEnum.getByName(regionTypeEnum.getDesc());
            result.add(this.defaultOneResourceStat(wetlandResourceTypeEnum));
        }
    }

    //查询天气信息
    @Override
    public void queryWeather() {
        //查询 所有 湿地信息
        List<WetlandInfo> wetlandInfoList = this.baseMapper.listForOur();
        //List<WetlandInfo> wetlandInfoList = this.baseMapper.selectList(new LambdaQueryWrapper<WetlandInfo>().eq(WetlandInfo::getDeleted, 0));
        for (WetlandInfo wetlandInfo : wetlandInfoList) {
            IotTTDeviceVO iotTTDeviceVO = new IotTTDeviceVO();
            iotTTDeviceVO.setOrderStatus("1");
            iotTTDeviceVO.setDeviceType("2022");
            iotTTDeviceVO.setPageNum(1);
            iotTTDeviceVO.setPageSize(10);
            iotTTDeviceVO.setTenantId(wetlandInfo.getTenantId());
            //iotTTDeviceVO.setTenantId("121062999");

//            TableDataInfo vo = this.rpcService.queryIotDeviceListPage(iotTTDeviceVO);
//            TableDataInfo vo = this.rpcService.queryIotDevicePage(iotTTDeviceVO);
            log.warn("查询设备租户id为：" + wetlandInfo.getTenantId());
            SysUser user = new SysUser();
            user.setTenantId(wetlandInfo.getTenantId());
            //user.setTenantId("121062444");
            Result<AuthObjDataVO> voResult = rpcService.getDataScopeObjBySysUser(user);
            if (ObjectUtil.isEmpty(voResult)) {
                continue;
            }
            if (ObjectUtil.isEmpty(voResult.getData())) {
                continue;
            }
            List<DeviceVO> voListDB = voResult.getData().getSensors();
            if (ObjectUtil.isNotEmpty(voListDB)) {
                log.warn("查询到设备");
                for (DeviceVO v : voListDB) {
                    log.warn("查询到设备的类型：" + v.getDeviceType());
                    log.warn("查询到设备的编码：" + v.getDeviceCode());
                }
            } else {
                log.warn("该湿地没有查到设备");
            }


            List<DeviceVO> voList = voListDB.stream().filter(v -> WEATHERSTATION.equals(v.getIotDeviceType())).collect(Collectors.toList());
//气象站或者气象传感器
            //  List<SysDeptDeviceVO> voList = voListDB.stream().filter(v->"2022".equals(v.getDeviceType())||"400800010001".equals(v.getDeviceType())).collect(Collectors.toList());


            //过滤离线设备
            // voList = voList.stream().filter(v -> v.getDeviceStatus() == 0).collect(Collectors.toList());

            if (ObjectUtil.isNotEmpty(voList)) {
                log.warn("查询到气象站的设备为：" + voList.get(0).getDeviceCode());
            } else {
                log.warn("该湿地没有查到气象站" + wetlandInfo.getId());
            }
            if (ObjectUtil.isEmpty(voList)) {
                continue;
            }

            BigDecimal temperature = new BigDecimal(0);
            BigDecimal precipitation = new BigDecimal(0);

            int flag = 0;
            int teFlag = 0;
            int preFlag = 0;
            //todo 去调接口查出租户所有设备
            // String deviceCode = "dust-hmkw-8347-08";
            for (int i = 0; i < voList.size(); i++) {
                DeviceVO deviceInfoVo = voList.get(i);
                String deviceCode = deviceInfoVo.getDeviceCode();
                //   String deviceCode = "864865068880328";
                //     log.warn("写死设备："+"864865068880328");
                //String deviceCode = "dust-hmkw-8347-08";
                AbstactEntity abstactEntity = new AbstactEntity() {
                    @Override
                    public URL getBindMapping() {
                        URL url = URL.MONGODB_EXECUTE_SCRIPT;
                        return url;
                    }

                    @Override
                    public String getRequestBody() {
                        // 获取当前系统时间，并格式化为YYYY-MM格式

                        String currentMonth = DateUtils.getMonth();
             /*     String find = "vm_iot_device_t_" + currentMonth.replace( "-", "");
              find="vm_iot_device_t_202407";
                String scriptEL = "    {\n" +
                        "        \"find\": \""+find+"\",\n" +
                        "        \"filter\": {\n" +
                        "            \"deviceCode\": \""+deviceCode+"\" \n" +
                        "        },\n" +
                        "        \"sort\": {\"updateTime\": -1},\n" +
                        "        \"limit\": 1\n" +
                        "    };";*/


                        String find = "sensor_attribute_report_all_" + currentMonth.replace("-", "");
                        String scriptEL = "    {\n" +
                                "        \"find\": \"" + find + "\",\n" +
                                "        \"filter\": {\n" +
                                "            \"deviceCode\": \"" + deviceCode + "\" \n" +
                                ", \"batteryVoltage\": {\n" +
                                "                \"$nin\": [\"0.0\", \"0\"]\n" +
                                "            }" +
                                "        },\n" +
                                "        \"sort\": {\"timeFlag\": -1},\n" +
                                "        \"limit\": 1\n" +
                                "    }";

                        com.alibaba.fastjson.JSONObject jsonObject = new com.alibaba.fastjson.JSONObject();
                        jsonObject.put("scriptEL", scriptEL);
                        return jsonObject.toJSONString();
                    }
                };
                Function<String, BasicResponse<String>> convert = new Function<String, BasicResponse<String>>() {
                    @Override
                    public BasicResponse<String> apply(String s) {
                        BasicResponse basicResponse = new BasicResponse<>();
                        basicResponse.setResponseBody(s);
                        return basicResponse;
                    }
                };
                BasicResponse basicResponse = withoutTokenAuthenticationAPI.requestForPost(abstactEntity, convert);
                System.out.print(basicResponse.getResponseBody());
                String responseBody = (String) basicResponse.getResponseBody();
                Map<String, String> map = getTemperature(responseBody);
                if (!Objects.isNull(map)) {
                    if (!ObjectUtils.isEmpty(map.get(RAINFALL))) {
                        precipitation = precipitation.add(new BigDecimal(map.get(RAINFALL)));
                        preFlag++;
                    }
                    if (!ObjectUtils.isEmpty(map.get(TEMPERATURE))) {
                        temperature = temperature.add(new BigDecimal(map.get(TEMPERATURE)));
                        teFlag++;
                    }
                    flag++;
                }

            }
            Date[] days = RemindDateUtils.getTimeByParam("day");
            Date date = new Date();
            //查询的 当前租户下 今日有无创建
            WeatherAnalyse one = this.weatherAnalyseMapper.getOneWeather(wetlandInfo, days[0], days[1]);
            if (Objects.isNull(one) && flag > 0) {
                one = new WeatherAnalyse();
                one.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 16));
                one.setTenantId(wetlandInfo.getTenantId());
                one.setIndustryCode(wetlandInfo.getIndustryCode());
                one.setAppVerCode(wetlandInfo.getAppVerCode());
                if (teFlag > 0) {
                    one.setTemperature(temperature.divide(new BigDecimal(teFlag)));
                    one.setTemperatureFrom(2);
                } else {
                    one.setTemperature(null);
                }
                if (preFlag > 0) {
                    one.setPrecipitation(precipitation.divide(new BigDecimal(preFlag)));
                    one.setPrecipitationFrom(2);
                } else {
                    one.setPrecipitation(null);
                }
                one.setCreateTime(date);
                one.setUpdateTime(date);
                log.warn("写入天气");
                this.weatherAnalyseMapper.saveWeather(one);
            } else if (!Objects.isNull(one) && flag > 0 && (teFlag > 0 || preFlag > 0)) {
                if (teFlag > 0) {
                    one.setTemperature(temperature.divide(new BigDecimal(teFlag)));
                    one.setTemperatureFrom(2);
                } else {
                    one.setTemperature(null);
                }
                if (preFlag > 0) {
                    one.setPrecipitation(precipitation.divide(new BigDecimal(preFlag)));
                    one.setPrecipitationFrom(2);
                } else {
                    one.setPrecipitation(null);
                }
                one.setUpdateTime(date);
                this.weatherAnalyseMapper.updatePrecipitation(one);
            }

        }
    }

    @Override
    public void getWtTest() {
        IotTTDeviceVO iotTTDeviceVO = new IotTTDeviceVO();
        iotTTDeviceVO.setOrderStatus("1");
        iotTTDeviceVO.setDeviceType("2022");
        iotTTDeviceVO.setPageNum(1);
        iotTTDeviceVO.setPageSize(10);
        iotTTDeviceVO.setTenantId("121062999");
        TableDataInfo vo = this.rpcService.queryIotDevicePage(iotTTDeviceVO);
    }

    @Override
    public List<WetlandInfo> listForOur() {
        return this.baseMapper.listForOur();
    }

    @Override
    public Map getWeatherTest() {
        //String deviceCode = "dust-hmkw-8347-08";
        String deviceCode = "2305081146";
        AbstactEntity abstactEntity = new AbstactEntity() {
            @Override
            public URL getBindMapping() {
                URL url = URL.MONGODB_EXECUTE_SCRIPT;
                return url;
            }

            @Override
            public String getRequestBody() {
                // 获取当前系统时间，并格式化为YYYY-MM格式

                String currentMonth = DateUtils.getMonth();
             /*     String find = "vm_iot_device_t_" + currentMonth.replace( "-", "");
              find="vm_iot_device_t_202407";
                String scriptEL = "    {\n" +
                        "        \"find\": \""+find+"\",\n" +
                        "        \"filter\": {\n" +
                        "            \"deviceCode\": \""+deviceCode+"\" \n" +
                        "        },\n" +
                        "        \"sort\": {\"updateTime\": -1},\n" +
                        "        \"limit\": 1\n" +
                        "    };";*/


                String find = "sensor_attribute_report_all_" + currentMonth.replace("-", "");
                String scriptEL = "    {\n" +
                        "        \"find\": \"" + find + "\",\n" +
                        "        \"filter\": {\n" +
                        "            \"deviceCode\": \"" + deviceCode + "\" \n" +
                        ", \"batteryVoltage\": {\n" +
                        "                \"$nin\": [\"0.0\", \"0\"]\n" +
                        "            }" +
                        "        },\n" +
                        "        \"sort\": {\"timeFlag\": -1},\n" +
                        "        \"limit\": 1\n" +
                        "    }";

                com.alibaba.fastjson.JSONObject jsonObject = new com.alibaba.fastjson.JSONObject();
                jsonObject.put("scriptEL", scriptEL);
                return jsonObject.toJSONString();
            }
        };
        Function<String, BasicResponse<String>> convert = new Function<String, BasicResponse<String>>() {
            @Override
            public BasicResponse<String> apply(String s) {
                BasicResponse basicResponse = new BasicResponse<>();
                basicResponse.setResponseBody(s);
                return basicResponse;
            }
        };
        BasicResponse basicResponse = withoutTokenAuthenticationAPI.requestForPost(abstactEntity, convert);
        System.out.print(basicResponse.getResponseBody());
        String responseBody = (String) basicResponse.getResponseBody();
        return getTemperature(responseBody);
    }


    /**
     * 获取温度及降水量
     *
     * @return
     */
    public Map<String, String> getTemperature(String json) {
        Map<String, String> map = new HashMap<>();
        com.alibaba.fastjson.JSONObject jsonObject = JSON.parseObject(json);
        try {
            String temperature = "";
            String rainfall = "";
            if (ObjectUtil.isNotEmpty(jsonObject.getJSONObject(RESPONSEBODY).getJSONObject(CURSOR).getJSONArray(FIRSTBATCH))) {
                if (ObjectUtil.isNotEmpty(jsonObject.getJSONObject(RESPONSEBODY).getJSONObject(CURSOR).getJSONArray(FIRSTBATCH).getJSONObject(0).get(TEMPERATURE))) {
                    temperature = jsonObject.getJSONObject(RESPONSEBODY).getJSONObject("cursor").getJSONArray(FIRSTBATCH).getJSONObject(0).get(TEMPERATURE).toString();
                } else {
                    log.warn("气象站没有Etemperature字段");
                }
                if (ObjectUtil.isNotEmpty(jsonObject.getJSONObject(RESPONSEBODY).getJSONObject(CURSOR).getJSONArray(FIRSTBATCH).getJSONObject(0).get(RAINFALL))) {
                    rainfall = jsonObject.getJSONObject(RESPONSEBODY).getJSONObject(CURSOR).getJSONArray(FIRSTBATCH).getJSONObject(0).get(RAINFALL).toString();
                } else {
                    log.warn("气象站没有RainAdd字段");
                }
            }
            System.out.print(temperature);
            map.put(TEMPERATURE, temperature);
            map.put(RAINFALL, rainfall);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
        return map;
    }


}