package com.chinatower.wetland.util;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.geotools.data.simple.SimpleFeatureCollection;
import org.geotools.data.simple.SimpleFeatureIterator;
import org.geotools.geojson.feature.FeatureJSON;
import org.geotools.geojson.geom.GeometryJSON;
import org.geotools.geometry.jts.JTS;
import org.geotools.referencing.CRS;
import org.geotools.util.factory.Hints;
import org.locationtech.jts.geom.Geometry;
import org.opengis.feature.simple.SimpleFeature;
import org.opengis.referencing.crs.CoordinateReferenceSystem;
import org.opengis.referencing.operation.MathTransform;

import java.io.StringReader;
import java.math.BigDecimal;
import java.util.*;

/**
 * <p>图层矩阵处理</p>
 *
 * @author zyx
 */
@Slf4j
public class LandTransferMatrixUtil {

    public static final String PROPERTIES = "properties";

    public static final String FEATURES = "features";

    static {
        // 强制使用 HSQL 作为 EPSG 数据库
        System.setProperty("org.geotools.epsg.factory", "hsql");
        // 确保坐标顺序为经度、纬度（适用于 WGS84）
        Hints.putSystemDefault(Hints.FORCE_LONGITUDE_FIRST_AXIS_ORDER, Boolean.TRUE);
    }

    public static Map<Integer, Map<Integer, BigDecimal>> transfer(JSONObject prevJson, JSONObject nextJson) throws Exception {
        //配置 GeometryJSON 支持 MultiPolygon
        GeometryJSON geometryJson = new GeometryJSON(15);
        FeatureJSON featureJson = new FeatureJSON(geometryJson);

        //加载前一年的数据
        SimpleFeatureCollection prevYearFeatures = (SimpleFeatureCollection)
                featureJson.readFeatureCollection(new StringReader(prevJson.toJSONString()));
        //加载后一年的数据
        SimpleFeatureCollection nextYearFeatures = (SimpleFeatureCollection)
                featureJson.readFeatureCollection(new StringReader(nextJson.toJSONString()));

        // 定义坐标系转换（WGS84 → UTM）
        CoordinateReferenceSystem sourceCrs = CRS.decode("EPSG:4326");
        //CoordinateReferenceSystem targetCrs = CRS.decode("EPSG:32650");
        CoordinateReferenceSystem targetCrs = CRS.decode("EPSG:3857");
        MathTransform transform = CRS.findMathTransform(sourceCrs, targetCrs);

        //平方米 -> 公顷
        BigDecimal num10000 = new BigDecimal(10000);

        //构建转移矩阵  (定义vo
        Map<Integer, Map<Integer, BigDecimal>> transferMatrix = new HashMap<>();

        //遍历前一年的地块
        try (SimpleFeatureIterator prevIt = prevYearFeatures.features()) {
            while (prevIt.hasNext()) {
                SimpleFeature prevFeature = prevIt.next();
                //前一年的属性
                Integer prevType = Integer.valueOf(prevFeature.getAttribute("type").toString());
                Geometry prevGeometry = (Geometry) prevFeature.getDefaultGeometry();

                // 执行转换 经纬度->平方米
                prevGeometry = JTS.transform(prevGeometry, transform);

                //遍历后一年的地块
                try (SimpleFeatureIterator nextIt = nextYearFeatures.features()) {
                    while (nextIt.hasNext()) {
                        SimpleFeature nextFeature = nextIt.next();
                        //后一年的属性
                        Integer nextType = Integer.valueOf(nextFeature.getAttribute("type").toString());
                        Geometry nextGeometry = (Geometry) nextFeature.getDefaultGeometry();

                        // 执行转换 经纬度->平方米
                        nextGeometry = JTS.transform(nextGeometry, transform);

                        //前后的板块面积相交判断
                        if (prevGeometry.intersects(nextGeometry)) {
                            //前后板块相交计算
                            Geometry intersection = prevGeometry.intersection(nextGeometry);
                            if (!intersection.isEmpty()) {
                                //获取相交板块面积 平方米 -> 公顷
                                BigDecimal area = BigDecimal.valueOf(intersection.getArea()).divide(num10000);

                                //更新矩阵
                                transferMatrix.computeIfAbsent(prevType, k -> new HashMap<>())
                                        .merge(nextType, area, BigDecimal::add);
                            }
                        }else {
                            transferMatrix.computeIfAbsent(prevType, k -> new HashMap<>())
                                    .merge(nextType, new BigDecimal(0), BigDecimal::add);
                        }
                    }
                }
            }
        }

        // 输出结果
        System.out.println("土地类型转移矩阵（单位：公顷）:");
        transferMatrix.forEach((prevType, subMap) -> {
            System.out.printf("从类型 %d 转移到：\n", prevType);
            subMap.forEach((nextType, area) ->
                    System.out.printf("  -> 类型 %d : %.2f\n", nextType, area));
        });
        System.out.println(transferMatrix.toString());
        return transferMatrix;
    }


}