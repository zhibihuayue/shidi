package com.chinatower.wetland.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
 
import java.io.IOException;
import java.math.BigDecimal;
 
/**
 * BigDecimal类返回的序列化，返回防止显示科学计算值
 * @author lxw
 */
public class BigSerializer extends JsonSerializer<Object> {
    @Override
    public void serialize(Object o, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        BigDecimal obj = (BigDecimal) o;
        obj=obj.stripTrailingZeros();
        jsonGenerator.writeString(obj.toPlainString());
    }
}