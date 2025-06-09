import { iframeSDK, postMsgUtil, requestSDK } from '@ct/iframe-connect-sdk'
import $ from 'jquery'
import request from '../request/new-axios'
import { Loading, Message } from 'element-ui'
import { $store } from './store'
// import { getUserMemoryInfo } from '../../common-comp-map/src/service'
import { getConfigByKey } from './system/config'
import CommonMessage from '../funCommon/message/common-message'
import { cloneDeep } from 'lodash-es'

/**
 * 通用js方法封装
 */
export const PAGE_SIZES = [10, 20, 50, 100]
export const PAGE_SIZE = PAGE_SIZES[0] //分页中的每页条数
export const urlAnalysis = 'video-forestry-analysis' //analysis统计
export const urlBis = 'video-forestry-biss' //
export const urlBaseService = 'video-forestry-baseservice' //基础服务
export const urlEmengercy = 'video-forestry-emengercy'
export const urlImg = process.env.VUE_APP_BASE_IMG
const baseURL = process.env.VUE_APP_BASE_API
export const urlSystem = 'VIDEO-APPLY-SYSTEM'
const baserServerUrl = process.env.VUE_APP_BASE_SERVER_API
export const amapKey = 'e1fb9ce1bfa5beacb0187e93b2181661' //高德地图key
export const loadModuleObj = {
  leftSearch: '5',
  left: '3',
  right: '4',
  bottom: '2',
  top: '1',
  commonBottom: '0',
  float: '66',
  all: '99',
  bottom2: '11'
}

/** 将数字格式化逢三一断 */
export function numberFormat(value) {
  let result = '0'
  let valstr = ''
  let fixed = ''
  if (value && value > 0) {
    valstr = value.toString()
    if (valstr.indexOf('.') > -1) {
      fixed = valstr.substring(valstr.indexOf('.'), valstr.length)
      valstr = valstr.substring(0, valstr.indexOf('.'))
    }
    result = valstr.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + fixed
  }
  return result
}

/** 对象属性合成 */
export function extend() {
  const length = arguments.length
  let target = arguments[0] || {}
  if (typeof target !== 'object' && typeof target !== 'function') {
    target = {}
  }
  let i = 1
  if (length === 1) {
    target = this
    i--
  }
  for (i; i < length; i++) {
    const source = arguments[i]
    for (const key in source) {
      // 使用for in会遍历数组所有的可枚举属性，包括原型。
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key]
      }
    }
  }
  return target
}

export const verifyRules = {
  required: {
    required: true,
    message: '必填项',
    trigger: ['blur', 'change']
  },
  phone: {
    pattern: /^1[0-9]{10}$/,
    message: '请输入正确的手机号码',
    trigger: 'blur'
  },
  email: {
    type: 'email',
    message: '请输入正确的邮箱地址',
    trigger: 'blur'
  },
  Abc: {
    pattern: /^[A-Za-z]+$/,
    message: '只能输入字母',
    trigger: 'blur'
  },
  ABC: {
    pattern: /^[A-Z]+$/,
    message: '只能输入大写字母',
    trigger: 'blur'
  },
  abc: {
    pattern: /^[a-z]+$/,
    message: '只能输入小写字母',
    trigger: 'blur'
  },
  noCN: {
    pattern: /^[A-Za-z0-9]+$/,
    message: '只能输入数字、字母',
    trigger: 'blur'
  },
  sixNum: {
    pattern: /^\d{6}$/,
    message: '请输入6位数字',
    trigger: 'blur'
  },
  int: {
    pattern: /^(0|\+?[1-9][0-9]*)$/,
    message: '只能输入非负整数',
    trigger: 'blur'
  },
  zInt: {
    pattern: /^(\+?[1-9][0-9]*)$/,
    message: '只能输入正整数',
    trigger: 'blur'
  },
  url: {
    pattern: /^(http(s?)|):\/\/(.+)$/,
    message: '请输入正确的链接地址',
    trigger: 'blur'
  },
  float: {
    pattern: /^(([1-9]\d*)|(0))(\.\d{1,2})?$/,
    message: '只能输入非负数，且最多保留两位小数',
    trigger: 'blur'
  },
  idCard: {
    pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    message: '请输入正确的身份证号',
    trigger: 'blur'
  },
  longitude: {
    pattern:
      /^([-+])?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
    message: '经度整数部分为-180到180,小数部分为0到6位',
    trigger: 'blur',
    required: true
  },
  latitude: {
    pattern: /^([-+])?([0-8]?\d\.\d{0,6}|90\.0{0,6}|[0-8]?\d|90)$/,
    message: '纬度整数部分为-90到90,小数部分为0到6位',
    trigger: 'blur',
    required: true
  },
  account: {
    pattern: /^[a-zA-Z0-9_-]{4,16}$/,
    message: '账号必须为4-16位(字母/数字/下划线/减号)',
    trigger: 'blur'
  },
  password: {
    pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,20}$/,
    message: '密码必须为字母、数字和特殊符号组成的8-20位字符',
    trigger: 'blur'
  },
  creditCode: {
    pattern: /^[a-zA-Z0-9]{18}$/,
    message: '请输入字母和数字组成的18位字符',
    trigger: 'blur'
  },
  height: {
    pattern: /^[1-9]\d*(\.\d+)?$|^0\.\d*[1-9]\d*$/,
    message: '设备挂高为大于0的数值',
    trigger: 'blur',
    required: true
  },
  groundHeight: {
    pattern: /^[1-9]\d*(\.\d+)?$|^0\.\d*[1-9]\d*$/,
    message: '海拔为大于0的数值',
    trigger: 'blur',
    required: true
  },
  visionDistance: {
    pattern: /^[1-9]\d*(\.\d+)?$|^0\.\d*[1-9]\d*$/,
    message: '视野距离为大于0的数值',
    trigger: 'blur',
    required: true
  },
  horizontalAngle: {
    pattern:
      /^1\.\d*|^[2-9](\.\d+)?$|^[1]\d(\.\d+)?$|^[2-9]\d?(\.\d+)?$|^1[0-1]\d(\.\d+)?$/,
    message: '水平视角为大于1且小于120的数值',
    trigger: 'blur',
    required: true
  },
  verticalAngle: {
    pattern: /^15\.\d*|^1[6-9](\.\d+)?$|^[2-9]\d(\.\d+)?$|^1[0-1]\d(\.\d+)?$/,
    message: '垂直视角为大于15且小于120的数值',
    trigger: 'blur',
    required: true
  },
  direction: {
    pattern:
      /^0\.\d*[1-9]\d*|^[1-9]\d?(\.\d+)?$|^[1-2]\d{2}(\.\d+)?$|^3[0-5]\d(\.\d+)?$/,
    message: '方向角大于0且小于或等于360的数值',
    trigger: 'blur',
    required: true
  },
  pitch: {
    pattern: /^-?(90|[0-8]?\d?(\.\d+)?)$/,
    message: '俯仰角为-90到90的数值',
    trigger: 'blur',
    required: true
  }
}

/** 通用表单校验规则 */
export function getRules() {
  const length = arguments.length
  if (length === 0) {
    return {}
  }
  const isRequired = !!arguments[0]
  if (length > 1) {
    const rules = []
    rules.push({
      required: isRequired,
      message: '必填项',
      trigger: ['blur', 'change']
    })
    for (let i = 1; i < length; i++) {
      rules.push(verifyRules[arguments[i]])
    }
    return rules
  } else {
    return {
      required: isRequired,
      message: '必填项',
      trigger: ['blur', 'change']
    }
  }
}

