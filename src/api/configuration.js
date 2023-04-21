import ajax from '@utils/ajax'

let serverPre = ajax.serverUrlMock

// 标准曲线簇查询下拉
export async function getQueryList(params) {
  return ajax.post(serverPre('/clusterRule/queryList'), params)
}

export async function queryStaList(params) {
  return ajax.post(serverPre('/clusterRule/queryStaList'), params)
}

// 标准曲线簇列表
export async function getQueryData(params) {
  return ajax.post(serverPre('/clusterRule/query'), params)
}

// 导出标准曲线簇列表
export async function getOutExcel(params) {
  return ajax.fileBlob(serverPre('/clusterRule/outExcel'), params)
}

// 获取曲线簇/曲线/曲线方案任意详情详情
export async function getCurveInfoAPI(params) {
  return ajax.get(serverPre('/clusterRule/curveInfo'), params)
}

// 下载主体名称磨板接口
export async function downloadTemplateAPI(params) {
  return ajax.fileBlob(serverPre('/objLevelManage/orgNameTemplateDownload'), params)
}

// 导入主体列表
export async function orgNameImportAPI(params) {
  return ajax.post(serverPre(`/objLevelManage/orgNameImport`), params)
}

// 主体名称匹配
export async function orgNameMatchAPI(params) {
  return ajax.post(serverPre(`/objLevelManage/orgNameMatch`), params)
}

// 保存曲线簇方案/曲线/曲线
export async function savePlanAPI(params) {
  return ajax.post(serverPre(`/clusterRule/savePlan`), params)
}

// 标准曲线簇删除
export async function deletePlanAPI(params) {
  return ajax.post(serverPre(`/clusterRule/deletePlan`), params)
}
// 曲线校验按钮
export async function getCheckPlan(params) {
  return ajax.get(serverPre(`/clusterRule/checkPlan`), params)
}

// 灵活配置曲线簇接口
export async function postsavePlanAPI(params) {
  return ajax.post(serverPre('/clusterRule/saveClusterPlan'), params)
}

// 获取曲线簇方案名称
export async function getNameListAPI(params) {
  return ajax.get(serverPre('/clusterRule/getNameList'), params)
}
