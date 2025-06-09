package com.chinatower.wetland.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chinatower.wetland.pojo.param.WetlandInfoEditParam;
import com.chinatower.wetland.pojo.entity.WetlandInfo;
import com.chinatower.wetland.pojo.param.WetlandInfoInsertParam;
import com.chinatower.wetland.pojo.vo.WetlandHomeBasicsInfoVO;
import com.chinatower.wetland.pojo.vo.WetlandHomeResourceStatVO;
import com.chinatower.wetland.pojo.vo.WetlandInfoDetailVO;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.Map;

/**
 * <p>湿地信息Service接口</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
public interface IWetlandInfoService extends IService<WetlandInfo>{

    /**
     * 插入数据
     * @param param
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    boolean insert(WetlandInfoInsertParam param);

    /**
     * 编辑数据
     * @param param
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    boolean edit(WetlandInfoEditParam param);

    /**
     * 查询列表
     * @return
     */
    List<WetlandInfoDetailVO> index();

    /**
     * 查询详情
     * @param id
     * @return
     */
    WetlandInfoDetailVO detailById(String id, String wetlandResourceType);

    /**
     * 上传图片
     * @param file
     * @return
     */
    String uploadPicture(MultipartFile file);

    /**
     * 导出湿地基础信息
     * @param response
     */
    void export(HttpServletResponse response);

    /**
     * 查询首页湿地基础信息
     * @return 首页湿地基础信息
     */
    WetlandHomeBasicsInfoVO queryHomeBasicsInfo();


    /**
     * 查询首页湿地资源统计
     * @return 首页湿地资源统计
     */
    List<WetlandHomeResourceStatVO> queryHomeResourceStat();

    /**
     * 删除数据
     * @param id
     * @return
     */
    Boolean deleteById(String id);
    /**
     * 获取设备的气象信息
     * @return
     */
    void queryWeather();

    void getWtTest();

    List<WetlandInfo> listForOur();

    Map getWeatherTest();
}
