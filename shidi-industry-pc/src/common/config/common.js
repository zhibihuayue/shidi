import { requestSDK } from '@ct/iframe-connect-sdk';
import request from './axios.js';
import { Loading } from 'element-ui';
import { $store } from './store.js';

const urlImg = (exports.urlImg = '/common-img-url');

export class httpService {
  /*
   * vue: 当前是以this.vue.$http或者this.vue.http方式请求(Vue、this)
   * url:请求链接
   * data:请求参数
   * success:请求成功回调
   * error:请求失败时是否报错(true时不报错),error三种形式:1.为function时调用 2.为true时不弹出提示错误，而是控制台输出  3.为false时弹出提示错误
   * loadParam对象: 属性loading,是否有加载动画,check是否校验,
   */
  static get(vue, url, params, success, error, loadParam = {}) {
    loadParam.connectMode = 'get';
    this.beforeConnect(vue, url, params, success, error, loadParam);
  }
  static post(vue, url, params, success, error, loadParam = {}) {
    loadParam.connectMode = 'post';
    this.beforeConnect(vue, url, params, success, error, loadParam);
  }
  static postNoLoadCheck(vue, url, params, success, error) {
    const loadParam = {
      loading: false,
      check: false,
    };
    this.post(
      vue,
      url,
      params,
      resp => {
        if (success) {
          const isArray = isArrayFn(resp.data);
          if ((isArray && resp.data.length > 0) || !isArray) {
            success(resp);
          }
        }
      },
      error,
      loadParam
    );

    function isArrayFn(value) {
      if (typeof Array.isArray === 'function') {
        return Array.isArray(value);
      } else {
        return Object.prototype.toString.call(value) === '[object Array]';
      }
    }
  }
  static postNoCheck(vue, url, params, success, error) {
    const loadParam = {
      loading: false,
      check: false,
    };
    params.__ctCbAllCode = true; //主程序只拦截401
    this.post(
      vue,
      url,
      params,
      resp => {
        if (success) {
          success(resp);
        }
      },
      error,
      loadParam
    );
  }
  static outLoginCount = 0;
  static connectCount = 0;
  static beforeConnect(vue, url, params, success, error, loadParam) {
    console.log(vue,url,url,'接口调用！！！');
    // 获取本地登录信息
    let $loginInfo = $store.get('$loginInfo');
    params = params || {};
    if (this.haveLoginInfo($loginInfo)) {
      //存在登录数据
      params.creator = $loginInfo.userAccount;
      // 租户id
      if (!params.tenantId && !this.isEmpty($loginInfo.tenantId)) {
        //非空
        params.tenantId = $loginInfo.tenantId;
      }
    }

    const host = location.host;
    let isLocation = false;
    if ('localhost:9998' === host) {
      isLocation = true;
    } else if ('localhost:8080' === host) {
      isLocation = true;
    }else{
      isLocation = false;
    }
    loadParam.isLocation = isLocation;
    this.connect(vue, url, params, success, error, loadParam);
  }

