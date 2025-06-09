# 全景大屏 区域选择级联 组件

全景大屏 区域选择级联 组件

## 代码演示

```demo
basic.vue
```

## API

### Props

| 参数          | 类型    | 默认值  | 说明                       |
| ------------- | ------- | ------- | -------------------------- |
| componentKey  | String  | ''      | 组件 key 值 防止 emit 错乱 |
| v-model       | Boolean | `false` | 是否展开                   |
| canSetDefault | Boolean | true    | 是否支持重置默认值         |
| data          | Array   | []      | 地区级联数据               |
| defaultArea   | Object  | {}      | 地区默认值                 |

### Event

| 事件名                | 事件参数类型 | 示例值 | 说明           |
| --------------------- | ------------ | ------ | -------------- |
| [componentKey-]select | Object       | {}     | 选择区域       |
| [componentKey-]reset  | -            | -      | 重置选择       |
| change                | Boolean      | false  | 变更弹窗展示值 |

### Methods

| 方法名  | 说明         | 参数   |
| ------- | ------------ | ------ |
| setData | 设置默认选中 | Object |
