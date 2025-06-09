/*
 * @Author: 米亚流年
 * @Date: 2024-02-20 11:29:12
 * @LastEditors: 米亚流年
 * @LastEditTime: 2024-02-20 13:48:55
 * @FilePath: /Component-Gallery/docs/scripts/ make.ts
 * @Description:
 */
const fs = require('fs')
const { marked } = require('marked')
const path = require('path')
const makeMenu = (dir, componentName) => {
  const mdPath = path.resolve(__dirname, '../../../packages', dir)
  const mdTokens = marked.lexer(fs.readFileSync(mdPath).toString())
  for (const token of mdTokens) {
    if (token.type === 'heading' && token.depth === 1) {
      return {
        label: token.text,
        enSuffix: true,
        path: `/${componentName}`
      }
    }
  }
}

module.exports = {
  makeMenu
}
