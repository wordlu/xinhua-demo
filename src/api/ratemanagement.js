import ajax from '@utils/ajax'

// let serverPre = ajax.serverLoc;
let serverPre = ajax.serverUrlMock
// 上传文件
export function getFileUpload(params) {
  return ajax.post(serverPre('/objLevelManage/orgNameImport'), params, {
    'Content-Type': 'multipart/form-data'
  })
}
// 评级管理导入
export function getFileRating(params) {
  return ajax.post(serverPre('/ratingManage/ratingImport'), params, {
    'Content-Type': 'multipart/form-data'
  })
}
// 上传文件后，弹出框匹配
export async function orgNameMatch(params) {
  return ajax.post(serverPre(`/objLevelManage/orgNameMatch`), params)
}
// 上传文件后，评级管理导入匹配
export async function ratingMatch(params) {
  return ajax.post(serverPre(`/ratingManage/ratingMatch`), params)
}
// 上传文件后，评级管理导入保存
export async function saveRating(params) {
  return ajax.post(serverPre(`/ratingManage/saveRatingInfo`), params)
}
// 上传文件后，债券名称匹配
export async function bndNameMatch(params) {
  return ajax.post(serverPre(`/bndRatingQuery/bndNameMatch`), params)
}
// 主体名称列表
export async function getOrgNameList() {
  return ajax.get(serverPre('/objLevelManage/orgNameList?count=100'))
}
// 主体名称列表-模糊搜索
export async function getorgNameSearchList(params) {
  return ajax.get(serverPre(`/objLevelManage/orgNameSearchList?name=${params}`))
}
// 债券简称列表-分页模糊搜索
export async function getBndNamePageList(params) {
  return ajax.post(serverPre(`/bndRatingQuery/bndNameListPage`), params)
}
// 主体名称列表-分页模糊搜索
export async function getOrgNamePageList(params) {
  return ajax.post(serverPre(`/objLevelManage/orgNameListPage`), params)
}
// 主体所属分析师
export async function getOrgAnalystList() {
  return ajax.get(serverPre('/objLevelManage/orgAnalystList'))
}
// 主体级别类型、状态、最新级别
export async function getOrgList(params) {
  return ajax.get(serverPre(`/objLevelManage/queryList?classCd=${params}`))
}
// 主体行业
export async function getIndustryList(params) {
  return ajax.get(serverPre(`/objLevelManage/industryList?treeId=${params}`))
}
// 主体级别状态列表查询列表
export async function getobjLevelStatusQuery(params) {
  return ajax.post(serverPre(`/objLevelManage/objLevelStatusQuery`), params)
}
// 主体级别状态列表导出
export async function objLevelStatusExcel(params) {
  return ajax.fileBlob(serverPre('/objLevelManage/objLevelStatusExportExcel'), params)
}
// 主体评级记录列表导出
export async function objLevelRecordExcel(params) {
  return ajax.fileBlob(serverPre('/objLevelManage/objLevelRecordExportExcel'), params)
}
// 导入查询主体模板下载
export async function orgNameTemplate() {
  return ajax.fileBlob(serverPre('/objLevelManage/orgNameTemplateDownload'))
}
// 评级管理模板下载
export async function ratingTemplate() {
  return ajax.getFileBlob(serverPre('/ratingManage/ratingTemplateDownload'))
}
// 导入查询债券模板下载
export async function bndNameTemplate() {
  return ajax.getFileBlob(serverPre('/bndRatingQuery/bndNameTemplateDownload'))
}
// 评级历史查询
export async function getratingHistoryQuery(params) {
  return ajax.post(serverPre(`/objLevelManage/ratingHistory`), params)
}
// 通过主体名称获取机构评级
export async function getNewesRatingLevel(params) {
  return ajax.get(serverPre(`/objLevelManage/getNewestRatingLevel?orgCd=${params}`))
}
// 新增快速评级
export async function addFastRating(params) {
  return ajax.post(serverPre(`/objLevelManage/addFastRating`), params)
}
// 主体评级记录查询
export async function getobjLevelRecordQuery(params) {
  return ajax.post(serverPre(`/objLevelManage/objLevelRecordQuery`), params)
}
// 撤销快速评级
export async function revokeFastRating(revokeId, roleName) {
  return ajax.get(
    serverPre(`/objLevelManage/revokeFastRating?revokeId=${revokeId}&roleName=${roleName}`)
  )
}
// 评级管理查询列表
export async function getratingManageQuery(params) {
  return ajax.post(serverPre(`/ratingManage/ratingManageQuery`), params)
}
// 评级管理撤销上次导入
export async function revokeLastImport() {
  return ajax.get(serverPre(`/ratingManage/revokeLastImport`))
}
// 评级管理导出
export async function ratingManageExcel(params) {
  return ajax.fileBlob(serverPre('/ratingManage/ratingManageExportExcel'), params)
}
// 债项评级查询
export async function getbndRatingQuery(params) {
  return ajax.post(serverPre(`/bndRatingQuery/bndRatingQuery`), params)
}
// 债券名称列表查询
export async function getBndNameList() {
  return ajax.get(serverPre('/bndRatingQuery/bndNameList?count=100'))
}
// 债券名称远程查询
export async function getBndNameSearchList(params) {
  return ajax.get(serverPre(`/bndRatingQuery/bndNameSearchList?name=${params}`))
}
// 债项评级查询评级历史
export async function getbndRatingHistoryQuery(params) {
  return ajax.post(serverPre(`/bndRatingQuery/bndRatingHistoryQuery`), params)
}
// 债项评级债券导入
export function getFileBndName(params) {
  return ajax.post(serverPre('/bndRatingQuery/bndNameImport'), params, {
    'Content-Type': 'multipart/form-data'
  })
}
// 债项评级债券导出
export async function bndRatingExcel(params) {
  return ajax.fileBlob(serverPre('/bndRatingQuery/bndRatingExportExcel'), params)
}

