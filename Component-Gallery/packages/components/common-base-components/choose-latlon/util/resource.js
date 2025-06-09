// 通用配置
const tyThemeConfig = {
  iconConfig: {
    clickIcon: 'tyIcon', // 选中
    width: 30, // 宽
    height: 35 // 高
  }
}
// 林业配置
const lyThemeConfig = {
  iconConfig: {
    clickIcon: 'lyIcon', // 选中
    width: 43, // 宽
    height: 46 // 高
  }
}
// 国土配置
const gtThemeConfig = {
  iconConfig: {
    clickIcon: 'gtIcon', // 选中
    width: 48, // 宽
    height: 51 // 高
  }
}

export function getConfig(theme) {
  const themeConfigMap = {
    ty: tyThemeConfig,
    ly: lyThemeConfig,
    gt: gtThemeConfig
  }
  return themeConfigMap[theme]
}
// 通用配置
const tyThemeColorfig = {
  iconConfig: {
    color: '#4F9FFF',
    fillColor: 'rgba(19, 115, 230, 0.40)',
    fillColorHex: '#1373E6'
  }
}
// 林业配置
const lyThemeColorfig = {
  iconConfig: {
    color: '#0DC985',
    fillColor: 'rgba(2, 50, 32, 0.40)',
    fillColorHex: '#023220'
  }
}
// 国土配置
const gtThemecolorfig = {
  iconConfig: {
    color: '#FFE167',
    fillColor: 'rgba(86,64,0,0.4)',
    fillColorHex: '#564000'
  }
}

export function getConfigColor(theme) {
  const themeColorfigMap = {
    ty: tyThemeColorfig,
    ly: lyThemeColorfig,
    gt: gtThemecolorfig
  }
  return themeColorfigMap[theme]
}
export function getVideoPlayerColor(theme) {
  const themeColorfigMap = {
    ty: '#1373E6',
    ly: '#F9FF6C',
    gt: '#FFFA28'
  }
  return themeColorfigMap[theme]
}
