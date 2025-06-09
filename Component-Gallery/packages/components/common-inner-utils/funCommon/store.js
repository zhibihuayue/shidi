/*
 * @Author: 米亚流年
 * @Date: 2024-01-22 16:48:07
 * @LastEditors: 米亚流年
 * @LastEditTime: 2024-01-23 09:01:26
 * @FilePath: /Component-Gallery/packages/components/utils/funCommon/store.js
 */
let $store = {
  set: function (key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get: function (key) {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (e) {
      return localStorage.getItem(key)
    }
  },
  remove: function (key) {
    localStorage.removeItem(key)
  },
  clear: function () {
    let startTime = this.get('startTime')
    let fStartTime = this.get('fStartTime')
    let personalStartTime = this.get('personalStartTime')
    let startTime1 = this.get('startTime1')
    localStorage.clear()
    startTime && this.set('startTime', startTime)
    fStartTime && this.set('fStartTime', fStartTime)
    personalStartTime && this.set('personalStartTime', personalStartTime)
    startTime1 && this.set('startTime1', startTime1)
  }
}
let $session = {
  set: function (key, value) {
    sessionStorage.setItem(key, JSON.stringify(value))
  },
  get: function (key) {
    try {
      return JSON.parse(sessionStorage.getItem(key))
    } catch (e) {
      return sessionStorage.getItem(key)
    }
  },
  remove: function (key) {
    sessionStorage.removeItem(key)
  },
  clear: function () {
    sessionStorage.clear()
  }
}
let $cookie = {
  set: function (key, value) {
    document.cookie = key + '=:' + value + ';path=/;'
  },
  get: function (key) {
    var cookieList = document.cookie.split('; ')
    for (var i = 0; i < cookieList.length; i++) {
      if (cookieList[i].split('=:')[0] == key) {
        return cookieList[i].split('=:')[1]
      }
    }
    return null
  },
  remove: function (key) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = $cookie.get(key)
    if (cval != null)
      document.cookie =
        key + '=:' + cval + ';expires=' + exp.toUTCString() + ';path=/;'
  },
  clear: function () {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cookieList = document.cookie.split('; ')
    for (var i = 0; i < cookieList.length; i++) {
      document.cookie =
        cookieList[i].split('=:')[0] +
        '=:' +
        cookieList[i].split('=:')[1] +
        ';expires=' +
        exp.toUTCString() +
        ';path=/;'
    }
  }
}
export { $store as $store, $session as $session, $cookie as $cookie }
