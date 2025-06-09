package com.chinatower.wetland.schedule;

import com.chinatower.wetland.pojo.vo.AnalysisParamVo;
import com.chinatower.wetland.service.IDeviceInfoService;
import com.chinatower.wetland.service.IWeatherAnalyseService;
import com.chinatower.wetland.service.IWetlandInfoService;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;


@Component
@Slf4j
@RequiredArgsConstructor
public class WeatherTask {

    private final IWeatherAnalyseService weatherAnalyseService;

    private final IWetlandInfoService wetlandInfoService;


    private final IDeviceInfoService deviceInfoService;

   /*
    * 拿设备测试
    */
    // @Scheduled(cron = "0 */3 * * * ?")
    public void testDevice() {
        AnalysisParamVo analysisParamVo = new AnalysisParamVo();

      //  deviceInfoService.statistics(analysisParamVo);
    }

    /**
     * 获取天气信息 每天下午2点执行
     */
    //@Scheduled(cron = "0 45 9 * * ?")
    //@Scheduled(cron = "0 0 14 * * ?")
    //@Scheduled(cron = "0 */3 * * * ?")
    //@Scheduled(cron = "0 */3 * * * ?")
    //@Scheduled(cron = "0 0 14 * * ?")
    @XxlJob(value = "getWeatherHandler")
    public ReturnT<String> getWeather(String param){
         //先取和风
        this.weatherAnalyseService.setWeatherNow();
        //气象站有天气就覆盖和风
        wetlandInfoService.queryWeather();
        log.info("获取天气信息");
        return ReturnT.SUCCESS;
    }
   // @Scheduled(cron = "0 */5 * * * ?")
   // @Scheduled(cron = "0 0 14 * * ?")
    public void getWeatherHf() {
        //监测站拿不到再取和风
        this.weatherAnalyseService.setWeatherNow();
        log.info("获取天气信息");
    }

}
