package com.chinatower.wetland.util;

import com.chinatower.platform.common.utils.DateUtils;
import com.chinatower.platform.data.sdk.WithoutTokenAuthenticationAPI;
import com.chinatower.platform.data.sdk.entity.AbstactEntity;
import com.chinatower.platform.data.sdk.entity.BasicResponse;

import java.util.function.Function;

/**
 * Created by zhang on 2024/9/26.
 */
public class MongoQueryUtil {

    //查询天气信息
    public String queryWeather(){
        WithoutTokenAuthenticationAPI withoutTokenAuthenticationAPI=new WithoutTokenAuthenticationAPI();
        String deviceCode="simulator-0100-001";
        AbstactEntity abstactEntity=new AbstactEntity() {
            @Override
            public URL getBindMapping() {
                URL  url=URL.MONGODB_EXECUTE_SCRIPT;
                return url ;
            }

            @Override
            public String getRequestBody() {
                // 获取当前系统时间，并格式化为YYYY-MM格式

                String currentMonth = DateUtils.getMonth();
                String find = "vm_iot_device_t_" + currentMonth.replace( "-", "");
                String scriptEL = "    {\n" +
                        "        \"find\": \"vm_iot_device_t\",\n" +
                        "        \"filter\": {\n" +
                        "            \"deviceCode\": \"1111\" \n" +
                        "        },\n" +
                        "        \"sort\": {\"updateTime\": -1},\n" +
                        "        \"limit\": 1\n" +
                        "    };";

                return scriptEL;
            }
        };
        Function<String, BasicResponse<String>> convert=new Function<String, BasicResponse<String>>() {
            @Override
            public BasicResponse<String> apply(String s) {
                BasicResponse basicResponse=   new BasicResponse<>();
                basicResponse.setResponseBody(s);
                return  new BasicResponse<>();
            }
        };
        BasicResponse basicResponse=withoutTokenAuthenticationAPI.requestForPost(abstactEntity,convert);
        System.out.print(basicResponse.getResponseBody());
        return (String) basicResponse.getResponseBody();
    }

}