/** 精确身份证号码校验 */
export function validateIDCardExact(rule, idcode, callback) {
  const weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2] // 加权因子
  const check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'] // 校验码
  const code = idcode + ''
  const last = idcode[17] // 最后一位
  const seventeen = code.substring(0, 17)
  // ISO 7064:1983.MOD 11-2 判断最后一位校验码是否正确
  const arr = seventeen.split('')
  const len = arr.length
  let num = 0
  for (let i = 0; i < len; i++) {
    num = num + arr[i] * weight_factor[i]
  }
  const last_no = check_code[num % 11] // 获取余数
  /**
   *格式的正则 正则思路：第一位不可能是0;第二位到第六位可以是0-9
   *第七位到第十位是年份，所以七八位为19或者20;十一位和十二位是月份，这两位是01-12之间的数值;十三位和十四位是日期，是从01-31之间的数值;
   *第十五，十六，十七都是数字0-9;十八位可能是数字0-9，也可能是X
   */
  const idCardPatter =
    /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][012])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/
  // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
  if (last === last_no && idCardPatter.test(idcode)) {
    callback()
  } else {
    callback(new Error('请输入正确的身份证号'))
  }
}

/**
 * 日期时间格式化
 * @param time
 * @param pattern
 * @returns {string}
 */
export function parseTime(time, pattern) {
  if (time == null || time === '' || arguments.length === 0) {
    return ''
  }
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }

  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  return format.replace(/{([ymdhisa])+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
}

/**
 * 表格时间格式化
 */
export function tableTimeFormat(row, column, cellValue) {
  return parseTime(cellValue, '{y}-{m}-{d} {h}:{i}:{s}')
}

/**
 * 表格日期格式化
 */
export function tableDateFormat(row, column, cellValue) {
  return parseTime(cellValue, '{y}-{m}-{d}')
}

/**
 *  数据字典列表转为字典格式化方法列表
 */
export function dictToFormatters(dicts, formatters) {
  Object.keys(dicts).forEach((key) => {
    formatters[key] = (row, column, cellValue) => {
      return this.selectDictLabel(dicts[key], cellValue)
    }
  })
}

/**
 * 表单重置
 */
export function resetForm(refName) {
  if (this.$refs[refName]) {
    const fields = this.$refs[refName].fields
    if (fields.length > 0) {
      fields.forEach((field) => {
        if (field.$children.length > 1) {
          if (!field.$children[1].disabled) {
            field.resetField()
          }
        }
      })
    }
  }
}

/**
 * 添加日期范围
 */
export function addDateRange(params, dateRange) {
  let search = params
  search.beginTime = ''
  search.endTime = ''
  if (dateRange != null && dateRange !== '') {
    search.beginTime = dateRange[0]
    search.endTime = dateRange[1]
  }
  return search
}

/** 回显数据字典 */
export function selectDictLabel(datas, value) {
  value = '' + value
  if (datas && value) {
    let actions = []
    Object.keys(datas).map((key) => {
      if (datas[key].dictValue === value) {
        actions.push(datas[key].dictLabel)
        return false
      }
    })
    return actions.join('')
  }
  return ''
}

/** 通用下载方法 */
export function download(fileName) {
  window.location.href =
    baseURL +
    '/admin/base/common/download/name?fileName=' +
    encodeURI(fileName) +
    '&delete=' +
    true
}

/** 字符串格式化(%s ) */
export function sprintf(str) {
  let args = arguments
  let flag = true
  let i = 1
  str = str.replace(/%s/g, function () {
    let arg = args[i++]
    if (typeof arg === 'undefined') {
      flag = false
      return ''
    }
    return arg
  })
  return flag ? str : ''
}

/** 转换字符串，undefined,null等转化为""  */
export function praseStrEmpty(str) {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()
  const diff = (now - d) / 1000
  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 返回utf8字符串的字节长度
 */
export function byteLength(str) {
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xdc00 && code <= 0xdfff) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  return cloneDeep(source)
}

/**
 * Check if an element has a class
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

/**
 * 根据Id获取地区名称
 * @returns {string}
 * @param name
 */
export function getAreaIdByName(name) {
  const options = [].concat(this.$store.getters.areaOptions)
  return getTreeId(options, name)
}

export function getAreaPidByName(name) {
  const options = [].concat(this.$store.getters.areaOptions)
  return getTreePid(options, name)
}

export function getTreePid(list, name) {
  for (let i = 0; i < list.length; i++) {
    const a = list[i]
    if (a.label === name) {
      return a.pid
    } else {
      if (a.children && a.children.length > 0) {
        const res = getTreePid(a.children, name)
        if (res) {
          return res
        }
      }
    }
  }
}

export function getTreeId(list, name) {
  for (let i = 0; i < list.length; i++) {
    const a = list[i]
    if (a.label === name) {
      return a.id
    } else {
      const res = haveFun(a)
      if (res) {
        return res
      }
    }
  }
  function haveFun(a) {
    if (a.children && a.children.length > 0) {
      const res = getTreeId(a.children, name)
      if (res) {
        return res
      } else {
        return null
      }
    } else {
      return null
    }
  }
}

/**
 * 根据Id获取地区名称
 * @param id
 * @returns {string}
 */
export function getAreaNameById(id) {
  const options = [].concat(this.$store.getters.areaOptions)
  return getTreeName(options, id)
}

/**
 * 根据Id获取部门名称
 * @param id
 * @returns {string}
 */
export function getDeptNameById(id) {
  const options = [].concat(this.$store.getters.deptOptions)
  return getTreeName(options, id)
}

/**
 * @returns {string}
 */
export function getTreeName(list, id) {
  for (let i = 0; i < list.length; i++) {
    const a = list[i]
    if (a.id === id) {
      return a.label
    } else {
      if (a.children && a.children.length > 0) {
        const res = getTreeName(a.children, id)
        if (res) {
          return res
        }
      }
    }
  }
}

/**
 * 封装简写的vue请求
 */
export class $v {
  static outLoginCount = 0
  static connectCount = 0

  /*
   * vue: 当前是以this.vue.$http或者this.vue.http方式请求(Vue、this)
   * url:请求链接
   * data:请求参数
   * success:请求成功回调
   * error:请求失败时是否报错(true时不报错),error三种形式:1.为function时调用 2.为true时不弹出提示错误，而是控制台输出  3.为false时弹出提示错误
   * loadParam对象: 属性loading,是否有加载动画,check是否校验,
   */
  static get(vue, url, params, success, error, loadParam = {}) {
    loadParam.connectMode = 'get'
    this.beforeConnect(vue, url, params, success, error, loadParam)
  }

  static post(vue, url, params, success, error, loadParam = {}) {
    loadParam.connectMode = 'post'
    this.beforeConnect(vue, url, params, success, error, loadParam)
  }

  static upload(vue, url, params, success, error, loadParam = {}) {
    loadParam.connectMode = 'post'
    let $loginInfo = $store.get('$loginInfo')
    params = params || {}
    if (this.haveLoginInfo($loginInfo)) {
      //存在登录数据
      params.creator = $loginInfo.userAccount
      if (!params.tenantId && !this.isEmpty($loginInfo.tenantId)) {
        //非空
        params.tenantId = $loginInfo.tenantId
      }
    }
    loadParam.isLocation = true
    url = baserServerUrl + '/' + url
    this.connect(vue, url, params, success, error, loadParam)
  }

  static postNoLoadCheck(vue, url, params, success, error) {
    const loadParam = {
      loading: false,
      check: false
    }
    this.post(
      vue,
      url,
      params,
      (resp) => {
        if (success) {
          const isArray = isArrayFn(resp.data)
          if ((isArray && resp.data.length > 0) || !isArray) {
            success(resp)
          }
        }
      },
      error,
      loadParam
    )

    function isArrayFn(value) {
      if (typeof Array.isArray === 'function') {
        return Array.isArray(value)
      } else {
        return Object.prototype.toString.call(value) === '[object Array]'
      }
    }
  }

  static postNoCheck(vue, url, params, success, error) {
    const loadParam = {
      loading: false,
      check: false
    }
    params.__ctCbAllCode = true //主程序只拦截401
    this.post(
      vue,
      url,
      params,
      (resp) => {
        if (success) {
          success(resp)
        }
      },
      error,
      loadParam
    )
  }

  static beforeConnect(vue, url, params, success, error, loadParam) {
    params = params || {}
    loadParam.isLocation = false
    this.connect(vue, url, params, success, error, loadParam)
  }

  static connect(vue, url, params, success, error, loadParam) {
    const connectMode = loadParam.connectMode
    const loading = loadParam.loading
    const onUploadProgress = loadParam.onUploadProgress //进度信息

    const _this = this
    let loadingInstance
    if (loading !== false) {
      _this.connectCount++
      loadingInstance = Loading.service({ fullscreen: true })
    }

    //获取请求axios的实例
    if ('post' === connectMode) {
      if (url.indexOf('?') > -1) {
        url += '&'
      } else {
        url += '?'
      }
      url += this.getUUID()
      if (loadParam.isLocation) {
        request({
          method: 'post',
          url,
          data: params,
          onUploadProgress
        }).then(
          (d) => {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance)
            _this.judgmentReturn(vue, d, success) //判断返回数据
          },
          (d) => {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance)
            _this.judgmentReturnError(vue, d, error)
          }
        )
      } else {
        $v.requestSDK(vue, url, params, 'post').then(
          (d) => {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance)
            if (d.code === 200) {
              //解决sdk400已返回到成功中的问题
              _this.judgmentReturn(vue, d, success) //判断返回数据
            } else {
              _this.judgmentReturnError(vue, d, error)
            }
          },
          (d) => {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance)
            _this.judgmentReturnError(vue, d, error)
          }
        )
      }
    } else {
      if (loadParam.isLocation) {
        let p = ''
        if (params) {
          Object.keys(params).forEach(function (i) {
            p += i + '=' + params[i] + '&'
          })
          p = p.replace(/&$/, '') //请求类型为管理端(用户端不传)
        }
        if (p) {
          url += '?' + p
        }
        request.get(url).then(
          function (d) {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance)
            _this.judgmentReturn(vue, d, success) //判断返回数据
          },
          (d) => {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance)
            _this.judgmentReturnError(vue, d, error)
          }
        )
      } else {
        $v.requestSDK(vue, url, params, 'get').then(
          function (d) {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance)
            if (d.code === 200) {
              //解决sdk400已返回到成功中的问题
              _this.judgmentReturn(vue, d, success) //判断返回数据
            } else {
              _this.judgmentReturnError(vue, d, error)
            }
          },
          (d) => {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance)
            _this.judgmentReturnError(vue, d, error)
          }
        )
      }
    }
  }

  /**
   * 生成uuid
   */
  static getUUID() {
    const crypto = window.crypto || window.msCrypto
    const array = new Uint32Array(1)
    const r = crypto.getRandomValues(array)[0]
    return Date.now() + '999' + r
  }

  static async requestSDK(vue, url, params, method) {
    if (params.responseType) {
      const responseType = params.responseType
      delete params.responseType
      return await requestSDK(url, params, {}, method, responseType)
    }
    return await requestSDK(url, params, {}, method)
  }

  /**
   * 关闭加载动画
   * @param loading
   * @param loadingInstance
   */
  static closeLoading(loading, loadingInstance) {
    if (loading !== false) {
      this.connectCount--
      if (this.connectCount <= 0) {
        this.connectCount = 0
        loadingInstance.close()
      }
    }
  }

  /**
   * {type} success: 成功, warn: 提示, warning: 提示, error: 错误; 默认warning; 不区分大小写
   * {mess, message} 消息内容; 必选其一
   * {data} 消息详情; 可选
   */
  static message(param = {}) {
    if (typeof param === 'string') {
      const mess = param
      param = {
        type: 'success',
        mess: mess
      }
    }
    if (!param.type) {
      param.type = 'warning'
    }
    param.type = param.type.toLowerCase()
    if (param.type === 'warn') {
      param.type = 'warning'
    }
    const duration = 5000
    const only = new Date().getTime()
    const ob = {
      type: param.type,
      message: param.mess || param.message || 'null',
      duration: duration,
      showClose: true,
      customClass: 'message-new message-' + param.type + '-new' + ' ' + only
    }
    if (param.data) {
      ob.customClass += ' message-more-new'
      ob.dangerouslyUseHTMLString = true
      ob.message +=
        '<span class="more-til" onclick="lookMessageDetail(' +
        only +
        ')">显示详情</span>'
      ob.message += '<div class="more-detail">'
      if (typeof param.data === 'string') {
        ob.message += param.data
      } else {
        ob.message += '<div class="more-left">' + param.data[0] + '</div>'
        ob.message += '<div class="more-right">' + param.data[1] + '</div>'
      }
      ob.message += '</div>'
    }
    setTimeout(() => {
      Message(ob)
      if (window.top !== window) {
        iframeSDK({
          iframeOperationId: 'message',
          ...ob
        })
      }
    })
  }

  // static jumpHome(vue, mess){//返回首页
  //   if(vue.$route.path.indexOf('login') !== -1) {
  //     return false;
  //   }
  //   $session.clear();
  //   $store.clear();
  //   $cookie.clear();
  //   if(mess) {
  //     MessageBox.alert(mess, '', {
  //       confirmButtonText: '确定',
  //       center: true,
  //       callback: () => {
  //         this.jumpMenu(vue, '/');
  //       }
  //     }).then();
  //   }else {
  //     this.jumpMenu(vue, '/');
  //   }
  //   this.socketClose();
  // }
  // static socketClose(){
  //   if(window.socket1) {
  //     window.socket1.close();
  //   }
  //   if(window.socket2) {
  //     window.socket2.close();
  //   }
  //   if(window.mesList) {
  //     for(let key in window.mesList) {
  //       if(window.mesList.hasOwnProperty(key)){
  //         window.mesList[key].close();
  //       }
  //     }
  //   }
  // }
  static jumpMenu(vue, e, _blank) {
    //跳转链接
    let href = window.location.href
    href = href.substring(href.indexOf('#') + 1, href.length)
    let url
    if (typeof e === 'object') {
      url = e.url
      _blank = e.blank || _blank
      let p = Object.entries(e.params || {})
        .map(([key, value]) => {
          return `&${key}=${value}`
        })
        .join('')

      if (p) {
        if (!url.includes('?')) {
          url += '?'
        }
        if (!url.split('?')[1]) {
          p = p.replace('&', '')
        }
        url += p
      }
    } else {
      url = e
    }
    if (url && href !== url) {
      if (vue.$router) {
        if (!_blank) {
          vue.$router.push({
            path: url
          })
        } else {
          _blank = vue.$router.resolve(url)
          window.open(_blank.href, '_blank')
        }
      } else {
        console.log('未找到vue-router')
      }
    }
  }

  static judgmentReturn(vue, d, success) {
    //判断返回数据
    if (success) {
      let dStr = JSON.stringify(d)
      d = JSON.parse(dStr)
      success(d)
    }
  }

  static judgmentReturnError(vue, d, error) {
    //判断返回异常的数据
    if (d.status === 401 || d.status === 410) {
      return false
    }
    if (error) {
      d.resultStat = 'ERROR'
      d.mess = '系统繁忙，请稍后再试'
      error(d)
    }
  }

  //判断字符是否为空
  static isEmpty(str) {
    return (
      typeof str === 'undefined' || str === null || str === '' || str === ' '
    )
  }

  //判断字符是否为空
  static haveLoginInfo($loginInfo) {
    return (
      $store.get('$loginInfo') &&
      JSON.stringify($loginInfo) !== '{}' &&
      $store.get('$loginInfo')
    )
  }

  static openPage(url, params = {}) {
    params.timer = new Date().getTime()
    postMsgUtil.trigger(null, 'redirectTo', {
      isOpener: true, //  isOpener 是否打开新页面，true：是，false：否
      url: url, // 要跳转的工作台URL地址
      params: params
    })
  }
}

