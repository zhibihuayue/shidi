<!--
 * @Author: fanzhiwei
 * @Date: 2024-06-19 11:41:29
 * @LastEditors: fanzhiwei
 * @LastEditTime: 2024-06-19 12:43:08
 * @FilePath: /shidi-industry/README.md
 * @Description: 说明
-->
# 1.项目介绍

湿地项目--

# 2.项目环境  
node 16.14+

npm 8.3+

# 3.规范/约束
## 代码规范

引入依赖`eslint`，参考文件`eslintrc.cjs`

## 代码提交规范

没有过多要求，主要目的在于描述清楚提交内容，利于问题追溯

### 提交格式

`git commit -m <type>[scope]: <description>`

type :用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档？总结以下 11 种类型:

- build:主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
- ci:主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle 等)的提交
- docs:文档更新
- feat:新增功能
- fix:bug 修复
- perf:性能优化
- refactor:重构代码(既没有新增功能，也没有修复 bug)
- style:不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
- test:新增测试用例或是更新现有测试
- revert:回滚某个更早之前的提交
- chore:不属于以上类型的其他类型(日常事务)

scope:一个可选的修改范围。用于标识此次提交主要涉及到代码中哪个模块。

description:一句话描述此次提交的主要内容，做到言简意赅。

### 提交示例

```bash
git commit -m 'feat: 增加 xxx 功能'
git commit -m 'fix(JIRA-123): 修复 xxx bug'
```

# 4.项目运行
## 安装依赖

npm install

## 开发运行

npm run serve

## 打包

npm run build