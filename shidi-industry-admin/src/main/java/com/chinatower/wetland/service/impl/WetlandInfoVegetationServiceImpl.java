package com.chinatower.wetland.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinatower.wetland.mappper.WetlandInfoVegetationMapper;
import com.chinatower.wetland.pojo.entity.WetlandInfoVegetation;
import com.chinatower.wetland.service.IWetlandInfoVegetationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * <p>湿地植被信息Service</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/19 luojun
 * <p>
 * @see
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class WetlandInfoVegetationServiceImpl extends ServiceImpl<WetlandInfoVegetationMapper, WetlandInfoVegetation> implements IWetlandInfoVegetationService {

}
