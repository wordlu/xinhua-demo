import ajax from '@utils/ajax'

// let serverPre = ajax.serverLoc;
let serverPre = ajax.serverUrlMock

// 我的自定义曲线
export async function getCustomCurve(params) {
  return ajax.post(serverPre('/homePage/curveInfoList'), params)
}

// 我的快速评级列表查询
export async function getQuickRating(params) {
  return ajax.post(serverPre('/homePage/ratingList'), params)
}

// 今日快速评级列表查询
export async function getTodayQuickRating(params) {
  return ajax.post(serverPre('/homePage/ratingNow'), params)
}

// 触发快速评级提醒列表
export async function getRatingRemind(params) {
  return ajax.post(serverPre('/homePage/fastRatingList'), params)
}

// 查询-未分组债券列表
export async function getBondUngrouped(params) {
  return ajax.post(serverPre('/homePage/unGroupedBndList'), params)
}

// 查询-重复分组数据列表
export async function getBondRepeatgrouped(params) {
  return ajax.post(serverPre('/homePage/repeatingGroupsBnd'), params)
}

// 查询-标准曲线簇拟合问题列表
export async function getStandardCurve(params) {
  return ajax.post(serverPre('/homePage/fitProbList'), params)
}

// 查询-标准估值列表
export async function getStandardValuation(params) {
  return ajax.post(serverPre('/homePage/stdValuationList'), params)
}

// 查询主体名称
export async function getOrgNameList(params, pageNum, pageSize) {
  return ajax.get(
    serverPre(`/homePage/orgNameList?name=${params}&pageNum=${pageNum}&pageSize=${pageSize}`)
  )
}

// 债券简称
export async function getBndAbbrList(params) {
  return ajax.get(serverPre(`/homePage/bndAbbrList?name=${params}`))
}

// 债券代码
export async function getBndCodeList(params) {
  return ajax.get(serverPre(`/homePage/bndCodeList?name=${params}`))
}

// 债券初始化简称
export async function getBndNameList(val, pageNum, pageSize) {
  return ajax.get(
    serverPre(`/homePage/bndAbbrListPage?bndStr=${val}&pageNum=${pageNum}&pageSize=${pageSize}`)
  )
}

// 债券初始化代码
export async function getBndInitCodeList() {
  return ajax.get(serverPre(`/homePage/bndCodeListPage?count=100`))
}

// 曲线名称
export async function getCurveNameList() {
  return ajax.get(serverPre('/homePage/curveNameList'))
}

// 获取批次号下拉
export async function getRatingNowBatchNum() {
  return ajax.post(serverPre('/homePage/ratingNowBatchNum'))
}

// 删除曲线
export async function delCurveInfo(params) {
  return ajax.post(serverPre('/homePage/deleteCurveInfo'), params)
}

// 导出-我的快速评级列表数据导出
export async function exportQuickRating(params) {
  return ajax.fileBlob(serverPre('/homePage/expoRtratingData'), params)
}

// 导出-今日快速评级列表
export async function exportTodayQuickRating(params) {
  return ajax.fileBlob(serverPre('/homePage/exportRatingNow'), params)
}

// 导出-触发快速评级列表数据导出
export async function exportRatingRemind(params) {
  return ajax.fileBlob(serverPre('/homePage/exportFastRating'), params)
}

// 导出-未分组
export async function exportBondUngrouped(params) {
  return ajax.fileBlob(serverPre('/homePage/exportUnGroupedBnd'), params)
}

// 导出-重复分组
export async function exportBondRepeatgrouped(params) {
  return ajax.fileBlob(serverPre('/homePage/exporTrepeatingGroupsBnd'), params)
}

// 导出-标准曲线簇
export async function exportStandardCurve(params) {
  return ajax.fileBlob(serverPre('/homePage/exportFitProb'), params)
}

// 导出-标准估值
export async function exportStandardValuation(params) {
  return ajax.fileBlob(serverPre('/homePage/exportStdValuation'), params)
}

// 撤销-我的快速评级-批量
export async function resetQuickRatingBatch(params) {
  return ajax.post(serverPre('/homePage/revokeOperateBatch'), params)
}

// 撤销-我的快速评级-单项
export async function resetQuickRating(revokeId, roleName) {
  return ajax.get(serverPre(`/homePage/revokeOperate?revokeId=${revokeId}&roleName=${roleName}`))
}
