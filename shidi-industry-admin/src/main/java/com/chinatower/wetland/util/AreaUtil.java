package com.chinatower.wetland.util;

import java.math.BigDecimal;
import java.text.DecimalFormat;

import java.util.Properties;

import com.alibaba.nacos.api.exception.NacosException;
import com.alibaba.nacos.api.naming.NamingFactory;
import com.alibaba.nacos.api.naming.NamingService;


/**
 * 功能描述: 面积转化工具类
 *
 * @author wangman
 * @date 2024-06-17
 */
public class AreaUtil {

    private AreaUtil(){}

    private static final String HECTARE = "公顷";
    private static final String SQUARE_KM = "km²";

    // 1公顷  = 15亩
    private static final BigDecimal HECTARE_TO_MU = new BigDecimal("15");

    // 1 km2 = 100公顷
    private static final BigDecimal SQUARE_KM_TO_HECTARE = new BigDecimal("100");

    // 1 km2 = 1500亩
    private static final BigDecimal SQUARE_KM_TO_MU = new BigDecimal("1500");


    /**
     * 公顷转亩
     *
     * @param hectare 公顷数
     * @return 多少亩
     */
    public static BigDecimal convertHectareToMu(BigDecimal hectare) {
        return hectare.multiply(HECTARE_TO_MU);
    }

    /**
     * km转公顷
     *
     * @param squareKm km数
     * @return 多少公顷
     */
    public static BigDecimal convertSquareKmToHectare(BigDecimal squareKm) {
        return squareKm.multiply(SQUARE_KM_TO_HECTARE);
    }

    /**
     * km转亩
     *
     * @param squareKm km数
     * @return 多少亩
     */
    public static BigDecimal convertSquareKmToMu(BigDecimal squareKm) {
        return squareKm.multiply(SQUARE_KM_TO_MU);
    }

    /**
     * 转为某亩
     *
     * @param data 数据量
     * @param unit 单位
     * @return
     */
    public static BigDecimal convertToMu(BigDecimal data, String unit) {
        switch (unit) {
            case SQUARE_KM:
                return convertSquareKmToMu(data);
            case HECTARE:
                return convertHectareToMu(data);
            default:
                return data;
        }
    }

    public static String showDataNum(BigDecimal data) {
        // 设置格式化小数部分的格式，最多保留4位小数
        DecimalFormat df = new DecimalFormat("#.####");

        // 判断整数部分长度是否超过4位
        int integerPartLength = data.precision() - data.scale();

        String result;
        if (integerPartLength > 4) {
            // 超过4位整数部分，转换成万单位
            BigDecimal areaInTenThousand = data.divide(BigDecimal.valueOf(10000));
            // 格式化成字符串并返回
            result = df.format(areaInTenThousand) + "万";
        } else {
            // 不超过4位整数部分，直接格式化小数部分并返回
            result = df.format(data);
        }

        return handleShowNum(result, 4);
    }

    public static String showDataNumForTwo(BigDecimal data) {
        // 设置格式化小数部分的格式，最多保留2位小数
        DecimalFormat df = new DecimalFormat("#.##");

        // 判断整数部分长度是否超过4位
        int integerPartLength = data.precision() - data.scale();

        String result;
        if (integerPartLength > 4) {
            // 超过4位整数部分，转换成万单位
            BigDecimal areaInTenThousand = data.divide(BigDecimal.valueOf(10000));
            // 格式化成字符串并返回
            result = df.format(areaInTenThousand) + "万";
        } else {
            // 不超过4位整数部分，直接格式化小数部分并返回
            result = df.format(data);
        }

        return result;
    }

    /**
     * 获取保留几位数据并保留单位
     *
     * @param data 数据
     * @param num  展示几位数字
     * @return 处理后的数据
     */
    public static String handleShowNum(String data, int num) {
        if (data.replace(".", "").length() > num + 1 && data.contains("万")) {
            return getShowNum(data,num) + "万";
        }
        if (data.replace(".", "").length() < num + 1 && data.contains("万")) {
            return getShowNumFillZero(data) + "万";
        }
        if (data.replace(".", "").length() > num && !data.contains("万")) {
            return getShowNum(data,num);
        }
        return data;
    }

    /**
     * 小数位补零
     * @param data 数据
     * @return
     */
    private static String getShowNumFillZero(String data) {
        if (data.contains(".") && data.substring(data.lastIndexOf(".")).length() < 4) {
            return data.substring(0,data.length() - 1) + "0";
        }
        return data.substring(0,data.length() - 1);
    }

    /**
     * 获取保留几位数据
     * @param data 数据
     * @param num 展示几位数字
     * @return 处理后的数据
     */
    public static String getShowNum(String data, int num) {
        String result = data;
        if (data.contains(".") && !result.endsWith(".")) {
            result = data.substring(0, num + 1);
            if (result.endsWith(".")) {
                result = data.substring(0, num);
            }
        } else {
            result = data.substring(0, num);
        }
        return result;
    }

    public static void main(String[] args) throws NacosException, InterruptedException {
        Properties properties = new Properties();
        properties.setProperty("serverAddr", "127.0.0.1:8848");
        properties.setProperty("namespace", "019598da-f226-4b04-9d8f-236b6a9c44c9");

        NamingService naming = NamingFactory.createNamingService(properties);

        //naming.registerInstance("zuul", "10.43.86.213", 80, "DEFAULT");
        naming.registerInstance("zuul", "10.43.86.129", 8181,"DEFAULT");
        naming.subscribe("zuul", event -> {});



        Thread.sleep(200000000);
    }
}
