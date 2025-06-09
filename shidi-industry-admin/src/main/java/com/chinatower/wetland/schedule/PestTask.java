package com.chinatower.wetland.schedule;

import com.chinatower.wetland.pojo.entity.PestLightRecord;
import com.chinatower.wetland.service.ICoverageInfoService;
import com.chinatower.wetland.service.IPestLightRecordService;
import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;


@Configuration
@Slf4j
@RequiredArgsConstructor
public class PestTask {

    @Autowired
    private IPestLightRecordService service;

    //@Scheduled(cron = "0 0 23 * * ?")
    //@Scheduled(cron = "0 40 19 * * ?")
    //@Scheduled(cron = "0 */3 * * * ?")
    //@Scheduled(cron = "0 30 0 * * ?")
    @XxlJob(value = "getPestLightHandler")
    public ReturnT<String> getPestLight(String param) {
        service.pestLightDeviceAll();
        return ReturnT.SUCCESS;
    }

    //@Scheduled(cron = "0 40 19 * * ?")
    //@Scheduled(cron = "0 */3 * * * ?")
    //@Scheduled(cron = "0 30 0 * * ?")
    @XxlJob(value = "getPestLightRecordHandler")
    public ReturnT<String> getPestLightRecord(String param){
        service.getPestLightRecord();
        return ReturnT.SUCCESS;
    }


    @XxlJob(value = "getPestLightRecordThreeMonth")
    public ReturnT<String> getPestLightRecordThreeMonth(String param) {
        service.getPestLightRecordThreeMonth();
        return ReturnT.SUCCESS;
    }




}
