// 导入图片资源
import img1 from '../assets/images/wildlife-item-bg.png'
// 导入图片
import img1Active from '../assets/images/wildlife-item-bg-active.png'
// 导入图片
import img2 from '../assets/images/today-img.png'
// 导入图片
import img3 from '../assets/images/today-species.png'
// 导入图片
import cameraNormal from '../assets/images/camera-normal.png'
// 导入图片
import cameraSelect from '../assets/images/camera-select.png'
// 导出野生动植物列表
export const wildlifeList = [
  {
    // 声纹采集设备
    label: '声纹采集设备',
    key: 'wildlifeCamera',
    value: 'allProtectionDeviceNum',
    img: img1,
    activeImg: img1Active,
    theme: '#FFAB10',
    type: '1',
    params: {}
  },
  {
    // 今日音频
    label: '今日音频',
    key: 'todayPicture',
    value: 'todayDeviceSnapNum',
    img: img2,
    activeImg: img2,
    theme: '#24AB83',
    type: '2'
  },

  {
    // 今日鸟类
    label: '今日鸟类',
    key: 'todaySpecies',
    value: 'todayMonitorBirdsNum',
    img: img3,
    activeImg: img3,
    theme: '#2493DC',
    type: '3'
  }
]
// 导出图标映射
export const iconMap = {
  // 选中状态下的图标和尺寸
  selected: {
    icon: cameraSelect,
    size: [46, 50]
  },
  // 正常状态下的图标和尺寸
  normal: {
    icon: cameraSelect,
    size: [46, 50]
  }
}
