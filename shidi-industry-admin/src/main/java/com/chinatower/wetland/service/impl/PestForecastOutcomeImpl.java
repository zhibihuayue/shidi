package com.chinatower.wetland.service.impl;


import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinatower.common.core.utils.DateUtils;
import com.chinatower.common.core.utils.StringUtils;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.wetland.exception.BaseBizException;
import com.chinatower.wetland.mappper.PestForecastOutcomeMapper;
import com.chinatower.wetland.pojo.entity.PestControlForecast;
import com.chinatower.wetland.pojo.entity.PestForecastOutcome;
import com.chinatower.wetland.pojo.param.PestOutcomeParam;
import com.chinatower.wetland.pojo.vo.PestControlForecastVo;
import com.chinatower.wetland.pojo.vo.PestForecastOutcomeVo;
import com.chinatower.wetland.pojo.vo.PestHomeStatisticsVo;
import com.chinatower.wetland.service.IPestControlForecastService;
import com.chinatower.wetland.service.IPestForecastOutcomeService;
import com.chinatower.wetland.service.RpcService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * @Description : 病虫害预测结果表
 * @Author : zyx
 * @Date: 2024-03-12
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PestForecastOutcomeImpl extends ServiceImpl<PestForecastOutcomeMapper, PestForecastOutcome> implements IPestForecastOutcomeService {

    private final RpcService rpcService;

    private final IPestControlForecastService forecastService;

    static final String YEAR_MONTH_DAY = "yyyy-MM-dd";

    /**
     * 大屏-病虫害预测
     *
     * @param param
     * @return
     */
    @Override
    public PestHomeStatisticsVo pestPrediction(PestOutcomeParam param) {
        if (StringUtils.isNotEmpty(param.getCreateTime())) {
            param.setStartTime(param.getCreateTime() + " 00:00:00");
            param.setEndTime(param.getCreateTime() + " 23:59:59");
        } else {
            throw new BaseBizException("时间参数不能为空");
        }

        LoginUser loginUser = rpcService.getLoginUser();
        PestHomeStatisticsVo result = new PestHomeStatisticsVo();

        //查询 相关虫预测规则
        PestControlForecast forecast = this.forecastService.getOne(new LambdaQueryWrapper<PestControlForecast>()
                .eq(PestControlForecast::getPestType, param.getPestType())
                .eq(PestControlForecast::getTenantId, loginUser.getUser().getTenantId())
                .eq(PestControlForecast::getIndustryCode, loginUser.getUser().getIndustryCode())
                .eq(PestControlForecast::getAppVerCode, loginUser.getUser().getAppVerCode()).last(" limit 1"));
        PestControlForecastVo forecastVo = new PestControlForecastVo();
        if (Objects.nonNull(forecast)) {
            BeanUtils.copyProperties(forecast, forecastVo);
        }
        result.setForecastVo(forecastVo);

        //找到病虫害预测数据
        List<PestForecastOutcomeVo> outcomes = this.baseMapper.listByParam(param);
        //修改 风险等级
        for (PestForecastOutcomeVo outcome : outcomes) {
            BigDecimal pestNum = outcome.getPestNum();
            if (pestNum.compareTo(forecastVo.getNormalLow()) >= 0 && pestNum.compareTo(forecastVo.getNormalHigh()) < 0) {
                outcome.setPestLevel(0);
            } else if (pestNum.compareTo(forecastVo.getEarlyLow()) >= 0 && pestNum.compareTo(forecastVo.getEarlyHigh()) < 0) {
                outcome.setPestLevel(1);
            } else if (pestNum.compareTo(forecastVo.getWarnLow()) >= 0 && pestNum.compareTo(forecastVo.getWarnHigh()) < 0) {
                outcome.setPestLevel(2);
            } else if (pestNum.compareTo(forecastVo.getRiskLow()) >= 0) {
                outcome.setPestLevel(3);
            }
        }

        result.setOutcomeVos(outcomes.stream().sorted(Comparator
                .comparing(PestForecastOutcomeVo::getForecastDate)).collect(Collectors.toList()));

        return result;
    }

    /**
     * 时间下拉框
     *
     * @return
     */
    @Override
    public List<String> pestTimeList() {
        return this.baseMapper.listTime();
    }

    @Override
    public List<PestForecastOutcomeVo> pestLightLastDay(PestOutcomeParam param) {
        if (StringUtils.isNotEmpty(param.getCreateTime())) {
            param.setStartTime(param.getCreateTime() + " 00:00:00");
            param.setEndTime(param.getCreateTime() + " 23:59:59");
        } else {
            throw new BaseBizException("时间参数不能为空");
        }

        List<PestForecastOutcomeVo> outcomeVos = this.baseMapper.pestLightLastDay(param);

        LoginUser loginUser = rpcService.getLoginUser();
        //查询 相关虫预测规则
        PestControlForecast forecast = this.forecastService.getOne(new LambdaQueryWrapper<PestControlForecast>()
                .eq(PestControlForecast::getPestType, param.getPestType())
                .eq(PestControlForecast::getTenantId, loginUser.getUser().getTenantId())
                .eq(PestControlForecast::getIndustryCode, loginUser.getUser().getIndustryCode())
                .eq(PestControlForecast::getAppVerCode, loginUser.getUser().getAppVerCode()).last(" limit 1"));

        //修改 风险等级
        for (PestForecastOutcomeVo outcome : outcomeVos) {
            BigDecimal pestNum = outcome.getPestNum();
            if (pestNum.compareTo(forecast.getNormalLow()) >= 0 && pestNum.compareTo(forecast.getNormalHigh()) < 0) {
                outcome.setPestLevel(0);
            } else if (pestNum.compareTo(forecast.getEarlyLow()) >= 0 && pestNum.compareTo(forecast.getEarlyHigh()) < 0) {
                outcome.setPestLevel(1);
            } else if (pestNum.compareTo(forecast.getWarnLow()) >= 0 && pestNum.compareTo(forecast.getWarnHigh()) < 0) {
                outcome.setPestLevel(2);
            } else if (pestNum.compareTo(forecast.getRiskLow()) >= 0) {
                outcome.setPestLevel(3);
            }
        }


        return outcomeVos;
    }
}
