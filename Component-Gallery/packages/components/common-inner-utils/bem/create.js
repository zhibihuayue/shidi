/*
 * @Author: 米亚流年
 * @Date: 2024-03-19 19:45:57
 * @LastEditors: 米亚流年
 * @LastEditTime: 2024-03-19 21:42:52
 * @FilePath: /Component-Gallery/packages/components/common-inner-utils/bem/create.js
 */
function _bem(prefixName, blockSuffix, element, modifier) {
  if (blockSuffix) {
    prefixName += `-${blockSuffix}`
  }
  if (element) {
    prefixName += `__${element}`
  }

  if (modifier) {
    prefixName += `--${modifier}`
  }
  return prefixName
}

function createBEM(prefixName) {
  const b = (blockSuffix = '') => _bem(prefixName, blockSuffix, '', '')
  const e = (element = '') => (element ? _bem(prefixName, '', element, '') : '')
  const be = (blockSuffix = '', element = '') =>
    blockSuffix && element ? _bem(prefixName, blockSuffix, element, '') : ''
  return {
    b,
    e,
    be
  }
}

export function createNameSpace(name) {
  const prefixName = `${name}`
  return createBEM(prefixName)
}