/**
 * 8.3.	获取当前用户信息
 */
export async function getInfo() {
  return await requestSDK('getInfo')
}

/**
 * 8.4.	权限获取
 */
export async function getPermissionsByTarget() {
  return await requestSDK('getPermissionsByTarget')
}

/**
 * 计算两个时间之间的小时数
 * @param {*} date1
 * @param {*} date2
 */
export function getHoursByTwoDate(date1, date2) {
  const dateOne = new Date(date1)
  const dateTwo = new Date(date2)
  const ms = dateTwo.getTime() - dateOne.getTime()
  if (ms < 0) {
    return 0
  }
  return (ms / 1000 / 60 / 60).toFixed(2)
}

const TokenKey = 'Admin-Token'

export function getToken() {
  return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
  return sessionStorage.setItem(TokenKey, token)
}

/**
 * level 0为全国,1为省,2为地市,3为区县
 * code 行政区划编码 全国取首都,省取省会
 * @param success 成功回调
 */
export function getOrderAuthority(success) {
  const url = urlBaseService + '/area/getDataScopeObj'
  const loadParam = {
    loading: false,
    check: false
  }
  $v.post(
    this,
    url,
    {},
    (resp) => {
      let code
      let level
      const areaList = resp.data.areaList
      if (areaList && areaList.length > 0) {
        if (
          areaList.every(
            (item) => item.provinceCode === areaList[0].provinceCode
          )
        ) {
          //省全等
          if (
            areaList.every((item) => item.cityCode === areaList[0].cityCode)
          ) {
            //地市全等
            if (
              areaList.every(
                (item) => item.countyCode === areaList[0].countyCode
              )
            ) {
              //区县全等
              code = areaList[0].countyCode
              level = 3
            } else {
              //有不等的区县取地市
              code = areaList[0].cityCode
              level = 2
            }
          } else {
            //有不等的地市取省
            code = areaList[0].provinceCode
            level = 1
          }
        } else {
          //多个省全国
          code = '100000'
          level = 0
        }
      } else {
        //多个省全国
        code = '100000'
        level = 0
      }
      if (success) {
        success(code, level)
      }
    },
    null,
    loadParam
  )
}

