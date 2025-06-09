# 更新日志

## [1.6.90] - 2024-08-30

### 新增

#### [common-comp-inspection-task-list] 巡查任务列表基础版
#### [common-comp-accuracy-today-alarms] 今日告警准确率基础版
#### [common-comp-realtime-air-quality] 实时空气质量基础版
#### [common-comp-air-quality-forecast] 空气质量预报基础版
#### [common-comp-tool-fire-prediction] 火势蔓延预测组件基础版
#### [common-comp-epidemic-wood-statistics] 疫木统计组件基础版
#### [common-comp-mining-tree] 矿业权组件基础版
#### [common-comp-alarm-atlas] 非农非粮告警图谱组件基础版

### 变动
#### [common-comp-ar-map] 小地图组件
- 获取可视域数据接口更换

#### [common-comp-ar-player] ar定制播放器
- 服务迁移接口变更

#### [common-comp-alarm-atlas] ar大屏标签展示基础版
- 部分后台优化接口替换
- 更新一键告警组件

#### [common-comp-history-video-tree] 录像回放列表
- 服务迁移接口变更

#### [common-comp-ar-history-video] 录像播放组件
- 服务迁移接口变更

#### [common-comp-source-tree] 资源树列表基础版
- 根节点增加刷新按钮
- 样式优化

#### [common-comp-monitor-top] 告警大屏顶部统计
- 增加赤土黄皮肤风格

#### [common-comp-video] 视频管理组件
- 巡航计划弹窗新增一行时添加通道信息


#### [common-comp-grid-operator-tree] 网格员列表
- 新增刷新按钮
- 新增责任网格功能

#### [common-comp-grid-tree] 网格列表
- 新增刷新按钮

#### [common-comp-search-map] 地图查询
- 新增 props addressCode，默认显示对应的区域

#### [common-comp-alarm-detail] 告警详情专业版
- 新增到这里辅助功能按钮
- 新增转案件辅助功能按钮
- 告警来源为物联设备告警的，告警设备信息可以为多个

#### [common-comp-alarm-list] 告警列表基础版
- 新增 告警筛选功能
- 新增 滚动加载
#### [common-comp-alarm-list] 告警列表统计版
- 新增 告警筛选功能
- 新增 滚动加载
#### [common-comp-ar-configuration] 大屏功能按钮配置组件
- 服务迁移接口变更
- eslint问题修复
#### [common-comp-ar-preset] 预置位设置组件
- eslint问题修复
- UI样式变更

### 修复

## [1.6.86] - 2024-08-02

### 修复

#### [common-comp-video] 视频管理组件

- 修复巡航计划异常的问题。

#### [common-comp-track-popup] 轨迹组件

- 修复时间范围选择器错位问题。

以上组件已上传至生产环境1.6.80版本

## [1.6.85] - 2024-07-30

### 修复

#### [common-base-component-video-player-listener] 视频播放器监听组件

- 修复视频播放弹窗下载录像回放视频跨域的问题

### 变动

#### [common-comp-video] 视频管理组件

- 优化视频管理铁塔视角切换客户视角时崩溃问题。
- 优化首次进入视频管理实时视频树加载两次问题。

#### [common-comp-alarm-detail] 告警详情专业版

- 事件描述增加`监测目标名称`

以上组件已上传至生产环境1.6.80版本

## [1.6.80] - 2024-07-26

### 新增

#### [common-comp-intelligent-assistant] 数字人助手

#### [common-comp-forest-gateway-camera] 行业组件-林区卡口

#### [common-comp-snap-list] 行业组件-实时抓拍

#### [common-comp-ar-map] 小地图组件(AR 组件)

#### [common-base-component-video-player-listener] 视频播放器监听组件

#### [common-comp-alarm-detail-large] 告警详情大字版

#### [common-comp-species-picture] 行业组件-物种图片基础版

#### [common-comp-trap-collect-log] 行业组件-诱捕器采集记录基础版

### 变动

#### [common-comp-alarm-to-case] 告警转案件组件
- 主办人从输入框改成下拉框
- 主办人跟协办人不能想同，给校验
- 图片限制为png、jpg、jpeg、视频限制为mp4、音频限制为mp3，大小都限制为10M以下
- 在涉案人员、涉案车辆、处罚信息三个导航页的保存按钮旁边添加取消按钮，可关闭弹框
- 检测预警页面点告警转案件，删除文书头部导航栏、删除涉案人员、涉案车辆、处罚信息左侧导航栏
- 检测预警页面点告警转案件，点击保存时，新增关闭弹框功能



