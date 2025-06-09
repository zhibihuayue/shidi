// 本地测试地址
import request from "@/common/config/axios";
const ApisList = {
  formAdd: "/pestControlForecast/insert",
  formEdit: "/pestControlForecast/edit",
  formDeleteById: "/pestControlForecast/deleteById",
  tableData: "/pestControlForecast/index",
  getVoById: '/pestControlForecast/getVoById',
  export: '/pestControlForecast/export'
};

/**
 * 列表查询
 */
export const getTableData = (param) => {
  return request.get(ApisList.tableData);
};
/**
 * 列表id查询
 */
export const getVoById = (param) => {
  return request.get(ApisList.getVoById + "?id="+param);
};


/**
 * 编辑数据
 */
export const formEdit = (param) => {
  return request.post(ApisList.formEdit, param);
};

