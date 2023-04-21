import ajax from '@utils/ajax'

let serverPre = ajax.serverUrlMock

// 估值债券查询下拉
export async function getvaluatQueryList(params) {
  return ajax.get(serverPre('/valuationBondCheck/queryList'), params)
}

// 估值债券列表
export async function getvaluatQueryData(params) {
  return ajax.post(serverPre('/valuationBondCheck/query'), params)
}

// 估值债券列表 导出
export async function getvaluatOutExcel(params) {
  return ajax.fileBlob(serverPre('/valuationBondCheck/outExcel'), params)
}

// 曲线分组查询（信，投）字典项
export async function getgroupQueryList(params) {
  return ajax.get(serverPre('/group/queryList'), params)
}

// 曲线分组查询（信，投）列表
export async function getgroupQuery(params) {
  return ajax.post(serverPre('/group/query'), params)
}

// 曲线分组查询（信，投）导出
export async function getgroupOutExcel(params) {
  return ajax.fileBlob(serverPre('/group/outExcel'), params)
}

//  标准曲线分组变更记录查询（信、投） 字典项
export async function getgroupChangeQueryList(params) {
  return ajax.get(serverPre('/groupChange/queryList'), params)
}

//  标准曲线分组变更记录查询（信、投） 列表
export async function getgroupChangeQuery(params) {
  return ajax.post(serverPre('/groupChange/query'), params)
}

//  标准曲线分组变更记录查询（信、投） 导出
export async function getgroupChangeOutExcel(params) {
  return ajax.fileBlob(serverPre('/groupChange/outExcel'), params)
}
//  标准曲线分组变更记录查询（字典项）
export async function getChangeCurveList(params) {
  return ajax.get(serverPre('/groupChange/getChangeCurveList'), params)
}
