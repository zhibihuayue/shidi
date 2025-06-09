import {
  getTableData,
  deleteById,
  formEdit,
  getVoById
} from "@/common/service/wetlandAnimal.js";

export class tabelTagLogic {
  rules = {
    pestType: [
      {
        required: true,
        message: "请选择",
        trigger: "change",
      },
    ],
    normalLow: [
      {
        required: true,
        message: "请输入",
        trigger: "change",
      },
    ],
    normalHigh: [
      {
        required: true,
        message: "请输入",
        trigger: "change",
      },
    ],
    earlyLow: [
      {
        required: true,
        message: "请输入",
        trigger: "change",
      },
    ],
    earlyHigh: [
      {
        required: true,
        message: "请输入",
        trigger: "change",
      },
    ],
    warnLow: [
      {
        required: true,
        message: "请输入",
        trigger: "change",
      },
    ],
    warnHigh: [
      {
        required: true,
        message: "请输入",
        trigger: "change",
      },
    ],
    riskLow: [
      {
        required: true,
        message: "请输入",
        trigger: "change",
      },
    ],
  };

  queryParams = {
    page: 1,
    limit: 10,
  };

  levelType = [
    { label: "国家级", id: 1 },
    { label: "省级", id: 2 },
    { label: "一般", id: 3 },
  ];

  // 0 东亚飞蝗 1-芦苇尖蛾 2-松墨天牛 3-稻蓟马"
  pestTypeOption = [
    { label: "东亚飞蝗", id: 0 },
    { label: "芦苇尖蛾", id: 1 },
    { label: "松墨天牛", id: 2 },
    { label: "稻蓟马", id: 3 },
  ];

  // 0-无 1-低 2-一般 3-中等 4-高
  foodLevelOption = [
    { label: "无", id: 0 },
    { label: "低", id: 1 },
    { label: "一般", id: 2 },
    { label: "中等", id: 3 },
    { label: "高", id: 4 },
  ];
  // 0-无 1-极少 2-少 3-中 4-多
  enemyLevelOption = [
    { label: "无", id: 0 },
    { label: "极少", id: 1 },
    { label: "少", id: 2 },
    { label: "中", id: 3 },
    { label: "多", id: 4 },
  ];

   // 风险等级默认值
   riskTypeData = [
    {
      id: 0,
      group: {
        normalLow: 0,
        normalHigh: 0.5,
        earlyLow: 0.5,
        earlyHigh: 5,
        warnLow: 5,
        warnHigh: 10,
        riskLow: 10,
      },
    },
    {
      id: 1,
      group: {
        normalLow: 0,
        normalHigh: 2,
        earlyLow: 2,
        earlyHigh: 6,
        warnLow: 6,
        warnHigh: 13,
        riskLow: 13,
      },
    },
    {
      id: 2,
      group: {
        normalLow: 0,
        normalHigh: 3,
        earlyLow: 3,
        earlyHigh: 7,
        warnLow: 7,
        warnHigh: 14,
        riskLow: 14,
      },
    },
    {
      id: 3,
      group: {
        normalLow: 0,
        normalHigh: 6,
        earlyLow: 6,
        earlyHigh: 15,
        warnLow: 15,
        warnHigh: 25,
        riskLow: 25,
      },
    },
  ];

  // 生态平衡默认值
  zoologyTypeData = [
    {
      id: 0,
      group: {
        foodLevel: 2,
        enemyLevel: 3,
      },
    },
    {
      id: 1,
      group: {
        foodLevel: 2,
        enemyLevel: 3,
      },
    },
    {
      id: 2,
      group: {
        foodLevel: 2,
        enemyLevel: 3,
      },
    },
    {
      id: 3,
      group: {
        foodLevel: 2,
        enemyLevel: 3,
      },
    },
  ]

