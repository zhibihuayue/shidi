package com.chinatower.wetland.mappper;


import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chinatower.wetland.pojo.entity.PestLight;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PestLightMapper extends BaseMapper<PestLight> {

    @InterceptorIgnore(tenantLine = "true")
    void deleteAll();
}
