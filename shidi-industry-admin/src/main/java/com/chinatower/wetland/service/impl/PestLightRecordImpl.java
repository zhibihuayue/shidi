package com.chinatower.wetland.service.impl;


import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chinatower.common.entity.Result;
import com.chinatower.forestry.emengercy.api.entity.TrapGatherVO;
import com.chinatower.forestry.emengercy.api.entity.TrapVO;
import com.chinatower.platform.model.dto.LoginUser;
import com.chinatower.wetland.mappper.PestLightMapper;
import com.chinatower.wetland.mappper.PestLightRecordMapper;
import com.chinatower.wetland.mappper.WetlandInfoMapper;
import com.chinatower.wetland.pojo.entity.PestLight;
import com.chinatower.wetland.pojo.entity.PestLightRecord;
import com.chinatower.wetland.pojo.entity.WetlandInfo;
import com.chinatower.wetland.pojo.enums.PestTypeEnum;
import com.chinatower.wetland.pojo.vo.PestLightQueryVo;
import com.chinatower.wetland.service.IPestLightRecordService;
import com.chinatower.wetland.service.RpcService;
import com.github.pagehelper.PageInfo;
import com.google.gson.Gson;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sun.font.TrueTypeFont;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * @Description : 虫情灯记录表
 * @Author : zyx
 * @Date: 2024-03-12
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class PestLightRecordImpl extends ServiceImpl<PestLightRecordMapper, PestLightRecord> implements IPestLightRecordService {

    private final RpcService rpcService;

    @Autowired
    private PestLightRecordMapper mapper;
    @Autowired
    private PestLightMapper pestLightMapper;


    @Autowired
    private WetlandInfoMapper wetlandInfoMapper;


    @Override
    public void getPestLightRecord() {

        log.warn("开始采集诱捕器数据");

        //对接诱捕器接口获取相应的数据插入pest_light_record

        List<PestLightRecord> list = new ArrayList<>();

        //查询湿地信息
        List<WetlandInfo> wetlandInfoList = this.wetlandInfoMapper.listForOur();
        SimpleDateFormat formatter=new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        Calendar calendar= Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, -1);
        String startTime = formatter.format(calendar.getTime());
        //根据湿地租户对接诱捕器获取数据
        String finalStartTime = startTime+" 00:00:00";
        String finalEndTime = startTime+" 23:59:59";
        insertPestRecordList(wetlandInfoList,finalStartTime,finalEndTime,"getPestLightRecordHandler");

    }

    @Override
    public List<PestLight> pestLightDevice() {
        LoginUser loginUser = rpcService.getLoginUser();  //客户信息
        List<PestLight> list = new ArrayList<>();
        TrapVO vo = new TrapVO();
        vo.setTenantId(loginUser.getUser().getTenantId());
        vo.setAppVerCode(loginUser.getUser().getAppVerCode());
        vo.setIndustryCode(loginUser.getUser().getIndustryCode());
        vo.setPageSize(1000);

        for(int page=1;page<page+1;page++){
            vo.setPageNum(page);
            Result<PageInfo<TrapVO>> result = rpcService.queryTrapList(vo);
            List<TrapVO> trapGatherList = result.getData().getList();
            trapGatherList.forEach(l->{
                PestLight pestLight = new PestLight();
                BeanUtils.copyProperties(l,pestLight);
                list.add(pestLight);
            });
            //最后一页跳出循环
            if(result.getData().isIsLastPage()){
                break;
            }
        }
       // return mapper.pestLightDevice(loginUser.getUser().getTenantId());
        return list;
    }

    @Override
    public void pestLightDeviceAll() {
        //查询湿地信息
        List<WetlandInfo> wetlandInfoList = this.wetlandInfoMapper.listForOur();
        //删除所有诱捕器
        pestLightMapper.deleteAll();
        //根据湿地租户对接获取所有诱捕器
        wetlandInfoList.forEach(w->{
            //调用接口获取诱捕器
            TrapVO vo = new TrapVO();
            vo.setTenantId(w.getTenantId());
            vo.setAppVerCode(w.getAppVerCode());
            vo.setIndustryCode(w.getIndustryCode());
            vo.setPageSize(1000);
            //休眠时间
            Long[] sleepArray = new Long[3];
            sleepArray[0]=1L;
            sleepArray[1]=5L;
            sleepArray[2]=10L;
            //查询错误次数
            int count = 0 ;
            for(int page=1;page<page+1;page++){
                vo.setPageNum(page);
                Result<PageInfo<TrapVO>> result = null;
                for(int i = 0;i < 3;i++){
                    try{
                        result = rpcService.queryTrapList(vo);
                        if(ObjectUtil.isEmpty(result)||result.getCode() != 200){
                            log.warn("查询病虫害设备返回状态不为200，参数为："+vo.getTenantId()+",页数："+page+",查询病虫害设备页面大小："+vo.getPageSize());
                            //如果重试三次之后还是错误，count++
                            if(i==2){
                                count++;
                                break;
                            }
                            try{
                                TimeUnit.SECONDS.sleep(sleepArray[i]);
                            }catch (Exception e){
                                log.warn("休眠失败");
                            }
                        }else {
                            count=0;
                            break;
                        }
                }catch (Exception e){
                    log.error("查询病虫害设备异常，参数为："+vo.getTenantId()+",页数："+page+"查询病虫害设备报错信息为：", e+",查询病虫害设备异常页面大小："+vo.getPageSize());
                    if(i==2){
                        count++;
                        break;
                    }
                    try{
                        TimeUnit.SECONDS.sleep(sleepArray[i]);
                    }catch (Exception ex){
                        log.warn("休眠失败");
                    }
                }
        }

                if(count==3){
                    log.warn("查询病虫害设备连续失败跳出本湿地查询："+vo.getTenantId()+",页数："+page+",跳出病虫害页面大小："+vo.getPageSize());
                    break;
                }
//                    log.warn("结束查询病虫害设备");
//                    log.warn("查询结果为："+ result);
                if(ObjectUtil.isNotEmpty(result)&&ObjectUtil.isNotEmpty(result.getData())&&ObjectUtil.isNotEmpty(result.getData().getList())){
                    List<TrapVO> trapGatherList = result.getData().getList();
                    log.warn("病虫害设备一共有"+trapGatherList.size()+"条");
                    trapGatherList.forEach(l->{
                        log.warn("诱捕器id为："+l.getId());
                        PestLight pestLight = new PestLight();
                        BeanUtils.copyProperties(l,pestLight);
                        pestLight.setId(l.getId().toString());
                        try {
                            pestLightMapper.insert(pestLight);
                        }catch (Exception e){
                            log.warn("病虫害设备数据插入错误："+e);
                        }
                    });
                }
                //最后一页跳出循环
                if(ObjectUtil.isNotEmpty(result)&&ObjectUtil.isNotEmpty(result.getData())&&result.getData().isIsLastPage()){
                    break;
                }

            }
        });

    }

    @Override
    public void getPestLightRecordThreeMonth() {

        log.info("开始采集诱捕器数据");
        //对接诱捕器接口获取相应的数据插入pest_light_record

        List<PestLightRecord> list = new ArrayList<>();

        //查询湿地信息
        List<WetlandInfo> wetlandInfoList = this.wetlandInfoMapper.listForOur();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DATE, -2);
        String endTime = formatter.format(calendar.getTime());
        calendar.add(Calendar.MONTH, -3);
        String startTime = formatter.format(calendar.getTime());
        //根据湿地租户对接诱捕器获取数据
        String finalStartTime = startTime+" 00:00:00";
        String finalEndTime = endTime+" 23:59:59";
        log.info("getPestLightRecordThreeMonth的开始时间:"+finalStartTime);
        log.info("getPestLightRecordThreeMonth的结束时间:"+finalEndTime);
        //清空表中所有数据
        mapper.deleteAll();
        insertPestRecordList(wetlandInfoList,finalStartTime,finalEndTime,"getPestLightRecordThreeMonth");
    }

    private void insertPestRecordList(List<WetlandInfo> wetlandInfoList,
                                      String finalStartTime,
                                      String finalEndTime,
                                      String jobName){
        wetlandInfoList.forEach(w->{
            TrapGatherVO vo = new TrapGatherVO();
            vo.setTenantId(w.getTenantId());
            vo.setIndustryCode(w.getIndustryCode());
            vo.setPageSize(100);
            List<String> trapList = new ArrayList<>();
            //0-东亚飞蝗 1-芦苇尖蛾 2-松墨天牛 3-稻蓟马
            trapList.add("东亚飞蝗");
            trapList.add("芦苇尖蛾");
            trapList.add("松墨天牛");
            trapList.add("稻蓟马");
            vo.setTrappingInsectList(trapList);
            vo.setHarvestingStartTime(finalStartTime);
            vo.setHarvestingEndTime(finalEndTime);

            //休眠时间
            Long[] sleepArray = new Long[3];
            sleepArray[0]=1L;
            sleepArray[1]=5L;
            sleepArray[2]=10L;
            log.info(jobName+"开始采集租户"+w.getTenantId()+"诱捕器数据");
            //查询错误次数
            int count = 0 ;
            for(int page=1;page<page+1;page++) {
                vo.setPageNum(page);
                Result<PageInfo<TrapGatherVO>> result = null;
                //获取采集数据
                for (int i = 0; i < 3; i++) {
                    try {
                        result = rpcService.queryTrapGatherList(vo);
                        if (ObjectUtil.isEmpty(result)||result.getCode() != 200||ObjectUtil.isEmpty(result.getData())) {
                            log.info(jobName+"查询诱捕器采集数据返回状态不为200，参数为："+vo.getTenantId()
                                    +",页数："+page+",查询页面大小："+vo.getPageSize());
                            //如果重试三次之后还是错误，count++
                            if(i==2){
                                count++;
                                break;
                            }
                            try{
                                TimeUnit.SECONDS.sleep(sleepArray[i]);
                            }catch (Exception e){
                                log.error("休眠失败");
                            }
                        }else {
                            count=0;
                            break;
                        }

                    } catch (Exception e) {
                        Gson gson = new Gson();
                        log.error(jobName+"查询诱捕器采集数据异常，参数为：" + vo.getTenantId() + ",页数："
                                        + page + "查询诱捕器采集数据报错信息为："+",异常时页面大小："+vo.getPageSize()
                                +"返回的result为"+gson.toJson(result),e);
                        if (i == 2) {
                            count++;
                            break;
                        }
                        try {
                            TimeUnit.SECONDS.sleep(sleepArray[i]);
                        } catch (Exception ex) {
                            log.error("休眠失败");
                        }
                    }
                }
                if(count==3){
                    log.info(jobName+"查询诱捕器采集数据连续失败跳出本湿地查询："+vo.getTenantId()+",页数："+page
                            +",跳出时页面大小："+vo.getPageSize());
                    break;
                }

                if (ObjectUtil.isNotEmpty(result) && ObjectUtil.isNotEmpty(result.getData())
                        && ObjectUtil.isNotEmpty(result.getData().getList())) {
                    List<TrapGatherVO> trapGatherList = result.getData().getList();
                    trapGatherList.forEach(l -> {
                        //数据转化
                        PestLightRecord record = new PestLightRecord();
                        //record.setId(l.getId().toString());
                        record.setAppVerCode(w.getAppVerCode());
                        record.setIndustryCode(w.getIndustryCode());
                        record.setTenantId(w.getTenantId());
                        record.setLightId(l.getDeviceCode());
                        record.setLightName(l.getDeviceName());
                        //pi*30*30 半径30米
                        record.setLightArea(2827.43);
                        record.setPestNum(Integer.valueOf(l.getTrapNumber()));
                        record.setPestType(PestTypeEnum.getByDesc(l.getTrappingInsects()).getCode());
                        record.setLongitude(l.getLongitude());
                        record.setLatitude(l.getLatitude());
                        record.setCreateTime(l.getHarvestingTime());
                        record.setUpdateTime(new Date());
                        //插入表中
                        try {
                            mapper.insert(record);
                        } catch (Exception e) {
                            log.error(jobName+"查询诱捕器采集数据报错信息：" , e);
                        }
                    });
                }
                //最后一页跳出循环
                if (ObjectUtil.isNotEmpty(result) && ObjectUtil.isNotEmpty(result.getData())
                        &&(ObjectUtil.isEmpty(result.getData().getList())
                        ||result.getData().getList().size()<vo.getPageSize())) {
                    break;
                }

            }
        });

    }
}
