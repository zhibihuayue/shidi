/*
 * @Author: 逗逗飞 wufei@strongdata.com.cn
 * @Date: 2024-10-23 20:48:29
 * @LastEditors: 逗逗飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-10-24 13:03:47
 * @FilePath: /Component-Gallery/internal/shout-stream/rollup.config.js
 * @Description:
 */
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { babel } from '@rollup/plugin-babel'

export default {
  input: './index',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      plugins: [terser()]
    }
  ],
  plugins: [resolve(), commonjs(), babel({ babelHelpers: 'bundled' })]
}

