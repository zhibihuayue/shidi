import $ from 'jquery'
/**
 * 提示
 */
let tipDelayTiming, tipUpdateTiming

export function setupCTips() {
  $('body').on('mouseenter mousemove mouseleave', '[c-tip]', function (e) {
    clearTimeout(tipDelayTiming)
    if (e.type === 'mouseenter' || e.type === 'mouseleave') {
      clearInterval(tipUpdateTiming)
      $('.c-tip').remove()
    }
    if (
      e.type === 'mouseenter' ||
      (e.type === 'mousemove' && !$('.c-tip').length)
    ) {
      tipDelayTiming = setTimeout(() => {
        tipShow(e, $(this))
      }, 500)
    }
  })
}
function tipShow(e, $dom) {
  let text = $dom.attr('c-tip')
  const offsetWidth = $dom[0].offsetWidth
  const clientWidth = $dom[0]?.getBoundingClientRect()?.width
  const scrollWidth = $dom[0].scrollWidth
  const noTextFlow = scrollWidth <= (clientWidth || offsetWidth)
  const auto = $dom.attr('c-tip-auto')
  if (!text || (auto !== undefined && noTextFlow)) {
    return false
  }
  let tipClass = 'c-tip'
  const customClass = $dom.attr('c-tip-class')
  if (customClass) {
    tipClass += ' ' + customClass
  }
  const str = `<i class="${tipClass}">${text}</i>`
  $('body').append(str)
  if (window.fullScreenId && checkScreenFull()) {
    $('#' + window.fullScreenId).append(str)
  }
  tipFit(e, $dom)
  tipUpdate(e, $dom, text)
}
function tipUpdate(e, $dom, text) {
  tipUpdateTiming = setInterval(() => {
    text = $dom.attr('c-tip')
    if ($('.c-tip:eq(0)').html() !== text) {
      $('.c-tip').html($dom.attr('c-tip'))
      tipFit(e, $dom)
    }
    if (!$dom.is(':visible')) {
      clearInterval(tipUpdateTiming)
      $('.c-tip').remove()
    }
  }, 500)
}

let x, y
function tipFit(e, $dom) {
  const $tip = $('.c-tip')
  const winW = $(window).width()
  const winH = $(window).height()
  const tipW = $tip.outerWidth()
  const tipH = $tip.outerHeight()
  x = e.clientX + 10
  y = e.clientY + 14
  if (x + tipW > winW) {
    x -= tipW + 18
  }
  if (y + tipH > winH) {
    y -= tipH + 10
  }
  $tip.css({
    display: 'block',
    left: x,
    top: y
  })
  const tipPlacement = $dom.attr('c-tip-placement')
  const domRect = $dom[0].getBoundingClientRect()
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
  $tip.css({
    display: 'block',
    left: x,
    top: y
  })
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
