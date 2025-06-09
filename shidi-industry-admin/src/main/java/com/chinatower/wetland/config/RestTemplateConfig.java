package com.chinatower.wetland.config;

import lombok.extern.slf4j.Slf4j;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.config.Registry;
import org.apache.http.config.RegistryBuilder;
import org.apache.http.conn.socket.ConnectionSocketFactory;
import org.apache.http.conn.socket.PlainConnectionSocketFactory;
import org.apache.http.conn.ssl.SSLConnectionSocketFactory;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.conn.PoolingHttpClientConnectionManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
@Slf4j
public class RestTemplateConfig {


    @Bean
    public RestTemplate restTemplateCommon(){

        int defaultMaxPerRoute = 200;
        Registry<ConnectionSocketFactory> registry = RegistryBuilder.<ConnectionSocketFactory>create()
                .register("http", PlainConnectionSocketFactory.getSocketFactory())
                .register("https", SSLConnectionSocketFactory.getSocketFactory())
                .build();
        PoolingHttpClientConnectionManager connectionManager = new PoolingHttpClientConnectionManager(registry);
        //设置整个连接池最大连接数
        connectionManager.setMaxTotal(2 * defaultMaxPerRoute);
        //路由是对maxTotal的细分
        connectionManager.setDefaultMaxPerRoute(defaultMaxPerRoute);
        RequestConfig requestConfig = RequestConfig.custom()
                //服务器返回数据(response)的时间，超过该时间抛出read timeout
                .setSocketTimeout(20000)
                //连接上服务器(握手成功)的时间，超出该时间抛出connect timeout
                .setConnectTimeout(10000)
                //从连接池中获取连接的超时时间，超过该时间未拿到可用连接，会抛出org.apache.http.conn.ConnectionPoolTimeoutException: Timeout waiting for connection from pool
                .setConnectionRequestTimeout(1000)
                .build();
        CloseableHttpClient build = HttpClientBuilder.create()
                .setDefaultRequestConfig(requestConfig)
                // 如果不配置connectionManager，则默认使用System.getProperty获取配置参数
                .setConnectionManager(connectionManager)
                .build();
        RestTemplate restTemplate = new RestTemplate(new HttpComponentsClientHttpRequestFactory(build));
        log.info("初始化 RestTemplate，bean name :{}","restTemplate");
        return restTemplate;
    }
}
