import ajax from '@utils/ajax'

let serverPre = ajax.serverAnalysis

// 单一日期 - 主体代码 - 模糊搜素
export function getOrgCd(params) {
  return ajax.post(serverPre('/stdValuation/singleDate/objNameList'), params)
}

// 单一日期 - 债券代码 - 模糊搜素
export function getBondCodeList(params) {
  return ajax.post(serverPre('/stdValuation/singleDate/bondCodeList'), params)
}

// 单一日期 - 债券简称 - 模糊搜素
export function getBondNameList(params) {
  return ajax.post(serverPre('/stdValuation/singleDate/bondNameList'), params)
}

// 标准估值 - 单一日期 - 图表数据
export function getSingleDateEcharts(params) {
  return ajax.post(serverPre('/stdValuation/singleDate/info'), params)
}

// 标准估值 - 单一日期 - 汇总列表数据
export function getSingleDateTotal(params) {
  return ajax.post(serverPre('/stdValuation/singleDate/SumList'), params)
}

// 标准估值 - 单一日期 - 折线列表数据
export function getSingleDateLine(params) {
  return ajax.post(serverPre('/stdValuation/singleDate/lineList'), params)
}

// 标准估值 - 单一日期 - 散点列表数据
export function getSingleDateScatter(params) {
  return ajax.post(serverPre('/stdValuation/singleDate/scatterList'), params)
}

// 估值走势 - 债券代码 - 模糊搜素
export function getBondCode(params) {
  return ajax.post(serverPre('/stdValuation/bndTrend/bondCodeList'), params)
}

// 标准估值 - 估值走势 - Echarts数据
export function getBndTrendEcharts(params) {
  return ajax.post(serverPre('/stdValuation/bndTrend/info'), params)
}

// 标准估值 - 估值走势 - 折线列表数据
export function getBndTrendLine(params) {
  return ajax.post(serverPre('/stdValuation/bndTrend/LineList'), params)
}

// 标准估值 - 估值走势 - 散点列表数据
export function getBndTrendScatter(params) {
  return ajax.post(serverPre('/stdValuation/bndTrend/ScatterList'), params)
}

// 单一主体标准估值-利率期限结构查询-汇总列表数据
export function getSumListTerm(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/sumListTerm'), params)
}

// 单一主体标准估值-利率期限结构查询-债券列表数据
export function getBndListTerm(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/bndListTerm'), params)
}

// 单一主体标准估值-获取曲线簇信息
export function getClusterInfo(params) {
  return ajax.get(serverPre('/stdValuation/singleOrg/getClusterInfo'), params, {
    'Content-Type': 'multipart/form-data'
  })
}

// 单一主体标准估值-利率期限结构查询(Echarts总数据)
export function getEchartsListTerm(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/termInfo'), params)
}

// 单一主体标准估值-利率期限结构查询-散点数据
export function getScatterListTerm(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/scatterListTerm'), params)
}

// 单一主体标准估值-利率期限结构查询-曲线数据
export function getCurveListTerm(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/curveModeListTerm'), params)
}

// 单一主体标准估值-利率期限结构查询-曲线参数数据
export function getCurveParamListTerm(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/curveParamListTerm'), params)
}

// 单一主体标准估值-利率期限结构查询-查询剩余期限
export function getSearchYieldTerm(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/searchYieldTerm'), params)
}

// 单一主体标准估值-利率走势分析-汇总列表
export function getTrendEcharts(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/trendView'), params)
}

// 单一主体标准估值-利率走势分析-折线数据列表
export function getTrendLine(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/trendLineList'), params)
}

// 单一主体标准估值-利率走势分析-散点数据列表
export function getTrendScatter(params) {
  return ajax.post(serverPre('/stdValuation/singleOrg/trendScatterList'), params)
}

// 获取当日向前推的默认日期
export function getBeginExchDate(params) {
  return ajax.get(serverPre(`/common/getBeginExchDate?num=${params}`))
}

// 单一债券标准估值-单一日期估值导出
export function exportSingleDay(params) {
  return ajax.fileBlob(serverPre(`/stdValuation/excelExport/singleDay`), params)
}

// 单一债券标准估值-单一日期估值-导出校验数据
export function exportSingleDayCheckData(params) {
  return ajax.fileBlob(serverPre(`/stdValuation/excelExport/singleDay/makeUpPoints`), params)
}

// 单一债券标准估值-估值走势导出
export function exportBndTrend(params) {
  return ajax.fileBlob(serverPre(`/stdValuation/excelExport/bndTrendExport`), params)
}

// 单一主体标准估值-利率期限结构导出
export function exportSingleOrgTerm(params) {
  return ajax.fileBlob(serverPre(`/stdValuation/excelExport/exportSingleOrgTerm`), params)
}

// 单一主体标准估值-利率期限结构-导出校验数据
export function exportSingleOrgTermCheck(params) {
  return ajax.fileBlob(
    serverPre(`/stdValuation/excelExport/exportSingleOrgTerm/makeUpPoints`),
    params
  )
}

// 单一主体标准估值-利率走势分析导出
export function exportTrendLineList(params) {
  return ajax.fileBlob(serverPre(`/stdValuation/excelExport/exportTrendLineList`), params)
}

// 单一债券标准估值 - 估值走势 -- 获取日期
export function getBeginDate(params) {
  return ajax.get(serverPre(`/stdValuation/bndTrend/getBeginDate`), params)
}
