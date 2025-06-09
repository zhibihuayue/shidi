# 告警详情顶部组件

告警详情组件

## 代码演示

## 传参

| Name | Description | Value | Type   | Default |
| ---- | ----------- | ----- | ------ | ------- |
| item | 自定义事件  | {}    | Object |         |

自定义数据字段示例=>{
tip: '自定义 1 号',
key: 'test1',
icon: 'iconfont_tools icon-shipinzujian_icon_fangda_n',
type: 'btn',
click: (tool) => {
this.toolClick()
}
}
| tip | 鼠标悬浮提示 | - | String | ''
| key | 自定义字段 | - | String | '' |
| icon | 图标 Class | - | String | '' |
| type | 图表类型 | - | String | '' |
| excludeToolbar | 自定义排除字段 | - | Array | [] |
| expandToolbar | 自定义 toolbar 传入 | - | Array | [] |

### 事件

| 事件名称                 | 说明     | 回调参数 |
| ------------------------ | -------- | -------- |
| downloadAlarmPicAndVideo | 下载全部 | 无       |
| collEvent                | 收藏     | 无       |
| clickFunBtn              | 分享     | 无       |

### EvnetBus 事件
