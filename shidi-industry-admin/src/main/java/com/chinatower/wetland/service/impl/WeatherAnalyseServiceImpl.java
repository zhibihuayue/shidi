package com.chinatower.wetland.service.impl;


import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.URLUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.Method;
import com.alibaba.excel.util.DateUtils;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.wetland.exception.BaseBizException;
import com.chinatower.wetland.mappper.WeatherAnalyseMapper;
import com.chinatower.wetland.pojo.entity.WeatherAnalyse;
import com.chinatower.wetland.pojo.entity.WetlandInfo;
import com.chinatower.wetland.pojo.param.TimeListParam;
import com.chinatower.wetland.pojo.param.WeatherAnalyseSelectParam;
import com.chinatower.wetland.pojo.vo.WeatherStatisticsVo;
import com.chinatower.wetland.pojo.vo.WeatherTimeVo;
import com.chinatower.wetland.service.IWeatherAnalyseService;
import com.chinatower.wetland.service.IWetlandInfoService;
import com.chinatower.wetland.service.RpcService;
import com.chinatower.wetland.util.RemindDateUtils;
import com.chinatower.wetland.util.SignUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @Description : 气候统计分析
 * @Author : zyx
 * @Date: 2024-09-24
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class WeatherAnalyseServiceImpl extends ServiceImpl<WeatherAnalyseMapper, WeatherAnalyse> implements IWeatherAnalyseService {

    private final RpcService rpcService;

    private final IWetlandInfoService wetlandInfoService;

    @Value("${weather.tenantId}")
    private String tenantId;
    //和风天气用到的
    @Value("${weather.sk}")
    private String sk;

    @Value("${weather.path}")
    private String path;

    @Autowired
    private WeatherAnalyseMapper weatherAnalyseMapper;

    static final String YEAR_MONTH = "yyyy-MM";

    static final String END_TIME = " 23:59:59";

    @Override
    public WeatherStatisticsVo statistics(WeatherAnalyseSelectParam param) {
        this.getParam(param);

        //获取本月开始结束时间
        Date[] months = RemindDateUtils.getTimeByParam("month");
        //平均气温 平均降水
        WeatherStatisticsVo result = this.baseMapper.statisticsMonth(param.getIndustryCode(),
                param.getTenantId(), param.getAppVerCode(), months[0], months[1]);
        //获取本年开始结束时间
        Date[] year = RemindDateUtils.getTimeByParam("year");
        WeatherStatisticsVo yearStatistics = this.baseMapper.statisticsMonth(param.getIndustryCode(),
                param.getTenantId(), param.getAppVerCode(), year[0], year[1]);
        result.setTemperatureYear(yearStatistics.getTemperatureMonth());
        result.setPrecipitationYear(yearStatistics.getPrecipitationMonth());


        //获取当天
        Date[] day = RemindDateUtils.getTimeByParam("day");
        WeatherStatisticsVo dayStatistics = this.baseMapper.statisticsMonth(param.getIndustryCode(),
                param.getTenantId(), param.getAppVerCode(), day[0], day[1]);
        result.setTemperatureDay(dayStatistics.getTemperatureMonth());
        result.setPrecipitationDay(dayStatistics.getPrecipitationMonth());

        //开始结束 时间处理
        this.setStartAndEndTime(param);
        //获取 气候折线图统计
        List<WeatherTimeVo> statisticsTimeList = this.baseMapper.statisticsTimeList(param);
        //根据 横坐标处理数据
        statisticsTimeList = this.getAbscissaWeatherAnalyse(param, statisticsTimeList);

        result.setTemperatureList(statisticsTimeList);
        result.setPrecipitationList(statisticsTimeList);

        return result;
    }

    private List<WeatherTimeVo> getAbscissaWeatherAnalyse(WeatherAnalyseSelectParam param, List<WeatherTimeVo> statisticsTimeList) {
        List<String> abscissa = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        DateTimeFormatter formatterYearMonthDay = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate today = LocalDate.now();
        //显示横坐标
        if (Objects.equals(1, param.getTimeType())) {
            //年
            int currentYear = today.getYear();
            int month = 12;
            //比对 是否为 当年的 数据
            if (Objects.equals(param.getYear(), currentYear)) {
                //若 为本年 则 最大值为 当月
                month = today.getMonthValue();
            }
            //年 添加 所有月份
            for (int i = 1; i <= month; i++) {
                abscissa.add(i < 10 ? "0" + i : String.valueOf(i));
            }
        } else {
            // 获取开始 结束 之间的日期
            LocalDate startLocalDate = LocalDate.parse(param.getStartTime(), formatter);
            LocalDate endLocalDate = LocalDate.parse(param.getEndTime(), formatter);
            //如果 为 月 则 结束时间 不能大于 今日
            if (Objects.equals(0, param.getTimeType()) && endLocalDate.isAfter(today)) {
                endLocalDate = today;
            }
            //获取开始日期和结束日期之间的每日日期（包括开始和结束日期）
            for (LocalDate date = startLocalDate; !date.isAfter(endLocalDate); date = date.plusDays(1)) {
                abscissa.add(date.format(formatterYearMonthDay));
            }
        }

        //保存 以最新 横坐标 装填数据
        if (Objects.equals(1, param.getTimeType())) {
            //年份 按照月份来判断
            for (String time : abscissa) {
                List<WeatherTimeVo> collect = statisticsTimeList.stream().filter(x -> Objects.equals(x.getTimes(), time)).collect(Collectors.toList());
                if (collect.isEmpty()) {
                    WeatherTimeVo vo = new WeatherTimeVo();
                    vo.setTimes(time);
                    vo.setDayDateTime(time);
                    vo.setTemperature(0.0);
                    vo.setPrecipitation(0.0);
                    statisticsTimeList.add(vo);
                }
            }
            statisticsTimeList = statisticsTimeList.stream().sorted(Comparator.comparing(WeatherTimeVo::getTimes)).collect(Collectors.toList());
        } else {
            //月 及 自定义 按照具体日期来判断
            for (String time : abscissa) {
                List<WeatherTimeVo> collect = statisticsTimeList.stream().filter(x -> Objects.equals(x.getDayDateTime(), time)).collect(Collectors.toList());
                if (collect.isEmpty()) {
                    WeatherTimeVo vo = new WeatherTimeVo();
                    vo.setTimes(time);
                    vo.setDayDateTime(time);
                    vo.setTemperature(0.0);
                    vo.setPrecipitation(0.0);
                    statisticsTimeList.add(vo);
                }
            }
            statisticsTimeList = statisticsTimeList.stream().sorted(Comparator.comparing(WeatherTimeVo::getDayDateTime)).collect(Collectors.toList());
        }
        return statisticsTimeList;
    }


    /**
     * 设置开始结束时间
     *
     * @param param
     */
    private void setStartAndEndTime(WeatherAnalyseSelectParam param) {
        if (Objects.equals(0, param.getTimeType())) {
            param.setStartTime(param.getStartTime() + "-01 00:00:00");
            //判断 本月最后一天时间
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(YEAR_MONTH);
            // 将字符串解析为YearMonth对象
            YearMonth yearMonth = YearMonth.parse(param.getEndTime(), formatter);
            // 获取该月份的最后一天
            LocalDate lastDayOfMonth = yearMonth.atDay(yearMonth.lengthOfMonth());
            param.setEndTime(lastDayOfMonth + END_TIME);
        } else if (Objects.equals(1, param.getTimeType())) {
            param.setYear(Integer.valueOf(param.getStartTime()));
            param.setStartTime(param.getStartTime() + "-01-01 00:00:00");
            param.setEndTime(param.getEndTime() + "-12-31 23:59:59");
        } else {
            param.setStartTime(param.getStartTime() + " 00:00:00");
            param.setEndTime(param.getEndTime() + END_TIME);
        }
    }

    private void getParam(WeatherAnalyseSelectParam param) {
        //获取用户信息
        LoginUser loginUser = rpcService.getLoginUser();
        //行业编码 租户id 行业版本
        param.setIndustryCode(loginUser.getUser().getIndustryCode());
        param.setTenantId(loginUser.getUser().getTenantId());
        param.setAppVerCode(loginUser.getUser().getAppVerCode());
    }


    @Override
    public Boolean setWeatherNow() {
        //查询 所有 湿地信息
        List<WetlandInfo> wetlandInfoList = this.wetlandInfoService.listForOur();
        for (WetlandInfo wetlandInfo : wetlandInfoList) {
            //通过HTTP请求方式 获取 和风天气数据
            String location = this.getLocation(wetlandInfo);
            if (StringUtils.isEmpty(location)) {
                continue;
            }
            //预定的 tenantId 及 sk
            /*String tenantId = "video20230824";
            String sk = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBALL34DxOIwXY82VRyrTWVyFMRzpuvor6msZYudUZI2lWtGcXgBeL5aGc+tRXpcLqwngEMK5LbdD1a6Z0YbPs132Zg3D8lS5rI+ffJeVziWgXENVxIpEnGxxcfwhnrsDg+IMX9PiF4rd2kYenV9Imwvcvw2CZmGDTRrathMMDYaHtAgMBAAECgYAajTHkYIdLp8s8fez/9UjJ9OIgZiu4vMNXp/QyDF+3khiDrvXfCG9SEdMYy8QY7fFaEu0R/rjVJoQJFv0jz4CMr0AGCbHzjkGzV/+sTd5GMgiu5hnNQ68r0Wg4cG1YIUs+lbzaIKd5Uzjmr+R4T2rktK/RaCbqojq5xSIx0+AplQJBANvB24uToYFcneBZ0lrfWGlgqLcWAA8n/VKzH23b6it/C+8Dj4FIr+R/EWuPhCOiINYz32O0bPG5PdUctPvhOmsCQQDQe+imRUNKerUjIZWR+X7A9uWkrXSlJHL8vHVzu+ri/O5TsLj+PY/A/CnOEGOa8BJ4gpMWwrsO/NGa7a1Yn1sHAkAwqwQmKzHPZmWIdBwECAaaf8+djH/C24ZctFK3j8aSj3ZjHpS/ewuJPSLsgUIwag1/oslMWX7vIakx80OZrM21AkEAjLJSe4NaujS9cYwEqJK7m/YDXHNCuQA0KaP1j7lN9wnCvPASqGFbVl3WyJ3+2l0R2gokwcOBAchUnD2yMpC4mQJBAIxmWI+Tjn6nxUwxgEaP5TIfLxo03Wnxd/R+t88JZBx5EtB8OiFEEpKFHN+THO/aQeB8KnAA26qmbmeMn9D2OUY=";*/
            JSONObject weather = this.getWeather(tenantId, sk, location);

            if (weather != null) {
                this.insertWeather(weather, wetlandInfo);
            }
        }
        return true;
    }

    private void insertWeather(JSONObject weather, WetlandInfo wetlandInfo) {
        Date[] days = RemindDateUtils.getTimeByParam("day");
        Date date = new Date();

        BigDecimal temperature = new BigDecimal(weather.get("temp").toString());
        BigDecimal precipitation = new BigDecimal(weather.get("precip").toString());
        //查询的 当前租户下 今日有无创建
        WeatherAnalyse one = this.weatherAnalyseMapper.getOneWeather(wetlandInfo, days[0], days[1]);
        if (Objects.isNull(one)) {
            one = new WeatherAnalyse();
            one.setId(UUID.randomUUID().toString().replace("-", "").substring(0, 16));
            one.setTenantId(wetlandInfo.getTenantId());
            one.setIndustryCode(wetlandInfo.getIndustryCode());
            one.setAppVerCode(wetlandInfo.getAppVerCode());
            one.setTemperature(temperature);
            one.setPrecipitation(precipitation);
            one.setTemperatureFrom(1);
            one.setPrecipitationFrom(1);
            one.setCreateTime(date);
            one.setUpdateTime(date);
            this.baseMapper.saveWeatherHf(one);
        } else {
            //气象站没有降雨量，这里给降雨量
            if (ObjectUtil.isEmpty(one.getTemperature()) || ObjectUtil.isEmpty(one.getPrecipitation())) {
                if (ObjectUtil.isEmpty(one.getTemperature())) {
                    one.setTemperature(temperature);
                    one.setTemperatureFrom(1);
                }
                if (ObjectUtil.isEmpty(one.getPrecipitation())) {
                    one.setPrecipitation(precipitation);
                    one.setPrecipitationFrom(1);
                }
                one.setUpdateTime(date);
                this.baseMapper.updatePrecipitation(one);
            }

        }
    }

    private String getLocation(WetlandInfo wetlandInfo) {
        String location = "";
        //处理经纬度数据
        if (StringUtils.isNotEmpty(wetlandInfo.getLatitudeLongitude())) {
            String[] split = wetlandInfo.getLatitudeLongitude().split(",");
            if (split.length >= 2) {
                // 创建DecimalFormat来格式化数字
                DecimalFormat df = new DecimalFormat("#.00"); // 注意这里是".00"，表示保留两位小数
                // 格式化经度和纬度
                String formattedLat = df.format(new BigDecimal(split[0]));
                String formattedLon = df.format(new BigDecimal(split[1]));
                // 拼接结果
                location = formattedLat + "," + formattedLon;
            }
        }
        return location;
    }


    private JSONObject getWeather(String tenantId, String sk, String location) {
        // MOCK一个参数
        Map<String, Object> query = new HashMap<>();
        query.put("tenantId", tenantId);
        query.put("timestamp", System.currentTimeMillis());
        query.put("location", location);
        query.put("lang", "zh");
        query.put("unit", "m");
        // 待签名字段(将map按照 ASCII 码从小到大排序后生成，比如 "a=1&b=2&c=3")
        String signContent = SignUtils.getSignContent2(query);
        // 连接sk
        String localTemp = signContent + "&key=" + sk;

        JSONObject data = null;
        try {
            String sign = SignUtils.sign(localTemp, sk);
            // 使用签名，正常发起请求 hutool使用5.6.6无需转义；若后续使用5.8或其他版本则需要转义
            //query.put("sign", URLUtil.encodeAll(sign));
            query.put("sign", sign);
            //String url1 = "https://comp.tower0788.cn:8092/weather/weatherComp/cityWeather/now";
            String result = "";
            result = HttpRequest.get(path)
                    .method(Method.GET)
                    .form(query)
                    .timeout(10000)
                    .execute()
                    .body();
            JSONObject jsonObject = JSON.parseObject(result);
            if (Objects.equals(jsonObject.get("code"), 200) && ObjectUtil.isNotEmpty(jsonObject.get("data"))) {
                data = jsonObject.getJSONObject("data");
            } else {
                throw new BaseBizException("定时器报错-未获取到天气信息");
            }
            //System.err.println("Query: " + SignUtils.getSignContent2(query));
        } catch (Exception e) {
            log.info("异常：" + e.getMessage());
        }
        return data;
    }
}
