// 线上接口地址
const ApisList = {
  tableData: "forest-wetland/wetland-info/index",
  deleteUrl: "forest-wetland/wetland-info/deleteById",
  upload: "forest-wetland/wetland-info/uploadPicture",
  addList: "forest-wetland/wetland-info/insert",
  editList: "forest-wetland/wetland-info/edit",
  deleteByIdRegion: "forest-wetland/wetland-info/region/deleteById",
  deleteByIdVegetation: "forest-wetland/wetland-info/vegatation/deleteById",
  getRegionList: "forest-wetland/wetland-info/getRegion",
};
/**
 * 列表查询
 */
export const getTableData = (param) => {
  return window.requestSDK(ApisList.tableData, param, {}, 'get')
};
/**
 * 列表删除
 */
export const deleteById = (param) => {
  return window.requestSDK(ApisList.deleteUrl+ "?" + param, null, {}, 'get')
};
/**
 * 上传图片
 */
export const upLoadImg = (param) => {
  return window.requestSDK(ApisList.upload, param, {}, 'get')

};

/**
 * 新增数据
 */
export const addList = (param) => {
  return window.requestSDK(ApisList.addList, param, {}, 'post')
};
/**
 * 编辑数据
 */
export const editList = (param) => {
  return window.requestSDK(ApisList.editList, param, {}, 'post')
};
/**
 * 删除区域数据
 */
export const deleteByIdRegion = (param) => {
  return window.requestSDK(ApisList.deleteByIdRegion+ "?" + param, null, {}, 'get')
};
/**
 * 删除植被数据
 */
export const deleteByIdVegetation = (param) => {
  return window.requestSDK(ApisList.deleteByIdVegetation+ "?" + param, null, {}, 'get')
};

/**
 * 区域下拉
 */
export const getRegionList = (param) => {
  return window.requestSDK(ApisList.getRegionList, param, {}, 'post')
};
