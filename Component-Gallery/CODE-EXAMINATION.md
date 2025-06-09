# 代码审查
- 组件使用的图片一定要压缩，否则会影响加载速度。这个压缩不是简单的从蓝湖上下载的时候的压缩，而是使用现在工程里集成的压缩工具pnpm run prepare-tinify-image 完成压缩，或者使用[https://tinypng.com/?ref=biemoyu.com]
- 组件的 `index.demo-entry.md` 里面的内容一定要详而全，特别是参数说明，杜绝参数直接写个 `object`,也不说明这个 `object` 里面有哪些参数。杜绝相关API书写不完整，遗漏API。
- 杜绝在写样式的时候只这么写 `<style lang="scss" scoped></style>` 为了后续样式覆盖的问题，一定要使用命名空间包括一下比如：`.common-comp-alarm-today { xxx }` 所有的样式都写在common-comp-alarm-today里面
- 杜绝在代码中引入jquery
- 杜绝在引入包的时候使用 `import * as xxx from 'xxx'` 引入包，因为这样会导致打包的时候把整个包都打包进去，导致体积过大。
- 杜绝把组件的状态函数`data`作为一个存放变量的地方，什么内容都顺手仍在data里面，这样会导致组件的复用性变差。能使用计算属性的使用计算属性，不能使用计算属性的再使用data
- 杜绝把地图示例直接放在`data`里，这样会影响整个页面的性能
- 杜绝把一些静态的数据直接写在业务代码里，建议针对静态数据提出一个单独的`data.js`文件，这样方便维护，也方便复用。同时还可以使用`import {xxx} from 'data.js'` 引入以及缩减单个文件的代码量
- 杜绝一整个页面都写在`index.vue`里面，这样会导致整个页面的代码量过大，不利于维护。建议把每个页面拆分成一个，单个业务代码文件不能超过1000行。
- 杜绝同样的功能或者相似度达到80%以上的代码直接复制粘贴。建议提取成公共的功能模块，然后直接通过 `import`的方式引入。
- 杜绝一些工具函数直接自己实现，应统一使用`commmon`文件夹下的工具函数。
- 杜绝在使用时间处理函数`moment`,统一使用`dayjs`
- 杜绝在window上绑定了一些事件监听方法，最后没有解绑：如scroll,resize等等
- 杜绝在可以使用数据驱动的地方，直接平铺写重复的dom
- 杜绝正常逻辑前置，异常逻辑后置，如下写法不允许：
    ````
    function checkStatus() {
      done();
      if (!isLogin()) {
        throw new Error('未登录');
      }
      if (!isVip()) {
        throw new Error('不是会员');
      }
      if (!isDoubleCheck()) {
        throw new Error('不要重复点击');
      }
    }
    ````
    我们要遵循异常逻辑前置，正常逻辑后置的写法
- 杜绝在代码中出现如下这种写法
  ````
  if (xx){
    return true
  }
  if (oo) {
    return true
  }
  ````
- 杜绝在代码中出现如下这种写法：
  ````
  const maxVal = Math.max(...rigLineData.seriesBarList)
    let gridLeft = 0
    if (maxVal >= 1000000) {
      gridLeft = '20.5%'
    } else if (maxVal >= 100000) {
      gridLeft = '18.5%'
    } else if (maxVal >= 10000) {
      gridLeft = '16.5%'
    } else if (maxVal >= 1000) {
      gridLeft = '13.5%'
    } else {
      gridLeft = '12%'
    }
  ````
改成类似如下写法：
  ````
  const thresholds = [
      { value: 1000000, gridLeft: '20.5%' },
      { value: 100000, gridLeft: '18.5%' },
      { value: 10000, gridLeft: '16.5%' },
      { value: 1000, gridLeft: '13.5%' },
    ];
    const result = thresholds.find(({ value }) => maxVal >= value);
    return result ? result.gridLeft : '12%';
  ````
其实就是优先考虑策略模式来减少复杂度，增加可读性和后续扩展性
- 杜绝在处理数据时，对不确定的数据没有做容错处理，造成页面白屏
- 如无特殊情况，杜绝循环调用接口
- 杜绝满屏的setTimeout，不可控
- 杜绝在页面上不太重要的图片使用`<img src="xxx">`，尽量使用`background-image: url(xxx)`
- 杜绝样式中满屏的`!important`，尽量使用命名空间
- 杜绝在有移动的动画中直接使用`left,top`等，尽量使用`transform: translate(x,y)`