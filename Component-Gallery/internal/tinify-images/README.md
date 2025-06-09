<!--
 * @Author: 吴飞 wufei@strongdata.com.cn
 * @Date: 2024-08-14 10:32:35
 * @LastEditors: 吴飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-08-14 11:38:30
 * @FilePath: /Component-Gallery/internal/tinify-images/README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# @component-gallery/tinify-images

 此CLI工具用于压缩图片
 使用示例
 `tinify-image common-comp-tree/src/assets`

## Features

- 压缩后的图片会自动生成到 指定目录下的`*_compress`目录下,并保持图片原有目录层级
  - 例如： `tinify-image common-comp-tree/src/assets` 命令, 压缩后的图片会自动生成到 `common-comp-tree/src/assets_compress`目录下


## Getting started

### 安装

- 项目根目录执行

  ``` bash
  pnpm prepare-tinify-image
  ```

### 使用

- 项目根目录执行

  ``` bash
  tinify-image [路径]
  ```
