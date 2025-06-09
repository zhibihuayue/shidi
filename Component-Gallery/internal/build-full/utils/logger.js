/*
 * @Author: 吴飞 wufei@strongdata.com.cn
 * @Date: 2024-07-22 17:20:16
 * @LastEditors: 吴飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-09-15 10:57:05
 * @FilePath: /Component-Gallery/internal/build-full/utils/logger.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const chalk = require('chalk')
const log = console.log;
const loggerGreen = (message, process = '') => {
  log(chalk.underline.bold.red(`${message} `), chalk.greenBright(process))
  log('\n')
}
module.exports = {
  loggerGreen
}
