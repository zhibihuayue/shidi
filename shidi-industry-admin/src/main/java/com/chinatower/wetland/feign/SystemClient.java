//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.chinatower.wetland.feign;

import com.chinatower.common.core.web.domain.AjaxResult;
import com.chinatower.common.entity.Result;
import com.chinatower.common.entity.TreeSelect;
import com.chinatower.common.page.TableDataInfo;
import com.chinatower.platform.entity.admin.SysArea;
import com.chinatower.platform.entity.admin.SysConfig;
import com.chinatower.platform.entity.admin.SysDept;
import com.chinatower.platform.entity.admin.SysDictData;
import com.chinatower.platform.entity.admin.SysRole;
import com.chinatower.platform.entity.admin.SysUser;
import com.chinatower.system.api.feign.factory.SystemFeignClientFallbackFactory;
import com.chinatower.system.api.model.AreaDataVO;
import com.chinatower.system.api.model.AuthObjDataVO;
import com.chinatower.system.api.model.DeviceTreeVO;
import com.chinatower.system.api.model.StreetTreeVO;
import com.chinatower.system.api.model.SysAreaVO;
import com.chinatower.system.api.model.SysCapitalVO;
import com.chinatower.system.api.model.SysDeptAreaVO;
import com.chinatower.system.api.model.SysDeptDetailVO;
import com.chinatower.system.api.model.SysDeptStreetRelVO;
import com.chinatower.system.api.model.SysRoleScreenVO;
import com.chinatower.system.api.model.SysUserWhiteListVO;
import com.chinatower.system.api.model.TownShipDictData;
import com.chinatower.system.api.model.TreeSelectBySystem;
import com.chinatower.system.api.model.VmCommonWordsVO;
import com.chinatower.system.api.request.dept.QuTenantDeptSubsetRequest;
import com.chinatower.system.api.request.dept.QuTenantDeptTopRequest;
import com.chinatower.system.api.request.notice.SysNoticeReq;
import com.chinatower.system.api.request.role.QueryRoleRequest;
import com.chinatower.system.api.request.tenant.AddTenantInfoRequest;
import com.chinatower.system.api.request.tenant.CreateTenantRootDeptRequest;
import com.chinatower.system.api.request.tenant.QuTenantInfoRequest;
import com.chinatower.system.api.request.user.AddUserRequest;
import com.chinatower.system.api.request.user.GetUserByDeptAndDeviceScopeRequest;
import com.chinatower.system.api.request.user.VideoUpdateUserRequest;
import com.chinatower.system.api.request.words.wordsRequest;
import com.chinatower.system.api.resp.SysAreaResponse;
import com.chinatower.system.api.resp.SysDeptInfoResponse;
import com.chinatower.system.api.resp.SysDeptResponse;
import com.chinatower.system.api.resp.SysDictDataResponse;
import com.chinatower.system.api.resp.SysRoleResponse;
import com.chinatower.system.api.resp.SysUserResponse;
import com.chinatower.system.api.resp.SysUserTenantInfoResponse;
import com.chinatower.system.api.resp.tenant.SysTenantInfoResponse;
import io.swagger.annotations.ApiOperation;
import java.util.List;
import java.util.Map;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

@FeignClient(
    value = "video-system",
    fallbackFactory = SystemFeignClientFallbackFactory.class,
        contextId = "596849846514"
)
@Component
@Service
public interface SystemClient {
    String TENANT_PREFIX = "/system/tenant";
    String USER_PREFIX = "/system/user";
    String TENANT_DEPT_PREFIX = "/system/tenantDept";

    @PostMapping(
        path = {"/system/tenant/listTenantInfo"}
    )
    Result<Map<String, Object>> getTenantInfoList(@RequestBody QuTenantInfoRequest quTenantInfoRequest);

    @PostMapping(
        path = {"/system/tenant/addTenantInfo"}
    )
    Result addTenantInfo(@Validated @RequestBody AddTenantInfoRequest addTenantInfoRequest);

    @PostMapping(
        path = {"/system/user/addUser"}
    )
    Result<Integer> addUser(@Validated @RequestBody AddUserRequest addUserRequest);

