package com.chinatower.wetland.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.Signature;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Description: 签名相关 .<br>
 * <p>Created Time: 2024/8/6 下午4:05 </p>
 *
 * @author <a href="mail to: mengxiangyuancc@gmail.com" rel="nofollow">孟祥元</a>
 */
public class SignUtils {

    /**
     * 【公共方法】使用RSA私钥对字符串进行签名
     *
     * @param preStr     待签名的字符串
     * @param privateKey RSA私钥的Base64编码字符串
     * @return 签名结果的Base64编码字符串
     * @throws Exception 如果签名过程中发生错误
     */
    public static String sign(String preStr, String privateKey) throws Exception {
        // 初始化签名值为空字符串
        String strSign = "";
        // 指定使用RSA算法和SHA-256散列算法的签名算法套件
        String suite = "SHA256WithRSA";
        // 获取签名对象
        Signature signature = Signature.getInstance(suite);
        // 从Base64编码的私钥字符串解码得到私钥字节码
        PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(Base64.decodeBase64(privateKey));
        // 获取密钥工厂对象
        KeyFactory keyFac = KeyFactory.getInstance("RSA");
        // 使用密钥工厂生成私钥
        PrivateKey privateKey2 = keyFac.generatePrivate(keySpec);
        // 初始化签名对象用于签名
        signature.initSign(privateKey2);
        // 将待签名字符串转换为字节数组
        byte[] msgBuf = preStr.getBytes(StandardCharsets.UTF_8);
        // 更新签名对象的数据
        signature.update(msgBuf);
        // 执行签名，返回签名结果字节数组
        byte[] byteSign = signature.sign();
        // 将签名结果字节数组转换为Base64编码字符串
        strSign = Base64.encodeBase64String(byteSign);
        // 返回签名结果的Base64编码字符串
        return strSign;
    }

    /**
     * 【公共方法】签名排序v2版本，解决双层map问题
     *
     * @param sortedParams 待排序的参数
     * @return 排序后的结果
     */
    public static String getSignContent2(Map<String, Object> sortedParams) {
        // 初始化StringBuilder用于构建最终的排序字符串
        StringBuilder content = new StringBuilder();
        // 将参数的key放入列表并进行排序
        List<String> keys = new ArrayList<>(sortedParams.keySet());
        Collections.sort(keys);
        // 初始化索引，用于判断是否是第一个参数
        int index = 0;

        // 遍历排序后的参数key列表
        for (int i = 0; i < keys.size(); i++) {
            String key = keys.get(i);
            Object value = sortedParams.get(key);
            // 忽略空值或空字符串
            if (value != null && !StringUtils.isEmpty(value.toString())) {
                // 处理value为Map类型且大小大于1的情况
                if (value instanceof Map && ((Map<?, ?>) value).size() > 1) {
                    Map<?, ?> innerMap = (Map<?, ?>) value;
                    // 将内部Map的key放入列表并进行排序
                    List<String> innerKeys = new ArrayList<String>((Collection<? extends String>) innerMap.keySet());
                    Collections.sort(innerKeys);
                    // 对内部Map的key进行排序，并构建内部Map的字符串表示
                    String innerContent = innerKeys.stream()
                        .map(k -> k + "=" + innerMap.get(k))
                        .collect(Collectors.joining("&"));
                    // 将内部Map的结果追加到最终的字符串中
                    content.append(index == 0 ? "" : "&").append(key).append("=").append(innerContent);
                } else {
                    // 非Map类型或Map类型但大小不大于1，直接追加到最终的字符串中
                    content.append(index == 0 ? "" : "&").append(key).append("=").append(value);
                }
                // 更新索引，准备追加下一个参数
                index++;
            }
        }
        // 返回最终构建的排序字符串
        return content.toString();
    }

}