/**
 * code 行政区划编码
 * @param success 成功回调
 */
// export function getTenantArea(success) {
//   let areaCode = ''
//   let areaType = ''
//   let adCode = ''
//   getUserMemoryInfo(['chooseArea'], (resp) => {
//     for (const item of resp.data) {
//       if ('chooseArea' === item.memoryType && item.memoryValue) {
//         const areaArrays = item.memoryValue.split('`')
//         adCode = areaArrays[0]
//         areaCode = areaArrays[1]
//         areaType = Number(areaArrays[2])
//       }
//     }
//     if (areaCode == null || areaCode === '') {
//       //查询用户订购权限
//       getOrderAuthority((code, level) => {
//         if (level === 1) {
//           //省级
//           getSysCapital(code, (adCode2) => {
//             if (success) {
//               success({
//                 adCode: adCode2,
//                 areaCode: code,
//                 areaType: level
//               })
//             }
//           })
//         } else {
//           if (success) {
//             success({
//               adCode: code,
//               areaCode: code,
//               areaType: level
//             })
//           }
//         }
//       })
//     } else {
//       if (success) {
//         success({
//           adCode: adCode,
//           areaCode: areaCode,
//           areaType: areaType
//         })
//       }
//     }
//   })
// }

/**
 * 查询省份的省会
 */
export function getSysCapital(provCode, success) {
  const url = urlBaseService + '/area/getSysCapital'
  const params = {
    provCode: provCode
  }
  $v.postNoCheck(this, url, params, (resp) => {
    let adCode
    if (resp && resp.data) {
      adCode = resp.data['capitalCode']
    } else {
      adCode = provCode
    }
    if (success) {
      success(adCode)
    }
  })
}

// 获取 url originKey
export function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}

/**
 * 跳转新tag页面(自行操作)
 */
export function redirectToPage(name, redirectUrl, params = {}) {
  postMsgUtil.trigger(null, 'redirectTo', {
    url: redirectUrl, // 要打开的页面地址
    params: {
      originKey: getQueryString('originKey'), // 来源的唯一标识，必须
      ...params,
      metaTitle: name // 自定义tag标签标题
    }
  })
}

/**
 * 返回（关闭）来源tag页面(自行操作)
 */
export function backToPage(redirectUrl, params = {}) {
  postMsgUtil.trigger(null, 'backToOrigin', {
    isClose: true, // 是否关闭当前tag页面，true 为关闭、flase 为不关闭
    data: {
      originKey: getQueryString('originKey'), // 来源的唯一标识，必须
      ...params
    }
  })
}

/* 获取url地址 */
export const $getUrlParam = (name, webUrl) => {
  try {
    if (webUrl == null) {
      webUrl = window.location.href
    }

    if (webUrl.indexOf('?') === -1) {
      return ''
    }
    const params = webUrl.split('?')[1]
    const strs = params.split('&')
    const param = {}
    for (let i = 0; i < strs.length; i++) {
      param[strs[i].split('=')[0]] = strs[i].split('=')[1]
    }
    const resp = param[name] || ''
    return decodeURI(resp)
  } catch (e) {
    return ''
  }
}

export function getUrlHead() {
  let url = ''
  let pathname = ''
  if (parent !== window) {
    try {
      url = parent.location.href
      pathname = parent.document.location.pathname
    } catch (e) {
      url = document.referrer
    }
  } else {
    try {
      url = window.location.href
      pathname = window.document.location.pathname
    } catch (e) {
      url = document.referrer
    }
  }
  const pos = url.indexOf(pathname)
  console.log(url, pathname, pos, 'pathname')
  if (pos > -1) {
    //兼容弹窗搜索不到的
    return url.substring(0, pos)
  } else {
    if (url.substring(url.length - 1, url.length) === '/') {
      return url.substring(0, url.length - 1)
    }
    return url
  }
}

// export function shareIpToDomainName(urlHead) {
//   const protocol = 'https';
//   let hostname;
//   if (urlHead.indexOf('120.46.149.139:9091') > -1) { //测试环境
//     hostname = 'slwyytest.tower0788.cn'
//   } else if (urlHead.indexOf('117.78.2.139:9091') > -1) { //准生产环境
//     hostname = 'slyyzsc-waf.tower0788.cn';
//   } else if (urlHead.indexOf('117.78.2.139:9091') > -1) { //生产环境
//     hostname = 's.chiantowercom.cn';
//   } else {
//     return urlHead
//   }
//   return protocol + '://' + hostname + '/';
// }

Date.prototype.Format = function (fmt) {
  function getYearWeek(date) {
    const date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    const date2 = new Date(date.getFullYear(), 0, 1)

    //获取1月1号星期（以周一为第一天，0周一~6周日）
    let dateWeekNum = date2.getDay() - 1
    if (dateWeekNum < 0) {
      dateWeekNum = 6
    }
    if (dateWeekNum < 4) {
      //前移日期
      date2.setDate(date2.getDate() - dateWeekNum)
    } else {
      //后移日期
      date2.setDate(date2.getDate() + 7 - dateWeekNum)
    }
    const d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000)
    if (d < 0) {
      const date3 = new Date(date1.getFullYear() - 1, 11, 31)
      return getYearWeek(date3)
    } else {
      //得到年数周数
      return Math.ceil((d + 1) / 7)
    }
  }

  const o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds(), //毫秒
    'W+': getYearWeek(this) //周数
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (let k in o)
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  return fmt
}

