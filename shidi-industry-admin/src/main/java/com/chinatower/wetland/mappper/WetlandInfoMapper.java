package com.chinatower.wetland.mappper;


import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.chinatower.wetland.pojo.entity.WetlandInfo;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * <p>湿地信息mapper</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Mapper
public interface WetlandInfoMapper extends BaseMapper<WetlandInfo> {

    @InterceptorIgnore(tenantLine = "true")
    List<WetlandInfo> listForOur();

}





















