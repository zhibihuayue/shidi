# 组件库

## 概述

- 1: 基于**monorepo**构建组件库工程
- 2: 用**pnpm**代替**npm**解决 mulrepo 场景下**node_module**重复以及 npm i 时下载过慢、在项目跟目录下可以直接启动**playground**工程.
- 3: 将 node 升级到**node16**版本 解决 node 版本过低的问题 **<u>node16 下已验证组件的功能均正常无缺陷</u>**.
- 4: **eslint**+**prettier** +**ls-lint** 解决代码规范、组件目录规范.
- 5: **husky**+**lint-stage** +**commitinint** 规范代码提交.
- 6: 统一组件打包打包脚本.
- 7: 组件库安装依赖统一使用 pnpm.

## 组件本地调试

目前工程使用 node 版本为`16.20.2`，可以使用`nvm`切换到对应版本，拉取工程代码，执行`pnpm install`完成后,解压根路径下的@ct 到根目录下的`node_module`, 在项目根路径执行 `pnpm playground`即可

## 目录结构

```plainText
-packages:
  |-components                        组件库目录
    |-assets                          公共资源(包含字体、图标、图片、样式等静态资源)
      |- font                         字体资源
      |- mapImage     			      地图图标资源
    |- common-comp-*     			  基础组件库通用目录结构
      |- src     				      组件库源码(与此组件相关的资源都src目录下)
        |- index.js     	          组件构建依赖
        |-package.json      	      组件构建依赖
|- docs                               组件库文档工程
|- playground					      playground目录
|- build						      组件库自动打包脚本
      |- index.js                     勿动

```

## 组件目录规范

- 业务组件都需放到 packages/components 下
- 每个组件目录结构如下

```plainText
-common-comp-*     						     基础组件库通用目录结构
  |--- src     						         组件库源码(与此组件相关的资源都src目录下)
    |--- index.js     						 组件构建依赖
    |--- package.json     				     组件构建依赖
```

- packages/components/index.js 内容如下

```javascript
import Footer from './src/CommonFooter.vue'

Footer.install = function (Vue) {
  Vue.component(Footer.name, Footer)
}

export default Footer
```

- packages/components/package.json 内容如下

```json
{
  "name": "",
  "version": ""
}
```

## 规范/约束

新工程引入了较严格的依赖约束，主要覆盖了代码规范，文件、文件夹命名规范，提交信息规范

### 组件间 evenBus event name 命名规范

- emit name、on name 命名规范
  - `component name` + \_\_ + `event name`
  - > component name 来源于 `@component-gallery/build-event-bus-path` 而 `event name` 则来源于业务需求

#### Usage

- 项目根路径执行

```bash
 pnpm run build:event-bus-path
```

> 执行此命令会自动扫描`packages/components`路径下所有的组件，并生成如下的数据结构:

```js
export default {
  commonCompAlarmList: 'common-comp-alarm-list'
  ...
}
```

- 业务组件内安装依赖

```bash
 pnpm add @component-gallery/build-event-bus-path  --filter 业务组件
```

- 业务组件内引用

```vue
import eventPath from '@component-gallery/build-event-bus-path'
```

- 组件内业务代码

```js
this.$globalEventBus.$emit(`${eventPath.commonCompSearchMap}_xxxx`, item)
```

### 文件、文件夹命名规范

引入依赖`ls-lint`，参考文件`.ls-lint.yml`

- 概括说明即`*.vue`文件为 Pascal 命名规则，其余文件、目录均使用 kebab 命名规则
- `*.vue`文件命名需要与业务相关，由多个单词组成,如`LoginPage.vue`

### 代码规范

引入依赖`eslint`，参考文件`eslintrc.cjs`

不必过分担心格式问题，工程引入了`husky`，会在提交前更正可修复的格式问题，而相对于 TypeScript，一个比较严格的要求是消除`any`类型，需要开发人员花费精力做好业务相关的类型声明。

### 提交规范

引入依赖`commitlint`，参考文件`commitlint.config.ts`

没有过多要求，主要目的在于描述清楚提交内容，利于问题追溯

#### 提交格式

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

#### 提交示例

```bash
git commit -m 'feat: 增加 xxx 功能'
git commit -m 'fix(JIRA-123): 修复 xxx bug'
```

## 常见问题

### 组件打包

- 全量打包

```bash
pnpm run build:full-components
```

- 指定组件打包

```bash
skin=common-comp-tree pnpm run build:full-components
```

### 提交报错

请排查是否有代码不合规的情况，或者存在命名不规范的问题

### 关于 ct_map_ol 更新

目前 ct_map_ol 包，采用手动更新，手动替换的方式进行迭代
具体更新详见 `@ct/ct_map_ol/CHANGELOG.md`

## Remote-RunTime 组件远程加载工程 运行前置条件

- 1. `component-gallery`根目录运行`pnpm run build:theme-chalk`,
- 2. 进入`component-gallery/theme-chalk/dist` 执行`npm init` 生成`package.json` 文件,将此包发布到 npm

  ```json
  {
    "name": "component-gallery-theme-chalk",
    "version": "1.0.1", // 变更版本号
    "description": "",
    "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
  }
  ```

- 3. 进入`component-remote-page-loader`工程内,执行 build 命令,然后将仓库发布到 npm
- 4. 调用对应的接口 返回对应的数据
