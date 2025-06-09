/*
 * @Author: 吴飞 wufei@strongdata.com.cn
 * @Date: 2024-08-14 11:07:46
 * @LastEditors: 吴飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-08-14 11:08:17
 * @FilePath: /Component-Gallery/internal/tinify-images/install/index.js
 * @Description:
 */
const path = require('path')
const shell = require('shelljs')
shell.cd(path.resolve(__dirname, '..'))
shell.exec('npm unlink tinify-image && npm link')
