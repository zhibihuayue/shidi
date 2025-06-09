/*
 * @Author: 吴飞 wufei@strongdata.com.cn
 * @Date: 2024-08-14 10:32:51
 * @LastEditors: 吴飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-08-14 11:33:03
 * @FilePath: /Component-Gallery/internal/tinify-images/shared/mageShared.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const imageType = require("../constant/image-type");
const path = require("path");
const globby = require("globby");
const isImage = (file) => {
  return imageType.includes(path.extname(file).toLowerCase());
};

const isImages = async (dir) => {
  const modules = await globby(["**/*.png", "**/*.jpg", "**/*.jpeg"], {
    cwd: dir,
  });
  return modules.length > 0;
};

const isSvgGif = async (dir) => {
  const modules = await globby(["**/*.svg", "**/*.gif"], {
    cwd: dir,
  });
  return {
    exist: modules.length > 0,
    files: modules,
  };
};

module.exports = {
  isImages,
  isImage,
  isSvgGif,
};
