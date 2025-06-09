package com.chinatower.wetland.controller;

import com.chinatower.common.entity.Result;
import com.chinatower.platform.entity.admin.SysArea;
import com.chinatower.wetland.pojo.param.UploadPicture;
import com.chinatower.wetland.pojo.param.WetlandInfoEditParam;
import com.chinatower.wetland.pojo.param.WetlandInfoInsertParam;
import com.chinatower.wetland.pojo.vo.WetlandHomeBasicsInfoVO;
import com.chinatower.wetland.pojo.vo.WetlandHomeResourceStatVO;
import com.chinatower.wetland.pojo.vo.WetlandInfoDetailVO;
import com.chinatower.wetland.service.IWetlandInfoService;
import com.chinatower.wetland.service.RpcService;
import com.chinatower.wetland.util.BASE64DecodedMultipartFileUtil;
import com.chinatower.wetland.util.FIleToMultipartFile;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * <p>湿地信息Controller</p>
 *
 * @author  luojun
 * @author  其它作者姓名
 * @version 1.00 2024/06/15 luojun
 * <p>
 * @see
 */
@Slf4j
@Api(tags = "铁塔-湿地信息")
@RequestMapping("/wetland-info")
@RestController
@Validated
@RequiredArgsConstructor
public class WetlandInfoController {
    private final IWetlandInfoService wetlandInfoService;
    private final RpcService rpcService;
    @ApiOperation("新增数据")
    @PostMapping("/insert")
    public Result<Boolean> insert(@RequestBody @Valid WetlandInfoInsertParam param) {
        boolean b = wetlandInfoService.insert(param);
        if (b){
            return Result.data(Boolean.TRUE);
        }
        return Result.fail();
    }

    @ApiOperation("编辑数据")
    @PostMapping("/edit")
    public Result<Boolean> edit(@RequestBody @Valid WetlandInfoEditParam param) {
        boolean b = wetlandInfoService.edit(param);
        if (b){
            return Result.data(Boolean.TRUE);
        }
        return Result.fail();
    }

    @ApiOperation("列表")
    @GetMapping("/index")
    public Result<List<WetlandInfoDetailVO>> index() {
        List<WetlandInfoDetailVO> list = wetlandInfoService.index();
        return Result.data(list);
    }

    @ApiOperation("查询详情byId")
    @GetMapping("/detailById")
    public Result<WetlandInfoDetailVO> detailById(@RequestParam String id, @RequestParam(required = false) String wetlandResourceType) {
        WetlandInfoDetailVO wetlandInfoDetailVO = wetlandInfoService.detailById(id, wetlandResourceType);
        return Result.data(wetlandInfoDetailVO);
    }

    @ApiOperation("删除数据")
    @GetMapping("/deleteById")
    public Result<Boolean> deleteById(@RequestParam String id) {
        return Result.data(wetlandInfoService.deleteById(id));
    }

    @ApiOperation("上传图片")
    @PostMapping("/uploadPicture")
    public Result<String> uploadPicture(@RequestBody UploadPicture file){
        String path = BASE64DecodedMultipartFileUtil.base64ToFile(file.getFile(),file.getFileType());
        assert path != null;
        MultipartFile multipartFile = FIleToMultipartFile.convertFileToMultipartFile(new File(path));
        String url = wetlandInfoService.uploadPicture(multipartFile);
        return Result.data(url);
    }

    @ApiOperation("列表导出")
    @PostMapping("/export")
    public void export(HttpServletResponse response) {
        log.info("开始进入打印接口");
        wetlandInfoService.export(response);
    }


    @ApiOperation("查询首页湿地基础信息")
    @GetMapping("/queryHomeBasicsInfo")
    public Result<WetlandHomeBasicsInfoVO> queryHomeBasicsInfo() {
        return Result.data(wetlandInfoService.queryHomeBasicsInfo());
    }

    @ApiOperation("查询首页湿地资源统计")
    @GetMapping("/queryHomeResourceStat")
    public Result<List<WetlandHomeResourceStatVO>> queryHomeResourceStat() {
        return Result.data(wetlandInfoService.queryHomeResourceStat());
    }

    @ApiOperation("获取区域信息")
    @PostMapping("/getRegion")
    public Result<List<SysArea>> getRegion(@RequestBody SysArea sysArea) {
        return rpcService.getRegion(sysArea);
    }

    @ApiOperation("获取天气信息")
    @PostMapping("/getWt")
    public void getWt() {
        wetlandInfoService.queryWeather();
    }


    @ApiOperation("获取天气信息测试")
    @PostMapping("/getWtTest")
    public void getWtTest() {
        wetlandInfoService.getWtTest();
    }

    @ApiOperation("获取天气信息测试")
    @PostMapping("/getWeatherTest")
    public Map getWeatherTest() {
        return  wetlandInfoService.getWeatherTest();
    }
}