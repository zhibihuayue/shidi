//directive.js文件
import Vue from 'vue'

/**
 * 提示
 */
let tipDelayTiming, tipUpdateTiming, tipEle
function handleShowTips(e, el, binding) {
  clearTimeout(tipDelayTiming)
  clearInterval(tipUpdateTiming)
  tipEle && tipEle.remove()
  tipDelayTiming = setTimeout(() => {
    tipShow(e, el, binding)
  }, 500)
}
function handleRemoveTips() {
  clearTimeout(tipDelayTiming)
  clearInterval(tipUpdateTiming)
  tipEle && tipEle.remove()
}

function createTipElement(text) {
  let el = document.createElement('i')
  el.className = 'c-tip'
  el.textContent = text
  tipEle = el
  return el
}
function tipShow(e, element, binding) {
  const offsetWidth = element.offsetWidth
  // const clientWidth = element?.getBoundingClientRect()?.width
  const clientWidth = element.clientWidth
  const scrollWidth = element.scrollWidth
  const scrollHeight = element.scrollHeight
  const clientHeight = element.clientHeight
  if (
    binding.modifiers.auto &&
    (!binding.value ||
      (scrollWidth <= (clientWidth || offsetWidth) &&
        scrollHeight <= clientHeight))
  ) {
    return false
  }

  const tip = createTipElement(binding.value)
  document.body.append(tip)

  if (window.fullScreenId && checkScreenFull()) {
    document.getElementById('#' + window.fullScreenId).append(tip)
  }
  tipFit(e, element, binding.arg)
  tipUpdate(e, element, binding)
}
function tipUpdate(e, $dom, binding) {
  tipUpdateTiming = setInterval(() => {
    if (tipEle.textContent !== binding.value) {
      tipEle.textContent = binding.value
      tipFit(e, $dom, binding.arg)
    }
    if ($dom.style.display === 'none' || $dom.style.visibility === 'hidden') {
      clearInterval(tipUpdateTiming)
      tipEle.remove()
    }
  }, 500)
}

let x, y
function tipFit(e, $dom, tipPlacement) {
  const winW = window.innerWidth
  const winH = window.innerHeight

  tipEle.style.display = 'block'
  tipEle.style.visibility = 'hidden'
  const tipW = tipEle.offsetWidth
  const tipH = tipEle.offsetHeight
  x = e.clientX + 10
  y = e.clientY + 14
  if (x + tipW > winW) {
    x -= tipW + 18
  }
  if (y + tipH > winH) {
    y -= tipH + 10
  }

  const domRect = $dom.getBoundingClientRect()
  console.log('domRect', domRect)
  if (tipPlacement === 'top') {
    tipToTop(domRect, winW, winH, tipH, tipW)
  }
  if (tipPlacement === 'bottom') {
    tipToBottom(domRect, winW, winH, tipH, tipW)
  }
  if (tipPlacement === 'left') {
    tipToLeft(domRect, winW, winH, tipH, tipW)
  }
  if (tipPlacement === 'right') {
    tipToRight(domRect, winW, winH, tipH, tipW)
  }
  tipEle.style.visibility = 'visible'
  tipEle.style.left = x + 'px'
  tipEle.style.top = y + 'px'
}
function tipToTop(domRect, winW, winH, tipH, tipW) {
  x = domRect.left + domRect.width / 2 - tipW / 2
  y = domRect.top - tipH - 4
  if (x < 0) {
    x = 0
  }
  if (x + tipW > winW) {
    x = winW - tipW
  }
  if (y < 0) {
    y = domRect.bottom + 4
  }
}
function tipToBottom(domRect, winW, winH, tipH, tipW) {
  x = domRect.left + domRect.width / 2 - tipW / 2
  y = domRect.bottom + 4
  if (x < 0) {
    x = 0
  }
  if (x + tipW > winW) {
    x = winW - tipW
  }
  if (y + tipH > winH) {
    y = domRect.top - tipH - 4
  }
}
function tipToLeft(domRect, winW, winH, tipH, tipW) {
  x = domRect.left - tipW - 4
  y = domRect.top + domRect.height / 2 - tipH / 2
  if (x < 0) {
    x = domRect.right + 4
  }
}
function tipToRight(domRect, winW, winH, tipH, tipW) {
  x = domRect.right + 4
  y = domRect.top + domRect.height / 2 - tipH / 2
  if (x + tipW > winW) {
    x = domRect.left - tipW - 4
  }
}
/**
 * 校验是否全屏
 */
function checkScreenFull() {
  let can
  if (document.mozFullScreen) {
    can = true
  }
  if (document.fullScreen) {
    can = true
  }
  if (document.webkitIsFullScreen) {
    can = true
  }
  if (document.webkitRequestFullScreen) {
    can = true
  }
  if (document.mozRequestFullScreen) {
    can = true
  }
  if (document.msFullscreenEnabled) {
    can = true
  }
  return can
}
Vue.directive('c-tip', {
  bind(el, binding) {
    binding.modifiers._show = function (e) {
      handleShowTips(e, el, binding)
    }

    binding.modifiers._remove = function (e) {
      handleRemoveTips()
    }

    el.addEventListener('mouseenter', binding.modifiers._show)
    el.addEventListener('mouseover', binding.modifiers._show)
    el.addEventListener('mouseleave', binding.modifiers._remove)
    el.addEventListener('mouseout', binding.modifiers._remove)
  },
  update(el, binding) {
    binding.modifiers._show &&
      typeof binding.modifiers._show === 'function' &&
      el.removeEventListener('mouseenter', binding.modifiers._show)
    binding.modifiers._show &&
      typeof binding.modifiers._show === 'function' &&
      el.removeEventListener('mouseover', binding.modifiers._show)
    binding.modifiers._remove &&
      typeof binding.modifiers._remove === 'function' &&
      el.removeEventListener('mouseleave', binding.modifiers._remove)
    binding.modifiers._remove &&
      typeof binding.modifiers._remove === 'function' &&
      el.removeEventListener('mouseout', binding.modifiers._remove)
    binding.modifiers._show = function (e) {
      handleShowTips(e, el, binding)
    }

    binding.modifiers._remove = function (e) {
      handleRemoveTips()
    }
    el.addEventListener('mouseenter', binding.modifiers._show)
    el.addEventListener('mouseover', binding.modifiers._show)
    el.addEventListener('mouseleave', binding.modifiers._remove)
    el.addEventListener('mouseout', binding.modifiers._remove)
  },
  componentUpdated() {
    handleRemoveTips()
  },
  unbind(el, binding) {
    handleRemoveTips()
    binding.modifiers._show &&
      typeof binding.modifiers._show === 'function' &&
      el.removeEventListener('mouseenter', binding.modifiers._show)
    binding.modifiers._show &&
      typeof binding.modifiers._show === 'function' &&
      el.removeEventListener('mouseover', binding.modifiers._show)
    binding.modifiers._remove &&
      typeof binding.modifiers._remove === 'function' &&
      el.removeEventListener('mouseleave', binding.modifiers._remove)
    binding.modifiers._remove &&
      typeof binding.modifiers._remove === 'function' &&
      el.removeEventListener('mouseout', binding.modifiers._remove)
  }
})