export function getDataString(date) {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function listenNode(node, type, callback) {
  node.addEventListener(type, callback)
  return {
    destroy() {
      node.removeEventListener(type, callback)
    }
  }
}

/**
 * @description iframe弹出框
 * @param type 操作类型, add: 新建弹窗, del: 删除弹窗, move: 移动弹窗, get: 获取iframe信息
 * @param params
 * @param iframeDialogMoving
 * @param params.key 唯一标识, 弹窗生成的id: iframeRef+params.key
 * @param params.src iframe完整地址, 新增弹窗时必传
 * @param params.iframeIds 获取iframe信息的key数组
 * @param params.width 弹框的width
 * @param params.height 弹框的height
 * @param params.left 弹框的left
 * @param params.top 弹框的left
 * @param params.right 弹框的left
 * @param params.bottom 弹框的left
 * @param params.move 拖拽位移参数
 * @param params.zIndex 弹框层级
 */
let iframeDialogMoving = false

export async function iframeDialog(type, params) {
  const keyBefore = 'iframeRef'
  const viewId = $getUrlParam('viewId')
  params = params || {}
  const iframeIds = []
  if (params.key) {
    let key = keyBefore + params.key
    if (type === 'move') {
      key += viewId
    }
    iframeIds.push(key)
  }
  params.iframeIds = params.iframeIds || []
  params.iframeIds.forEach((key) => {
    iframeIds.push(keyBefore + key + viewId)
  })
  const windowInfo = await requestSDK('getWindowInfo', {
    iframeIds: iframeIds,
    only: new Date().getTime() + '' + randomFloat()
  })
  const iframeInfo = windowInfo.data.iframeInfo || {}
  if (iframeInfo[keyBefore + params.key]) {
    iframeInfo[params.key] = iframeInfo[keyBefore + params.key]
  }
  params.iframeIds.forEach((key) => {
    if (iframeInfo[keyBefore + key + viewId]) {
      iframeInfo[key] = iframeInfo[keyBefore + key + viewId]
    }
  })
  if (type === 'get') {
    return new Promise((resolve) => {
      resolve(windowInfo.data)
    })
    // return windowInfo.data;
  }
  const cw = windowInfo.data.width //容器宽
  const ch = windowInfo.data.height //容器高
  let percentW, percentH, percentX, percentY
  let fitW = 0
  if (type === 'add') {
    fitW = 1
  }
  if (params.width) {
    const vw = params.width + fitW //弹框元素宽, 加1是为了计算百分比时缺边
    percentW = (vw / cw) * 100 + '%' //弹框相对于容器宽度百分比
    if (type === 'add') {
      const vx = (cw - vw) / 2 //弹框left
      percentX = (vx / cw) * 100 + '%' //弹框相对于容器left百分比
    }
  }
  if (params.height) {
    const vh = params.height + fitW //弹框元素高, 加1是为了计算百分比时缺边
    percentH = (vh / ch) * 100 + '%' //弹框相对于容器高度百分比
    if (type === 'add') {
      const vy = (ch - vh) / 2 //弹框top
      percentY = (vy / ch) * 100 + '%' //弹框相对于容器top百分比
    }
  }
  if (params.left != null) {
    percentX = (params.left / cw) * 100 + '%' //弹框相对于容器left百分比
  }
  if (params.top != null) {
    percentY = (params.top / ch) * 100 + '%' //弹框相对于容器top百分比
  }
  let vIframe
  if (type === 'move') {
    vIframe = iframeInfo[keyBefore + params.key + viewId]
  } else {
    vIframe = iframeInfo[keyBefore + params.key]
  }
  if (params.right != null && (params.width || vIframe)) {
    percentX =
      ((cw - (params.width || vIframe.offsetWidth) - params.right) / cw) * 100 +
      '%' //弹框相对于容器left百分比
  }
  if (params.bottom != null && (params.height || vIframe)) {
    percentY =
      ((ch - (params.height || vIframe.offsetHeight) - params.bottom) / ch) *
        100 +
      '%' //弹框相对于容器top百分比
  }
  if (params.move && vIframe) {
    if (iframeDialogMoving && params.fixed == null) {
      return false
    }
    iframeDialogMoving = true
    setTimeout(() => {
      iframeDialogMoving = false
    }, 80)
    if (params.move.left) {
      let x = vIframe.offsetLeft + params.move.left
      x = x < 0 ? 0 : x
      x = x > cw - vIframe.offsetWidth ? cw - vIframe.offsetWidth : x
      percentX = (x / cw) * 100 + '%'
    }

    if (params.move.top) {
      let y = vIframe.offsetTop + params.move.top
      y = y < 0 ? 0 : y
      y = y > ch - vIframe.offsetHeight ? ch - vIframe.offsetHeight : y
      percentY = (y / ch) * 100 + '%'
    }
  }
  if (type === 'move') {
    params.key += viewId
  }

  const types = {
    add: 'addUrl',
    del: 'delUrl',
    move: 'moveUrl'
  }
  let _params = {
    iframeOperationId: types[type], //操作类型
    key: params.key, //唯一id
    viewId: viewId,
    percentW, //宽度百分比
    percentH, //高度百分比
    percentX, //left百分比
    percentY, //top百分比
    only: new Date().getTime() + '' + randomFloat()
  }
  if (type === 'add') {
    _params.iframeSrc = params.src
    _params.zIndex = 19
    await iframeSDK({
      iframeOperationId: 'delUrl',
      key: params.key //唯一id
    })
  }
  if (params.zIndex != null) {
    _params.zIndex = params.zIndex
  }
  // const returnData = await iframeSDK(_params);
  // console.log('-------returnData--------',returnData);
  let returnData = null
  if (type === 'move' || type === 'get') {
    _params.needBack = true
    returnData = await iframeSDK({
      ..._params,
      only: new Date().getTime() + '' + randomFloat()
    })
  } else {
    returnData = await iframeSDK(_params)
  }
  return new Promise((resolve) => {
    resolve(returnData)
  })
  // return _params;
}

export function dragLimitBind({
  el,
  iframe,
  unstop,
  isRight,
  minX,
  maxX,
  minY,
  maxY,
  callback
}) {
  el.onmousedown = (e1) => {
    if (!unstop) {
      e1.stopPropagation()
    }
    if (el._prevClass.indexOf('stop-drag') !== -1) {
      e1.stopPropagation()
    }
    if (el._prevClass.indexOf('stop-drag') === -1) {
      const oldLeft = !isRight
        ? parseInt($(el).css('left') || 0)
        : parseInt($(el).css('right') || 0)
      const oldTop = !isRight
        ? parseInt($(el).css('top') || 0)
        : parseInt($(el).css('bottom') || 0)
      let newTop
      let newLeft
      document.onmousemove = (e2) => {
        // 取消文本选中，来规避拖动时产生的问题
        window.getSelection
          ? window.getSelection().removeAllRanges()
          : document.selection.empty()
        const moveX = !isRight
          ? e2.clientX - e1.clientX
          : e1.clientX - e2.clientX
        const moveY = !isRight
          ? e2.clientY - e1.clientY
          : e1.clientY - e2.clientY
        // 计算新的顶部位置，但限制在minY和maxY之间
        newTop = Math.min(Math.max(minY, oldTop + moveY), maxY)
        // 计算新的left 在x轴方向限制在minX和maxX之间
        newLeft = Math.min(Math.max(minX, oldLeft + moveX), maxX)
        if (iframe) {
          iframeDialog('move', {
            key: iframe,
            move: {
              left: moveX,
              top: moveY
            }
          }).then()
          return false
        }
        if (isRight) {
          $(el).css({
            right:
              !isNaN(minX) && !isNaN(maxX) ? newLeft : oldLeft + moveX + 'px',
            bottom:
              !isNaN(minY) && !isNaN(maxY) ? newTop : oldTop + moveY + 'px'
          })
        } else {
          $(el).css({
            left:
              !isNaN(minX) && !isNaN(maxX) ? newLeft : oldLeft + moveX + 'px',
            top: !isNaN(minY) && !isNaN(maxY) ? newTop : oldTop + moveY + 'px'
          })
        }
      }
      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        callback && callback()
      }
    }
  }
  el.addEventListener('touchstart', (e) => {
    console.log('------------------触摸屏点击')
    if (!unstop) {
      e.stopPropagation()
    }
    if (el._prevClass.indexOf('stop-drag') !== -1) {
      e.stopPropagation()
    }
    if (el._prevClass.indexOf('stop-drag') === -1) {
      const oldLeft = parseInt($(el).css('left') || 0)
      const oldTop = parseInt($(el).css('top') || 0)
      const e1 = e.touches[0]
      const destroyMove = listenNode(document, 'touchmove', (e_) => {
        console.log('-----------触摸屏移动')
        const e2 = e_.touches[0]
        const moveX = e2.clientX - e1.clientX
        const moveY = e2.clientY - e1.clientY
        if (iframe) {
          iframeDialog('move', {
            key: iframe,
            move: {
              left: moveX,
              top: moveY
            }
          }).then()
          return false
        }
        $(el).css({
          left: oldLeft + moveX + 'px',
          top: oldTop + moveY + 'px'
        })
      })
      const destroyEnd = listenNode(document, 'touchend', () => {
        console.log('-----------触摸屏停止')
        destroyMove.destroy()
        destroyEnd.destroy()
      })
    }
  })
}

