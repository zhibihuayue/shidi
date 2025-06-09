package com.chinatower.wetland;

import com.chinatower.redis.config.TowerRedisAutoConfiguration;
import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.mongo.MongoAutoConfiguration;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableDiscoveryClient
@SpringBootApplication(scanBasePackages = {
        "com.chinatower.wetland",
        "com.chinatower.analysis.api",
        "com.chinatower.system.api.feign.client",
        "com.chinatower.platform.feign",
        "com.chinatower.forestry.emengercy.api",
        "com.chinatower.platform.data.sdk",
        "com.chinatower.gis.api",
        "com.chinatower.bdm.api",
        "com.chinatower.device.api"
}, exclude = {TowerRedisAutoConfiguration.class, MongoAutoConfiguration.class})
@EnableAspectJAutoProxy
@EnableFeignClients(basePackages = {
        "com.chinatower.analysis.api",
        "com.chinatower.system.api.feign.client",
        "com.chinatower.forestry.emengercy.api",
        "com.chinatower.wetland.feign",
        "com.chinatower.platform.data.sdk",
        "com.chinatower.gis.api",
        "com.chinatower.bdm.api",
        "com.chinatower.device.api",
        "com.chinatower.file.feign.client"
})
@MapperScan(basePackages = {"com.chinatower.wetland.mappper"})
@EnableTransactionManagement
@EnableEncryptableProperties
@EnableScheduling
@ConfigurationPropertiesScan("com.chinatower.wetland.properties")
public class ShidiIndustryAdminApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShidiIndustryAdminApplication.class, args);
    }
    /**
     * 跨域过滤器
     *
     * @return
     */
}
