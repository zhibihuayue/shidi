// 通用配置
const tyThemeConfig = {
  // 可视域
  viewshed: {
    backgroundColor: '#4F9FFF', // 背景面颜色
    fanColor: '#4F9FFF', // 扇形颜色
    backgroundSelectedColor: '#FB913C', // 背景面选中颜色
    fanSelectedColor: '#FB913C' // 扇形选中颜色
  },
  iconConfig: {
    icon1: require('../assets/images/wiseblue/camera-normal.png'), // 在线 摄像机
    icon2: require('../assets/images/wiseblue/camera-offline.png'), // 离线
    clickIcon: require('../assets/images/wiseblue/camera-select.png'), // 选中
    clickIcon2: require('../assets/images/wiseblue/camera-offline-select.png'), // 离线选中
    clusterImg: require('../assets/images/wiseblue/camera-cluster.png'), // 聚合图标
    width: 34, // 宽
    height: 34, // 高
    clusterWidth: 60, // 聚合图标宽度
    clusterHeight: 60, // 聚合图标高度
    clusterOffset: [30, 30]
  }
}
// 林业配置
const lyThemeConfig = {
  viewshed: {
    backgroundColor: '#3CFFE9', // 背景面颜色
    fanColor: '#3CFFE9', // 扇形颜色
    backgroundSelectedColor: '#F9FF6C', // 背景面选中颜色
    fanSelectedColor: '#F9FF6C' // 扇形选中颜色
  },
  iconConfig: {
    icon1: require('../assets/images/aquamarine/camera-normal.png'), // 在线 摄像机
    icon2: require('../assets/images/aquamarine/camera-offline.png'), // 离线
    clickIcon: require('../assets/images/aquamarine/camera-select.png'), // 选中
    clickIcon2: require('../assets/images/aquamarine/camera-select.png'), // 离线选中
    clusterImg: require('../assets/images/aquamarine/camera-cluster.png'), // 聚合图标
    width: 43, // 宽
    height: 46, // 高
    clusterWidth: 60, // 聚合图标宽度
    clusterHeight: 60, // 聚合图标高度
    clusterOffset: [30, 30]
  }
}
// 国土配置
const gtThemeConfig = {
  viewshed: {
    backgroundColor: '#FFFA28', // 背景面颜色
    fanColor: '#FFFA28', // 扇形颜色
    backgroundSelectedColor: '#FF7F3C', // 背景面选中颜色
    fanSelectedColor: '#FF7F3C' // 扇形选中颜色
  },
  iconConfig: {
    icon1: require('../assets/images/terracotta/camera-normal.png'), // 在线 摄像机
    icon2: require('../assets/images/terracotta/camera-offline.png'), // 离线
    clickIcon: require('../assets/images/terracotta/camera-select.png'), // 选中
    clickIcon2: require('../assets/images/terracotta/camera-select.png'), // 离线选中
    clusterImg: require('../assets/images/terracotta/camera-cluster.png'), // 聚合图标
    width: 34, // 宽
    height: 34, // 高
    clusterWidth: 60, // 聚合图标宽度
    clusterHeight: 60, // 聚合图标高度
    clusterOffset: [30, 30]
  }
}

export function getConfig(theme) {
  // 主题 'theme-wiseblue':通用 'theme-aquamarine':林业 'theme-terracotta':国土
  const themeConfigMap = {
    'theme-wiseblue': tyThemeConfig,
    'theme-aquamarine': lyThemeConfig,
    'theme-terracotta': gtThemeConfig
  }
  return themeConfigMap[theme]
}
