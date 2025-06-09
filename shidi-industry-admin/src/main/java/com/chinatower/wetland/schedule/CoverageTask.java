package com.chinatower.wetland.schedule;

import com.chinatower.wetland.service.ICoverageInfoService;
import com.xxl.job.core.biz.model.ReturnT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.Scheduled;


@Configuration
@Slf4j
@RequiredArgsConstructor
public class CoverageTask {

    private final ICoverageInfoService coverageInfoService;

    /**
     * 清空 图层缓存数据
     *
     **/
    @Scheduled(cron = "0 0 0/1 * * ?")
    public void clearCoverage(){
        this.coverageInfoService.getSuitableByTenantId(true);
        this.coverageInfoService.getEcosystemByTenantId(true);
        log.info("清空 图层缓存数据");
    }

}