import { getToken, urlBaseService, $v } from './common'
import axios from 'axios'
import { Loading, Message, MessageBox, Notification } from 'element-ui'
import FileSaver from 'file-saver'
const baseUrl = window.location.protocol + '//' + window.location.host
const parentUrl = process.env.VUE_APP_IFRAME_PARENT_URL
// 导入模板下载路径
const downloadTmplUrl = '/admin/base/common/download/configkey/'

// 通用文件下载路径
// const downloadFileUrl = '/api/admin/base/common/download/id/'
const downloadFileUrl = `${urlBaseService}/file/download/id/`
const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  zip: 'application/zip'
}
const request = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: baseUrl,
  // 超时时长设置
  timeout: 600000,
  // 响应类型
  responseType: 'blob'
})

export function downloadById(fileId, fileName) {
  if (fileId) {
    $v.get(
      this,
      `/${urlBaseService}/file/download/id/${fileId}`,
      {},
      (res) => {
        if (res.code == 200) {
          const blobData = base64ToBlob(res.data)
          FileSaver.saveAs(blobData, fileName)
        } else {
          Notification.error({
            title: res.code + ' 错误',
            message: res.msg,
            duration: 0
          })
        }
      },
      (err) => {
        console.log(err)
      }
    )
    // request.get(downloadFileUrl + fileId, {
    //   headers: { 'Authorization': 'Bearer ' + getToken() }
    // })
    // .then(res => {
    //   if (res.headers['content-type'] === 'application/json;charset=UTF-8') {
    //     const reader = new FileReader()
    //     reader.readAsText(res.data)
    //     reader.onload = function(event) {
    //       const resp = JSON.parse(reader.result)
    //       Notification.error({
    //         title: resp.code + ' 错误',
    //         message: resp.msg,
    //         duration: 0
    //       })
    //     }
    //   } else {
    //     const desc = res.headers['content-disposition']
    //     const filename = desc.substring(desc.indexOf('=') + 1, desc.length)
    //     const blob = new Blob([res.data], { type: 'application/octet-stream' })
    //     FileSaver.saveAs(blob, decodeURIComponent(filename))
    //   }
    // }).catch(err => {
    //   console.log(err)
    // })
  }
}