export function dragBind(el, iframe, unstop, isRight, minY, maxY, callback) {
  dragLimitBind({ el, iframe, unstop, isRight, minY, maxY, callback })
}

/***时间单位转换**/
export function sToHs(value) {
  let result = parseInt(value)
  let h =
    Math.floor(result / 3600) < 10
      ? '0' + Math.floor(result / 3600)
      : Math.floor(result / 3600)
  let m =
    Math.floor((result / 60) % 60) < 10
      ? '0' + Math.floor((result / 60) % 60)
      : Math.floor((result / 60) % 60)
  let s =
    Math.floor(result % 60) < 10
      ? '0' + Math.floor(result % 60)
      : Math.floor(result % 60)
  let string = ''
  if (Number(h) > 0) {
    string = string + h + '小时'
  }
  if (Number(m) > 0) {
    string = string + m + '分钟'
  }
  if (Number(s) > 0) {
    string = string + m + '秒'
  }
  return string
}

/***距离单位转换**/
export function mTokm(m) {
  let v
  if (typeof m === 'number' && !isNaN(m)) {
    if (m >= 1000) {
      v = (m / 1000).toFixed(2) + '公里'
    } else {
      v = m + '米'
    }
  } else {
    v = '0米'
  }
  return v
}

export function numberConvertToUppercase(num) {
  num = Number(num)
  const upperCaseNumber = [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
    '百',
    '千',
    '万',
    '亿'
  ]
  const length = String(num).length
  if (length === 1) {
    return upperCaseNumber[num]
  } else if (length === 2) {
    if (num === 10) {
      return upperCaseNumber[num]
    } else if (num > 10 && num < 20) {
      return '十' + upperCaseNumber[String(num).charAt(1)]
    } else {
      return (
        upperCaseNumber[String(num).charAt(0)] +
        '十' +
        upperCaseNumber[String(num).charAt(1)].replace('零', '')
      )
    }
  }
}

/**
 * 获取天气图标
 */
export function getWeatherIcon(weatherText) {
  let icon
  if (weatherText) {
    if ('天' === weatherText.substring(weatherText.length - 1)) {
      weatherText = weatherText.substring(0, weatherText.length - 1)
    }
    switch (weatherText) {
      case '晴':
        icon = 'icon-icon_qingtian'
        break
      case '夜间晴':
        icon = 'icon-icon_yejianqingtian'
        break
      case '阴':
        icon = 'icon-icon_yintian'
        break
      case '多云':
        icon = 'icon-icon_duoyun'
        break
      case '夜间多云':
        icon = 'icon-icon_yejianduoyun'
        break
      case '阵雨':
        icon = 'icon-icon_zhenyu'
        break
      case '小雨':
        icon = 'icon-icon_xiaoyu'
        break
      case '中雨':
        icon = 'icon-icon_zhongyu'
        break
      case '大雨':
        icon = 'icon-icon_dayu'
        break
      case '暴雨':
        icon = 'icon-icon_baoyu'
        break
      case '雷阵雨':
        icon = 'icon-icon_leizhenyu'
        break
      case '阵雪':
        icon = 'icon-icon_zhenxue'
        break
      case '小雪':
        icon = 'icon-icon_xiaoxue'
        break
      case '中雪':
        icon = 'icon-icon_zhongxue'
        break
      case '大雪':
        icon = 'icon-icon_daxue'
        break
      case '暴雪':
        icon = 'icon-icon_baoxue'
        break
      case '雾':
        icon = 'icon-icon_wu'
        break
      case '夜间雾':
        icon = 'icon-icon_yejianwu'
        break
      case '浮尘':
        icon = 'icon-icon_fuchen'
        break
      case '扬沙':
        icon = 'icon-icon_yangsha'
        break
      case '沙尘暴':
        icon = 'icon-icon_shachenbao'
        break
      case '大暴雨':
        icon = 'icon-dabaoyu1'
        break
      case '特大暴雨':
        icon = 'icon-tedabaoyu1'
        break
      case '冻雨':
        icon = 'icon-dongyu1'
        break
      case '大雨转暴雨':
        icon = 'icon-dayuzhuanbaoyu1'
        break
      case '龙卷风':
        icon = 'icon-longjuanfeng'
        break
      case '雾霾':
      case '霾':
        icon = 'icon-yinmai'
        break
      case '带冰雹雷阵雨':
        icon = 'icon-daibingbaoleizhenyu'
        break
      case '小雨转中雨':
        icon = 'icon-xiaoyuzhuanzhongyu1'
        break
      case '中雨转大雨':
        icon = 'icon-zhongyuzhuandayu1'
        break
      case '雨夹雪':
        icon = 'icon-yujiaxue1'
        break
      case '小雪转中雪':
        icon = 'icon-xiaoxuezhuanzhongxue1'
        break
      case '中雪转大雪':
        icon = 'icon-zhongxuezhuandaxue1'
        break
      case '台风':
        icon = 'icon-taifeng'
        break
      default:
        icon = 'icon-icon_wushuju' //无数据
    }
  } else {
    icon = 'icon-icon_wushuju' //无数据
  }
  return icon
}

/**
 * 显示导航
 * @param params {{name: *, position: string, isEnd: boolean}}
 */
export function showNavigation(params) {
  const viewId = $getUrlParam('viewId')
  const navigationKey = 'Navigation'
  let leftKey = 'left'
  const viewFlag = getViewFlag()
  if (viewFlag.indexOf('卡') > -1) {
    // 林区卡口大屏特殊处理
    leftKey = 'leftSearch'
  }
  const leftTreeDialogKey = 'ancientTreeMenu'
  const beforeKey = 'iframeRef'
  iframeDialog('get', {
    iframeIds: [leftKey, leftTreeDialogKey]
  }).then((resp) => {
    const info = resp.iframeInfo[leftKey]
    const treeInfo = resp.iframeInfo[leftTreeDialogKey]
    const offsetTop = info.offsetTop
    const offsetLeft = info.offsetLeft
    const offsetWidth = info.offsetWidth
    let treeOffsetWidth = 0
    if (treeInfo) {
      treeOffsetWidth = treeInfo.offsetWidth
    }

    windowResizeRatio((ratioX) => {
      let scale = 1 / ratioX
      let left, top
      let src = `${window.location.origin}/bigScreen/Navigation`
      let zIndex = null
      if (viewFlag.indexOf('全') > -1) {
        //全景展示
        const leftPlanWidth = 432
        const leftScale = (offsetWidth - 10) / leftPlanWidth
        left = offsetLeft + offsetWidth - 48 * leftScale + 10
        top = (260 + 24 + 312 + 24) * leftScale - 264
      } else if (viewFlag.indexOf('卡') > -1) {
        //林区卡口
        left = offsetLeft + offsetWidth + 7 // 7px是margin
        top = offsetTop + 14 // 14是左侧iframe的top
        zIndex = 100
        src += '?fromBayonet=true'
      } else {
        //监测预警和古树名木
        if (offsetWidth > 440 * scale) {
          //森林火险和搜索都展开了
          left = offsetLeft + 416 * scale + treeOffsetWidth
        } else {
          left = offsetLeft + 80 * scale + treeOffsetWidth
        }
        top = offsetTop + 240 * scale
      }

      console.log('showNavigation的scale:', scale)
      iframeDialog('add', {
        key: navigationKey + viewId,
        src: src,
        width: 270 * scale,
        left: left,
        height: 334 * scale,
        top: top,
        zIndex: zIndex
      }).then(() => {
        setTimeout(() => {
          iframeSDK({
            targetIframe: `${beforeKey}${navigationKey}${viewId}`,
            method: 'searchByPosition',
            params: params
          })
        }, 800)
      })
    })
  })
}

