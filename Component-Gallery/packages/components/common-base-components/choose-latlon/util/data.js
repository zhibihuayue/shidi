export const groupColumn = [
  {
    prop: 'index',
    label: '序号',
    custom: true,
    tooltip: true,
    width: 60
  },
  {
    prop: 'emergencyUserAccount',
    label: '账号',
    custom: true,
    tooltip: true,
    width: 160
  },
  {
    prop: 'emergencyUserName',
    label: '姓名',
    custom: true,
    tooltip: true,
    width: 134
  },
  {
    prop: 'phoneNumber',
    label: '手机号',
    custom: true,
    tooltip: true
  }
]
export const eventLevelEnum = [
  {
    key: 4,
    label: '特别重大',
    className: 'very-important'
  },
  {
    key: 3,
    label: ' 重大',
    className: 'important'
  },
  {
    key: 2,
    label: '较大',
    className: 'large'
  },
  {
    key: 1,
    label: '一般',
    className: 'normal'
  }
]

export const eventStateEnum = [
  {
    key: 1,
    label: '未处置',
    className: 'todo-status'
  },
  {
    key: 2,
    label: '处置中',
    className: 'doing-status'
  },
  {
    key: 3,
    label: '已完成',
    className: 'done-status'
  },
  {
    key: 4,
    label: '已归档',
    className: 'archive-status'
  }
]

export const tabsData = [
  { label: '事件信息', name: 'eventinfo' },
  { label: '指挥部', name: 'headquarters' },
  { label: '行动计划', name: 'actionplan' },
  { label: '应急资源', name: 'source' }
]

export const eventWarningEnum = [
  {
    key: 'Blue',
    label: '蓝色预警',
    className: 'blue-warning'
  },
  {
    key: 'Orange',
    label: '橙色预警',
    className: 'orange-warning'
  },
  {
    key: 'Red',
    label: '红色预警',
    className: 'red-warning'
  },
  {
    key: 'Yellow',
    label: '黄色预警',
    className: 'yellow-warning'
  },
  {
    key: 'White',
    label: '白色预警',
    className: 'white-warning'
  },
  {
    key: 'Green',
    label: '绿色预警',
    className: 'green-warning'
  },
  {
    key: 'Black',
    label: '黑色预警',
    className: 'black-warning'
  },
  {
    key: 'null',
    label: '',
    className: 'null-warning'
  }
]

export const EventTypeTreeProps = {
  props: {
    children: 'children',
    name: 'typeName',
    id: 'id'
  },
  option: {
    defaultExpandAll: true,
    itemSize: 32,
    expandOnClickNode: false,
    indent: 6
  },
  configs: {
    optionKey: 'dictValue',
    optionLabel: 'dictLabel'
  }
}
export const EventTypeTreePropsPlan = {
  props: {
    children: 'children',
    name: 'typeName',
    id: 'id'
  },
  option: {
    showCheckbox: true,
    defaultExpandAll: true,
    itemSize: 32,
    expandOnClickNode: false,
    indent: 6
  },
  configs: {
    optionKey: 'dictValue',
    optionLabel: 'dictLabel'
  }
}
//关联事件列表
export const planlistcolumn = [
  {
    prop: 'eventName',
    label: '预案名称',
    width: '150',
    tooltip: true,
    custom: true
  },
  {
    prop: 'eventGradeDict',
    label: '事件等级',
    width: '80',
    tooltip: true,
    custom: true
  },
  {
    prop: 'eventTypeText',
    label: '事件类型',
    width: '178',
    tooltip: true,
    custom: true
  },
  {
    prop: 'creator',
    label: '创建人',
    width: '100',
    tooltip: true
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: '166',
    tooltip: true
  },
  {
    prop: 'modifier',
    label: '修改人',
    width: '100',
    tooltip: true
  },
  {
    prop: 'updateTime',
    label: '修改时间',
    width: '166',
    tooltip: true
  }
]
//查看预案-预案信息
export const planInfo = [
  {
    name: '预案名称',
    value: 'eventName',
    col: 1,
    flag: 'nobor'
  },
  {
    name: '事件等级',
    value: 'eventLevel',
    col: 1,
    flag: 'nobor'
  },
  {
    name: '事件类型',
    value: 'eventType',
    col: 2
  }
]
//查看预案-启动条件
export const startCondition = [
  {
    name: '死亡（含失踪）人数',
    value: 'deathCount',
    col: 1,
    flag: 'nobor'
  },
  {
    name: '紧急转移/救助人数',
    value: 'emergencyCount',
    col: 1,
    flag: 'nobor'
  },
  {
    name: '倒塌/损坏房屋数量',
    value: 'collapsesCount',
    col: 1,
    flag: 'nobor'
  },
  {
    name: '需救助人数',
    value: 'difficultCount',
    col: 1,
    flag: 'nobor'
  },
  {
    name: '其他',
    value: 'other',
    col: 2
  }
]
//查看预案-指挥部
export const planzhbgroupColumn = [
  {
    prop: 'emergencyUserAccount',
    label: '账号',
    tooltip: true,
    width: 160
  },
  {
    prop: 'emergencyUserName',
    label: '姓名',
    tooltip: true,
    width: 134
  },
  {
    prop: 'phoneNumber',
    label: '手机号',
    tooltip: true
  },
  {
    prop: 'groupName',
    label: '组织',
    tooltip: true
  }
]
//查看预案-行动计划
export const planactionColumn = [
  {
    prop: 'taskName',
    label: '任务名称',
    custom: true,
    width: 180
  },
  {
    prop: 'taskLeader',
    label: '负责人',
    custom: true,
    width: 340
  },
  {
    prop: 'taskContent',
    label: '任务内容',
    custom: true,
    width: 400
  },
  {
    prop: 'resourceNum',
    label: '应急资源',
    custom: true,
    width: 114
  }
]
//查看预案-查看任务
export const imporTaskInfo = [
  {
    name: '阶段：',
    value: 'stageName'
  },
  {
    name: '任务名称：',
    value: 'taskName'
  },
  {
    name: '负责人：',
    value: 'taskLeader'
  },
  {
    name: '任务内容：',
    value: 'taskContent'
  }
]
