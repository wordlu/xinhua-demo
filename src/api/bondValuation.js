import ajax from '@utils/ajax';

let serverPre = ajax.serverUrl;
// let serverMock = ajax.serverLoc;
// let serverLoc = ajax.serverLoc;

// 债券估值列表
export async function postbndValuatInfoList (params) {
  return ajax.post(serverPre('/bndValuatInfo/queryConvertColumn'), params);
}

// 债券估值横向导出
export async function bndExcel (params) {
  return ajax.fileBlob(serverPre('/bndValuatInfo/bndExcel'), params);
}

// 债券估值竖向导出
export async function bndExcelVertical (params) {
  return ajax.fileBlob(serverPre('/bndValuatInfo/bndExcelVertical'), params);
}

// 虚拟债券估值列表
export async function postficBndQueryList (params) {
  return ajax.post(serverPre('/bndValuatInfo/ficBndQueryConvertColumn'), params);
}

// 虚拟债券估值-横向导出
export async function ficBndExcel (params) {
  return ajax.fileBlob(serverPre('/bndValuatInfo/ficBndExcel'), params);
}

// 虚拟债券估值-纵向导出
export async function ficBndExcelVertical (params) {
  return ajax.fileBlob(serverPre('/bndValuatInfo/ficBndExcelVertical'), params);
}

// 日期列的映射
export async function postbndDateColumnList (params) {
  return ajax.post(serverPre('/bndValuatInfo/dateColumnListConvertColumn'), params);
}


// 无风险利率查询(曲线数据查询)
export async function postcurveDataQuery (params) {
  return ajax.post(serverPre('/risklessInterRate/curveDataQueryConvertColumn'), params);
}

// 无风险利率图表数据查询(曲线数据查询)
export async function postcurveChartDataQuery (params) {
  return ajax.post(serverPre('/risklessInterRate/curveTrendQuery'), params);
}


// 无风险利率查询(曲线走势对比查询)
export async function postcurveTrendQuery (params) {
  return ajax.post(serverPre('/risklessInterRate/curveTrendQueryConvertColumn'), params);
}

// 利率期限结构查询
export async function postInterRatePeriodQuery (params) {
  return ajax.post(serverPre('/risklessInterRate/interRatePeriodQuery'), params);
}

// 利率走势分析-曲线走势对比-横向导出
export async function curveTrendExcel (params) {
  return ajax.fileBlob(serverPre('/risklessInterRate/curveTrendExcel'), params);
}

// 利率走势分析-曲线走势对比-竖向导出
export async function curveTrendExcelVertical (params) {
  return ajax.fileBlob(serverPre('/risklessInterRate/curveTrendExcelVertical'), params);
}

// 利率走势分析-曲线数据查询-横向导出
export async function curveDataExcel (params) {
  return ajax.fileBlob(serverPre('/risklessInterRate/curveDataExcel'), params);
}

// 利率走势分析-曲线数据查询-竖向导出
export async function curveDataExcelVertical (params) {
  return ajax.fileBlob(serverPre('/risklessInterRate/curveDataExcelVertical'), params);
}

// 利率期限查询-利率期限结构导出
export async function interRatePeriodExcel (params) {
  return ajax.fileBlob(serverPre('/risklessInterRate/interRatePeriodExcel'), params);
}

// 利率期限查询结构日期列的映射
export async function postDateColumnList (params) {
  return ajax.post(serverPre('/risklessInterRate/dateColumnList'), params);
}