export function downloadByUrl(fileUrl, fileName) {
  if (fileUrl) {
    $v.get(
      this,
      `/${urlBaseService}/file/download/byUrl`,
      {
        fileUrl: fileUrl
      },
      (res) => {
        if (res.code == 200) {
          const blobData = base64ToBlob(res.data)
          FileSaver.saveAs(blobData, fileName)
        } else {
          Notification.error({
            title: res.code + ' 错误',
            message: res.msg,
            duration: 0
          })
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }
}

/**
 * 导出灾后评估报告
 * @param fileId
 */
export function exportAssessmentReport(url, query, fileName) {
  $v.post(
    this,
    url,
    query,
    (res) => {
      if (res.code === 200) {
        Message.success('导出成功')
        const blobData = base64ToBlob(res.data)
        FileSaver.saveAs(blobData, fileName)
      } else {
        Message.warning(res.msg || '导出失败，请检查网络')
      }
    },
    (err) => {
      console.log(err)
    },
    {
      loading: false
    }
  )

  /*$v.get(this, `${url}`, {}, (res) => {
    console.log(res, 'res')
    if (res.code == 200) {
      const blob = new Blob([res.data], {type: "application/octet-stream"});
      FileSaver.saveAs(blob,"1.docx");
    } else {
      Notification.error({
        title: res.code + ' 错误',
        message: res.msg,
        duration: 0
      })
    }
  }, err => {
    console.log(err)
  });*/

  /*console.log( getToken(),process.env.VUE_APP_IFRAME_PARENT_URL," getToken()")
  customDownload(url).then((res) => {
    console.log(res);
      /!*const desc = res.headers['content-disposition'];
      const filename = desc.substring(desc.indexOf("=")+1,desc.length);*!/
      const blob = new Blob([res.data], {type: "application/octet-stream"});
      FileSaver.saveAs(blob,"1.docx");
  })*/
}

/**
 * 自定义下载方法
 * @param url
 * @param query
 * @returns {AxiosPromise}
 */
export function customDownload(url, query) {
  return axios({
    method: 'get',
    url: `${parentUrl}api${url}`,

    responseType: 'blob',
    headers: { Authorization: 'Bearer ' + getToken() }
    // headers: { 'Authorization': "Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiIl0sInVzZXJfbmFtZSI6IndlYl9tYW5hZ2V8bHljcyIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE2NTc4NDk5MjMsInVzZXJJZCI6MzA5NzM4LCJqdGkiOiI0NTViODljYi1lY2JlLTQ1NWEtOTcxYS1mYmNiZWEyMDEwZmQiLCJjbGllbnRfaWQiOiJ3ZWJfbWFuYWdlIn0.aou3mwnCYtnCfoveppGwbU1HrVPSHc_PXPOIPWNa9yzTeYuYA8YIdtjuveirYZFHqYb2vUaJqtw3HOMycVFQC3ZbObUItivQkUmDgWGXpmnlvOseGbQHJw5tznksZZAT7KOxc_SkpRNwMM5KADeaIK99R2R_m-a8CeMQjP1QNdw1N7cHG_EPuElK8gDT5knrbEh_YcUWYTtDvaAmNerf6_AvnrXfyukzMGuXVm5qOXti-yEBvCpyFwcuOpKt_S1NsZtCD2CAUqKnmMqVkwPnOmmSom9dDcpz-PKq7DP7dAsLLZqnqITtDy6d8NBEY6FOjGFDOQJdvXaYJibQZIgKWQ" }
  })
}

/**
 * 通用压缩文件下载方法
 * @param url
 * @param fileName
 */
export function downLoadZip(url, fileName) {
  axios({
    method: 'get',
    url: baseUrl + url,
    responseType: 'blob',
    headers: { Authorization: 'Bearer ' + getToken() }
  }).then((res) => {
    resolveBlob(res, mimeMap.zip, (fileName || 'defaultName') + '.zip')
  })
}

/**
 * 通用压缩文件下载方法(post方式)
 * @param url
 * @param fileName
 */
export function downLoadZipPost(url, fileName, data) {
  axios({
    method: 'post',
    url: '/api' + url,
    data: data,
    responseType: 'blob',
    headers: { Authorization: 'Bearer ' + getToken() }
  }).then((res) => {
    resolveBlob(res, mimeMap.zip, (fileName || 'defaultName') + '.zip')
  })
}

/**
 * export模块下载文件
 * @param fileId
 */
export function exportServiceDownloadById(url, fileId) {
  const downloadUrl = url + fileId
  if (fileId) {
    request
      .get(downloadUrl, {
        headers: { Authorization: 'Bearer ' + getToken() }
      })
      .then((res) => {
        if (res.headers['content-type'] == 'application/json;charset=UTF-8') {
          const reader = new FileReader()
          reader.readAsText(res.data)
          reader.onload = function (event) {
            const resp = JSON.parse(reader.result)
            Notification.error({
              title: resp.code + ' 错误',
              message: resp.msg,
              duration: 0
            })
          }
        } else {
          const desc = res.headers['content-disposition']
          const filename = desc.substring(desc.indexOf('=') + 1, desc.length)
          const blob = new Blob([res.data], {
            type: 'application/octet-stream'
          })
          FileSaver.saveAs(blob, decodeURIComponent(filename))
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}

/**
 * 通用表格信息导出方法
 * @param url
 * @param query
 * @param fileName
 */
export function exportExcel(
  url,
  query,
  fileName,
  message = '是否确认导出所有的数据项?',
  title = '警告'
) {
  MessageBox.confirm(message, title, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const loadingInstance = Loading.service({
        lock: true,
        text: '数据正在准备中，请稍等...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      $v.post(
        this,
        url,
        query,
        (res) => {
          loadingInstance.close()
          if (res.code == 200) {
            Message.success(res.msg || '导出成功')
            const blobData = base64ToBlob(res.data)
            FileSaver.saveAs(blobData, (fileName || '导出文件') + '.xlsx')
          } else {
            Message.warning(res.msg || '导出失败，请检查网络')
          }
        },
        (err) => {
          console.log(err)
        }
      )
      // axios({
      //   method: 'post',
      //   url: baseUrl + url,
      //   data: query,
      //   responseType: 'blob',
      //   headers: { 'Authorization': 'Bearer ' + getToken() }
      // }).then(res => {
      //   loadingInstance.close()
      //   if (res.data.type == 'application/octet-stream' || res.data.type == 'application/vnd.ms-excel') {
      //     Message.success('导出成功')
      //     resolveBlob(res, mimeMap.xlsx, (fileName || '导出文件') + '.xlsx')
      //   } else {
      //     const reader = new FileReader()
      //     reader.readAsText(res.data)
      //     reader.onload = function(event) {
      //       const resp = JSON.parse(reader.result)
      //       if (resp.code == 200) {
      //         if (resp.data.code == 1) {
      //           Message.warning(resp.data.info);
      //           return;
      //         }
      //         Message.warning(resp.msg)
      //       } else {
      //         Notification.error({
      //           title: resp.code + ' 错误',
      //           message: resp.msg,
      //           duration: 0
      //         })
      //       }
      //     }
      //   }
      // }).catch(() => {
      //   loadingInstance.close()
      //   Message.warning('导出失败，请检查网络')
      // })
    })
    .catch(() => ({}))
}

/**
 * 通用表格信息导出方法(自定义提示语)
 * @param url
 * @param query
 * @param fileName
 * @param prompt
 */
export function exportExcelForCustomPrompt(url, query, fileName, prompt) {
  MessageBox.confirm(prompt, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      $v.post(
        this,
        url,
        query,
        (res) => {
          if (res.code === 200) {
            Message.success('导出成功')
            const blobData = base64ToBlob(res.data)
            FileSaver.saveAs(blobData, (fileName || '导出文件') + '.xlsx')
          } else {
            Message.warning(res.msg || '导出失败，请检查网络')
          }
        },
        (err) => {
          console.log(err)
        },
        {
          loading: false
        }
      )
    })
    .catch(() => ({}))
}

export function exportTmpl(type) {
  customDownload(downloadTmplUrl + type)
    .then((res) => {
      if (res.status == 200) {
        Message.success('导出成功')
        resolveBlob2(res, mimeMap.xlsx)
      } else {
        Message.warning('模板下载失败')
      }
    })
    .catch(() => {
      Message.warning('导出失败，请检查网络')
    })
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 * @param {String} fileName 文件名
 */
export function resolveBlob(res, mimeType, fileName) {
  const aLink = document.createElement('a')
  const blob = new Blob([res.data], { type: mimeType })
  aLink.href = URL.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}

/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob2(res, mimeType) {
  const aLink = document.createElement('a')
  const desc = res.headers['content-disposition']
  const filename = desc.substring(desc.indexOf('=') + 1, desc.length)
  aLink.setAttribute('download', decodeURIComponent(filename)) // 设置下载文件名称
  const blob = new Blob([res.data], { type: mimeType })
  aLink.href = URL.createObjectURL(blob)
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)

  // FileSaver.saveAs(blob, filename ? decodeURIComponent(filename) : '导入模板.xlsx');
}

// 用于大屏资源打点
export function downloadByUrl2(fileUrl, fileName) {
  return new Promise((r) => {
    if (fileUrl) {
      $v.get(
        this,
        `/${urlBaseService}/file/download/byUrl`,
        {
          fileUrl: fileUrl
        },
        (res) => {
          if (res.code == 200) {
            r(res.data, fileName)
          } else {
            Notification.error({
              title: res.code + ' 错误',
              message: res.msg,
              duration: 0
            })
          }
        },
        (err) => {
          r('')
        }
      )
    }
  })
}

/**
 * base64数据转成blob格式
 * @param {*} base64
 * @returns
 */
export function base64ToBlob(base64) {
  let str = atob(base64)
  let n = str.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = str.charCodeAt(n)
  }
  return new Blob([u8arr])
}
