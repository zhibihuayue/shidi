import {
  getTableData,
  deleteById,
  // addList,
} from "@/common/service/workbench.js";

export class tabelTagLogic {
  queryParams = {
    page: 1,
    limit: 10,
  };

  levelType = [
    { label: "国家级", id: 1 },
    { label: "省级", id: 2 },
    { label: "一般", id: 3 },
  ];
  
  columns = [
    {
      porVal: "wetlandName",
      label: "湿地名称",
      type: false,
      width: 166,
      fixed: "left",
    },
    { porVal: "imageList", label: "图片", type: false, width: 94 },
    { porVal: "regionNameList", label: "所在区域", type: true, width: 130 },
    { porVal: "latitudeLongitude", label: "经纬度", type: true, width: 210 },
    {
      porVal: "wetlandTypeString",
      label: "湿地类型",
      type: true,
      width: 140,
      // optionMap: this.wetlandType,
    },
    { porVal: "wetlandArea", label: "湿地面积（亩）", type: true, width: 144 },
    {
      porVal: "protectionLevel",
      label: "保护级别",
      type: true,
      width: 120,
      optionMap: this.levelType,
    },
    { porVal: "establishmentTime", label: "建立时间", type: true, width: 120 },
    {
      porVal: "ownerUnit",
      label: "所属单位",
      type: true,
      width: 160,
    },
    {
      porVal: "createBy",
      label: "创建人",
      type: true,
      width: 120,
    },
    { porVal: "createTime", label: "创建时间", type: true, width: 100 },
    { porVal: "updateBy", label: "修改人", type: true, width: 180 },
    {
      porVal: "updateTime",
      label: "修改时间",
      type: true,
      width: 100,
    },
  ];

  /**
   * 列表查询接口
   */
  async getTableData(params) {
    try {
      let arrRes = await getTableData(params);
      if (arrRes.code == 200) {
        arrRes.data.forEach((element) => {
          element.regionNameList = Array.isArray(element.regionNameList)
            ? element.regionNameList.join("-")
            : "";
        });

        return arrRes.data || [];
      }
    } catch (error) {}
  }

  /**
   * 删除
   * @param row 当前点击列数据
   */
  async deleteById(row) {
    await deleteById(`id=${row.id}`);
  }
}
