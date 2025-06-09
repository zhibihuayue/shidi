# 折叠面板组件

支持换肤的折叠面板组件

## 代码演示

```demo
basic.vue
```

## API

### Props

| 参数       | 类型    | 可选值     | 默认值                    | 说明                 |
| ---------- | ------- | ---------- | ------------------------- | -------------------- |
| title      | String  |            | ''                        | 面板标题             |
| isActive   | Boolean | true/false | false                     | 是否展开             |
| addMargin  | Boolean | true/false | false                     | 标题增加 margin 样式 |
| shrinkIcon | String  |            | icon-tongyong_icon_xiala  | 自定义收缩图标       |
| expandIcon | String  |            | icon-tongyong_icon_shouqi | 自定义展开图标       |

### 事件

| 事件名 | 事件参数类型 | 示例值 | 说明     |
| ------ | ------------ | ------ | -------- |
| click  | Event        | 无     | 点击事件 |

### 插槽

| 插槽名   | 插槽参数类型 | 示例值 | 说明                       |
| -------- | ------------ | ------ | -------------------------- |
| 默认插槽 | void         | 无     | 容器 body 内可承载任意元素 |
| title    | void         | 无     | 自定义标题区域             |
