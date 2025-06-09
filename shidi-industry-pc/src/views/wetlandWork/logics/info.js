import {
  addList,
  editList,
  deleteByIdRegion,
  deleteByIdVegetation,
  getTableData,
  getRegionList,
} from "@/common/service/workbench.js";
import { iframeSDK } from "@ct/iframe-connect-sdk";
export class infoLogic {

  //湿地类型
  wetlandType = [
    { label: "沼泽湿地", id: 1 },
    { label: "湖泊湿地", id: 2 },
    { label: "河流湿地", id: 3 },
    { label: "滨海湿地", id: 4 },
    { label: "人工湿地", id: 5 },
  ];

  // 湿地面积单位
  static unitArea = [
    { label: "亩", id: 0 },
    { label: "公顷", id: 1 },
    { label: "km²", id: 2 },
  ];

  // 气候类型
  climateType = [
    { label: "热带雨林气候", id: 1 },
    { label: "热带草原气候", id: 2 },
    { label: "热带沙漠气候", id: 3 },
    { label: "热带季风气候", id: 4 },
    { label: "亚热带季风气候", id: 5 },
    { label: "地中海气候", id: 6 },
    { label: "温带海洋性气候", id: 7 },
    { label: "温带季风气候", id: 8 },
    { label: "温带大陆性气候", id: 9 },
    { label: "亚寒带针叶林气候", id: 10 },
    { label: "极地气候", id: 11 },
    { label: "高原山地气候", id: 12 },
  ];
  // 保护级别
  levelType = [
    { label: "国家级", id: 1 },
    { label: "省级", id: 2 },
    { label: "一般", id: 3 },
  ];

  //月份选择
  mouthType = [
    { label: "一月", id: 0 },
    { label: "二月", id: 1 },
    { label: "三月", id: 2 },
    { label: "四月", id: 3 },
    { label: "五月", id: 4 },
    { label: "六月", id: 5 },
    { label: "七月", id: 6 },
    { label: "八月", id: 7 },
    { label: "九月", id: 8 },
    { label: "十月", id: 9 },
    { label: "十一月", id: 10 },
    { label: "十二月", id: 11 },
  ];
  
  rules = {
    wetlandName: [
      {
        required: true,
        message: "请输入",
        trigger: "blur",
      },
    ],
    regionCodeList: [
      {
        required: true,
        message: "请选择",
        trigger: "change",
      },
    ],
    latitudeLongitude: [
      {
        required: true,
        message: "请输入",
        trigger: "chnage",
      },
    ],
    wetlandTypeList: [
      {
        required: true,
        message: "请选择",
        trigger: "change",
      },
    ],
    wetlandArea: [
      {
        required: true,
        message: "请输入",
        trigger: "change",
      },
    ],
    climateTypeList: [
      {
        required: true,
        message: "请选择",
        trigger: "change",
      },
    ],
    establishmentTime: [
      {
        required: true,
        message: "请选择",
        trigger: "change",
      },
    ],
    protectionLevel: [
      {
        required: true,
        message: "请输入",
        trigger: "change",
      },
    ],
    imageList: [
      {
        type: "array",
        required: true,
        message: "请选择",
        trigger: "change",
      },
    ],
    ownerUnit: [
      {
        required: true,
        message: "请输入",
        trigger: "blur",
      },
    ],
  }
  
  /**
   *  单位转换
   * @param {number} value 输入值
   * @param {string} fromUnit 现单位
   * @param {string} toUnit 原单位
   * @returns 转换值
   */
  static areaConverter(value, fromUnit, toUnit) {
    // 定义每种单位相对于平方公里的换算比例
    const conversions = {
      "km²": 1,
      '公顷': 100,
      '亩': 1500,
    };
    // 将输入值从源单位转换为平方公里
    const squareKilometers = value / conversions[toUnit];
    // 将平方公里的值转换为目标单位
    let numBack = squareKilometers * conversions[fromUnit];
    if (numBack % 1 !== 0) {
      // 如果是小数，保留两位小数
      return numBack.toFixed(2);
    } else {
      // 如果是整数，直接返回整数形式
      return numBack.toString();
    }
  }

   /**
     * 消息提示盒子
     */
   async messageBox(data){
    await iframeSDK( {
      iframeOperationId: 'message',
      message: data,
    })
  }

  /**
   * 新增保存
   * @param data 当前保存数据
   */
  async addList(row) {
    let res = await addList(row);
    return res;
  }
  /**
   * 编辑
   * @param data 当前编辑数据
   */
  async editList(row) {
    let res = await editList(row);
    return res;
  }

  /**
   * 删除区域
   */
  async deleteByIdRegion(data) {
    let res = await deleteByIdRegion(`id=${data.id}`);
    return res;
  }
  /**
   * 删除植被
   */
  async deleteByIdVegetation(data) {
   const res = await deleteByIdVegetation(`id=${data.id}`);
   return res
  }

  /**
   * 列表查询接口 刷新数据
   */
  async getTableData(params) {
    try {
      let arrRes = await getTableData(params);
      if (arrRes.code == 200) {
        return arrRes.data || [];
      }
    } catch (error) {
      this.messageBox(error);
    }
  }
  async getRegionList(params) {
    try {
      let arrRes = await getRegionList(params);
      if (arrRes.code == 200) {
        return arrRes.data || [];
      }
    } catch (error) {
      this.messageBox(error);
    }
  }
}
