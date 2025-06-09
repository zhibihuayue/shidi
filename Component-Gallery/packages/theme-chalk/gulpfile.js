/*
 * @Author: 吴飞 wufei@strongdata.com.cn
 * @Date: 2024-07-22 17:20:19
 * @LastEditors: 吴飞 wufei@strongdata.com.cn
 * @LastEditTime: 2024-09-15 10:55:35
 */
'use strict'

const { series, src, dest } = require('gulp')
const sass = require('gulp-dart-sass')
const path = require('path')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const replace = require('gulp-replace')
const rollup = require('@rollup/stream')
const source = require('vinyl-source-stream')
const terser = require('@rollup/plugin-terser')

const projectRoot = path.resolve(__dirname, '../..')

function compileScss() {
  return src('./src/*.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['ie > 9', 'last 2 versions'],
        cascade: false
      })
    )
    .pipe(replace('~@component-gallery/assets', './static'))
    .pipe(cssmin())
    .pipe(dest('./dist/css'))


}

function copyFont() {
  return src('./src/fonts/**').pipe(cssmin()).pipe(dest('./dist/fonts'))
}

function copyAssets() {
  return src(
    path.resolve(projectRoot, 'packages/components/common-assets') + '/**'
  ).pipe(dest('./dist/css/static'))
}

function copyCss() {
  return src('./dist/**').pipe(
    dest(path.resolve(projectRoot, 'dist/theme-chalk'))
  )
}

function compileJS() {
  const options = {
    input: 'src/index.js',
    output: { format: 'umd', name: 'DynamicColors' },
    plugins: [terser()]
  }
  return rollup(options).pipe(source('index.js')).pipe(dest('./dist/js'))
}

exports.build = series(compileScss, compileJS, copyFont, copyAssets, copyCss)
