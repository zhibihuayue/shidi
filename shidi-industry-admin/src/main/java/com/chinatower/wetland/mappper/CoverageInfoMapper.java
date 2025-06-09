package com.chinatower.wetland.mappper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chinatower.wetland.pojo.entity.CoverageInfo;
import com.chinatower.wetland.pojo.param.CoverageInfoSelectParam;
import com.chinatower.wetland.pojo.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>图层信息mapper</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Mapper
public interface CoverageInfoMapper extends BaseMapper<CoverageInfo> {

    /**
     * 以下返回 公顷
     * @param param
     * @return
     */
    List<CoverageChainVo> statisticsChain(@Param("param") CoverageInfoSelectParam param);

    List<CoverageFeatureVo> statisticsFeature(@Param("param") CoverageInfoSelectParam param);

    /**
     * 以下返回 亩
     * @param param
     * @return
     */
    List<CoverageSuitableAreaVo> statisticsSuitableAnalyse(@Param("param") CoverageInfoSelectParam param);

    CoverageSuitableAnalyseVo statisticsAllCountByParam(@Param("param") CoverageInfoSelectParam param);

    List<CoverageSuitableYearVo> statisticsAreaGroupByYear(@Param("param") CoverageInfoSelectParam param);

    List<CoverageSuitableChainVo> statisticsSuitableChain(@Param("param") CoverageInfoSelectParam param);
}





