#### [common-comp-tree] 摄像机列表基础本

- el-tree 组件更换虚拟树组件
- 修复筛选面板与筛选图标状态同步问题
- 兼容 AR 大屏
- 摄像机列表选中节点居中显示调用虚拟树内部封装方法

#### [common-comp-iot-tree] 物联设备列表

- 修复代码扫描问题
- 修改换肤问题
- el-tree 组件更换虚拟树组件

#### [common-comp-iot-tree] 雷达设备列表

- 修复代码扫描问题
- 修改换肤问题
- el-tree 组件更换虚拟树组件

#### [common-comp-iot-tree] 大喇叭设备列表

- 修复代码扫描问题
- 修改换肤问题
- el-tree 组件更换虚拟树组件
- 修改实时喊话

#### [common-comp-source-tree] 资源列表基础本

- el-tree 组件更换虚拟树组件

#### [common-comp-tree-recorder] 执法记录仪列表基础本

- el-tree 组件更换虚拟树组件

#### [common-base-components] 内部全局通用组件

- 添加基础虚拟树组件 [base-virtual-tree]

#### [common-comp-map] 基础地图

- 允许配置是否触发全局事件
- 允许配置可选择的地图模式
- 允许配置默认呈现的地图模式

#### [common-comp-tool-box] 工具箱

- 图层管理支持自定义图标配置
- 增加三维地图特定的贴地处理开关，以优化三维下弹窗元素展示效果
- `配置项`界面样式变更，增加二级功能配置。增加配置`告警类型`、`地图高亮模式`、`地图切换模式`

#### [common-comp-video-inspection] 周边分析

- 增加`执法记录仪`设备类型查询
- 界面布局调整

#### [common-comp-video-inspection] 视频巡检

- 优化巡检中箭头动画效果和表现
- 对大摄像头数据量时提供性能优化

#### [common-comp-video-inspection-polygon] 视频巡检图斑版

- 允许配置巡检时，图斑的渲染层级

#### [common-comp-ar-cruise-plan] ar 大屏巡航计划组件

- 详情弹窗根据最新 UI 进行更改

#### [common-comp-label-filter] ar 大屏标签过滤组件

- 增加“建筑设施类标签、道路设施类标签”相关内容

#### [common-comp-ar-history-video] 录像播放组件

- 增加`录像倍速播放功能`

#### [common-comp-ar-player] AR 定制播放器

- AR 实景抓视频功能优化

#### [common-comp-ar-label] ar 大屏标签管理组件

- 新增/编辑页增加建筑类、设施类标签
- 标签展示页增加范围标签展示
- 标签展示页增加建筑类、设施类标签详情

#### [common-comp-video] 视频管理组件

- 新增预置位抓图下载功能
- 视频窗口抓图\抓视频添加水印
- 新增倍速同步切换功能

#### [common-comp-alarm-detail] 告警详情

- 事件描述 ai 告警增加扩展参数字段
- 告警详情增加可下载全部视频和图片，可下载单个图片或视频
- 新增督办辅助功能，顶部增加督办消息提示

#### [common-comp-message-remind] 消息提醒

- 增加督办消息

#### [common-comp-search-map] 地图查询

- 支持眼膜类型：地区、眼膜
- 眼膜类型由地图小工具控制（地图切换、地图显示）
- 支持同步加载和异步加载两种方式
- 首次加载可以控制是否渲染眼膜

#### [common-comp-grid-operator-tree] 网格员列表

- 网格员点击，如果网格员和网格多对一关系，显示高亮所有网格员

#### [common-comp-land-layer-tree] 国土图层组件

- 支持传入图层层级 API
- 兼容组件异步加载

#### [common-comp-footer] 底部功能区组件

- 兼容组件异步加载

#### [common-comp-tool-spot] 地块查询组件

- 支持传入图层层级 API

#### [common-comp-tool-space] 空间查询组件

- 支持传入图层层级 API

#### [common-comp-tool-compound] 复合查询组件

- 支持传入图层层级 API

#### [common-comp-spot-detail] 地块详情组件

- 支持弹窗辅助功能配置