    @PutMapping(
        path = {"/system/user/updateVideoUser"}
    )
    Result<Integer> updateVideoUser(@Validated @RequestBody VideoUpdateUserRequest request);

    @GetMapping(
        path = {"/base/system/dict/data/dictType/{dictType}"}
    )
    Result<List<SysDictData>> getDictDataByType(@PathVariable("dictType") String dictType);

    @PostMapping(
        path = {"/system/dept/addTenantRootDept"}
    )
    Result addTenantRootDept(@Validated @RequestBody CreateTenantRootDeptRequest createTenantRootDeptRequest);

    @PostMapping(
        path = {"/system/role/selectRoleList"}
    )
    Result<List<SysRoleResponse>> getRoleList(@RequestBody QueryRoleRequest queryRoleRequest);

    @PostMapping(
        path = {"/system/tenantDept/selectTenantTop"}
    )
    Result<Map<String, Object>> selectTenantTop(@RequestBody QuTenantDeptTopRequest quTenantDeptTopRequest);

    @PostMapping(
        path = {"/system/tenantDept/listSubsetDeptInfo"}
    )
    Result<List<SysDeptInfoResponse>> listTenantSubsetDept(@RequestBody QuTenantDeptSubsetRequest quTenantDeptSubsetRequest);

    @PostMapping(
        path = {"/system/role/add"}
    )
    Result addRole(@RequestBody SysRole SysRole);

    @GetMapping(
        path = {"/system/area/queryAllAreaCode"}
    )
    Result<List<SysAreaResponse>> queryAllAreaCode();

    @DeleteMapping(
        path = {"/system/dept/del/{deptId}"}
    )
    Result remove(@PathVariable("deptId") String deptId);

    @GetMapping({"/system/tenant/checkTenantId/{tenantId}"})
    Result<Integer> checkTenantId(@PathVariable("tenantId") String tenantId);

    @GetMapping({"/system/user/selectUserByTenantId/{tenantId}"})
    Result<List<SysUserResponse>> selectUserByTenantId(@PathVariable("tenantId") String tenantId);

    @GetMapping({"/system/user/selectUserListByTenantId"})
    Result<List<SysUserTenantInfoResponse>> selectUserListByTenantId(@RequestParam Integer pageNum, @RequestParam Integer pageSize);

    @GetMapping({"/system/user/selectUserListByTenantCount"})
    Result<Long> selectUserListByTenantCount();

    @GetMapping({"/base/system/dict/data/dictDataType/{dictType}"})
    Result<List<SysDictDataResponse>> dictDataType(@PathVariable("dictType") String dictType);

    @GetMapping({"/base/system/dict/data/dictType/multiple/{dictTypes}"})
    Result<Map<String, List<TownShipDictData>>> dictType(@PathVariable("dictTypes") String[] dictTypes);

    @RequestMapping(
        value = {"/system/config/base/detail/{configKey}"},
        method = {RequestMethod.GET}
    )
    AjaxResult getConfValue(@PathVariable("configKey") String configKey);

    @PostMapping(
        path = {"/system/tenantDept/tenantTreeList2Video"}
    )
    Result<List<SysDeptResponse>> tenantTreeList2Video(@Validated @RequestBody QuTenantDeptTopRequest quTenantDeptTopRequest);

    @PostMapping(
        path = {"/system/tenantDept/selectTenantTop2Video"}
    )
    Result<Map<String, Object>> selectTenantTop2Video(@RequestBody QuTenantDeptTopRequest quTenantDeptTopRequest);

    @PostMapping(
        path = {"/base/common/uploadFileVideo"},
        consumes = {"multipart/form-data"}
    )
    Result uploadFile2Video(@RequestPart("uploadFile") MultipartFile uploadFile);

    @GetMapping({"/common/downloadByUrl"})
    Result<Object> downloadByUrl(@RequestParam("url") String url);

    @GetMapping({"/system/tenant/selectByTenantId/{tenantId}"})
    Result<List<SysTenantInfoResponse>> selectByTenantId(@PathVariable("tenantId") String tenantId);

    @PostMapping(
        path = {"/system/user/getListByIds"}
    )
    AjaxResult getListByIds(SysUser user);

