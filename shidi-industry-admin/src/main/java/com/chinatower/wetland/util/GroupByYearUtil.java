package com.chinatower.wetland.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.*;

public class GroupByYearUtil {

    public static final String PROPERTIES = "properties";

    public static final String FEATURES = "features";

    public static void main(String[] args) {
        // 模拟 Map<String, JsonObject> 数据（这里用 fastjson 的 JSONObject 表示）
        Map<String, JSONObject> dataMap = new HashMap<>();
        String jsonStr = "{\"features\":[{\"geometry\":{\"coordinates\":[[[[132.9311244,45.351257419],[132.943353022,45.351608184],[132.943412441,45.350438959],[132.931195703,45.350079835],[132.9311244,45.351257419]]]],\"type\":\"MultiPolygon\"},\"id\":28,\"type\":\"feature\",\"properties\":{\"area\":25,\"tbbh\":529,\"year\":2023,\"type\":1,\"bsm\":\"0caed08ea0c848d3a971566ad763a618\",\"properties\":\"{\\\"area\\\":\\\"25\\\",\\\"tbbh\\\":\\\"529\\\",\\\"year\\\":\\\"2023\\\",\\\"id\\\":\\\"528\\\",\\\"type\\\":\\\"1\\\"}\"}},{\"geometry\":{\"coordinates\":[[[[132.931029328,45.352660466],[132.936365238,45.352777385],[132.936472193,45.35164159],[132.931112516,45.351541372],[132.931029328,45.352660466]]]],\"type\":\"MultiPolygon\"},\"id\":29,\"type\":\"feature\",\"properties\":{\"area\":11,\"tbbh\":530,\"year\":2023,\"type\":1,\"bsm\":\"4288d5c5816846cda416ca4ada9d5f3f\",\"properties\":\"{\\\"area\\\":\\\"11\\\",\\\"tbbh\\\":\\\"530\\\",\\\"year\\\":\\\"2023\\\",\\\"id\\\":\\\"529\\\",\\\"type\\\":\\\"1\\\"}\"}},{\"geometry\":{\"coordinates\":[[[[132.913365624,45.331552992],[132.911982328,45.332254764],[132.913693622,45.333618182],[132.915248047,45.33321718],[132.913365624,45.331552992]]]],\"type\":\"MultiPolygon\"},\"id\":108,\"type\":\"feature\",\"properties\":{\"area\":6,\"tbbh\":609,\"year\":2023,\"type\":1,\"bsm\":\"f5856a0b17db4e5eaefe809d4061540c\",\"properties\":\"{\\\"area\\\":\\\"6\\\",\\\"tbbh\\\":\\\"609\\\",\\\"year\\\":\\\"2023\\\",\\\"id\\\":\\\"608\\\",\\\"type\\\":\\\"1\\\"}\"}},{\"geometry\":{\"coordinates\":[[[[132.936745525,45.354188745],[132.943067806,45.354247203],[132.94325795,45.351791917],[132.937517984,45.351666645],[132.937755664,45.352902655],[132.936662337,45.352961114],[132.936745525,45.354188745]]]],\"type\":\"MultiPolygon\"},\"id\":30,\"type\":\"feature\",\"properties\":{\"area\":26,\"tbbh\":531,\"year\":2023,\"type\":1,\"bsm\":\"adc44503c4b04c9085efb5caf212b107\",\"properties\":\"{\\\"area\\\":\\\"26\\\",\\\"tbbh\\\":\\\"531\\\",\\\"year\\\":\\\"2023\\\",\\\"id\\\":\\\"530\\\",\\\"type\\\":\\\"1\\\"}\"}}],\"type\":\"FeatureCollection\"}";
        String js2 = "{\"features\":[{\"geometry\":{\"coordinates\":[[[[132.9311244,45.351257419],[132.943353022,45.351608184],[132.943412441,45.350438959],[132.931195703,45.350079835],[132.9311244,45.351257419]]]],\"type\":\"MultiPolygon\"},\"id\":28,\"type\":\"feature\",\"properties\":{\"area\":25,\"tbbh\":529,\"year\":2025,\"type\":1,\"bsm\":\"0caed08ea0c848d3a971566ad763a618\",\"properties\":\"{\\\"area\\\":\\\"25\\\",\\\"tbbh\\\":\\\"529\\\",\\\"year\\\":\\\"2023\\\",\\\"id\\\":\\\"528\\\",\\\"type\\\":\\\"1\\\"}\"}},{\"geometry\":{\"coordinates\":[[[[132.931029328,45.352660466],[132.936365238,45.352777385],[132.936472193,45.35164159],[132.931112516,45.351541372],[132.931029328,45.352660466]]]],\"type\":\"MultiPolygon\"},\"id\":29,\"type\":\"feature\",\"properties\":{\"area\":11,\"tbbh\":530,\"year\":2025,\"type\":1,\"bsm\":\"4288d5c5816846cda416ca4ada9d5f3f\",\"properties\":\"{\\\"area\\\":\\\"11\\\",\\\"tbbh\\\":\\\"530\\\",\\\"year\\\":\\\"2023\\\",\\\"id\\\":\\\"529\\\",\\\"type\\\":\\\"1\\\"}\"}},{\"geometry\":{\"coordinates\":[[[[132.913365624,45.331552992],[132.911982328,45.332254764],[132.913693622,45.333618182],[132.915248047,45.33321718],[132.913365624,45.331552992]]]],\"type\":\"MultiPolygon\"},\"id\":108,\"type\":\"feature\",\"properties\":{\"area\":6,\"tbbh\":609,\"year\":2024,\"type\":1,\"bsm\":\"f5856a0b17db4e5eaefe809d4061540c\",\"properties\":\"{\\\"area\\\":\\\"6\\\",\\\"tbbh\\\":\\\"609\\\",\\\"year\\\":\\\"2023\\\",\\\"id\\\":\\\"608\\\",\\\"type\\\":\\\"1\\\"}\"}},{\"geometry\":{\"coordinates\":[[[[132.936745525,45.354188745],[132.943067806,45.354247203],[132.94325795,45.351791917],[132.937517984,45.351666645],[132.937755664,45.352902655],[132.936662337,45.352961114],[132.936745525,45.354188745]]]],\"type\":\"MultiPolygon\"},\"id\":30,\"type\":\"feature\",\"properties\":{\"area\":26,\"tbbh\":531,\"year\":2024,\"type\":1,\"bsm\":\"adc44503c4b04c9085efb5caf212b107\",\"properties\":\"{\\\"area\\\":\\\"26\\\",\\\"tbbh\\\":\\\"531\\\",\\\"year\\\":\\\"2023\\\",\\\"id\\\":\\\"530\\\",\\\"type\\\":\\\"1\\\"}\"}},{\"geometry\":{\"coordinates\":[[[[132.936365238,45.354180394],[132.936365238,45.35293606],[132.9311244,45.35286925],[132.930898604,45.354188745],[132.936365238,45.354180394]]]],\"type\":\"MultiPolygon\"},\"id\":31,\"type\":\"feature\",\"properties\":{\"area\":12,\"tbbh\":532,\"year\":2024,\"type\":1,\"bsm\":\"b2de1a537a6d40738b2ec2f855b40246\",\"properties\":\"{\\\"area\\\":\\\"12\\\",\\\"tbbh\\\":\\\"532\\\",\\\"year\\\":\\\"2023\\\",\\\"id\\\":\\\"531\\\",\\\"type\\\":\\\"1\\\"}\"}}],\"type\":\"FeatureCollection\"}";
        // 假设数据以 key "data1" 存入 Map 中
        dataMap.put("data1", JSON.parseObject(jsonStr));
        dataMap.put("data2", JSON.parseObject(js2));

        Map<Integer, JSONObject> yearGeoData = transferYearGeoData(dataMap);

        JSONObject year2023 = yearGeoData.get(2023);
        JSONObject year2025 = yearGeoData.get(2025);

        try {
            LandTransferMatrixUtil.transfer(year2023, year2025);
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

    public static Map<Integer, JSONObject> transferYearGeoData(Map<String, JSONObject> dataMap){
        // 按 year 分组，year -> List<JSONObject>（每个 JSONObject 对应一个 feature）
        Map<Integer, List<JSONObject>> groupByYear = new HashMap<>();
        for (JSONObject jsonObj : dataMap.values()) {

            JSONArray features = jsonObj.getJSONArray(FEATURES);
            for (int i = 0; i < features.size(); i++) {
                JSONObject feature = features.getJSONObject(i);
                JSONObject props = feature.getJSONObject(PROPERTIES);
                // 移除嵌套的 "properties" 字段，防止解析混淆
                props.remove(PROPERTIES);
            }

            //JSONArray features = jsonObj.getJSONArray("features");
            for (int i = 0; i < features.size(); i++) {
                JSONObject feature = features.getJSONObject(i);
                JSONObject properties = feature.getJSONObject("properties");
                int year = properties.getIntValue("year");
                groupByYear.computeIfAbsent(year, k -> new ArrayList<>()).add(feature);
            }
        }

        Map<Integer, JSONObject> result = new HashMap<>();
        // 按分组构造新的 FeatureCollection 输出（保持原有数据格式）
        for (Map.Entry<Integer, List<JSONObject>> entry : groupByYear.entrySet()) {
            int year = entry.getKey();
            List<JSONObject> featureList = entry.getValue();

            JSONObject output = new JSONObject();
            output.put("type", "FeatureCollection");
            // features 数组采用分组后的 feature 集合
            output.put("features", featureList);

            result.put(year, output);
        }


        return result;
    }
}