#### [common-comp-sense-time-line] 遥感时间轴组件

- 调整播放条播放逻辑和位置信息

### 修复

#### [common-comp-ar-top-function] ar 大屏顶部功能组件

- 修复代码扫描问题

#### [common-comp-ar-camera-dialog] ar 大屏摄像机弹窗组件

- 修复代码扫描问题

#### [common-comp-ar-configuration] 大屏功能按钮配置组件

- 摄像树增加加载效果

#### [common-comp-label-filter] ar 大屏标签过滤组件

- 修复代码扫描问题
- 修改图标库

#### [common-comp-weather] 大天气卡片组件

- 大天气卡片更新时间显示错误

#### [common-comp-weather-small] 小天气卡片组件

- 小天气卡片更新时间显示错误

#### [common-comp-history-video-tree] 录像回放列表

- 修复代码扫描问题

#### [common-base-component-video-player] 视频播放器组件

- 修复代码扫描问题

#### [common-comp-search-map] 地图查询

- 修复代码扫描问题

#### [common-comp-grid-tree] 网格列表

- 修复代码扫描问题

#### [common-comp-grid-operator-tree] 网格员列表

- 修复代码扫描问题

---

## [1.6.75] - 2024-7-12

### 修复

#### [common-comp-alarm-detail] 告警详情

- 允许配置告警地图打点、图斑图标展示
- 允许配置图斑的渲染层级

### 变更

#### [common-comp-search-map] 地图查询

- 地图眼膜参数可配置
- 眼膜绘制完成后通过 event-bus 向外传递

---

## [1.6.70] - 2024-06-22

### 新增

#### [common-base-component-video-player] 视频播放器组件

#### [common-comp-ar-top-function] ar 大屏顶部功能组件

#### [common-comp-ar-cruise-plan] ar 大屏巡航计划组件

#### [common-comp-ar-camera-dialog] ar 大屏摄像机弹窗组件

#### [common-comp-ar-preset] 预置位设置组件

#### [common-comp-ar-configuration] 大屏功能按钮配置组件

#### [common-comp-label-filter] ar 大屏标签过滤组件

#### [common-comp-history-video-tree] ar 大屏录像回放列表

#### [common-comp-ar-history-video] ar 大屏录像播放组件

#### [common-comp-ar-player] ar 定制播放器

- AR 实景主播放窗口
- AR 实景底部小播放窗口
- AR 录像底部小播放窗口

#### [common-comp-ar-label] ar 大屏标签管理组件

- 标签展示
- 标签新增与编辑

### 变动

#### [common-comp-grid-operator-tree] 网格员列表

- 支持网格类型的数据绘制眼膜

#### [common-comp-tree] 摄像机列表基础本

- 兼容 AR 大屏
- 通道节点图标可配置

#### [common-comp-tree] 物联设备列表基础本

- 添加设备树筛选
- 添加弹窗图片信息

#### [common-comp-tree] 雷达列表基础本

- 添加设备树筛选
- 添加弹窗图片信息

#### [common-comp-tree] 大喇叭列表基础本

- 添加设备树筛选
- 添加弹窗图片信息

#### [common-comp-source-tree] 资源列表基础本

- 节点增加收藏功能
- 资源详情弹窗增加 tab 切换
- 详情弹窗经纬度字段由保留 9 位改为保留 6 位小数
- 详情弹窗增加图片展示及轮播

### [common-comp-tree-recorder] 执法记录仪列表基础本

- el-tree 组件更换虚拟树组件

#### [common-comp-weather] 大卡片天气

- 增加`天气灾害预警`

#### [common-comp-weather-small] 小卡片天气

- 增加`天气灾害预警`

#### [common-comp-uav-tree] 无人机列表

- 增加`筛选`功能
- 无人机弹窗增加`无人机图片`tab

#### [common-comp-alarm-detail] 告警详情

- 增加告警事件`天气信息`
- 增加`区域屏蔽压制`功能
- 卡口告警事件信息增加`前端告警识别结果和后端算法识别结果`
- 物联告警事件信息增加告警规则为`监测均值`相关信息
- 周边视频搜索附近摄像机范围变更为`5km`
- 历史告警增加`下载告警图片/视频`功能

---

## [1.6.50] - 2024-07-05

### 新增

#### [common-comp-banner] 新增 banner

---
