# 告警详情辅助功能组件

告警详情组件

## 代码演示

## 传参

| Name | Description | Value | Type   | Default |
| ---- | ----------- | ----- | ------ | ------- |
| item | 自定义事件  | {}    | Object |         |

自定义数据字段示例=>{
content: '一键看向告警点',
key: 'point',
class: alarmPointClass,
type: 'btn',
click: (aux) => {
this.clickFunBtn('2')
}
},
| content | 鼠标悬浮提示 | - | String | ''
| key | 自定义字段 | - | String | '' |
| class | 图标 Class | - | String | '' |
| ctClass | 图标 Class | - | String | '' |
| name | 图标 Class | - | String | '' |
| type | 图表类型 | - | String | '' |
| noAuxiliaryList | 自定义排除字段 | - | Array | [] |
| auxiliaryList | 自定义 toolbar 传入 | - | Array | []

### 事件

| 事件名称    | 说明             | 回调参数 |
| ----------- | ---------------- | -------- |
| clickFunBtn | 辅助功能点击事件 | 无       |

### EvnetBus 事件
