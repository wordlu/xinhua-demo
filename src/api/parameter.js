import ajax from '@utils/ajax'

let serverPre = ajax.serverUrlMock

// 参数列表
export async function getParamInfoList(params) {
  return ajax.post(serverPre('/v1/paramManage/paramInfoList'), params)
}
// 保存
export async function postSaveParamInfo(params) {
  return ajax.post(serverPre('/v1/paramManage/saveParamInfo'), params)
}
// 编辑
export async function postEditParam(params) {
  return ajax.post(serverPre('/v1/paramManage/editParam'), params)
}
// 启用禁用
export async function postUpdateState({ paramCd, data }) {
  return ajax.post(serverPre(`/v1/paramManage/updateState?paramCd=${paramCd}`), data)
}
// 导出
export async function getExportExcel() {
  return ajax.fileBlob(serverPre(`/v1/paramManage/exportExcel?dataTp=3`))
}

// 单个到期
export async function getUpdateExpireTime(params) {
  return ajax.get(serverPre(`/v1/paramManage/updateExpireTime?id=${params}`))
}

// 批量到期
export async function getUpdateBatchExpireTime(params) {
  return ajax.post(serverPre('/v1/paramManage/updateBatchExpireTime'), params)
}

// 异常主体模板下载
export async function getObjTemplateDownload() {
  return ajax.getFileBlob(serverPre('/v1/paramManage/ObjTemplateDownload'))
}

// 异常主体确认
export async function postObjConfirm(params) {
  return ajax.post(serverPre('/v1/paramManage/objConfirm'), params)
}

// 债券确认
export async function postBondConfirm(params) {
  return ajax.post(serverPre('/v1/paramManage/bondConfirm'), params)
}

// 债券模板下载
export async function getBondTemplateDownload() {
  return ajax.getFileBlob(serverPre('/v1/paramManage/bondTemplateDownload'))
}

// 曲线簇下拉数据
export async function getClusterName() {
  return ajax.get(serverPre('/v1/paramManage/clusterName'))
}

// 导入主体 - 取消只看失败 - 回显数据
export async function getOrgMatchData() {
  return ajax.get(serverPre('/v1/paramManage/objHistoryList'))
}

// 导入债券 - 取消只看失败 - 回显数据
export async function getBondMatchData() {
  return ajax.get(serverPre('/v1/paramManage/bondHistoryList'))
}

// 规则名称校验
export async function checkRuleName(name) {
  return ajax.get(serverPre(`/v1/paramManage/checkRuleName?name=${name}`))
}

// 参数名称
export async function getParamsName(dataTp) {
  return ajax.get(serverPre(`/v1/paramManage/curveRuleParamList?dataTp=${dataTp}`))
}