  // 病虫害防治
  pestControlType = [
    {
      id:0,
      group: {
        normalAdvice: '常规监测',
        normalMedicine: '无',
        earlyAdvice:'局部化学防治',
        earlyMedicine:'氯氟氰菊酯、蚍虫啉',
        warnAdvice:'局部化学防治',
        warnMedicine:'氯氟氰菊酯、蚍虫啉',
        riskAdvice:'大规模化学防治',
        riskMedicine:'甲氨基阿维菌素、氯氰菊酯',
      },
    },
    {
      id:1,
      group: {
        normalAdvice: '常规监测',
        normalMedicine: '无',
        earlyAdvice:'局部化学防治',
        earlyMedicine:'氯菊酯、阿维菌素',
        warnAdvice:'局部化学防治',
        warnMedicine:'氯菊酯、阿维菌素',
        riskAdvice:'大规模化学防治',
        riskMedicine:'氯氟氰菊酯、氟虫腈',
      },
    },
    {
      id:2,
      group: {
        normalAdvice: '常规监测',
        normalMedicine: '无',
        earlyAdvice:'局部化学防治',
        earlyMedicine:'乙酰甲胺磷、阿维菌素',
        warnAdvice:'局部化学防治',
        warnMedicine:'乙酰甲胺磷、阿维菌素',
        riskAdvice:'大规模化学防治',
        riskMedicine:'蚍虫啉、联苯菊酯',
      },
    },
    {
      id:3,
      group: {
        normalAdvice: '常规监测',
        normalMedicine: '无',
        earlyAdvice:'局部化学防治',
        earlyMedicine:'噻虫嗪、烯啶虫胺',
        warnAdvice:'局部化学防治',
        warnMedicine:'噻虫嗪、烯啶虫胺',
        riskAdvice:'大规模化学防治',
        riskMedicine:'氟啶虫胺腈、蚍虫啉',
      },
    },
  ]

  columns = [
    {
      porVal: "pestType",
      label: "病虫害名称",
      type: false,
      fixed: "left",
      optionMap: this.pestTypeOption
    },
    {
      porVal: "foodLevel",
      label: "食物丰富度",
      type: true,
      optionMap: this.foodLevelOption,
      width:122
    },
    {
      porVal: "enemyLevel",
      label: "天敌情况",
      type: true,
      optionMap: this.enemyLevelOption,
      width:122
    },
    {
      porVal: "normalRangeInterval",
      label: "正常值阈值",
      type: true,
      width:190
    },
    {
      porVal: "normalAdvice",
      label: "正常值-防治建议",
      type: true,
      width:190
    },
    {
      porVal: "normalMedicine",
      label: "正常值-推荐药物",
      type: true,
      width:190
    },
    {
      porVal: "earlyRangeInterval",
      label: "预警值阈值",
      type: true,
      width:190
    },
    {
      porVal: "earlyAdvice",
      label: "预警值-防治建议",
      type: true,
      width:190
    },
    {
      porVal: "earlyMedicine",
      label: "预警值-推荐药物",
      type: true,
      width:190
    },

    {
      porVal: "warnRangeInterval",
      label: "警戒值阈值",
      type: true,
      width:190
    },
    {
      porVal: "warnAdvice",
      label: "警戒值-防治建议",
      type: true,
      width:190
    },
    {
      porVal: "warnMedicine",
      label: "警戒值-推荐药物",
      type: true,
      width:190
    },

    {
      porVal: "riskRangeInterval",
      label: "风险值阈值",
      type: true,
      width:190
    },
    {
      porVal: "riskAdvice",
      label: "风险值-防治建议",
      type: true,
      width:190
    },
    {
      porVal: "riskMedicine",
      label: "风险值-推荐药物",
      type: true,
      width:190
    },
  ];


