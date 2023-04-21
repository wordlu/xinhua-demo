import store from '@store'

export function globalDictMap(key) {
  let dictData = store.state.user.dictData
  return dictData[key]
}

// 全局回显数据字典
export function globalDictLabel(dictType, value) {
  const actions = []
  const datas = globalDictMap(dictType)
  Object.keys(datas).some(key => {
    if (datas[key].code === '' + value) {
      actions.push(datas[key].name)
      return true
    }
  })
  return actions.join('')
}
export function detectZoom() {
  let ratio = 0
  let screen = window.screen
  let ua = navigator.userAgent.toLowerCase()
  if (window.devicePixelRatio !== undefined) {
    ratio = window.devicePixelRatio
  } else if (~ua.indexOf('msie')) {
    if (screen.deviceXDPI && screen.logicalXDPI) {
      ratio = screen.deviceXDPI / screen.logicalXDPI
    }
  } else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
    ratio = window.outerWidth / window.innerWidth
  }

  if (ratio) {
    ratio = Math.round(ratio * 100)
  }
  return ratio
}
