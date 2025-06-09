/*
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-15 09:30:26
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-10-23 19:34:33
 * @FilePath: /Component-Gallery/internal/build-map-ref/rollup.config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'umd',
    name: 'MapRef'
    // globals: {
    //   jquery: '$',
    //   lodash: '_'
    // }
  },
  // external: ['jquery', 'lodash'], // 外部依赖 不会打包到bundle.js
  plugins: [
    commonjs(), // 支持commonjs模块引入
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    typescript(),
    terser()
  ]
}
