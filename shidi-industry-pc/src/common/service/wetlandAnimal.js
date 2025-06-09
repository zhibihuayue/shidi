// 线上地址
const ApisList = {
  formAdd: "forest-wetland/pestControlForecast/insert",
  formEdit: "forest-wetland/pestControlForecast/edit",
  formDeleteById: "forest-wetland/pestControlForecast/deleteById",
  tableData: "forest-wetland/pestControlForecast/index",
  getVoById: 'forest-wetland/pestControlForecast/getVoById',
  export: 'forest-wetland/pestControlForecast/export'
};

/**
 * 列表查询
 */
export const getTableData = (param) => {
  return window.requestSDK(ApisList.tableData, param , {}, 'get')
};
/**
 * 列表id查询
 */
export const getVoById = (param) => {
  return window.requestSDK(ApisList.getVoById,param,{},'get')
};


/**
 * 编辑数据
 */
export const formEdit = (param) => {
  return window.requestSDK(ApisList.formEdit,param,{},'post')
};

