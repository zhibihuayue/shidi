package com.chinatower.wetland.config;

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.TenantLineInnerInterceptor;
import com.chinatower.wetland.handle.MyTenantLineHandler;
import com.chinatower.wetland.properties.TenantProperties;
import com.chinatower.wetland.service.RpcService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * MybatisPlus配置类
 *
 * @author
 * @Date
 */
@Configuration
public class MyBatisPlusConfig  {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor(TenantProperties tenantProperties,RpcService rpcService) {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        if (Boolean.TRUE.equals(tenantProperties.getEnable())) {
            // 启用多租户拦截
            interceptor.addInnerInterceptor(new TenantLineInnerInterceptor(new MyTenantLineHandler(tenantProperties,rpcService)));
        }
        return interceptor;
    }

}