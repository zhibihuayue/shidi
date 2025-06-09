/* eslint-disable @typescript-eslint/no-var-requires */
// /Users/xiao/junnan/tieta/application-forestry/forestry-pc/src/components/ComFooterFunsArea/components/deviceInfoPopup/separateInfo.js
export function deviceStatusequaltoZero(item, index, _obj, id, _arr = []) {
  return `<li class="InfoWindowCameraItem InfoWindowCameraItem_${index}" data-length="${
    _arr.length
  }" data-id="${id}" title="${item.deviceName}" data-index="${index}">
  <i class='${_obj[id]}'></i>
   <p>${item.deviceName}</p>
   ${item.height ? `<span>${item.height}m</span>` : ''}
   </li>`
}

export function deploymentSituationtwenty(item, index, _obj, id, _arr = []) {
  let addstr = `<i class='${_obj[id]}'></i>`
  let Online = require('@component-gallery/assets/functionMenu/TrapOnline.png') // 在线 诱捕器
  let Offline = require('@component-gallery/assets/functionMenu/TrapOffline.png') // 离线 诱捕器
  if (item.deploymentSituation === '0') {
    addstr = `<img style="width:13.2px;height: 16px" src=${Online} />`
  }
  if (item.deploymentSituation === '1') {
    addstr = `<img style="width:16px;height: 16px"  src="${Offline}" />`
  }
  let endSTR = `<li class="InfoWindowCameraItem InfoWindowCameraItem_${index}" data-id="${id}" data-length="${_arr.length}" title="${item.deviceName}" data-index="${index}">`

  endSTR += addstr
  endSTR += `<p>${item.deviceName}</p>
${item.height ? `<span>${item.height}m</span>` : ''}
</li>`
  return endSTR
}
export function getdeviceListelseHtml(item, index, _obj, id, _arr = []) {
  return `<li class="InfoWindowCameraItem InfoWindowCameraItem_${index}" data-length="${
    _arr.length
  }" style="color: #818D99" data-id="${id}" title="${
    item.deviceName
  }" data-index="${index}">
  <i class='${_obj[id]}' style="color:rgba(232, 243, 254, 0.6)"></i>
 <p style="color:rgba(232, 243, 254, 0.6)">${item.deviceName}</p>
 ${
   item.height
     ? `<span style="color:rgba(232, 243, 254, 0.6)">${item.height}m</span>`
     : ''
 }
 </li>`
}
export function getTrapRecoderHTml(_obj, _info, key) {
  return `<div class="attrItem">
  <span class="attrLabel">${_info[key]}：</span>
  <span class="attrValue" title="${_obj[key]}"><span>${
    _obj[key]
      ? _obj[key] + (key == 'height' ? 'm' : key == 'trapNumber' ? '只' : '')
      : '-'
  }</span>${
    key == 'deviceCode' || key == 'deviceName'
      ? `<i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${_obj[key]}"></i>`
      : ''
  }</span>
</div>`
}
export function getCamerDetailLeftHtml(_obj, _info, key) {
  return `<div class="attrItem">
  <span class="attrLabel">${_info[key]}：</span>
  <span class="attrValue" title="${_obj[key]}"><span>${
    _obj[key] ? _obj[key] + (key == 'height' ? 'm' : '') : '-'
  }</span>${
    key == 'deviceCode'
      ? `<i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${_obj[key]}"></i>`
      : ''
  }</span>
</div>`
}
export function getCamerDetailRightHtml(item) {
  return `<div class="imgItem">
  ${
    item.type == 1
      ? `<img src="${item.fileUrl}" />`
      : `<video src="${item.fileUrl}" controlslist="nodownload noplaybackrate" disablePictureInPicture referrerpolicy='no-referrer' controls></video>`
  }
  </div>`
}
export function getTrapHeadStatusHtml(id, data, configObj) {
  let endstr = ''
  if (id == 20) {
    if (data.deploymentSituation) {
      endstr += ` <span class="${
        data.deploymentSituation == '1' ? 'offline' : ''
      }" style="margin-left: 10px;">${
        data.deploymentSituation == '1' ? '未布设' : '已布设'
      }</span>`
    }
    endstr += `<i  data-ismonitor="${data.collectionFlag}" data-collobjtype="${
      configObj.collObjType
    }" data-collobjcode="${data.deviceCode}" class="iconfont_tools ${
      data.collectionFlag == '1'
        ? 'icon-AR-yishoucang select'
        : 'icon-weishoucang'
    } dotBoxCollectBtn"></i>`
  } else {
    endstr += getOnlineStatusHtml(data, configObj)
  }

  return endstr
}
function getOnlineStatusHtml(data, configObj) {
  let endstr = ''
  endstr += ` <span class="${
    data.status == 1 || data.deviceStatus == 1 ? 'offline' : ''
  }">${data.status == 1 || data.deviceStatus == 1 ? '离线' : '在线'}</span>`
  endstr += `<i  data-ismonitor="${data.isMonitor}" data-collobjtype="${
    configObj.collObjType
  }" data-collobjcode="${data.deviceCode}" class="iconfont_tools ${
    data.isMonitor == '1' ? 'icon-AR-yishoucang select' : 'icon-weishoucang'
  } dotBoxCollectBtn"></i>`
  return endstr
}

