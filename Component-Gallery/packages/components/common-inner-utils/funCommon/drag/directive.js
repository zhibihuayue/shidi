//directive.js文件
import Vue from 'vue'
// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }

      document.onmousemove = function (e) {
        // 取消文本选中，来规避拖动时产生的问题
        window.getSelection
          ? window.getSelection().removeAllRanges()
          : document.selection.empty()
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
  bind(el, binding, vnode, oldVnode) {
    const dragDom = binding.value.$el.querySelector('.el-dialog')

    el.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - el.offsetLeft

      document.onmousemove = function (e) {
        e.preventDefault() // 移动时禁用默认事件

        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        dragDom.style.width = `${l}px`
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

Vue.directive('divDrag', {
  bind(el, binding, vnode, oldVnode) {
    if (binding.value != null && !binding.value?.handelDragTag) {
      return
    }
    let dialogHeaderEl = el.querySelector('.tool-header')
    let dragDom = el
    let offsetLeft = 0
    let offsetTop = 0
    //出现没有header的时候直接用div
    if (dialogHeaderEl) {
      console.log(dialogHeaderEl)
      if (!binding.value?.canCopy) {
        dialogHeaderEl.oncopy = function (e) {
          return false
        }
      }
      dialogHeaderEl.style.cursor = 'pointer'
      offsetLeft = dialogHeaderEl.offsetLeft
      offsetTop = dialogHeaderEl.offsetTop
    } else {
      dialogHeaderEl = el
      if (!binding.value?.canCopy) {
        el.oncopy = function (e) {
          return false
        }
      }
      el.style.cursor = 'pointer'
    }

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    let sty =
      dragDom.currentStyle ||
      document.defaultView.getComputedStyle(dragDom, null)

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      let disX = e.clientX - offsetLeft
      let disY = e.clientY - offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        let l = e.clientX - disX
        let t = e.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})
Vue.directive('hasPermi', {
  inserted(el, binding, vnode) {
    const { value } = binding
    const all_permission = '*:*:*'
    const permissions = window.$videoStoreData.permissions || []

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value
      const hasPermissions = permissions.some((permission) => {
        return (
          all_permission === permission || permissionFlag.includes(permission)
        )
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
})
