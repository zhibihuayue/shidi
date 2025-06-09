package com.chinatower.wetland.util;

import com.chinatower.wetland.pojo.vo.CoverageDynamicIndexVo;
import com.chinatower.wetland.pojo.vo.PropertiesVo;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

/**
 * @author admin
 */
public class EcosystemCalculatorUtil {
    public static CoverageDynamicIndexVo calculate(List<PropertiesVo> data, String startYear, String endYear) {
        // 按年份分组数据
        Map<Integer, BigDecimal> startData = getYearData(data, startYear);
        Map<Integer, BigDecimal> endData = getYearData(data, endYear);

        // 计算原有湿地面积（图层类型 （1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地））
        BigDecimal originalWetland = calculateOriginalWetlandArea(startData);

        // 计算时间间隔
        int t = Integer.parseInt(endYear) - Integer.parseInt(startYear);
        if (t <= 0) {
            throw new IllegalArgumentException("时间间隔必须大于0");
        }

        //面积变化绝对值之和
        BigDecimal sumNonWetlandChanges = calculateSumNonWetlandAbsoluteChanges(startData, endData);

        // 计算综合动态度
        BigDecimal dynamicDegree = originalWetland.compareTo(BigDecimal.ZERO) == 0
                || sumNonWetlandChanges.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : sumNonWetlandChanges.divide(originalWetland, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100.0 / t));

        // 计算转入转出面积
        BigDecimal transferIn = calculateTransferInArea(startData, endData);
        BigDecimal transferOut = calculateTransferOutArea(startData, endData);

        // 计算指数
        BigDecimal transferInIndex = safeDivide(originalWetland, transferIn);
        BigDecimal transferOutIndex = safeDivide(originalWetland, transferOut);

        //定义为vo
        CoverageDynamicIndexVo result = new CoverageDynamicIndexVo();
        result.setDynamic(dynamicDegree);
        result.setTransferInIndex(transferInIndex);
        result.setTransferOutIndex(transferOutIndex);
        return result;
    }

    /**
     * 按年份和类型聚合数据
     * @param data
     * @param year
     * @return
     */
    private static Map<Integer, BigDecimal> getYearData(List<PropertiesVo> data, String year) {
        return data.stream()
                .filter(vo -> vo.getYear().equals(year))
                .collect(Collectors.toMap(
                        PropertiesVo::getType,
                        PropertiesVo::getArea,
                        BigDecimal::add
                ));
    }

    /**
     * 计算原有湿地面积（类型1-3）
     * @param startData
     * @return
     */
    //
    private static BigDecimal calculateOriginalWetlandArea(Map<Integer, BigDecimal> startData) {
        //图层类型 生态构成-（1-河流湿地 2-湖泊湿地 3-沼泽湿地 4-农业用地 5-养殖场类 6-城市用地 7-景观用地）
        return IntStream.rangeClosed(1, 3)
                .mapToObj(type -> startData.getOrDefault(type, BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * 计算所有景观面积变化-绝对值之和
     * @param start
     * @param end
     * @return
     */
    private static BigDecimal calculateSumNonWetlandAbsoluteChanges(
            Map<Integer, BigDecimal> start, Map<Integer, BigDecimal> end) {
        return IntStream.rangeClosed(1, 7)
                .mapToObj(type ->
                        end.getOrDefault(type, BigDecimal.ZERO)
                                .subtract(start.getOrDefault(type, BigDecimal.ZERO))
                                .abs()
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * 计算转入面积（非湿地类型减少量）
     * @param start
     * @param end
     * @return
     */
    private static BigDecimal calculateTransferInArea(
            Map<Integer, BigDecimal> start, Map<Integer, BigDecimal> end) {
        return IntStream.rangeClosed(4, 7)
                .mapToObj(type ->
                        start.getOrDefault(type, BigDecimal.ZERO)
                                .subtract(end.getOrDefault(type, BigDecimal.ZERO))
                                .max(BigDecimal.ZERO)
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * 计算转出面积（湿地类型减少量）
     * @param start
     * @param end
     * @return
     */
    private static BigDecimal calculateTransferOutArea(
            Map<Integer, BigDecimal> start, Map<Integer, BigDecimal> end) {

        BigDecimal startAmount = IntStream.rangeClosed(1, 3)
                .mapToObj(type ->
                        start.getOrDefault(type, BigDecimal.ZERO)
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal endAmount = IntStream.rangeClosed(1, 3)
                .mapToObj(type ->
                        end.getOrDefault(type, BigDecimal.ZERO)
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return startAmount.subtract(endAmount).max(BigDecimal.ZERO);
        /*return IntStream.rangeClosed(1, 3)
                .mapToObj(type ->
                        start.getOrDefault(type, BigDecimal.ZERO)
                                .subtract(end.getOrDefault(type, BigDecimal.ZERO))
                                .max(BigDecimal.ZERO)
                )
                .reduce(BigDecimal.ZERO, BigDecimal::add);*/
    }

    /**
     * 安全除法
     * @param numerator-
     * @param denominator-
     * @return
     */
    private static BigDecimal safeDivide(BigDecimal numerator, BigDecimal denominator) {
        return numerator.compareTo(BigDecimal.ZERO) == 0
                ? BigDecimal.ZERO
                : denominator.divide(numerator, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }
}