// 债券代码初始化数据
export async function getBndCodeData() {
  return ajax.get(serverPre(`/bndRatingQuery/bndCodeList?&count=100`))
}
// 债券代码远程搜索数据
export async function getBndCodeSearchList(params) {
  return ajax.get(serverPre(`/bndRatingQuery/bndCodeSearchList?code=${params}`))
}

// 根据主体代码获取主体名称
export async function getOrgNameByOrgCode(params) {
  return ajax.post(serverPre(`/objLevelManage/getOrgNameByOrgCode`), params)
}

// 根据债券代码获取债项名称
export async function getBndNameByBndCode(params) {
  return ajax.post(serverPre(`/bndRatingQuery/getBndNameByBndCode`), params)
}

// 参数管理--主体导入
export function postObjImport(params) {
  return ajax.post(serverPre('/v1/paramManage/objImport'), params, {
    'Content-Type': 'multipart/form-data'
  })
}
// 债项导入
export function postBondImport(params) {
  return ajax.post(serverPre('/v1/paramManage/bondImport'), params, {
    'Content-Type': 'multipart/form-data'
  })
}

// 参数管理--主体匹配
export async function postObjListMatch(params) {
  return ajax.post(serverPre(`/v1/paramManage/objListMatch`), params)
}
// 债券匹配
export async function postBondListMatch(params) {
  return ajax.post(serverPre(`/v1/paramManage/bondListMatch`), params)
  // 导入弹窗，只匹配失败 取消勾选后返回所有数据 - 债券
}

export async function getMatchQueryBnd(params) {
  return ajax.post(serverPre(`/bndRatingQuery/getImportBndName`), params)
}

// 导入弹窗，只匹配失败 取消勾选后返回所有数据 - 主体名称
export async function getMatchQueryOrg(params) {
  return ajax.post(serverPre(`/objLevelManage/getImportOrgName`), params)
}

// 导入弹窗，只匹配失败 取消勾选后返回所有数据 - 新增快速评级
export async function getMatchQueryFast(params) {
  return ajax.post(serverPre(`/ratingManage/getImportRating`), params)
}

// 导入弹窗，确认按钮 - 债券
export async function getSuccesshQueryBnd(params) {
  return ajax.get(serverPre(`/bndRatingQuery/bndNameConfirm`), params)
}

// 导入弹窗，确认按钮 - 主体名称
export async function getSuccesshQueryOrg(params) {
  return ajax.get(serverPre(`/objLevelManage/orgNameConfirm`), params)
}

// 提示信息
export async function getParameAssessDay () {
  return ajax.get(serverPre('/ratingManage/getParameAssessDay'))
}

