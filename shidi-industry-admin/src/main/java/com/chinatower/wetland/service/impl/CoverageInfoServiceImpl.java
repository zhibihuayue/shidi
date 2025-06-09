package com.chinatower.wetland.service.impl;


import cn.hutool.core.util.ObjectUtil;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinatower.common.core.dto.bdm.LayerResponseDTO;
import com.chinatower.common.entity.Result;
import com.chinatower.gis.api.entity.layer.LayerParcelQueryDTO;
import com.chinatower.gis.api.entity.layer.LayerParcelQueryFiltersDTO;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.wetland.exception.BaseBizException;
import com.chinatower.wetland.mappper.CoverageInfoMapper;
import com.chinatower.wetland.pojo.entity.BasicsEntity;
import com.chinatower.wetland.pojo.entity.CoverageInfo;
import com.chinatower.wetland.pojo.entity.CoverageInfoArea;
import com.chinatower.wetland.pojo.enums.RpcResultCodeEnum;
import com.chinatower.wetland.pojo.enums.SuitableTypeEnum;
import com.chinatower.wetland.pojo.param.CoverageInfoSelectParam;
import com.chinatower.wetland.pojo.vo.*;
import com.chinatower.wetland.service.ICoverageInfoAreaService;
import com.chinatower.wetland.service.ICoverageInfoService;
import com.chinatower.wetland.service.RpcService;
import com.chinatower.wetland.util.AreaUtil;
import com.chinatower.wetland.util.EcosystemCalculatorUtil;
import com.chinatower.wetland.util.GroupByYearUtil;
import com.chinatower.wetland.util.LandTransferMatrixUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @Description : 图层信息
 * @Author : zyx
 * @Date: 2024-09-24
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CoverageInfoServiceImpl extends ServiceImpl<CoverageInfoMapper, CoverageInfo> implements ICoverageInfoService {

    private final RpcService rpcService;

    private final ICoverageInfoAreaService coverageInfoAreaService;


    /**
     * 生态系统变化 stgc
     */
    private List<PropertiesVo> ecosystem = new ArrayList<>();

    private Map<String, JSONObject> ecosystemJsonMapForLayerId = new HashMap<>();

    private Map<Integer, JSONObject> ecosystemJsonMapForYear = new HashMap<>();

    /**
     * 适宜生境 syxpg
     */
    private List<PropertiesVo> suitable = new ArrayList<>();


    private List<PropertiesVo> getAllPropertiesByLayer(String abbreviation, String layerTypeId, List<LayerParcelQueryFiltersDTO> filtersDTOS, LoginUser loginUser) {
        //获取 图层id
        List<String> layerIds;
        Result<List<LayerResponseDTO>> listResult = this.rpcService.selectLayerList(abbreviation, null);
        if (listResult != null && Objects.equals(listResult.getCode(), RpcResultCodeEnum.RESULT_200.getCode()) && ObjectUtil.isNotEmpty(listResult.getData())) {
            List<LayerResponseDTO> list = listResult.getData();
            layerIds = list.stream().map(LayerResponseDTO::getId).collect(Collectors.toList());
        } else {
            return new ArrayList<>();
        }
        //获取 并 解析 图层自定义数据
        List<PropertiesVo> propertiesVos = new ArrayList<>();
        if (!layerIds.isEmpty()) {
            for (String layerId : layerIds) {
                propertiesVos.addAll(this.getLayerProperties(abbreviation, layerId, filtersDTOS, loginUser));
            }
        }

        return propertiesVos;
    }

    private List<PropertiesVo> getLayerProperties(String abbreviation, String layerID, List<LayerParcelQueryFiltersDTO> filtersDTOS, LoginUser loginUser) {
        LayerParcelQueryDTO dto = new LayerParcelQueryDTO();
        dto.setLayerID(layerID);
        dto.setFirstIndex(1);
        dto.setDistance(3000);
        dto.setCount(3000);
        if (ObjectUtil.isNotEmpty(filtersDTOS)) {
            //预留 可根据确定的 类型 进行查询
            /*List<LayerParcelQueryFiltersDTO> filtersDTOS = new ArrayList<>();
            LayerParcelQueryFiltersDTO filtersDTO = new LayerParcelQueryFiltersDTO();
            filtersDTO.setSearchKey("字段编码");
            filtersDTO.setSearchType(1); //1-and 2-or
            filtersDTO.setSearchValue("查询值");
            filtersDTO.setValueType(1);  //1-= 2-包含 3-不包含   4 != ,5 <= ,6 >,7 >=, 8 <
            filtersDTOS.add(filtersDTO);*/
            dto.setFilters(filtersDTOS);
        }
        Result result = this.rpcService.layerParcelQuery(dto);
        JSONObject data = null;
        //解析数据
        if (Objects.equals(result.getCode(), RpcResultCodeEnum.RESULT_200.getCode()) && ObjectUtil.isNotEmpty(result.getData())) {
            data = JSONObject.parseObject(JSONObject.toJSONString(result.getData()));
        } else {
            throw new BaseBizException("查询图层接口报错");
        }
        //图层数据
        JSONObject geoData = data.getJSONObject("geoData");

        if (ObjectUtil.isEmpty(geoData)) {
            return new ArrayList<>();
        }
        //1.7.30-若为生态构成 需要把原始图层数据 单独存放
        if (Objects.equals(abbreviation, "stgc")) {
            ecosystemJsonMapForLayerId.put(layerID, geoData);
        }

        List<JSONObject> features = geoData.getJSONArray("features").toJavaList(JSONObject.class);
        if (ObjectUtil.isEmpty(features)) {
            return new ArrayList<>();
        }
        List<PropertiesVo> propertiesVos = new ArrayList<>();
        for (JSONObject feature : features) {
            PropertiesVo vo = feature.getJSONObject("properties").toJavaObject(PropertiesVo.class);
            if (ObjectUtil.isNotEmpty(vo)) {
                vo.setTenantId(loginUser.getUser().getTenantId());
                vo.setIndustryCode(loginUser.getUser().getIndustryCode());
                vo.setAppVerCode(loginUser.getUser().getAppVerCode());
                propertiesVos.add(vo);
            }
        }
        return propertiesVos;
    }


    @Override
    public synchronized List<PropertiesVo> getEcosystemByTenantId(boolean isRefresh) {
        if (isRefresh) {
            ecosystemJsonMapForYear = new HashMap<>();
            ecosystemJsonMapForLayerId = new HashMap<>();
            ecosystem = new ArrayList<>();
            return new ArrayList<>();
        } else {
            LoginUser loginUser = this.rpcService.getLoginUser();
            List<PropertiesVo> ecosystemTenantIds = ecosystem.stream().filter(x -> Objects.equals(x.getTenantId(), loginUser.getUser().getTenantId())
                    && Objects.equals(x.getIndustryCode(), loginUser.getUser().getIndustryCode())
                    && Objects.equals(x.getAppVerCode(), loginUser.getUser().getAppVerCode())).collect(Collectors.toList());
            if (ecosystemTenantIds.isEmpty()) {
                List<PropertiesVo> stgc = this.getAllPropertiesByLayer("stgc", null, null, loginUser);
                if (ecosystem != null) {
                    ecosystem.addAll(stgc);
                } else {
                    ecosystem = stgc;
                }
                ecosystemTenantIds = stgc;
                if (ecosystemTenantIds.isEmpty()) {
                    return new ArrayList<>();
                }
                //1.7.30 -无论如何都都 更新一遍 年份数据
                ecosystemJsonMapForYear = GroupByYearUtil.transferYearGeoData(ecosystemJsonMapForLayerId);
            }
            return ecosystemTenantIds;
        }
    }

    @Override
    public synchronized List<PropertiesVo> getSuitableByTenantId(boolean isRefresh) {
        if (isRefresh) {
            suitable = new ArrayList<>();
            return new ArrayList<>();
        } else {
            LoginUser loginUser = this.rpcService.getLoginUser();
            List<PropertiesVo> suitableTenantId = suitable.stream().filter(x -> Objects.equals(x.getTenantId(), loginUser.getUser().getTenantId())
                    && Objects.equals(x.getIndustryCode(), loginUser.getUser().getIndustryCode())
                    && Objects.equals(x.getAppVerCode(), loginUser.getUser().getAppVerCode())).collect(Collectors.toList());
            if (suitableTenantId.isEmpty()) {
                List<PropertiesVo> syxpg = this.getAllPropertiesByLayer("syxpg", null, null, loginUser);
                if (suitable != null) {
                    suitable.addAll(syxpg);
                } else {
                    suitable = syxpg;
                }
                suitableTenantId = syxpg;
                if (suitableTenantId.isEmpty()) {
                    return new ArrayList<>();
                }
            }
            return suitableTenantId;
        }
    }

    private List<CoverageInfoVo> addSomeData(List<CoverageInfo> coverageInfos) {
        List<String> coverageIds = coverageInfos.stream().map(BasicsEntity::getId).collect(Collectors.toList());
        List<CoverageInfoVo> result = new ArrayList<>();
        List<CoverageInfoArea> coverageInfoAreas = this.coverageInfoAreaService.list(new LambdaQueryWrapper<CoverageInfoArea>()
                .in(CoverageInfoArea::getCoverageId, coverageIds));
        for (CoverageInfo coverageInfo : coverageInfos) {
            CoverageInfoVo vo = new CoverageInfoVo();
            BeanUtils.copyProperties(coverageInfo, vo);
            vo.setAreaList(coverageInfoAreas.stream().filter(x -> Objects.equals(x.getCoverageId(), coverageInfo.getId())).collect(Collectors.toList()));
            result.add(vo);
        }
        return result;
    }

    /**
     * 大屏-生态系统最小最大年份
     *
     * @return
     */
    @Override
    public List<String> suitableYear() {
        //查询 所有 生态构成 图层id  stgc
        List<PropertiesVo> ecosystemTenantIds = this.getEcosystemByTenantId(false);

        //得到 所有 去重年份
        List<String> result = new ArrayList<>();
        List<String> years = ecosystemTenantIds.stream().map(PropertiesVo::getYear)
                .distinct().collect(Collectors.toList());

        //根据 年份排序 返回 最小值 最大值
        if (!years.isEmpty()) {
            Collections.sort(years);
            result.add(years.get(0));
            result.add(years.get(years.size() - 1));
        }
        return result;
    }

    /**
     * 大屏-生态系统变化
     *
     * @param param
     * @return
     */
    @Override
    public List<CoverageChainVo> statisticsChain(CoverageInfoSelectParam param) {
        if (StringUtils.isEmpty(param.getStartTime()) || StringUtils.isEmpty(param.getEndTime())) {
            throw new BaseBizException("时间参数不能为空");
        }

        //查询 所有 生态构成 图层id  stgc
        List<PropertiesVo> ecosystemTenantIds = this.getEcosystemByTenantId(false);

        //根据 时间 获取 每个类型的 总面积 和 总板块数
        List<CoverageCountVo> startCount = this.getCoverageCountByTime(ecosystemTenantIds, param.getStartTime());
        List<CoverageCountVo> endCount = this.getCoverageCountByTime(ecosystemTenantIds, param.getEndTime());

        //装填返回值
        List<CoverageChainVo> result = new ArrayList<>();
        for (CoverageCountVo startVo : startCount) {
            CoverageChainVo vo = new CoverageChainVo();
            vo.setType(startVo.getType());
            //获取对应 类型的 结束节点 数据
            List<CoverageCountVo> collect = endCount.stream()
                    .filter(x -> Objects.equals(startVo.getType(), x.getType())).collect(Collectors.toList());
            if (!collect.isEmpty()) {
                CoverageCountVo endVo = collect.get(0);
                //根据 开始 结束 节点数据 计算差值 和 比率
                vo.setAreaDiff(endVo.getLayerArea().subtract(startVo.getLayerArea()));
                if (startVo.getLayerArea().compareTo(BigDecimal.ZERO) != 0) {
                    vo.setAreaRate(vo.getAreaDiff().divide(startVo.getLayerArea(), 4, RoundingMode.HALF_UP));
                } else {
                    if (vo.getAreaDiff().compareTo(BigDecimal.ZERO) == 0) {
                        vo.setAreaRate(BigDecimal.valueOf(0.0));
                    } else {
                        vo.setAreaRate(BigDecimal.valueOf(1.0));
                    }
                }
            }
            result.add(vo);
        }

        //根据 差值 进行倒序 排序
        return result.stream().sorted(Comparator.comparing(CoverageChainVo::getAreaDiff).reversed())
                .collect(Collectors.toList());
    }

    /**
     * 大屏-景观格局特征
     *
     * @param param
     * @return
     */
    @Override
    public List<CoverageFeatureVo> statisticsFeature(CoverageInfoSelectParam param) {
        if (StringUtils.isEmpty(param.getStartTime())) {
            throw new BaseBizException("时间参数不能为空");
        }

        //查询 所有 生态构成  stgc
        List<PropertiesVo> ecosystemTenantIds = this.getEcosystemByTenantId(false);

        //根据 时间 获取 每个类型的 总面积 和 总板块数
        List<CoverageCountVo> countVos = this.getCoverageCountByTime(ecosystemTenantIds, param.getStartTime());

        //装填返回值 平均数处理
        List<CoverageFeatureVo> result = new ArrayList<>();
        for (CoverageCountVo countVo : countVos) {
            CoverageFeatureVo vo = new CoverageFeatureVo();
            vo.setType(countVo.getType());
            vo.setPlaqueCount(countVo.getPolygonCount());
            vo.setAllArea(countVo.getLayerArea());
            //计算 平均数
            if (Objects.equals(vo.getPlaqueCount(), 0)) {
                vo.setAvgArea(BigDecimal.valueOf(0.0));
            } else {
                vo.setAvgArea(vo.getAllArea().divide(BigDecimal.valueOf(vo.getPlaqueCount()),
                        4, RoundingMode.HALF_UP));
            }
            result.add(vo);
        }
        //倒序排列返回
        return result.stream().sorted(Comparator.comparing(CoverageFeatureVo::getAllArea).reversed()).collect(Collectors.toList());
    }

    /**
     * 生态转移矩阵统计
     *
     * @param param 查询参数
     * @return
     */
    @Override
    public Map<Integer, Map<Integer, BigDecimal>> statisticsMatrix(CoverageInfoSelectParam param) {
        if (StringUtils.isEmpty(param.getStartTime()) || StringUtils.isEmpty(param.getEndTime())) {
            throw new BaseBizException("时间参数不能为空");
        }

        //查询 所有 生态构成 图层id  stgc
        if (ecosystemJsonMapForYear == null || ecosystemJsonMapForYear.isEmpty()) {
            this.getEcosystemByTenantId(false);
        }

        //根据 开始 结束 时间 获取 图层信息
        JSONObject startJson = ecosystemJsonMapForYear.get(Integer.parseInt(param.getStartTime()));
        JSONObject endJson = ecosystemJsonMapForYear.get(Integer.parseInt(param.getEndTime()));

        if (Objects.isNull(startJson) || Objects.isNull(endJson)) {
            throw new BaseBizException("开始结束时间内暂无图层数据");
        }

        //返回值创建
        Map<Integer, Map<Integer, BigDecimal>> transfer = new HashMap<>();
        try {
            //进行矩阵转化计算
            transfer = LandTransferMatrixUtil.transfer(startJson, endJson);
        } catch (Exception e) {
            throw new BaseBizException(e.getMessage());
        }
        return transfer;
    }

    /**
     * 综合动态度 转移指数
     *
     * @param param 查询参数
     * @return
     */
    @Override
    public CoverageDynamicIndexVo statisticsDynamicIndex(CoverageInfoSelectParam param) {
        if (StringUtils.isEmpty(param.getStartTime()) || StringUtils.isEmpty(param.getEndTime())) {
            throw new BaseBizException("时间参数不能为空");
        }
        //查询 所有 生态构成  stgc
        List<PropertiesVo> ecosystemTenantIds = this.getEcosystemByTenantId(false);

        //调用 计算类 进行计算
        return EcosystemCalculatorUtil.calculate(ecosystemTenantIds, param.getStartTime(), param.getEndTime());
    }

    /**
     * 根据 时间 获取 每个类型的 总面积 和 总板块数
     *
     * @param ecosystemTenantIds 生态结构数据
     * @param time               传入时间
     * @return
     */
    private List<CoverageCountVo> getCoverageCountByTime(List<PropertiesVo> ecosystemTenantIds, String time) {
        //根据时间 筛选出需要的数据
        List<PropertiesVo> properties = ecosystemTenantIds.stream()
                .filter(x -> Objects.equals(x.getYear(), time)).collect(Collectors.toList());
        //根据类型 分类出 各类的图层
        Map<Integer, List<PropertiesVo>> groupByType = properties.stream()
                .collect(Collectors.groupingBy(PropertiesVo::getType));
        //计算出 每个类型 的 总面积 和 总板块数
        return this.coverageCountByType(groupByType);
    }

    @Override
    public Map<Integer, String> suitableAnimal() {

        //获取 适宜性评估 图层数据  syxpg
        List<PropertiesVo> suitableTenantId = this.getSuitableByTenantId(false);

        //得到 所有 动物类型集合
        List<Integer> types = suitableTenantId.stream().map(PropertiesVo::getAnimal)
                .distinct().collect(Collectors.toList());
        Map<Integer, String> result = new HashMap<>();
        //根据 动物类型 获取对应 枚举解释
        for (Integer type : types) {
            result.put(type, SuitableTypeEnum.getByCode(type).getDesc());
        }
        return result;
    }

    /**
     * 根据 类型获取鸟类栖息地每年的数据
     *
     * @return
     */

    @Override
    public List<CoverageSuitableAnalyseVo> statisticsSuitableAnalyse(CoverageInfoSelectParam param) {
        param.setCoverageType(0);
        //若未选择 则不查询
        if (param.getType() == null) {
            return new ArrayList<>();
        }

        //获取 适宜性评估 图层数据
        List<PropertiesVo> suitableTenantId = this.getSuitableByTenantId(false);

        //按照动物类型分类
        List<PropertiesVo> craneList = suitableTenantId.stream().filter(propertiesVo -> propertiesVo.getAnimal()
                .equals(param.getType())).collect(Collectors.toList());
        Map<String, List<PropertiesVo>> craneListMap = craneList.stream().collect(Collectors
                .groupingBy(PropertiesVo::getYear));
        List<CoverageSuitableAnalyseVo> craneVOList = new ArrayList<>();
        for (Map.Entry<String, List<PropertiesVo>> entry : craneListMap.entrySet()) {
            List<PropertiesVo> list = entry.getValue();
            CoverageSuitableAnalyseVo vo = new CoverageSuitableAnalyseVo();
            vo.setCoverageYear(Integer.valueOf(entry.getKey()));
            for (PropertiesVo p : list) {
                if (p.getType() == 1) {
                    vo.setMostSuitableCount(vo.getMostSuitableCount().add(p.getArea()));
                } else if (p.getType() == 2) {
                    vo.setMoreSuitableCount(vo.getMoreSuitableCount().add(p.getArea()));
                } else {
                    vo.setNotSuitableCount(vo.getNotSuitableCount().add(p.getArea()));
                }
            }
            vo.setMostSuitableCount(vo.getMostSuitableCount().setScale(2, BigDecimal.ROUND_HALF_UP));
            vo.setMoreSuitableCount(vo.getMoreSuitableCount().setScale(2, BigDecimal.ROUND_HALF_UP));
            vo.setNotSuitableCount(vo.getNotSuitableCount().setScale(2, BigDecimal.ROUND_HALF_UP));
            vo.setMostSuitableCountStr(AreaUtil.showDataNumForTwo(vo.getMostSuitableCount()));
            vo.setMoreSuitableCountStr(AreaUtil.showDataNumForTwo(vo.getMoreSuitableCount()));
            vo.setNotSuitableCountStr(AreaUtil.showDataNumForTwo(vo.getNotSuitableCount()));
            vo.setAllArea(vo.getAllArea().add(vo.getMostSuitableCount()).add(vo.getMoreSuitableCount())
                    .add(vo.getNotSuitableCount()).setScale(2, BigDecimal.ROUND_HALF_UP));
            vo.setAllAreaStr(AreaUtil.showDataNumForTwo(vo.getAllArea()));
            vo.setMostSuitableRate(vo.getMostSuitableCount().divide(vo.getAllArea(), 2, BigDecimal.ROUND_HALF_UP)
                    .doubleValue());
            vo.setMoreSuitableRate(vo.getMoreSuitableCount().divide(vo.getAllArea(), 2, BigDecimal.ROUND_HALF_UP)
                    .doubleValue());
            vo.setNotSuitableRate(vo.getNotSuitableCount().divide(vo.getAllArea(), 2, BigDecimal.ROUND_HALF_UP)
                    .doubleValue());
            BigDecimal flag = new BigDecimal(1).subtract(vo.getNotSuitableCount()
                    .divide(vo.getAllArea(), 2, BigDecimal.ROUND_HALF_UP))
                    .subtract(vo.getMoreSuitableCount().divide(vo.getAllArea(), 2, BigDecimal.ROUND_HALF_UP))
                    .subtract(vo.getMostSuitableCount().divide(vo.getAllArea(), 2, BigDecimal.ROUND_HALF_UP));
            //精度计算
            if (new BigDecimal("0").compareTo(flag) > 0) {
                if ((vo.getMostSuitableCount().compareTo(vo.getMoreSuitableCount()) >= 0) && (vo.getMostSuitableCount()
                        .compareTo(vo.getNotSuitableCount()) >= 0)) {
                    vo.setMostSuitableRate(vo.getMostSuitableCount().divide(vo.getAllArea())
                            .subtract(new BigDecimal("0.01"))
                            .setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
                } else if ((vo.getMoreSuitableCount().compareTo(vo.getMostSuitableCount()) >= 0)
                        && (vo.getMoreSuitableCount().compareTo(vo.getNotSuitableCount()) >= 0)) {
                    vo.setMoreSuitableRate(vo.getMoreSuitableCount().divide(vo.getAllArea())
                            .subtract(new BigDecimal("0.01"))
                            .setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
                } else {
                    vo.setNotSuitableRate(vo.getNotSuitableCount().divide(vo.getAllArea())
                            .subtract(new BigDecimal("0.01"))
                            .setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
                }

            } else if (new BigDecimal("0").compareTo(flag) < 0) {
                if ((vo.getMostSuitableCount().compareTo(vo.getMoreSuitableCount()) >= 0)
                        && (vo.getMostSuitableCount().compareTo(vo.getNotSuitableCount()) >= 0)) {
                    vo.setMostSuitableRate(vo.getMostSuitableCount().divide(vo.getAllArea())
                            .add(new BigDecimal("0.01"))
                            .setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
                } else if ((vo.getMoreSuitableCount().compareTo(vo.getMostSuitableCount()) >= 0)
                        && (vo.getMoreSuitableCount().compareTo(vo.getNotSuitableCount()) >= 0)) {
                    vo.setMoreSuitableRate(vo.getMoreSuitableCount().divide(vo.getAllArea())
                            .add(new BigDecimal("0.01"))
                            .setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
                } else {
                    vo.setNotSuitableRate(vo.getNotSuitableCount().divide(vo.getAllArea())
                            .add(new BigDecimal("0.01"))
                            .setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue());
                }
            }
            craneVOList.add(vo);
        }
        craneVOList.sort(((o1, o2) -> {
            //从小到大 升序
            return o2.getCoverageYear() - o1.getCoverageYear();
        }));
        List<CoverageSuitableAnalyseVo> craneVOListAdd = new ArrayList<>();
        for (int i = 0; i + 1 < craneVOList.size(); i++) {
            CoverageSuitableAnalyseVo vo = craneVOList.get(i);
            CoverageSuitableAnalyseVo voNext = craneVOList.get(i + 1);
            Integer noYear = voNext.getCoverageYear() - vo.getCoverageYear();
            for (int j = 1; j < noYear; j++) {
                CoverageSuitableAnalyseVo addVo = new CoverageSuitableAnalyseVo();
                addVo.setCoverageYear(vo.getCoverageYear() + j);
                craneVOListAdd.add(addVo);
            }
        }
        craneVOList.addAll(craneVOListAdd);
        return craneVOList;
    }

    /**
     * 大屏-栖息地变化
     *
     * @param param
     * @return
     */
    @Override
    public List<CoverageSuitableChainVo> statisticsSuitableChain(CoverageInfoSelectParam param) {
        //若未选择 则不查询
        if (param.getType() == null) {
            return new ArrayList<>();
        }
        List<PropertiesVo> suitableTenantId = this.getSuitableByTenantId(false);

        //动物类型 1-丹顶鹤 2-东方白鹳 3-天鹅
        List<PropertiesVo> animals = suitableTenantId.stream()
                .filter(x -> Objects.equals(param.getType(), x.getAnimal())).collect(Collectors.toList());
        //根据年份 进行分类
        Map<String, List<PropertiesVo>> groupByType = animals.stream().collect(Collectors.groupingBy(PropertiesVo::getYear));
        //计算出 每个类型 的 总面积 和 总板块数
        List<CoverageCountVo> countVos = this.coverageCountByYear(groupByType);

        //按 年份 装填 基础Vo数据
        List<CoverageSuitableChainVo> chainVos = new ArrayList<>();
        for (CoverageCountVo countVo : countVos) {
            CoverageSuitableChainVo vo = new CoverageSuitableChainVo();
            vo.setCoverageYear(countVo.getYear());
            vo.setPlaqueCount(countVo.getPolygonCount());
            vo.setAllArea(countVo.getLayerArea());
            vo.setAllAreaStr(AreaUtil.showDataNumForTwo(vo.getAllArea()));
            chainVos.add(vo);
        }
        //按照年份 倒序 排序
        chainVos = chainVos.stream().sorted(Comparator.comparing(CoverageSuitableChainVo::getCoverageYear).reversed())
                .collect(Collectors.toList());

        //计算 本年 与 上一年 的 面积 板块数 差值
        for (int j = 0; j < chainVos.size(); j++) {
            if (j != chainVos.size() - 1) {
                //获取 本年 上一年 数据
                CoverageSuitableChainVo current = chainVos.get(j);
                CoverageSuitableChainVo next = chainVos.get(j + 1);
                //计算 面积 差值比率
                if (next.getAllArea().compareTo(BigDecimal.ZERO) == 0) {
                    current.setAreaRate(BigDecimal.ZERO);
                } else {
                    current.setAreaRate(current.getAllArea().subtract(next.getAllArea())
                            .divide(next.getAllArea(), 4, RoundingMode.HALF_UP));
                }
                //计算 面积 斑块数量 差值
                current.setPlaqueDiff(current.getPlaqueCount() - next.getPlaqueCount());
                current.setAreaDiffStr(AreaUtil.showDataNumForTwo(current.getAllArea()
                        .subtract(next.getAllArea())));
            }
        }
        return chainVos;

    }


    private List<CoverageCountVo> coverageCountByYear(Map<String, List<PropertiesVo>> groupByType) {
        List<CoverageCountVo> result = new ArrayList<>();
        for (String year : groupByType.keySet()) {
            CoverageCountVo vo = new CoverageCountVo();
            vo.setYear(year);
            List<PropertiesVo> propertiesVos = groupByType.get(year);
            if (ObjectUtil.isNotEmpty(propertiesVos)) {
                vo.setPolygonCount(propertiesVos.size());
                BigDecimal layerArea = propertiesVos.stream().map(PropertiesVo::getArea)
                        .filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
                vo.setLayerArea(layerArea);
            }
            result.add(vo);
        }

        return result;
    }

    private void setParam(CoverageInfoSelectParam param) {
        LoginUser loginUser = rpcService.getLoginUser();
        param.setIndustryCode(loginUser.getUser().getIndustryCode());
        param.setTenantId(loginUser.getUser().getTenantId());
        param.setAppVerCode(loginUser.getUser().getAppVerCode());
    }

    /**
     * 根据 图层类型 进行统计
     *
     * @param map
     * @return
     */
    private List<CoverageCountVo> coverageCountByType(Map<Integer, List<PropertiesVo>> map) {
        List<CoverageCountVo> result = new ArrayList<>();
        //图层类型 生态构成-（1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地）
        for (int i = 1; i <= 7; i++) {
            CoverageCountVo vo = new CoverageCountVo();
            vo.setType(i);
            List<PropertiesVo> propertiesVos = map.get(i);
            if (ObjectUtil.isNotEmpty(propertiesVos)) {
                vo.setPolygonCount(propertiesVos.size());
                BigDecimal layerArea = propertiesVos.stream().map(PropertiesVo::getArea)
                        .filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
                vo.setLayerArea(layerArea);
            }
            result.add(vo);
        }


        return result;
    }


}