  static connect(vue, url, params, success, error, loadParam) {
    const connectMode = loadParam.connectMode;
    const loading = loadParam.loading;
    const onUploadProgress = loadParam.onUploadProgress;

    const _this = this;
    let loadingInstance;
    if (loading !== false) {
      _this.connectCount++;
      loadingInstance = Loading.service({
        fullscreen: true,
      });
    }

    //获取请求axios的实例
    if ('post' === connectMode) {
      if (url.indexOf('?') > -1) {
        url += '&';
      } else {
        url += '?';
      }
      url += this.getUUID();
      request({
        method: 'post',
        url,
        data: params,
        onUploadProgress,
      }).then(
        d => {
          //关闭加载动画
          _this.closeLoading(loading, loadingInstance);
          _this.judgmentReturn(vue, d, success); //判断返回数据
        },
        e => error(e)
        // 原来的代码逻辑
        // d => {
        //   //关闭加载动画
        //   _this.closeLoading(loading, loadingInstance);
        //   _this.judgmentReturnError(vue, d, error);
        // }
      );
      // .catch(e => {
      //   error(e);
      // });
      return;
    }
    if ('get' === connectMode) {
      let p = '';
      console.log(params,'get里面的参数')
      if (params) {
        Object.keys(params).forEach(function (i) {
          p += i + '=' + params[i] + '&';
        });
        p = p.replace(/&$/, ''); //请求类型为管理端(用户端不传)
      }
     
      if (p) {
        url += '?' + p;
      }
      console.log(url,'处理后的url')
      request
        .get(url)
        .then(
          d => {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance);
            _this.judgmentReturn(vue, d, success); //判断返回数据
          },
          d => {
            //关闭加载动画
            _this.closeLoading(loading, loadingInstance);
            _this.judgmentReturnError(vue, d, error);
          }
        )
        .catch(e => {
          error(e);
        });
    }
  }
  /**
   * 生成uuid
   */
  static getUUID() {
    const crypto = window.crypto || window.msCrypto;
    const array = new Uint32Array(1);
    const r = crypto.getRandomValues(array)[0];
    return Date.now() + '999' + r;
  }

  static isEmpty(str) {
    return typeof str === 'undefined' || str === null || str === '' || str === ' ';
  }
  static async requestSDK(vue, url, params, method) {
    if (params.responseType) {
      const responseType = params.responseType;
      delete params.responseType;
      return await requestSDK(url, params, {}, method, responseType);
    }
    return await requestSDK(url, params, {}, method);
  }

  /**
   * 关闭加载动画
   * @param loading
   * @param loadingInstance
   */
  static closeLoading(loading, loadingInstance) {
    if (loading !== false) {
      this.connectCount--;
      if (this.connectCount <= 0) {
        this.connectCount = 0;
        loadingInstance.close();
      }
    }
  }
  static jumpMenu(vue, e, _blank) {
    //跳转链接
    let href = window.location.href;
    href = href.substring(href.indexOf('#') + 1, href.length);
    let url;
    if (typeof e === 'object') {
      url = e.url;
      _blank = e.blank || _blank;
    } else {
      url = e;
    }
    if (url && href !== url) {
      if (!_blank) {
        vue.$router.push({
          path: url,
        });
      } else {
        _blank = vue.$router.resolve(url);
        window.open(_blank.href, '_blank');
      }
    }
  }
  static judgmentReturn(vue, d, success) {
    // 判断返回数据
    if (success) {
      let dStr = JSON.stringify(d);
      if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        dStr = dStr.replace(/https:\/\/powerexchange-fs.obs.cn-north-4.myhuaweicloud.com:443/g, location.origin + urlImg);
      }
      if (location.protocol === 'https:') {
        dStr = dStr.replace(/http:\/\/124.70.52.86:10120/g, location.origin + '/port10120'); //准生产
        dStr = dStr.replace(/http:\/\/124.71.226.241:10120/g, location.origin + '/zport10120_1');
        dStr = dStr.replace(/http:\/\/58.215.54.4:10120/g, location.origin + '/zport10120_2');
        dStr = dStr.replace(/http:\/\/36.150.52.5:10120/g, location.origin + '/zport10120_3');
        dStr = dStr.replace(/http:\/\/114.66.236.4:10120/g, location.origin + '/zport10120_4');
        dStr = dStr.replace(/http:\/\/223.85.23.83:10120/g, location.origin + '/zport10120_5');
        dStr = dStr.replace(/http:\/\/182.151.249.22:10120/g, location.origin + '/zport10120_6');
        dStr = dStr.replace(/http:\/\/101.206.244.211:10120/g, location.origin + '/zport10120_7');
        dStr = dStr.replace(/http:\/\/122.9.214.147:10120/g, location.origin + '/zport10120_8');
        dStr = dStr.replace(/http:\/\/122.9.215.1:10120/g, location.origin + '/zport10120_9');
        dStr = dStr.replace(/http:\/\/122.9.210.68:10120/g, location.origin + '/zport10120_10');
        dStr = dStr.replace(/http:\/\/114.116.214:10120/g, location.origin + '/zport10120_11');
        dStr = dStr.replace(/http:\/\/122.9.11.27:10120/g, location.origin + '/zport10120_12');
        dStr = dStr.replace(/http:\/\/36.138.41.32:10120/g, location.origin + '/zport10120_13');
        dStr = dStr.replace(/http:\/\/111.29.61.135:10120/g, location.origin + '/zport10120_14');
      }
      d = JSON.parse(dStr);
      success(d);
    }
  }

  static haveLoginInfo($loginInfo) {
    return $store.get('$loginInfo') && JSON.stringify($loginInfo) !== '{}' && $store.get('$loginInfo');
  }

  static judgmentReturnError(vue, d, error) {
    //判断返回异常的数据
    if (d.status === 401 || d.status === 410) {
      if (this.outLoginCount === 0) {
        console.log('');
      }
      this.outLoginCount++;
      return false;
    } else {
      this.outLoginCount = 0;
    }
    // 原来的代码逻辑
    // 这代码干啥用 我也不知道
    // if (error) {
    //   d.resultStat = 'ERROR';
    //   d.mess = '系统繁忙，请稍后再试';
    //   error(d);
    // }
  }
}
