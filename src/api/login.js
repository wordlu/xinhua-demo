import ajax from '@utils/ajax'

const serverPro = ajax.serverManager
const serverPra = ajax.serverOauth
const serverPre = ajax.serverManagerNoToken
// 登录页面
export async function loginAPI(params) {
  return ajax.get(serverPra(`/oauth/token`), params)
}
// 获取当前用户权限
export async function getInfoAPI(params) {
  return ajax.get(serverPro(`/user/getUserMenuObject`), params)
}
// 给当前用户登录添加登录日志
export async function getLoginLogAPI(params) {
  return ajax.get(serverPro(`/log/login`), params)
}
// 给当前用户登录添加退出日志
export async function getLogoutLogAPI(params) {
  return ajax.get(serverPro(`/log/logout`), params)
}
// 根据token获取当前用户信息
export async function getUserInfoAPI(params) {
  return ajax.get(serverPro(`/user/info`), params)
}
// 获取token失效的原因
export async function getKickFlagAPI(params) {
  return ajax.get(serverPre(`/user/getKickFlag`), params)
}
// 获取登录错误原因
export async function checkAccountFlagAPI(params) {
  return ajax.get(serverPre(`/user/checkAccountFlag`), params)
}
