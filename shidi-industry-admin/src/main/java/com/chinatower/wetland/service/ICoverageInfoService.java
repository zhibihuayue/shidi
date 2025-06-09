package com.chinatower.wetland.service;


import com.baomidou.mybatisplus.extension.service.IService;
import com.chinatower.wetland.pojo.entity.CoverageInfo;
import com.chinatower.wetland.pojo.param.CoverageInfoSelectParam;
import com.chinatower.wetland.pojo.vo.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * <p>图层信息Service接口</p>
 *
 * @author  zyx
 * @author  其它作者姓名
 * @version 1.00 2024/09/24 zyx
 * <p>
 * @see
 */
public interface ICoverageInfoService extends IService<CoverageInfo> {


    List<PropertiesVo> getEcosystemByTenantId( boolean isRefresh);

    List<PropertiesVo> getSuitableByTenantId( boolean isRefresh);

    List<String> suitableYear();

    List<CoverageChainVo> statisticsChain(CoverageInfoSelectParam param);

    List<CoverageFeatureVo> statisticsFeature(CoverageInfoSelectParam param);

    Map<Integer, Map<Integer, BigDecimal>> statisticsMatrix(CoverageInfoSelectParam param);

    CoverageDynamicIndexVo statisticsDynamicIndex(CoverageInfoSelectParam param);


    Map<Integer, String> suitableAnimal();

    List<CoverageSuitableAnalyseVo> statisticsSuitableAnalyse(CoverageInfoSelectParam param);

    List<CoverageSuitableChainVo> statisticsSuitableChain(CoverageInfoSelectParam param);



}
