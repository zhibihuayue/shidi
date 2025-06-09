#!/usr/bin/env node
const path = require("path");
const ora = require("ora");
const { startCompression } = require("../entry/index");
const target = process.argv.slice(2);
const spinner = ora("🤯 compress start \n");
if (target.length === 0) {
  spinner.fail("🚫 请指定组件要压缩的图片目录");
  return;
}

target.forEach(async (scanPath) => {
  console.log("scanPath", scanPath);
  await startCompression(path.resolve(process.cwd(),"packages","components", scanPath), scanPath);
});