/**
 * 关闭导航
 */
export function closeNavigation() {
  const viewId = $getUrlParam('viewId')
  const navigationKey = 'Navigation'
  const beforeKey = 'iframeRef'
  iframeSDK({
    targetIframe: `${beforeKey}${navigationKey}${viewId}`,
    method: 'clearRoute',
    params: {
      close: true
    }
  })
}

/**
 * 获取当前大屏标识,用于判断是哪个大屏
 */
export function getViewFlag() {
  return $getUrlParam('viewName')
}

export function windowResize(successFn) {
  // 监听窗体变化
  postMsgUtil.listen('windowResize', (data) => {
    // 对应数据格式见下图
    console.log('windowResize', data)
    successFn(data)
  })
}

export async function awitWindowRatio() {
  return await requestSDK('getWindowRatio')
}

export function windowResizeRatio(successFn) {
  getWindowRatio(successFn)
  windowResize(() => {
    getWindowRatio(successFn)
  })
}

export function onlyWindowResizeRatio(successFn) {
  windowResize(() => {
    getWindowRatio(successFn)
  })
}

export function getWindowRatio(successFn) {
  awitWindowRatio().then((resp) => {
    let { ratioX, ratioY, screen } = resp.data //screen.
    console.log('ratioXratioXratioX', resp.data)
    //还有参数availWidth,availHeight
    let { width, height, innerWidth, innerHeight } = screen
    // width = width * ratioX; 浏览器必须缩放是100%
    width = innerWidth * ratioX //浏览器宽度必须全屏
    if (width > innerWidth * ratioX) {
      //开的不是全屏是窗口
      ratioX = width / innerWidth
      ratioY = width / innerWidth
    }
    //兼容其他分辨率, 看x轴
    ratioX = (ratioX * 1920) / width
    ratioY = (ratioY * 1920) / width

    successFn(ratioX, ratioY, width, height, innerWidth, innerHeight)
  })
}

export function randomFloat() {
  const crypto = window.crypto || window.msCrypto
  const array = new Uint32Array(1)
  return crypto.getRandomValues(array)[0]
}

/**
 * 视频插件的postMessage
 */
export function videoPostMessage(param) {
  window.parent.postMessage(param, '*')
}

const mapTypeNameObj = {
  amap: 'amap',
  tmap: 'tmap',
  mapbox: 'mapbox'
}
const onlineTypeObj = {
  onLine: 'onLine',
  offline: 'offline'
}

/**
 *  根据参数查地图字典值获取地图在线离线和地图类型
 */
export function getMapTypeByKey(successFn) {
  let result
  let mapType = mapTypeNameObj.amap //默认高德
  let baseLayerType = onlineTypeObj.onLine //默认在线
  getConfigByKey('lincao_map_type').then((response) => {
    if (response.data) {
      if (response.data.configValue === '2') {
        //天地图
        mapType = mapTypeNameObj.tmap
      }
      if (response.data.configValue === '1') {
        //离线地图mapbox
        baseLayerType = onlineTypeObj.offline
        mapType = mapTypeNameObj.mapbox
      }
    }
    result = {
      mapType,
      baseLayerType
    }
    successFn(result)
  })
}

export class DateFormat {
  static get(val) {
    return this.getDayStr(val) + ' ' + '00:00:00'
  }

  static getDayStr(val) {
    const date = val ? new Date(val) : new Date()
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    month = month < 10 ? '0' + month : month
    day = day < 10 ? '0' + day : day
    return [year, month, day].join('-')
  }

  static utcTimeToStrTime(UTCDateString) {
    if (!UTCDateString) {
      return '-'
    }
    let time = UTCDateString.replace(/T/g, ' ')
    time = time.split('.')[0]
    return time
  }

  static getAll(row, column) {
    const val = row[column.property]
    if (val === undefined) {
      return ''
    }
    const date = new Date(val) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = date.getDate()
    d = d < 10 ? '0' + d : d
    let h = date.getHours()
    h = h < 10 ? '0' + h : h
    let M = date.getMinutes()
    M = M < 10 ? '0' + M : M
    let s = date.getSeconds()
    s = s < 10 ? '0' + s : s
    return y + '-' + m + '-' + d + ' ' + '' + h + ':' + M + ':' + s
  }

  static now(t) {
    const dataObj = this.getData(t)
    return (
      dataObj.y +
      '-' +
      dataObj.m +
      '-' +
      dataObj.d +
      ' ' +
      dataObj.hour +
      ':' +
      dataObj.min +
      ':' +
      dataObj.seconds
    )
  }

  static onlyStr() {
    const dataObj = this.getData()
    return (
      '' +
      dataObj.y +
      dataObj.m +
      dataObj.d +
      dataObj.hour +
      dataObj.min +
      dataObj.seconds +
      dataObj.milliseconds
    )
  }

  /**
   * 生成日期的提共通,都调这个减少代码重复率
   */
  static getData(t) {
    const val = t || new Date()
    const y = val.getFullYear()
    let m = val.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = val.getDate()
    d = d < 10 ? '0' + d : d
    let hour = val.getHours()
    hour = hour < 10 ? '0' + hour : hour
    let min = val.getMinutes()
    min = min < 10 ? '0' + min : min
    let seconds = val.getSeconds()
    seconds = seconds < 10 ? '0' + seconds : seconds
    let milliseconds = ('000' + val.getMilliseconds()).substr(-3)
    return {
      y: y,
      m: m,
      d: d,
      hour: hour,
      min: min,
      seconds: seconds,
      milliseconds: milliseconds
    }
  }
}

/**
 * 复制到剪切板
 * val: 要复制的参数
 */
export function copyToClipboard(val) {
  let aux = document.createElement('input')
  aux.value = val
  document.body.appendChild(aux)
  aux.select()
  document.execCommand('copy')
  document.body.removeChild(aux)
  CommonMessage.success('复制成功')
}

