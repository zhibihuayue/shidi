package com.chinatower.wetland.config;

import cn.hutool.core.util.ObjectUtil;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

@Configuration
public class FeignHeaderInterceptor implements RequestInterceptor {
    @Override
    public void apply(RequestTemplate template) {
        ServletRequestAttributes attributes = (ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes();
        assert attributes != null;
        if(ObjectUtil.isNotEmpty(attributes)){
            HttpServletRequest request = attributes.getRequest();
            template.header("Authorization",request.getHeader("Authorization"));
        }

    }
}