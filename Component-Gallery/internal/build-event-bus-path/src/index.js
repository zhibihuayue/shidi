/*
 * @Author: 吴飞 wufei@strongdata.com.cn
 * @Date: 2024-07-22 17:20:16
 * @LastEditors: 吴飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-09-11 16:04:47
 * @FilePath: /Component-Gallery/internal/build-event-bus-path/src/index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const shell = require('shelljs')
const path = require('path')
const { camelCase } = require('lodash')
const { writFile } = require('../utils/write-file')
const MarkdownIt = require('markdown-it');
const { readFileSync, existsSync } = require('node:fs')

let evenBusPath = {}
let evenBusCompDesc = {}
shell.cd(path.resolve(__dirname, '..', '..', '..'))
shell.ls('packages/components').forEach((file) => {
  if (
    ![
      'common-assets',
      'common-inner-utils',
      'theme',
      'vue.config.js',
      'package.json'
    ].includes(file)
  ) {
    evenBusPath['commonInnerUtils'] = 'common-inner-utils'
    evenBusPath[camelCase(file)] = `${file}`
    evenBusCompDesc[`${file}`]  = {
      path: path.resolve(process.cwd(), `packages/components/${file}/demo/index.demo-entry.md`),
    }
  }
})
const TEMPLATE = `export default ${JSON.stringify(evenBusPath)}`
writFile(path.resolve(__dirname, '..', 'lib', 'main.js'), TEMPLATE)
const md = new MarkdownIt();
Object.keys(evenBusCompDesc).forEach((key) => {
  const { path } = evenBusCompDesc[key] // NOSONAR
  if (!existsSync(path)) {
    return;
  }
  const markdownContent = readFileSync(path, 'utf-8');
  const tokens = md.parse(markdownContent, {});
  const h1Contents = tokens
    .filter(token => token.type === 'heading_open' && token.tag === 'h1')
    .map((token, index) => tokens[index + 1].content);
  evenBusCompDesc[key].h1Contents = h1Contents.length > 0 ? h1Contents[0]: ''
})
const COMP_DESC = `export default ${JSON.stringify(evenBusCompDesc)}`
writFile(path.resolve(__dirname, '..', 'lib', 'desc.js'), COMP_DESC)
