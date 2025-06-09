// 本地测试地址
import request from "@/common/config/axios";
const ApisList = {
  tableData: "/wetland-info/index",
  deleteUrl: "/wetland-info/deleteById",
  upload: "/wetland-info/uploadPicture",
  addList: "/wetland-info/insert",
  editList: "/wetland-info/edit",
  deleteByIdRegion: "/wetland-info/region/deleteById",
  deleteByIdVegetation: "/wetland-info/vegatation/deleteById",
  // getRegionList: "/wetland-info/getRegion",
  getRegionList: "forest-wetland/wetland-info/getRegion",
};
/**
 * 列表查询
 */
export const getTableData = (param) => {
  return request.get(ApisList.tableData);
};
/**
 * 列表删除
 */
export const deleteById = (param) => {
  return request.get(ApisList.deleteUrl + "?" + param);
};
/**
 * 上传图片
 */
export const upLoadImg = (param) => {
  return request.get(ApisList.upload);
};

/**
 * 新增数据
 */
export const addList = (param) => {
  return request.post(ApisList.addList, param);
};
/**
 * 编辑数据
 */
export const editList = (param) => {
  return request.post(ApisList.editList, param);
};
/**
 * 删除区域数据
 */
export const deleteByIdRegion = (param) => {
  return request.get(ApisList.deleteByIdRegion + "?" + param);
};
/**
 * 删除植被数据
 */
export const deleteByIdVegetation = (param) => {
  return request.get(ApisList.deleteByIdVegetation + "?" + param);
};

/**
 * 区域下拉
 */
export const getRegionList = (param) => {
  // return request.post(ApisList.getRegionList, param);
  return window.requestSDK(ApisList.getRegionList, param, {}, 'post')
};
