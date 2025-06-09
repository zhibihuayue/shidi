package com.chinatower.wetland.service.impl;


import cn.hutool.core.util.ObjectUtil;
import com.alibaba.excel.EasyExcelFactory;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinatower.common.core.utils.StringUtils;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.wetland.exception.BaseBizException;
import com.chinatower.wetland.mappper.PestControlForecastMapper;
import com.chinatower.wetland.pojo.entity.PestControlForecast;
import com.chinatower.wetland.pojo.entity.WetlandInfo;
import com.chinatower.wetland.pojo.param.PestControlForecastEditParam;
import com.chinatower.wetland.pojo.param.PestControlForecastInsertParam;
import com.chinatower.wetland.pojo.vo.PestControlForecastExportVo;
import com.chinatower.wetland.pojo.vo.PestControlForecastVo;
import com.chinatower.wetland.pojo.vo.WetlandInfoDetailVO;
import com.chinatower.wetland.service.IPestControlForecastService;
import com.chinatower.wetland.service.RpcService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @Description : 病虫害预测表
 * @Author : zyx
 * @Date: 2024-03-12
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PestControlForecastImpl extends ServiceImpl<PestControlForecastMapper, PestControlForecast> implements IPestControlForecastService {

    private final RpcService rpcService;

    /**
     * 新增数据
     *
     * @param param
     * @return
     */
    @Override
    public boolean insert(PestControlForecastInsertParam param) {
        Date date = new Date();
        LoginUser loginUser = rpcService.getLoginUser();
        //判重
        boolean flag = this.checkRepeat(param.getPestType(), loginUser.getUser().getTenantId()
                , loginUser.getUser().getIndustryCode(), loginUser.getUser().getAppVerCode(), null);
        if (!flag) {
            throw new BaseBizException("已有该类型病虫害预测，不能重复添加");
        }

        PestControlForecast forecast = new PestControlForecast();
        BeanUtils.copyProperties(param, forecast);

        forecast.setId(UUID.randomUUID().toString());
        forecast.setTenantId(loginUser.getUser().getTenantId());
        forecast.setIndustryCode(loginUser.getUser().getIndustryCode());
        forecast.setAppVerCode(loginUser.getUser().getAppVerCode());

        //获取登录人信息
        String username = loginUser.getUsername();
        forecast.setCreateBy(username);
        forecast.setCreateTime(date);
        this.save(forecast);

        this.baseMapper.insert(forecast);

        return Boolean.TRUE;
    }

    /**
     * 编辑数据
     *
     * @param param
     * @return
     */
    @Override
    public boolean edit(PestControlForecastEditParam param) {
        Date date = new Date();
        //查询修改内容
        PestControlForecast forecast = this.getById(param.getId());
        if (forecast == null) {
            throw new BaseBizException("数据不存在");
        }
        BeanUtils.copyProperties(param, forecast);
        LoginUser loginUser = rpcService.getLoginUser();
        if(ObjectUtil.isEmpty(forecast.getTenantId())){
            forecast.setId(UUID.randomUUID().toString());
            forecast.setTenantId(loginUser.getUser().getTenantId());
            forecast.setAppVerCode(loginUser.getUser().getAppVerCode());
            forecast.setIndustryCode(loginUser.getUser().getIndustryCode());
            forecast.setUpdateBy(loginUser.getUsername());
            forecast.setUpdateTime(date);
            this.baseMapper.insert(forecast);
        }else {

            forecast.setUpdateBy(loginUser.getUsername());
            forecast.setUpdateTime(date);
            this.updateById(forecast);
        }
        return Boolean.TRUE;
    }

    /**
     * 列表
     *
     * @return
     */
    @Override
    public List<PestControlForecastVo> index() {
        LoginUser loginUser = rpcService.getLoginUser();
        List<PestControlForecastVo> list = new ArrayList<>();

        //改成支持返回多个 后面要换回来
        List<PestControlForecast> forecasts = this.baseMapper.selectList(new LambdaQueryWrapper<PestControlForecast>()
                .eq(PestControlForecast::getTenantId, loginUser.getUser().getTenantId())
                .eq(PestControlForecast::getIndustryCode, loginUser.getUser().getIndustryCode())
                .eq(PestControlForecast::getAppVerCode, loginUser.getUser().getAppVerCode()));

        if (ObjectUtil.isEmpty(forecasts)) {
            forecasts = new ArrayList<PestControlForecast>();
            QueryWrapper<PestControlForecast> wrapper = new QueryWrapper<>();
            wrapper.isNull("tenant_id");
            wrapper.isNull("app_ver_code");

            List<PestControlForecast> forecastsNew = this.baseMapper.selectList(wrapper);
            forecasts = forecastsNew;
        } else if (forecasts.size() > 0 && forecasts.size() < 4){
            List<Integer> pestTypeList = new ArrayList<>();
            List<Integer> typeList = forecasts.stream().map(PestControlForecast::getPestType).collect(Collectors.toList());
            for(int i = 0 ; i<4 ; i++ ){
               if(typeList.contains(i)){
                   continue;
               }else {
                   pestTypeList.add(i);
               }
            }
            QueryWrapper<PestControlForecast> wrapper = new QueryWrapper<>();
            wrapper.isNull("tenant_id");
            wrapper.isNull("app_ver_code");
            wrapper.in("pest_type",pestTypeList);
            List<PestControlForecast> pestControlForecastList = this.baseMapper.selectList(wrapper);
            forecasts.addAll(pestControlForecastList);
        }
        //添加数据及数据转换
        for (PestControlForecast forecast : forecasts) {
            PestControlForecastVo vo = new PestControlForecastVo();
            BeanUtils.copyProperties(forecast, vo);
            list.add(vo);
        }
        return list;
    }

    @Override
    public List<PestControlForecastExportVo> getVoByPestType() {

        LoginUser loginUser = rpcService.getLoginUser();

        //改成支持返回多个 后面要换回来
        List<PestControlForecast> forecasts = this.baseMapper.selectList(new LambdaQueryWrapper<PestControlForecast>()
                .eq(PestControlForecast::getTenantId, loginUser.getUser().getTenantId())
                .eq(PestControlForecast::getIndustryCode, loginUser.getUser().getIndustryCode())
                .eq(PestControlForecast::getAppVerCode, loginUser.getUser().getAppVerCode()));
        return this.transferToExport(forecasts);
    }

    /**
     * 根据id获取单条数据
     *
     * @param id
     * @return
     */
    @Override
    public PestControlForecastVo getVoById(String id) {
        PestControlForecast forecast = this.baseMapper.selectById(id);
        PestControlForecastVo vo = new PestControlForecastVo();
        BeanUtils.copyProperties(forecast, vo);
        return vo;
    }

    /**
     * 根据id删除
     *
     * @param id
     * @return
     */
    @Override
    public boolean deleteById(String id) {
        return this.removeById(id);
    }

    /**
     * 导出
     */
    @Override
    public void export(HttpServletResponse response) {
        List<PestControlForecastExportVo> vos = this.getVoByPestType();
        try {
            ClassPathResource resource = new ClassPathResource("excel/病虫害预测导出模板.xlsx");
            InputStream inputStream = resource.getInputStream();
            // 这里注意 有同学反应使用swagger 会导致各种问题，请直接用浏览器或者用postman
            response.setContentType("application/vnd.ms-excel");
            response.setCharacterEncoding("utf-8");
            // 这里URLEncoder.encode可以防止中文乱码 当然和easyexcel没有关系
            String fileName = URLEncoder.encode("病虫害预测", "utf-8");
            response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
            EasyExcelFactory.write(response.getOutputStream()).withTemplate(inputStream).sheet().doFill(vos);
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    /**
     * 转换为 导出格式
     *
     * @param forecasts
     * @return
     */
    private List<PestControlForecastExportVo> transferToExport(List<PestControlForecast> forecasts) {
        List<PestControlForecastExportVo> vos = new ArrayList<>();
        for (PestControlForecast forecast : forecasts) {
            PestControlForecastExportVo vo = new PestControlForecastExportVo();
            BeanUtils.copyProperties(forecast, vo);
            //病虫害类型 0-东亚飞蝗 1-芦苇尖蛾 2-松墨天牛 3-稻蓟马
            if (forecast.getPestType() != null) {
                switch (forecast.getPestType()) {
                    case 0:
                        vo.setPestTypeStr("东亚飞蝗");
                        break;
                    case 1:
                        vo.setPestTypeStr("芦苇尖蛾");
                        break;
                    case 2:
                        vo.setPestTypeStr("松墨天牛");
                        break;
                    case 3:
                        vo.setPestTypeStr("稻蓟马");
                        break;
                    default:
                        break;
                }
            }

            //风险等级
            vo.setRiskLevelStr(forecast.getNormalLow() + "≤正常值<" + forecast.getNormalHigh() + "只/㎡；" +
                    forecast.getEarlyLow() + "≤预警值<" + forecast.getEarlyHigh() + "只/㎡；" +
                    forecast.getWarnLow() + "≤警戒值<" + forecast.getWarnHigh() + "只/㎡；" +
                    "风险值≥" + forecast.getRiskLow() + "只/㎡");

            vo.setRiskLevelStr("正常值:每平方米" + forecast.getNormalLow() + "≤X<" + forecast.getNormalHigh() + "只;" +
                    "预警值:每平方米" + forecast.getEarlyLow() + "≤X<" + forecast.getEarlyHigh() + "只;" +
                    "警戒值:每平方米" + forecast.getWarnLow() + "≤X<" + forecast.getWarnHigh() + "只;" +
                    "风险值:每平方米X≥" + forecast.getRiskLow() + "只;");

            //食物丰富度 0-无 1-低 2-一般 3-中等 4-高
            if (forecast.getFoodLevel() != null) {
                switch (forecast.getFoodLevel()) {
                    case 0:
                        vo.setFoodLevelStr("无");
                        break;
                    case 1:
                        vo.setFoodLevelStr("低");
                        break;
                    case 2:
                        vo.setFoodLevelStr("一般");
                        break;
                    case 3:
                        vo.setFoodLevelStr("中等");
                        break;
                    case 4:
                        vo.setFoodLevelStr("高");
                        break;
                    default:
                        break;
                }
            }
            //天敌情况 0-无 1-极少 2-少 3-中 4-多
            if (forecast.getEnemyLevel() != null) {
                switch (forecast.getEnemyLevel()) {
                    case 0:
                        vo.setEnemyLevelStr("无");
                        break;
                    case 1:
                        vo.setEnemyLevelStr("极少");
                        break;
                    case 2:
                        vo.setEnemyLevelStr("少");
                        break;
                    case 3:
                        vo.setEnemyLevelStr("中");
                        break;
                    case 4:
                        vo.setEnemyLevelStr("多");
                        break;
                    default:
                        break;
                }
            }
            vos.add(vo);
        }
        return vos;
    }


    /**
     * 判重
     *
     * @param pestType     病虫害类型
     * @param tenantId
     * @param industryCode
     * @param appVerCode
     * @param id           病虫害id-用于判断新增还是编辑
     * @return
     */
    private boolean checkRepeat(Integer pestType, String tenantId, String industryCode, String appVerCode, String id) {
        boolean flag = false;
        if (StringUtils.isEmpty(id)) {
            //新增
            Integer count = this.baseMapper.selectCount(new LambdaQueryWrapper<PestControlForecast>()
                    .eq(PestControlForecast::getPestType, pestType)
                    .eq(PestControlForecast::getTenantId, tenantId)
                    .eq(PestControlForecast::getIndustryCode, industryCode)
                    .eq(PestControlForecast::getAppVerCode, appVerCode));
            if (count <= 0) {
                flag = true;
            }
        } else {
            //编辑
            Integer count = this.baseMapper.selectCount(new LambdaQueryWrapper<PestControlForecast>()
                    .eq(PestControlForecast::getPestType, pestType)
                    .eq(PestControlForecast::getTenantId, tenantId)
                    .eq(PestControlForecast::getIndustryCode, industryCode)
                    .eq(PestControlForecast::getAppVerCode, appVerCode)
                    .ne(PestControlForecast::getId, id));
            if (count <= 0) {
                flag = true;
            }
        }
        return flag;
    }

    public static void main(String[] args) {
        // 定义时间范围及格式
        LocalDateTime startDate = LocalDateTime.of(2025, 1, 1, 0, 0, 0);
        LocalDateTime endDate = LocalDateTime.of(2025, 4, 2, 0, 0, 0); // 截止到4月1日0点前
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        // 逐小时生成时间数据
        LocalDateTime current = startDate;
        while (current.isBefore(endDate)) {
            String format = current.format(formatter);
            System.out.println(format);
            current = current.plusHours(1);

        }
    }
}