    @PostMapping(
        path = {"/system/user/getListByUserNames"}
    )
    AjaxResult getListByUserNames(SysUser user);

    @PostMapping(
        path = {"/system/user/getUserList"}
    )
    Result<List<SysUser>> getUserList(@RequestBody SysUser user);

    @PostMapping(
        path = {"/base/system/tenantDept/getTenantTree"}
    )
    Result<List<TreeSelectBySystem>> getTenantTree(@RequestBody SysUser sysUser);

    @GetMapping({"/system/user/base/detail/{userId}"})
    AjaxResult getInfo(@PathVariable("userId") String userId);

    @PostMapping({"/system/config/getConfigInfo"})
    AjaxResult getConfigInfo(@RequestBody SysConfig config);

    @PostMapping({"/system/user/getPermissionsForString"})
    Result getPermissionsForString(@RequestBody SysUser user);

    @PostMapping({"/system/commonWords/getCommonWords"})
    Result<List<VmCommonWordsVO>> getCommonWords(@RequestBody wordsRequest words);

    @PostMapping({"/system/area/getSysCapital"})
    Result<SysCapitalVO> getSysCapital(@RequestBody SysCapitalVO vo);

    @PostMapping({"/system/commonWords/addCommonWords"})
    Result addCommonWords(@RequestBody wordsRequest words);

    @PostMapping({"/system/commonWords/updateCommonWords"})
    Result<Integer> updateCommonWords(@RequestBody wordsRequest words);

    @PostMapping({"/system/commonWords/updateCommonWordsBatch"})
    Result<String> updateCommonWordsBatch(@RequestBody wordsRequest words);

    @PostMapping({"/system/commonWords/deleteCommonWordsByWordsId"})
    Result<Integer> deleteCommonWordsByWordsId(@RequestBody wordsRequest words);

    @PostMapping({"/system/commonWords/deleteCommonWordsByWordsIdBatch"})
    Result<Integer> deleteCommonWordsByWordsIdBatch(@RequestBody wordsRequest words);

    @PostMapping({"/system/sysDeptStreetRel/getDeptStreetRel"})
    Result<List<SysDeptStreetRelVO>> getDeptStreetRel(@RequestBody SysDeptStreetRelVO vo);

    @PostMapping({"/system/sysDeptStreetRel/insertDeptStreetRel"})
    Result insertDeptStreetRel(@RequestBody List<SysDeptStreetRelVO> list);

    @PostMapping({"/system/sysDeptStreetRel/deleteDeptStreetRel"})
    Result deleteDeptStreetRel(@RequestBody SysDeptStreetRelVO vo);

    @PostMapping({"/system/user/getPermissions"})
    Result<List<DeviceTreeVO>> getPermissions(@RequestBody SysUser user);

    @PostMapping({"/system/user/getRegionTree"})
    Result<List<DeviceTreeVO>> getRegionTree(@RequestBody SysUser user);

    @PostMapping({"/system/user/getAreaByTenantId"})
    Result<List<AreaDataVO>> getAreaByTenantId(@RequestBody SysUser user);

    @PostMapping({"/system/user/getPhoneByRegion"})
    Result<List<SysUser>> getPhoneByRegion(@RequestBody SysUser user);

    @PostMapping({"/video/getRegion"})
    Result<List<SysArea>> getRegion(@RequestBody SysArea sysArea);

    @PostMapping({"/system/business/getDataScopeObj"})
    Result<AuthObjDataVO> getDataScopeObj();

    @PostMapping({"/system/business/getDataScopeObjBySysUser"})
    Result<AuthObjDataVO> getDataScopeObjBySysUser(@RequestBody SysUser user);

    @PostMapping({"/system/commonWords/queryFalseWords"})
    Result<String> queryFalseWords(@RequestBody String falseCode);

    @PostMapping({"/system/area/getAllStreetList"})
    Result<List<StreetTreeVO>> getAllStreetList(StreetTreeVO vo);

    @PostMapping({"/base/system/area/treeselectNew"})
    Result<List<TreeSelect>> selectTreeSelect();

    @ApiOperation("获取通知公告列表")
    @PostMapping({"/system/notice/list"})
    TableDataInfo list(SysNoticeReq notice);

