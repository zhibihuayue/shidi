package com.chinatower.wetland.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinatower.wetland.mappper.CoverageInfoAreaMapper;
import com.chinatower.wetland.pojo.entity.CoverageInfoArea;
import com.chinatower.wetland.service.ICoverageInfoAreaService;
import com.chinatower.wetland.service.RpcService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * @Description : 图层信息
 * @Author : zyx
 * @Date: 2024-09-24
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class CoverageInfoAreaServiceImpl extends ServiceImpl<CoverageInfoAreaMapper, CoverageInfoArea> implements ICoverageInfoAreaService {

    private final RpcService rpcService;


}
