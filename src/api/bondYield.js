import ajax from '@utils/ajax'

let serverPre = ajax.serverUrl
// let serverLoc = ajax.serverLoc;
// 债券简称列表
export async function getBondShortList(params) {
  return ajax.post(serverPre(`/bndTradeInfo/bndAttrList`), params)
}
// 债券代码列表
export async function getBondCode(params) {
  return ajax.post(serverPre(`/bndTradeInfo/bndCodeList`), params)
}
// 债券级别列表
export async function getBondGrade(params) {
  return ajax.get(serverPre(`/bndTradeInfo/bndGradeList?bizDate=${params}`, params))
}
// 债券列表导入
export async function bondImport(params) {
  return ajax.post(serverPre('/bndTradeInfo/bndImport'), params, {
    'Content-Type': 'multipart/form-data'
  })
}
// 债券列表匹配
export async function bondMatch(params) {
  return ajax.post(serverPre('/bondMatch'), params)
}
// 债券筛选
export async function bondFilter(params) {
  return ajax.post(serverPre('/bondTradeInfo/bondQuery'), params)
}
// 债券模板
export async function bondTemplate(params) {
  return ajax.getFileBlob(serverPre('/bndTradeInfo/bndTemplate'))
}
// 所属曲线
export async function getCurveNameList(params) {
  return ajax.get(serverPre(`/bndTradeInfo/curveNameList?bizDate=${params}`))
}

export async function getQueryList(params) {
  return ajax.post(serverPre('/bondTradeInfo/query'), params)
}
// 股东背景
export async function getShareholderBgList(params) {
  return ajax.get(serverPre(`/bondTradeInfo/shareholderBgList?bizDate=${params}`), params)
}
// 所属分析师列表
export async function getSubjAnalystList(params) {
  return ajax.get(serverPre(`/bondTradeInfo/subjAnalystList?bizDate=${params}`), params)
}
// 所在地域列表
export async function getSubjDomicileAreaList(params) {
  return ajax.get(serverPre(`/bondTradeInfo/subjDomicileAreaList?bizDate=${params}`), params)
}
// 主体列表导入
export async function subjImport(params) {
  return ajax.post(serverPre('/bndTradeInfo/orgImport'), params)
}
// 主体名称
export async function getSubjNameList(params) {
  return ajax.post(serverPre(`/bndTradeInfo/orgNameList`), params)
}
// 主体级别
export async function getSubjNewestGradeList(params) {
  return ajax.get(serverPre(`/bondTradeInfo/subjNewestGradeList?bizDate=${params}`), params)
}
// 主体筛选
export async function mainFilter(params) {
  return ajax.post(serverPre('/bondTradeInfo/subjQuery'), params)
}
// 主体模板下载
export async function mainTemplate(params) {
  return ajax.download(serverPre('/bndTradeInfo/orgTemplate'), params)
}
// 城投区域
export async function getUrbanInvestAreaLis(params) {
  return ajax.get(serverPre(`/bondTradeInfo/subjUrbanInvestAreaList?bizDate=${params}`), params)
}
// 城投级别
export async function getUrbanInvestGradeList(params) {
  return ajax.get(serverPre(`/bondTradeInfo/subjUrbanInvestGradeList?bizDate=${params}`), params)
}

// 债券交易信息查询
export async function getBondQuery(params) {
  return ajax.post(serverPre('/bndTradeInfo/query'), params)
}
// 债券交易信息查询
export async function bondExport(params) {
  return ajax.fileBlob(serverPre('/bndTradeInfo/excel'), params)
}
// 债券选择列表
export async function getBondList(params) {
  return ajax.post(serverPre('/bndTradeInfo/bndQuery'), params)
}
// 主体选择列表
export async function getMainList(params) {
  return ajax.post(serverPre('/bndTradeInfo/orgQuery'), params)
}
// 主体行业
export async function getIndustryList(params) {
  return ajax.get(serverPre(`/bndTradeInfo/industryList?indCd=${params}`))
}
// 主体分析师
export async function getOrgAnalystList(params) {
  return ajax.get(serverPre(`/bndTradeInfo/orgAnalystList`))
}

// 主体分析三级
export async function getOrgMuniRregionlist(params) {
  return ajax.get(serverPre(`/bndTradeInfo/orgMuniRregionlist`))
}

// 主体分析二级
export async function getOrgRregionList(params) {
  return ajax.get(serverPre(`/bndTradeInfo/orgRregionList`))
}

