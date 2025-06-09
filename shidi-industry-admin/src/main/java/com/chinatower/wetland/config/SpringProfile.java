package com.chinatower.wetland.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
@Component
@Slf4j
public class SpringProfile {
    //@Value("${spring.datasource.url}")
    public String connect;
    @PostConstruct
    public void readSpringProfile(){
        log.info("数据库链接信息-"+ connect);
    }
}
