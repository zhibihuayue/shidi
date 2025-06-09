package com.chinatower.wetland.mappper;


import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chinatower.wetland.pojo.entity.PestControlForecast;
import com.chinatower.wetland.pojo.entity.PestLight;
import com.chinatower.wetland.pojo.entity.PestLightRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>病虫害预测表mapper</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Mapper
public interface PestLightRecordMapper extends BaseMapper<PestLightRecord> {


    List<PestLight> pestLightDevice(@Param("tenantId") String tenantId);

    @InterceptorIgnore(tenantLine = "true")
    void deleteAll();
}





















