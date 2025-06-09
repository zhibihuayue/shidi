/*
 * @Author: 吴飞 wufei@strongdata.com.cn
 * @Date: 2024-08-14 10:32:51
 * @LastEditors: 吴飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-08-14 11:32:11
 * @FilePath: /Component-Gallery/internal/tinify-images/utils/logger.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const chalk = require("chalk");
const loggerGreen = (message) => {
  console.log(chalk.green(message));
};
const loggerBlue = (message) => {
  console.log(chalk.blue(message));
};
const loggerError = (message) => {
  console.log(chalk.red(message));
};

module.exports = {
  loggerGreen,
  loggerBlue,
  loggerError,
};