export function getCamerachannelListHTML(
  data,
  configObj,
  locationString,
  btnEventTitleString,
  id,
  _isPlay
) {
  let channelName = ' 通道名称：'
  let channelNumber = ' 通道编号：'
  return `
  ${
    configObj.isShowChannel
      ? `
    <div class="dotInfoBox style2 ${
      data.channelList && data.channelList.length == 1 ? 'short' : ''
    }">
      <div class="dotInfo">
      ${(function () {
        return data.channelList
          .map((item) => {
            return `<div class="attrItem">
              <span class="attrLabel ${
                item.status == 1 ? 'offline' : 'online'
              }">${channelName}</span>
              ${
                item.channelName
                  ? `<span class="attrValue" title="${item.channelName}"><span>${item.channelName}</span><i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${item.channelName}"></i></span>`
                  : '-'
              }
            </div>
            <div class="attrItem">
              <span class="attrLabel">${channelNumber}</span>
              ${
                item.channelCode
                  ? `<span class="attrValue" title="${item.channelCode}"><span>${item.channelCode}</span><i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${item.channelCode}"></i></span>`
                  : '-'
              }
            </div>`
          })
          .join('')
      })()}
      </div>
    </div>`
      : ''
  }
</div>
<div class="bottomBtns">
<div class="border-top-1">
  ${setIcon(
    configObj.icon,
    data,
    locationString,
    btnEventTitleString,
    id,
    _isPlay
  )}
</div>

</div>
</div>
</div>`
}

function setIcon(arr, data, locationString, btnEventTitleString, id, _isPlay) {
  let iconArr = {
    0: `<i class="iconfont_tools icon-icon_jianceshuju_30_n bottomBtnMonitor" data-code="${data.deviceCode}"  title="监测数据"></i>`,
    1: `<i class="iconfont_tools icon-icon_hanhua_30_n bottomBtnShout" data-code="${data.deviceCode}" data-name="${data.deviceName}" title="实时喊话"></i>`,
    2: `<i class="iconfont_tools ${
      _isPlay
        ? 'select icon-icon_shishishipin_30_s'
        : 'icon-icon_shishishipin_30_n'
    }  bottomBtnVideo" data-id="${id}" title="实时视频"></i>`,
    3: `<i class="iconfont_tools icon-icon_lishiguiji_30_n bottomBtnTrack1" data-code="${data.deviceCode}" title="历史轨迹"></i>`, ////${( == '1') ? 'select' : ''}"
    4: `<i class="iconfont_tools icon-icon_shishiguiji_30_n bottomBtnTrack2" data-status="${
      data.status == 1 || data.deviceStatus == 1 ? '1' : '0'
    }" data-code="${data.deviceCode}" title="实时轨迹"></i>`,
    // 5: `<i class="iconfont_tools icon-keshiyu bottomBtnView" data-code="${data.deviceCode}" title="可视域"></i>`,
    6: `<i class="iconfont_tools icon-icon_kanzheli_30_n bottomBtnLook" style="pointer-events:auto" data-longitude="${data.longitude}" data-status="${data.status}" data-latitude="${data.latitude}" title="看这里"></i>`,
    7: `<i class="iconfont_tools icon-icon_guanlian_20_n bottomBtnEvent" data-code="${data.deviceCode}" data-id="${id}" title="${btnEventTitleString}"></i>`,
    8: `<i class="iconfont_tools icon-icon_zhoubianfenxi_30_n bottomBtnPeriphery" data-longitude="${data.longitude}" data-latitude="${data.latitude}" data-devicecode="${data.deviceCode}" title="周边分析"></i>`,
    9: `<i class="iconfont_tools icon-icon_daozheli_30_n bottomBtnCome" data-position="${locationString}" data-latlon="${data.longitude},${data.latitude}" title="到这里"></i>`
  }
  return arr
    .map((item) => {
      return iconArr[item]
    })
    .join('')
}