export function formatCurrentDate() {
  let currentDate = new Date()
  const year = currentDate.getFullYear()
  const month = ('0' + (currentDate.getMonth() + 1)).slice(-2)
  const day = ('0' + currentDate.getDate()).slice(-2)
  const hours = ('0' + currentDate.getHours()).slice(-2)
  const minutes = ('0' + currentDate.getMinutes()).slice(-2)
  const seconds = ('0' + currentDate.getSeconds()).slice(-2)
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const fireWarnColors = {
  yellow: {
    line: '#f9ff6c',
    fill: 'rgba(249, 255, 108, 0.35)',
    fontColor: '#F4B312'
  },
  orange: {
    line: '#fe981e',
    fill: 'rgba(254, 152, 30, 0.35)',
    fontColor: '#FE981E'
  },
  red: {
    line: '#ff5858',
    fill: 'rgba(255, 88, 88, 0.35)',
    fontColor: '#FF5858'
  },
  default: {
    line: '#31cbff',
    fill: 'rgba(49, 203, 255, 0.15)',
    fontColor: '#31CBFF'
  }
}

export function warnTypeFormat(dictOptions, type) {
  for (let i in dictOptions['forestry_fire_weather_warning']) {
    if (
      Object.prototype.hasOwnProperty.call(
        dictOptions['forestry_fire_weather_warning'],
        i
      )
    ) {
      const item = dictOptions['forestry_fire_weather_warning'][i]
      if (type === item.dictValue) {
        return {
          color: item.remark,
          name: item.dictLabel
        }
      }
    }
  }
  return {}
}

/**
 * 预警类型颜色格式化
 */
// export function warnTypeFormat(dictOptions, type) {
//   for (let i in dictOptions['forestry_fire_weather_warning']) {
//     if (dictOptions['forestry_fire_weather_warning'].hasOwnProperty(i)) {
//       const item = dictOptions['forestry_fire_weather_warning'][i];
//       if (type === item.dictValue) {
//         return {
//           color: item.remark,
//           name: item.dictLabel
//         };
//       }
//     }
//   }
//   return {};
// }

export function executeFunction(func, param, param2, param3) {
  if (func) {
    if (param != null) {
      func(param, param2, param3)
    } else {
      func()
    }
  }
}

export function dragBindMove(el) {
  el.addEventListener('touchstart', dragStart)
  let odiv = el //获取当前元素
  el.onmousedown = (e) => {
    window.labelDetailClickCallBack(odiv)
    odiv.style.cursor = 'move'
    e.stopPropagation()
    //算出鼠标相对元素的位置
    let disX = e.clientX - odiv.offsetLeft
    let disY = e.clientY - odiv.offsetTop
    let left = ''
    let top = ''
    document.onmousemove = (ev) => {
      let odivHeight = window
        .getComputedStyle(odiv, null)
        .getPropertyValue('height')
      let odivWidth = window
        .getComputedStyle(odiv, null)
        .getPropertyValue('width')
      console.log(odivHeight)
      //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      left = ev.clientX - disX
      top = ev.clientY - disY
      //绑定元素位置到positionX和positionY上面
      //移动当前元素
      // 边界判断
      if (parseInt(left) <= 0) {
        odiv.style.left = '0px'
      } else if (parseInt(left) >= window.innerWidth - parseInt(odivWidth)) {
        odiv.style.left = window.innerWidth - parseInt(odivWidth) + 'px'
      } else {
        odiv.style.left = left + 'px'
      }
      if (parseInt(top) <= 0) {
        odiv.style.top = '0px'
      } else if (parseInt(top) >= window.innerHeight - parseInt(odivHeight)) {
        console.log('else if', window.innerHeight - parseInt(odivHeight))
        odiv.style.top = window.innerHeight - parseInt(odivHeight) + 'px'
      } else {
        odiv.style.top = top + 'px'
      }
      window.labelDetailPosition(odiv, left, top)
    }
    document.onmouseup = () => {
      window.labelDetailClickCallBack(odiv)
      document.onmousemove = null
      document.onmouseup = null
      odiv.style.cursor = 'auto'
    }
  }

  function dragStart(event) {
    window.labelDetailClickCallBack(odiv)
    odiv.style.cursor = 'move'
    event.stopPropagation()
    //算出鼠标相对元素的位置
    let disX = event.touches[0].clientX - odiv.offsetLeft
    let disY = event.touches[0].clientY - odiv.offsetTop
    let left = ''
    let top = ''
    el.addEventListener('touchmove', dragMove)
    el.addEventListener('touchend', dragEnd)

    function dragMove(ev) {
      const touchX = ev.touches[0].clientX
      const touchY = ev.touches[0].clientY
      let odivHeight = window
        .getComputedStyle(odiv, null)
        .getPropertyValue('height')
      let odivWidth = window
        .getComputedStyle(odiv, null)
        .getPropertyValue('width')
      //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
      left = touchX - disX
      top = touchY - disY
      //绑定元素位置到positionX和positionY上面
      //移动当前元素
      // 边界判断
      if (parseInt(left) <= 0) {
        odiv.style.left = '0px'
      } else if (parseInt(left) >= window.innerWidth - parseInt(odivWidth)) {
        odiv.style.left = window.innerWidth - parseInt(odivWidth) + 'px'
      } else {
        odiv.style.left = left + 'px'
      }
      if (parseInt(top) <= 0) {
        odiv.style.top = '0px'
      } else if (parseInt(top) >= window.innerHeight - parseInt(odivHeight)) {
        console.log('else if', window.innerHeight - parseInt(odivHeight))
        odiv.style.top = window.innerHeight - parseInt(odivHeight) + 'px'
      } else {
        odiv.style.top = top + 'px'
      }
      window.labelDetailPosition(odiv, left, top)
    }

    function dragEnd() {
      window.labelDetailClickCallBack(odiv)
      document.onmousemove = null
      document.onmouseup = null
      odiv.style.cursor = 'auto'
      el.removeEventListener('touchmove', dragMove)
      el.removeEventListener('touchend', dragEnd)
    }
  }
}

export function bindDragWidth(el, binding, vNode) {
  const _this = vNode.context
  el.addEventListener('touchstart', dragStart)
  el.onmousedown = (e) => {
    e.stopPropagation()
    // 计算当前元素距离可视区的距离
    const disX = e.clientX - el.offsetLeft

    document.body.onmousemove = function (ev) {
      e.preventDefault() // 移动时禁用默认事件
      // 通过事件委托，计算移动的距离
      const l = ev.clientX - disX
      const h = (l * 9) / 16
      document.getElementById('mapDivTh').style.width = `${l}px`
      document.getElementById('mapDivTh').style.height = `${
        h > document.body.offsetHeight ? document.body.offsetHeight : h
      }px`
      if (l <= 386) {
        _this.activeBig = false
        _this.activeSmall = true
      } else if (l >= 936) {
        _this.activeBig = true
        _this.activeSmall = false
      } else {
        _this.activeBig = false
        _this.activeSmall = false
      }
      _this.mapWidth = l
      _this.mapHeight = h
    }
    document.body.onmouseup = function () {
      document.body.onmousemove = null
      document.body.onmouseup = null
    }
  }

  function dragStart(e) {
    if (e.cancelable) {
      // 判断默认行为是否已经被禁用
      if (!e.defaultPrevented) {
        e.preventDefault()
      }
    }
    e.stopPropagation()
    // 鼠标按下，在原来页面上增加透明遮罩，防止部分元素例如iframe监听不到鼠标事件
    // 计算当前元素距离可视区的距离
    const disX = e.touches[0].clientX - el.offsetLeft
    el.addEventListener('touchmove', dragMove)
    el.addEventListener('touchend', dragEnd)

    function dragMove(ev) {
      ev.preventDefault() // 移动时禁用默认事件
      // 通过事件委托，计算移动的距离
      const l = ev.touches[0].clientX - disX
      const h = (l * 9) / 16
      window.document.getElementById('mapDivTh').style.width = `${l}px`
      window.document.getElementById('mapDivTh').style.height = `${
        h > document.body.offsetHeight ? document.body.offsetHeight : h
      }px`
      if (l <= 386) {
        _this.activeBig = false
        _this.activeSmall = true
      } else if (l >= 936) {
        _this.activeBig = true
        _this.activeSmall = false
      } else {
        _this.activeBig = false
        _this.activeSmall = false
      }
      _this.mapWidth = l
      _this.mapHeight = h
    }

    function dragEnd() {
      el.removeEventListener('touchmove', dragMove)
      el.removeEventListener('touchend', dragEnd)
    }
  }
}

export function uuid(len = 16) {
  const crypto = window.crypto || window.msCrypto
  const array = new Uint32Array(1)
  const r = crypto.getRandomValues(array)[0]
  const str = Date.now() + '' + r
  return str.substring(str.length - len)
}

export function filterDiscolour(value, key) {
  if (!value) {
    return ''
  }
  if (!key) {
    return value
  }
  return value.replace(
    new RegExp(`(${key})`),
    `<span class="key-word">$1</span>`
  )
}

export function getTopUrlHead() {
  let url = ''
  let pathname = null
  if (parent !== window) {
    try {
      url = parent.location.href
    } catch (e) {
      url = document.referrer
    }
    try {
      pathname = parent.document.location.pathname
    } catch (e) {
      console.log('获取top pathname跨域')
    }
  } else {
    pathname = window.document.location.pathname
  }
  console.log('getTopUrlHead======================>', url)
  const pos = url.indexOf(pathname)
  if (pos > -1) {
    //兼容弹窗搜索不到的
    return url.substring(0, pos)
  } else {
    if (url.substring(url.length - 1, url.length) === '/') {
      return url.substring(0, url.length - 1)
    }
    return url
  }
}
