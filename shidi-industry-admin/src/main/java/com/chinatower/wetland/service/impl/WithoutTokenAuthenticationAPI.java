//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.chinatower.wetland.service.impl;

import com.chinatower.common.core.utils.HMAC_SHA1;
import com.chinatower.platform.data.sdk.entity.AbstactEntity;
import com.chinatower.platform.data.sdk.entity.AbstactEntity.URL;
import com.chinatower.platform.data.sdk.entity.BasicResponse;
import okhttp3.*;
import okhttp3.Request.Builder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Component(value = "WithoutTokenAuthenticationAPICp")
public class WithoutTokenAuthenticationAPI implements InitializingBean {
    private static final Logger log = LoggerFactory.getLogger(WithoutTokenAuthenticationAPI.class);
    private String urlPrefix;
    @Value("${tower.skAuth.ak}")
    private String ak;
    @Value("${tower.skAuth.sk}")
    private String sk;
    @Value("${tower.skAuth.industryCode}")
    private String industryCode;
    @Value("${tower.skAuth.gatewayHost}")
    private String gatewayHost;
    @Value("${tower.skAuth.gatewayPort}")
    private String gatewayPort;
    private static final Map<String, String> MAP = new HashMap();
    private static final OkHttpClient httpClient;

    public <RES> BasicResponse<RES> requestForPost(AbstactEntity entity, Function<String, BasicResponse<RES>> convert) {
        try {
            String e = this.urlPrefix + (String) MAP.get(entity.getBindMapping().getName());
            RequestBody requestBody = RequestBody.create(MediaType.parse("application/json;charset=UTF-8"), entity.getRequestBody());
            Request request = (new Builder()).post(requestBody).url(e).addHeader("X-AK", this.ak).addHeader("X-SIGNATURE", HMAC_SHA1.signByHmacSHA1(this.ak, this.sk)).addHeader("X-INDUSTRY_CODE", this.industryCode).build();
            log.info("调用 executeScript 入参 header = {} , body = {} , url = {} ", new Object[]{request.headers(), entity.getRequestBody(), e});
            Call call = httpClient.newCall(request);
            Response response = call.execute();
            if (response.body() == null) {
                log.error("调用 executeScript 出参 为空 ");
                BasicResponse.createWithError("102", new String[]{"无响应数据"});
            }

            String content = new String(response.body().bytes());
            log.error("调用 executeScript 出参 {} ", content);
            return (BasicResponse) convert.apply(content);
        } catch (Exception var9) {
            log.error("executeScript 调用错误", var9);
            return BasicResponse.createWithError("103", new String[]{"系统错误"});
        }
    }

    public void afterPropertiesSet() throws Exception {
        this.urlPrefix = "http://" + this.gatewayHost + ":" + this.gatewayPort;
    }

    static {
        URL[] var0 = URL.values();
        int var1 = var0.length;

        for (int var2 = 0; var2 < var1; ++var2) {
            URL value = var0[var2];
            MAP.put(value.getName(), value.getUrl());
        }

        httpClient = (new OkHttpClient.Builder()).connectTimeout(3L, TimeUnit.SECONDS).readTimeout(3L, TimeUnit.SECONDS).callTimeout(3L, TimeUnit.SECONDS).build();
    }
}