export function getResource_Html(infoObj, key, data) {
  return `<div class="attrItem">
  <span class="attrLabel attrText">${infoObj[key].t}：</span>
  <span class="attrValue setWrap ${
    key === 'remark' ? 'scroll-y' : ''
  }" title="${data[key]}"><span>${
    data[key] ? data[key] + (infoObj[key].u || '') : '-'
  }</span>${
    key == 'deviceCode'
      ? `<i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${data[key]}"></i>`
      : ''
  }</span>
</div>`
}
export function getGridManMaek_Html(infoObj, key, data) {
  return `<div class="attrItem">
  <span class="attrLabel">${infoObj[key].t}：</span>
  <span class="attrValue setWrap" title="${data[key]}"><span>${
    data[key] ? data[key] + (infoObj[key].u || '') : '-'
  }</span>${
    key == 'deviceCode'
      ? `<i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${data[key]}"></i>`
      : ''
  }</span>
</div>`
}
export function getSmalClassWindowsHtml(infoObj, key, data) {
  return `<div class="attrItem">
  <span class="attrLabel label_text smallClass_Window">${
    infoObj[key].t
  }：</span>
  <span class="attrValue" title="${data[key]}"><span>${
    data[key] ? data[key] + (infoObj[key].u || '') : '-'
  }</span>${
    key == 'code'
      ? `<i class="iconfont_tools dotInfoCopyIcon icon-fuzhiicon icon-one-fuzhi" data-value="${data[key]}"></i>`
      : ''
  }</span>
</div>`
}

export function getGridManMaekIcon(arr, detaildata, id) {
  let iconArr = {
    0: `<i class="iconfont_tools icon-icon_jianceshuju_30_n bottomBtnMonitor" data-code="${detaildata.deviceCode}"  title="监测数据"></i>`,
    1: `<i class="iconfont_tools icon-icon_hanhua_30_n bottomBtnShout" data-code="${detaildata.deviceCode}" data-name="${detaildata.deviceName}" title="实时喊话"></i>`,
    2: `<i class="iconfont_tools icon-icon_shishishipin_30_n bottomBtnVideo" data-id="${id}" title="实时视频"></i>`,
    3: `<i class="iconfont_tools icon-icon_lishiguiji_30_n bottomBtnTrack1 " data-code="${detaildata.deviceCode}" title="历史轨迹"></i>`, //${( == '1') ? 'select' : ''}"
    4: `<i class="iconfont_tools icon-icon_shishiguiji_30_n bottomBtnTrack2" data-status="${
      detaildata.status == 1 || detaildata.deviceStatus == 1 ? '1' : '0'
    }" data-code="${detaildata.deviceCode}" title="实时轨迹"></i>`,
    5: `<i class="iconfont_tools icon-icon_shishiguiji_30_n bottomBtnTrack7" data-status="${
      detaildata.status == 1 || detaildata.deviceStatus == 1 ? '1' : '0'
    }" data-code="${detaildata.keeperId}" title="网格员轨迹"></i>`,

    // 5: `<i class="iconfont_tools icon-keshiyu bottomBtnView" data-code="${detaildata.deviceCode}" title="可视域"></i>`,
    6: `<i class="iconfont_tools icon-icon_kanzheli_30_n bottomBtnLook" style="pointer-events:auto" data-status="${detaildata.status}" data-longitude="${detaildata.longitude}" data-latitude="${detaildata.latitude}" title="看这里"></i>`,
    7: `<i class="iconfont_tools icon-icon_guanlian_20_n bottomBtnEvent" data-code="${detaildata.deviceCode}" data-id="${id}" title="关联事件"></i>`,
    8: `<i class="iconfont_tools icon-icon_zhoubianfenxi_30_n bottomBtnPeriphery" data-longitude="${
      detaildata.longitude
    }" data-latitude="${detaildata.latitude}" data-devicecode="${
      detaildata.deviceCode || detaildata.keeperId
    }" title="周边分析"></i>`,
    9: `<i class="iconfont_tools icon-icon_daozheli_30_n bottomBtnCome" data-position="${detaildata.keeperAddress}" data-latlon="${detaildata.longitude},${detaildata.latitude}" title="到这里"></i>`
  }
  return arr
    .map((item) => {
      return iconArr[item]
    })
    .join('')
}
{
  /* <i class='iconfont_tools icon-linye_icon_caijijilu'></i> */
}
export function getOldTreeListWIndow(_arr) {
  return `
  <div class="device-CameraListinfo-Window">
            <i data-id="23" class="closeImg InfoWindowCloseBtn"></i>
            <ul>
              ${(function () {
                return _arr
                  .map((item, index) => {
                    return getOldTreeitem(item, index, _arr)
                  })
                  .join('')
              })()}
            </ul>
            <div class="cameraInfoBox"></div>
            </div>
  </div>
  `
}
function getOldTreeitem(item, index, _arr) {
  // ' : 'isOffLine'
  let endstr = `<li class="InfoWindowCameraItem li_span isOnLine InfoWindowCameraItem_${index}" data-length="${_arr.length}" data-id="23" data-index="${index}">
  `
  console.log('古树名木item', item.treeGrade)
  let treeSpecies = ''
  let treeClassName = ''
  switch (item.treeGrade) {
    case '1':
      treeSpecies = '一级古树'
      endstr += `
      <i class="iconfont icon-linye_icon_yijigushu"> </i>
    `
      break
    case '2':
      treeSpecies = '二级古树'
      endstr += `
    <i  class="iconfont icon-linye_icon_erjigushu"></i>
  `
      break
    case '3':
      treeSpecies = '三级古树'
      endstr += `
    <i  class="iconfont icon-linye_icon_sanjigushu"></i>
  `
      break
    default:
      treeSpecies = '名木'
      endstr += `
    <i  class="iconfont icon-linye_icon_mingshu"></i>
  `
      break
  }
  if (treeSpecies == '名木') {
    treeClassName = 'name_tree'
  }
  // <p>${item.deviceName}</p>
  // ${item.height ? `<span>${item.height}m</span>` : ''}
  endstr += `
  <a class="span_text InfoWindowCameraItem InfoWindowCameraItem_${index}" data-id="23"  style="flex-grow: 1;" data-index="${index}" data-length="${
    _arr.length
  }" title="${item.treeCode}">${item.treeCode + item.treeCode}</a>
  <a class="span_text InfoWindowCameraItem InfoWindowCameraItem_${index} ${treeClassName}" data-id="23"  style="text-align: right;" data-index="${index}" title="${treeSpecies}">${treeSpecies}</a>
</li>`
  return endstr
}
/**
 * 编码格式化文字
 */
