import axios from 'axios'
import { getStorage, setStorage, removeStorage } from './storage'
import { Message } from 'element-ui'
import store from '@store'
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest'
}
let num = 0
axios.defaults.timeout = 1000 * 60 * 10
function requestHandle(params) {
  const { url, headers } = params
  if (url.includes('oauth2/oauth/token')) {
    removeStorage('expiration_time')
    delete headers.Authorization
  }
  // 验证过期时间
  const parseTime = getStorage('expiration_time')
  if (parseTime && parseTime !== '') {
    const currentTime = new Date().getTime()
    const millisecond = Math.floor((currentTime - parseTime) / 1000)
    const minute = Math.floor(millisecond / 60)
    if (minute > 230) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key.indexOf('_token') > -1) {
          localStorage.removeItem(key)
        }
      }
      localStorage.removeItem('expiration_time')
      const data = window.location.href.includes('cpad')
      if (data) {
        // 域名
        window.location.href = 'http://10.3.2.57:8090/sso/ssoLogin?serviceId=http://cpad/login'
      } else {
        window.location.href = 'http://10.3.2.57:8090/sso/ssoLogin?serviceId=http://10.3.2.98/login'
      }
    } else {
      // 每次请求接口更新过期时间
      setStorage('expiration_time', new Date().getTime())
    }
  }
  if (!headers.Authorization) {
    if (
      !(
        url.includes('oauth2/oauth/token') ||
        url.includes('user/getKickFlag') ||
        url.includes('user/checkAccountFlag') ||
        url.includes('export') ||
        url.includes('excel')
      )
    ) {
      if (num < 1) {
        store.dispatch('logOut', false)
        num++
      }
    }
  }
  return new Promise((resolve, reject) => {
    axios(params)
      .then(res => {
        const { status } = res
        if (res && status === 200) {
          const { status, code, msg, message, data } = res.data
          // 登录
          if (status === undefined || status === null) {
            if (code === '1') {
              // 密码错误的处理
              resolve({
                data: res.data || null,
                message: msg
              })
            } else {
              // 登录正确的处理
              resolve({
                data: res.data || null,
                message: message || '',
                status: status
              })
            }
          } else if (status === 200 || status === 201) {
            // 请求成功时候的处理
            resolve({
              data: data || null,
              message: message,
              status: status
            })
          } else {
            // 系统管理和平时错误的处理
            resolve({
              data: data || null,
              message: message || msg,
              status: status
            })
            Message.error(message || msg)
          }
        } else {
          reject(new Error('没有返回数据'))
        }
      })
      .catch(err => {
        // token失效的处理
        const { response } = err
        if (
          response.data.code === 401 &&
          response.data.message === 'Token过期或不合法,请重新登录'
        ) {
          store.dispatch('logOut', false)
        } else if (response.status === 405) {
          Message.error(response.data.message || '请求失败，请稍后重试！')
          resolve({
            error: {
              code: 500,
              message: `${params.url}: ${err.message}`
            }
          })
        } else if (response.status === 404) {
          if (params.url.includes('ruleConfig/calButton')) {
            Message.error('当前计算时间过长,请稍后查询计算结果！')
          }
          resolve({
            error: {
              code: 404,
              message: `${params.url}: ${err.message}`
            }
          })
        } else {
          Message.error('请求失败，请稍后重试！')
          resolve({
            error: {
              code: 500,
              message: `${params.url}: ${err.message}`
            }
          })
        }
      })
  })
}

function actionDownload(href, filename) {
  const aLink = document.createElement('a')
  aLink.href = href
  aLink.style.display = 'none'
  if (filename) {
    aLink.setAttribute('download', filename)
  } else {
    aLink.download = ''
  }

  let event
  if (window.MouseEvent) {
    event = new MouseEvent('click')
  } else {
    event = document.createEvent('MouseEvent')
    event.initMouseEvent(
      'click',
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    )
  }
  aLink.dispatchEvent(event)
  URL.revokeObjectURL(aLink.href)
}

function queryString(url, query) {
  const str = []
  for (const key in query) {
    if (query[key]) {
      str.push(key + '=' + query[key])
    }
  }
  const paramStr = str.join('&')
  return paramStr ? `${url}${url.indexOf('?') > -1 ? '&' : '?'}${paramStr}` : url
}