    @GetMapping({"/base/system/tenantDept/getVideoTreeselect"})
    Result<List<TreeSelect>> getVideoTreeselect();

    @RequestMapping(
        value = {"/system/fileinfo/detail/{fileId}"},
        method = {RequestMethod.GET}
    )
    AjaxResult getFileInfo(@PathVariable("fileId") String fileId);

    @RequestMapping(
        value = {"/base/system/fileinfo/byIds/{fileIds}"},
        method = {RequestMethod.GET}
    )
    AjaxResult selectSysFileInfoByIds(@PathVariable("fileIds") String[] fileIds);

    @PostMapping({"/system/area/getAllArea"})
    Result<List<SysArea>> getAllArea(@RequestBody SysArea sysArea);

    @PostMapping({"/system/area/getCenterLonLat"})
    Result<SysArea> getCenterLonLat(@RequestParam("code") String code);

    @PostMapping({"/system/business/getAreaStreet"})
    Result<List<SysAreaVO>> getAreaStreet(@RequestBody String regions);

    @GetMapping({"/system/whiteList/getUser"})
    Result<SysUserWhiteListVO> getUserWhite(@RequestParam("userName") String userName);

    @GetMapping({"/system/dept/deptDeviceDetail/{deptId}"})
    Result<SysDeptDetailVO> getDeptDeviceDetail(@PathVariable("deptId") String deptId);

    @PostMapping({"/system/dept/deptDeviceDetailBatch"})
    Result<SysDeptDetailVO> deptDeviceDetailBatch(@RequestBody List<String> list);

    @PostMapping(
        path = {"/base/common/upload"},
        consumes = {"multipart/form-data"}
    )
    AjaxResult uploadFile(@RequestPart("file") MultipartFile file);

    @GetMapping({"/system/dept/getUserDeptTreeselect"})
    Result<List<SysDeptAreaVO>> getUserDeptTreeselect();

    @PostMapping(
        path = {"/system/user/getUserByDeptAndDeviceScope"}
    )
    Result<List<SysUser>> getUserByDeptAndDeviceScope(@RequestBody GetUserByDeptAndDeviceScopeRequest request);

    @PostMapping({"/system/area/selectByAreaName"})
    Result<List<SysArea>> selectByAreaName(@RequestBody List<String> areaNames);

    @PostMapping({"/system/area/getAreaNameCaffeineMap"})
    Result<Map<String, String>> getAreaNameCaffeineMap(List<String> areaCodes);

    @PostMapping({"/system/user/forceLogout"})
    Result forceLogout(@RequestParam String userId, @RequestParam String userName);

    @GetMapping(
        path = {"/system/user/getTenantUsers"}
    )
    Result<List<SysUser>> getTenantUsers();

    @PostMapping(
        path = {"/system/role/delRoleScreenRef"}
    )
    Result<Integer> delRoleScreenRef(@RequestBody List<SysRoleScreenVO> sysRoleScreenVOList);

    @PostMapping(
        path = {"/system/role/queryRoleScreenRef"}
    )
    Result<List<SysRoleScreenVO>> queryRoleScreenRef(@RequestBody SysRoleScreenVO sysRoleScreenVO);

    @PostMapping(
        path = {"/system/role/getCurrentRoleScreen"}
    )
    Result<SysRoleScreenVO> getCurrentRoleScreen(@RequestBody SysRoleScreenVO sysRoleScreenVO);

    @PostMapping({"/system/tenantDept/listSubsetDept"})
    Result<List<SysDept>> listSubsetDept(QuTenantDeptSubsetRequest quTenantDeptSubsetRequest);

    @PostMapping({"/system/commonWords/addCommonWordsBatch"})
    Result addCommonWordsBatch(@RequestBody List<wordsRequest> commonWordsDTOList);

    @PostMapping({"/system/commonWords/getCommonWordsForInspection"})
    Result<List<VmCommonWordsVO>> getCommonWordsForInspection(@RequestBody wordsRequest wordsVO);

    @PostMapping({"/system/commonWords/updateProcessCommonWordsForInspection"})
    Result updateProcessCommonWordsForInspection(@RequestBody List<wordsRequest> commonWordsDTOList);

}
