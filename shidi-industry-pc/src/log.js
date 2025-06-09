/*
 * @Author: 米亚流年 miyaliunian@gmail.com
 * @Date: 2024-03-29 13:13:35
 * @LastEditors: 米亚流年 miyaliunian@gmail.com
 * @LastEditTime: 2024-03-29 13:13:45
 * @FilePath: /remote-runtime/src/log.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const extractVersion = inputString => {
  const pattern = /\d+\.\d+\.\d+/;
  const match = inputString.match(pattern);
  return match ? match[0] : null;
};

export const logVersion = (aString, aVersion, aLColor, aRColor) => {
  const VERSION = aVersion || '1.0.0';
  const leftStyle = `background:${aLColor || '#606060'}; color: #fff; border-radius: 3px 0 0 3px;padding: 5px;`;
  const rightStyle = `background: ${aRColor || '#1475B2'}; color: #fff; border-radius: 0 3px 3px 0;padding: 5px;`;
  console.log(`%c ${aString} %c ${VERSION} `, leftStyle, rightStyle);
};