function getHeaders(options) {
  const headers = Object.assign(
    {
      'Content-Type': 'application/json'
    },
    options
  )
  let token = null
  if (store.state.user.loginName) {
    token = getStorage(`${store.state.user.loginName}auth_token`)
  } else if (getStorage('auth_token')) {
    token = getStorage('auth_token')
  } else {
    let num = window.localStorage.length
    for (let i = 0; i < num; i++) {
      if (window.localStorage.key(i).includes('auth_token')) {
        token = getStorage(window.localStorage.key(i))
        break
      }
    }
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  headers.gateway_request_mark = true
  return headers
}

function directDownload(url, param) {
  const defaultParam = {}

  // 添加token权限验证
  const token = getStorage(`${store.state.user.loginName}auth_token`) || getStorage('auth_token')
  if (token) {
    defaultParam.token = token
  }

  Object.assign(defaultParam, param)

  actionDownload(encodeURI(queryString(url, defaultParam)))
}

function loadConfig(url, params, op, type) {
  let config = {
    method: 'get',
    // 添加token
    url: queryString(url, params),
    headers: getHeaders(op)
  }
  if (type === 'post') {
    config = {
      method: 'post',
      url: url,
      data: params,
      headers: getHeaders(op)
    }
  }
  return config
}

function resDownload(url, params, op, filename, type = 'get') {
  return new Promise((resolve, reject) => {
    axios({
      ...loadConfig(url, params, op, type),
      responseType: 'blob',
      headers: getHeaders(op)
    }).then(res => {
      if (res.data) {
        let data = res.data
        let r = new FileReader()
        r.readAsText(data, 'utf-8')
        r.onload = function() {
          try {
            let jsonData = JSON.parse(this.result)
            resolve({
              error: {
                code: jsonData.status,
                message: jsonData.message
              }
            })
          } catch (error) {
            if (filename === 'auto') {
              if (res.headers.filename) {
                filename = decodeURIComponent(res.headers.filename)
                actionDownload(window.URL.createObjectURL(new Blob([res.data])), filename)
                resolve({})
              }
            }
          }
        }
      } else {
        resolve({
          error: {
            code: 500,
            message: '文件下载失败'
          }
        })
      }
    })
  })
}

function downloadFileStream(stream, fileName) {
  const blob = new Blob([stream])
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
  } else {
    // IE10+下载
    navigator.msSaveBlob(blob, fileName)
  }
}

/**
 * 请求文件流--POST请求多层对象传参时使用
 * @param {String} url 待下载文件的URL
 * @param {Object} params 请求参数
 */
function saveFileBlob(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: url,
      responseType: 'blob',
      data: params,
      headers: getHeaders()
    })
      .then(res => {
        if (res.data.type === 'application/json') {
          const reader = new FileReader()
          reader.readAsText(res.data, 'utf-8')
          resolve(res)
        } else {
          let fileName
          if (res.headers['content-disposition']) {
            fileName = res.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
            fileName = decodeURIComponent(fileName)
          }
          downloadFileStream(res.data, fileName)
          res.fileName = fileName
          resolve(res)
        }
      })
      .catch(err => {
        // 后端提出方案，如果导出有问题，后端直接抛出错误
        Message.error('请求失败，请稍后重试！')
        reject(err)
      })
  })
}

/**
 * 请求文件流--GET请求多层对象传参时使用
 * @param {String} url 待下载文件的URL
 * @param {Object} params 请求参数
 */
function getFileBlob(url, params) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: url,
      responseType: 'blob',
      params: params,
      headers: getHeaders()
    })
      .then(res => {
        if (res.data.type === 'application/json') {
          const reader = new FileReader()
          reader.readAsText(res.data, 'utf-8')
        } else {
          let fileName
          if (res.headers['content-disposition']) {
            fileName = res.headers['content-disposition'].split('filename=')[1].replace(/"/g, '')
            fileName = decodeURIComponent(fileName)
          }
          downloadFileStream(res.data, fileName)
          res.fileName = fileName
          resolve(res)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}
const api = '/yapi/api/'
const apiOne = '/yapi/manager'
export default {
  post: function(url, params, op) {
    return requestHandle(loadConfig(url, params, op, 'post'))
  },
  get: function(url, params, op) {
    return requestHandle(loadConfig(url, params, op, 'get'))
  },
  download: function(url, params, filename, type, op) {
    if (filename) {
      return resDownload(url, params, op, filename, type)
    } else {
      directDownload(url, params)
    }
  },
  fileBlob: function(url, params) {
    return saveFileBlob(url, params)
  },
  getFileBlob: function(url, params) {
    return getFileBlob(url, params)
  },
  serverUrl(apiName) {
    return `${api}dateCurve${apiName}`
  },
  serverUrlMock(apiName) {
    return `${api}baseCurve${apiName}`
  },
  serverOauth(apiName) {
    return `${api}oauth2${apiName}`
  },
  serverManager(apiName) {
    return `${api}manager${apiName}`
  },
  serverAnalysis(apiName) {
    return `${api}analysisValuat${apiName}`
  },
  serverDispatchJob(apiName) {
    return `${api}dispatchJob${apiName}`
  },
  serverLoc(apiName) {
    return `/loc${apiName}`
  },
  serverMock(apiName) {
    return apiName
  },
  serverManagerNoToken(apiName) {
    return `${apiOne}${apiName}`
  },
  queryString
}
