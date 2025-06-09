# 鸟类声纹组件

鸟类声纹组件

## 代码演示

```demo
basic.vue
```

## API

| 参数                | 说明             | 类型    | 默认值                       | 备注                                            |
| ------------------- | ---------------- | ------- | ---------------------------- | ----------------------------------------------- |
| top                 | top 值           | Number  | 86                           | -                                               |
| right               | right 值         | Number  | 24                           | -                                               |
| left                | left 值          | Number  | null                         | -                                               |
| bottom              | bottom 值        | Number  | null                         | -                                               |
| maxHeight           | 设置最大高度     | Number  | 600                          | 跟所在大屏有关，需求要求支持高度撑满            |
| mapId               | 地图 id          | String  | ''                           | -                                               |
| configMemoryKey     | 记忆的 key 值    | String  | 'WildlifeBirdCamera' | -                                               |
| defaultWildlifeKeys | 三个卡片是否展示 | Array   | ['1','2','3']                | '1':鸟类声纹,'2':今日抓拍图片/视频,'3':今日物种 |
| showCardView        | 是否展示卡片视图 | Boolean | true                         |
| showListView        | 是否展示列表视图 | Boolean | true                         |

### EvnetBus 事件

- 组件监听事件

  | 事件名称                                                | 说明           | 回调参数                | 参数说明                                            |
  | ------------------------------------------------------- | -------------- | ----------------------- | --------------------------------------------------- |
  | common-comp-wildlife-bird-camera\_\_set-collect | 设置树节点收藏 | {code:'',isCollect:'1'} | code:摄像机编号 isCollect:'1' 收藏 '1' 取消收藏 '0' |

- 组件触发事件

  | 事件名称                                                | 说明               | 参数                        | 参数说明                                                    |
  | ------------------------------------------------------- | ------------------ | --------------------------- | ----------------------------------------------------------- |
  | common-comp-wildlife-bird-camera\_\_toggled     | 折叠展开事件       | {status: Boolean}           | status: true 展开 false 收起                                |
  | common-comp-wildlife-bird-camera\_\_collect     | 树节点点击收藏事件 | {codeList:[],isCollect:'1'} | codeList:摄像机编号数组 isCollect:'1' 收藏 '1' 取消收藏 '0' |
  | common-comp-wildlife-bird-camera\_\_card-toggle | 卡片激活展开       | {status: Boolean}           | status: true 展开 false 收起                                |
