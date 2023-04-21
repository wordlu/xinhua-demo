import ajax from '@utils/ajax';
// let serverPre = ajax.serverUrl;
let serverPre = ajax.serverMock;
const serverName = '/ms-base-server/';
const editPwdServerName = '/auth-management/user/';

export async function handleLogin(data) {
  return ajax.post(serverPre(`${serverName}jwt/token`), data);
}

export async function fetchPermissions() {
  return ajax.post(serverPre(`${serverName}base/resource/list`));
}

export async function logout() {
  return ajax.post(serverPre(`${serverName}jwt/logout`));
}

export async function editPassword(data) {
  return ajax.post(serverPre(`${editPwdServerName}password/updatePwd`), data);
}

// 获取用户密码规则
export async function queryPassRules(params) {
  return ajax.get(serverPre(`${editPwdServerName}pass-rules/query`), params);
}
// 保存密码规则
export async function savePassRules(params) {
  return ajax.post(serverPre(`${editPwdServerName}pass-rules/save`), params);
}

export async function testServer (params) {
  return ajax.get(serverPre(`/api/bondTradeInfo/bondAttrList`), params);
}