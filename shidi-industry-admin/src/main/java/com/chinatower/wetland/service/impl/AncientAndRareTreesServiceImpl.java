package com.chinatower.wetland.service.impl;

import com.alibaba.fastjson.JSON;
import com.chinatower.forestry.emengercy.api.entity.AncientTreeVO;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.wetland.pojo.enums.AncientAndRareTreesTypeEnum;
import com.chinatower.wetland.pojo.vo.AncientAndRareTreesLevelVo;
import com.chinatower.wetland.pojo.vo.AncientAndRareTreesSortStatisticsVo;
import com.chinatower.wetland.service.IAncientAndRareTreesService;
import com.chinatower.wetland.service.RpcService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * @Description : 古树名木统计
 * @Author : wanglin
 * @Date: 2024-06-18
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class AncientAndRareTreesServiceImpl implements IAncientAndRareTreesService {

    private final RpcService rpcService;

    /**
     * 获取古树名木信息分类统计数据
     *
     * @return
     */
    @Override
    public List<AncientAndRareTreesSortStatisticsVo> getClassifiedStatistic() {
        LoginUser loginUser = rpcService.getLoginUser();
        AncientTreeVO ancientTreeVO = new AncientTreeVO();
        ancientTreeVO.setIndustryCode(loginUser.getUser().getIndustryCode());
        ancientTreeVO.setTenantId(loginUser.getUser().getTenantId());
        Object data = rpcService.statisticsLevel(ancientTreeVO).getData();
        log.info("获取古树名木信息分类统计数据 :{}", data.toString());
        AncientAndRareTreesLevelVo vo = JSON.parseObject(JSON.toJSONString(data), AncientAndRareTreesLevelVo.class);
        List<AncientAndRareTreesSortStatisticsVo> vos = new ArrayList<>();
        int totality = vo.getOneLevelTreeCount() + vo.getTwoLevelTreeCount() + vo.getThreeLevelTreeCount() + vo.getWoodCount();
        if (Objects.equals(totality, 0)) {
            totality = 1;
        }

        AncientAndRareTreesSortStatisticsVo oneLevelTree = new AncientAndRareTreesSortStatisticsVo();
        oneLevelTree.setGradeType(AncientAndRareTreesTypeEnum.ONE_LEVE_TREE.getCode());
        oneLevelTree.setGradeName(AncientAndRareTreesTypeEnum.ONE_LEVE_TREE.getDesc());
        oneLevelTree.setCount(vo.getOneLevelTreeCount());
        BigDecimal proportion1 = new BigDecimal(vo.getOneLevelTreeCount()).divide(new BigDecimal(totality), 2, BigDecimal.ROUND_HALF_UP);
        oneLevelTree.setProportion(proportion1);

        AncientAndRareTreesSortStatisticsVo twoLevelTree = new AncientAndRareTreesSortStatisticsVo();
        twoLevelTree.setGradeType(AncientAndRareTreesTypeEnum.TWO_LEVE_TREE.getCode());
        twoLevelTree.setGradeName(AncientAndRareTreesTypeEnum.TWO_LEVE_TREE.getDesc());
        twoLevelTree.setCount(vo.getTwoLevelTreeCount());
        BigDecimal proportion2 = new BigDecimal(vo.getTwoLevelTreeCount()).divide(new BigDecimal(totality), 2, BigDecimal.ROUND_HALF_UP);
        twoLevelTree.setProportion(proportion2);

        AncientAndRareTreesSortStatisticsVo threeLevelTree = new AncientAndRareTreesSortStatisticsVo();
        threeLevelTree.setGradeType(AncientAndRareTreesTypeEnum.THREE_LEVE_TREE.getCode());
        threeLevelTree.setGradeName(AncientAndRareTreesTypeEnum.THREE_LEVE_TREE.getDesc());
        threeLevelTree.setCount(vo.getThreeLevelTreeCount());
        BigDecimal proportion3 = new BigDecimal(vo.getThreeLevelTreeCount()).divide(new BigDecimal(totality), 2, BigDecimal.ROUND_HALF_UP);
        threeLevelTree.setProportion(proportion3);

        AncientAndRareTreesSortStatisticsVo wood = new AncientAndRareTreesSortStatisticsVo();
        wood.setGradeType(AncientAndRareTreesTypeEnum.WOOD.getCode());
        wood.setGradeName(AncientAndRareTreesTypeEnum.WOOD.getDesc());
        wood.setCount(vo.getWoodCount());
        if (!Objects.equals(vo.getWoodCount(), 0)) {
            BigDecimal add = proportion1.add(proportion2.add(proportion3));
            BigDecimal subtract = new BigDecimal(1).subtract(add);
            wood.setProportion(subtract);
        } else {
            BigDecimal proportion0 = new BigDecimal(vo.getWoodCount()).divide(new BigDecimal(totality), 2, BigDecimal.ROUND_HALF_UP);
            wood.setProportion(proportion0);
        }
        vos.add(oneLevelTree);
        vos.add(twoLevelTree);
        vos.add(threeLevelTree);
        vos.add(wood);

        return vos;
    }

}