  // 病虫害防治tip
  preventionControlTipList={
    0:[
      {
        label:"东亚飞蝗",
        id:'0-0'
      },
      {
        label:'正常值：防治建议-常规监测；推荐药物-无。',
        id:'0-1'
      },
      {
        label:'预警值：防治建议-局部化学防治；推荐药物-氯氟氰菊酯、蚍虫啉。',
        id:'0-2'
      },
      {
        label:'警戒值：防治建议-局部化学防治；推荐药物-氯氟氰菊酯、蚍虫啉。',
        id:'0-3'
      },
      {
        label:'风险值：防治建议-大规模化学防治；推荐药物-甲氨基阿维菌素、氯氰菊酯。',
        id:'0-4'
      }
    ],
    1:[
      {
        label:"芦苇尖蛾",
        id:"1-0"
      },
      {
        label:'正常值：防治建议-常规监测；推荐药物-无。',
        id:"1-1"
      },
      {
        label:'预警值：防治建议-局部化学防治；推荐药物-氯菊酯、阿维菌素。',
        id:"1-2"
      },
      {
        label:'警戒值：防治建议-局部化学防治；推荐药物-氯菊酯、阿维菌素。',
        id:"1-3"
      },
      {
        label:'风险值：防治建议-大规模化学防治；推荐药物-氯氟氰菊酯、氟虫腈。',
        id:"1-4"
      }
    ],
    2:[
      {
        label:"松墨天牛",
        id:"2-0"
      },
      {
        label:'正常值：防治建议-常规监测；推荐药物-无。',
        id:'2-1'
      },
      {
        label:'预警值：防治建议-局部化学防治；推荐药物-乙酰甲胺磷、阿维菌素。',
        id:'2-2'
      },
      {
        label:'警戒值：防治建议-局部化学防治；推荐药物-乙酰甲胺磷、阿维菌素。',
        id:'2-3'
      },
      {
        label:'风险值：防治建议-大规模化学防治；推荐药物-蚍虫啉、联苯菊酯。',
        id:'2-4'
      }
    ],
    3:[ 
      {
        label:"稻蓟马",
        id:'3-0'
      },
      {
        label:'正常值：防治建议-常规监测；推荐药物-无。',
        id:'3-1'
      },
      {
        label:'预警值：防治建议-局部化学防治；推荐药物-噻虫嗪、烯啶虫胺。',
        id:"3-2"
      },
      {
        label:'警戒值：防治建议-局部化学防治；推荐药物-噻虫嗪、烯啶虫胺。',
        id:"3-3"
      },
      {
        label:'风险值：防治建议-大规模化学防治；推荐药物-氟啶虫胺腈、蚍虫啉。',
        id:"3-4"
      }
    ]
  }  
  
  // 天敌情况tip
  naturalEnemyTipList=[
    {
      label:"多：天敌的数量远多于被捕食者，能够有效地控制被捕食者的数量。",
      id:0
    },
    {
      label:"中：天敌与被捕食者的数量相对平衡，能够维持一定的生态稳定。",
      id:1
    },
    {
      label:"少：天敌对被捕食者有一定的控制作用，但不会导致被捕食者数量的剧烈波动。",
      id:2
    },
    {
      label:"极少：天敌的数量相对较少，对被捕食者的控制能力较弱。",
      id:3
    },
    {
      label:'无：代表暂无数据。',
      id:4
    }
  ]

  // 食物丰富度
  foodAbundanceTipList=[
    {
      label:"高丰富度：物种高度丰富，特有属、种繁多，生态系统丰富多样。对应生物多样性指数(BI)≥60。",
      id:1
    },
    {
      label:"中等丰富度：物种较丰富，特有属、种较多，生态系统类型较多，同部地区生物多样性高度丰富。对应生物多样性指数(BI)在30≤BI<60范围内。",
      id:2
    },
    {
      label:"一般丰富度：物种较少，特有属、种不多，局部地区生物多样性较丰富，但生物多样性总体水平一般。对应生物多样性指数(BI)在20≤BI<30范围内。",
      id:3
    },
    {
      label:"低丰富度：物种贫乏，生态系统类型单一、脆弱，生物多样性极低。对应于生物多样性指数(BI)<20。",
      id:4
    },
    {
      label:'无：代表暂无数据。',
      id:5
    }
  ]

  /**
   * 列表查询接口
   */
  async getTableData(params) {
    try {
      let arrRes = await getTableData(params);
      if (arrRes.code == 200) {
        return arrRes.data || [];
      }
    } catch (error) {}
  }
  /**
   * 列表id查询接口
   */
  async getVoById(params) {
    try {
      let arrRes = await getVoById(params);
      if (arrRes.code == 200) {
        return arrRes.data || [];
      }
    } catch (error) {}
  }

  async formEdit(row) {
    try {
      let arrRes =  await formEdit(row);
      console.log(arrRes,'arrRes---');
      if (arrRes.code == 200) {
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