function format(key, value, dictOptions) {
  if (!dictOptions) {
    return value
  }
  let label = value
  dictOptions[key].map((item) => {
    if (item.dictValue === value) {
      label = item.dictLabel
    }
  })
  return label
}
//古树详情
export function getOldTreeDetailHtml(
  data,
  type,
  plantTime,
  objData,
  newsData,
  arrt,
  info,
  scaleY,
  levelLabel
) {
  let newsObj = {
    chinese: '中文名',
    alias: '别名',
    latin_name: '拉丁名',
    Science: '科',
    attribute: '属',
    point: '特点',
    profile: '简介'
  }
  let treeAdressInfo = {
    // addressName: '地址',
    altitudeName: '海拔',
    logAndLat: '经纬度'
  }

  let logAndLat = data.longitude ? data.longitude + '，' + data.latitude : '-'
  let treeAdressInfoObj = {
    // addressName:data.treeAddress,//地址
    altitudeName: data.altitude ? data.altitude + '米' : '-', //海拔
    logAndLat: logAndLat //经纬
  }
  let nameF = data.name ? data.name : data.treeSpecies + data.treeCode

  let isOLdTree = ['1', '2', '3'].includes(data.treeGrade) ? true : false

  return `<div style="${
    type == 2 ? `transform: scale(${scaleY});` : ''
  }" class="dotBox deviceWindowsIdviceWindowsId attrDotDetailsBox ">
  <i data-id="23" class="closeImg InfoWindowCloseBtn"></i>
  <div class="el-dialog__header ">
        <div  class=" name" style="flex-direction: row;display: flex;width: 335px;">
     <h4  title="${nameF}">${nameF}</h4>
     ${levelLabel}
     <i  data-istree="1" data-isMonitor="${data.collect}" data-collobjtype="${
    isOLdTree ? 5 : 6
  }" data-collObjCode="${data.id}" class="iconfont_tools ${
    data.collect == '1' ? 'icon-AR-yishoucang select' : 'icon-weishoucang'
  } dotBoxCollectBtn"></i>
     <div class="headdivider"></div>
    </div>
  </div>
  <div class="dotContent">
    <div class="dotTab">
      <div class="dotTabList select" data-index="1">图片</div>
      <div class="dotTabList" data-index="2">基本信息</div>
      <div class="dotTabList" data-index="3">生长状况</div>
    </div>
    <div class="ancient_tab_box">
      <div class="treesImage short">
          <div class="treesImage_content">
          <div style="height: 186px;overflow:hidden;margin-top:10px">
          ${
            arrt.length
              ? `<div class="imgListBox">
              <div class="imgList" data-typeId="23">
                ${(function () {
                  return arrt
                    .map((item) => {
                      return getOldTreeImgeLisHtml(item)
                    })
                    .join('')
                })()}
              </div>
            </div>
            <i class="iconfont_tools icon-nav-right turn-btn-popup prev rotateLeft" ></i>
            <i class="iconfont_tools icon-nav-right turn-btn-popup next"></i>
            <i class="iconfont_tools icon-quanpingicon dotBoxFullScreen" style="bottom: 105px;right: 5px;"></i>`
              : '<i class="c-no-datas" style="top:38%;">暂无数据</i>'
          }
          </div>

          <div class="treeAdressInfo">
            <div class="attritem_box">
              <span class="attrLabel">地址：</span>
              <span class="attrValue" title="${data.treeAddress}">
                <span>${data.treeAddress ? data.treeAddress : '-'}</span>
              </span>
            </div>
            ${(function () {
              return Object.keys(treeAdressInfo)
                .map((key) => {
                  return getCamerDetailLeftHtml(
                    treeAdressInfoObj,
                    treeAdressInfo,
                    key
                  )
                })
                .join('')
            })()}
            <div style="width:100%;height:5px;"></div>
          </div>
        </div>



      </div>
    <div class="basicNews short">
      <div class="dotInfoBox">
        <div class="dotInfo">
          ${(function () {
            return Object.keys(newsObj)
              .map((key) => {
                return getOldTreeNewsData_Html(newsObj, key, newsData)
              })
              .join('')
          })()}
        </div>
      </div>
    </div>
    <div class="growDotContent short">
        <div class="dotInfoBox">
          <div class="dotInfo">
            ${(function () {
              return Object.keys(info)
                .map((key) => {
                  return getOldTreeInfo_Html(info, key, objData)
                })
                .join('')
            })()}
            ${plantTime}
            <div class="attritem_box">
              <span class="attrLabel">树木特性：</span>
              <span class="attrValue" title="${data.treeCharacteristics}">
                <span>${
                  data.treeCharacteristics ? data.treeCharacteristics : '-'
                }</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomBtns">
      <div class="border-top-1 bottom_box">
        <i class="iconfont_tools icon-icon_kanzheli_30_n bottomBtnLook"  style="pointer-events:auto" data-islookhere="0" data-typeId="23" data-longitude="${
          data.longitude
        }" data-latitude="${data.latitude}" title="看这里"></i>
        <i class="iconfont_tools icon-icon_zhoubianfenxi_30_n bottomBtnPeriphery" data-longitude="${
          data.longitude
        }" data-latitude="${data.latitude}" data-devicecode="${
    data.deviceCode
  }" title="周边分析"></i>
        <i class="iconfont_tools icon-icon_daozheli_30_n bottomBtnCome" data-position="${
          data.treeAddress
        }" data-latlon="${data.longitude},${data.latitude}" title="到这里"></i>
        <i class="iconfont_tools icon-icon_hanhua_30_n bottomBtnShout" data-typeid="23" data-code="${
          data.id
        }" data-name="${nameF}" title="实时喊话"></i>
      </div>
    </div>
  </div>
  </div>`
}
function getOldTreeImgeLisHtml(item) {
  return `<div class="imgItem">
  ${
    item.type == 1
      ? `<img src="${item.fileUrl}" mode="aspectFit" />`
      : `<video src="${item.fileUrl}" controlslist="nodownload noplaybackrate" disablePictureInPicture referrerpolicy='no-referrer' controls></video>`
  }
  </div>`
}

function getOldTreeInfo_Html(info, key, objData) {
  return `<div class="itemlabel_box">
<span class="attrLabel">${info[key]}：</span>
<span class="attrValue" title="${objData[key]}">
    <span>${objData[key] ? objData[key] : '-'}</span>
</span>
</div>`
}
function getOldTreeNewsData_Html(newsObj, key, newsData) {
  return `<div class="attritem_box">
  <span class="attrLabel">${newsObj[key]}：</span>
  <span class="attrValue" title="${newsData[key]}">
    <span>${newsData[key] ? newsData[key] : '-'}</span>
  </span>
</div>`
}
