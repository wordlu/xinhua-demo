import ajax from '@utils/ajax'

let serverPre = ajax.serverUrl

// 曲线利率期限结构 - 形态表
export async function perModtQuery(params) {
  return ajax.post(serverPre('/api/interRatePeriodStruc/modtQuery'), params)
}

// 曲线利率期限结构 - 散点图数据
export async function perScatterQuery(params) {
  return ajax.post(serverPre('/api/interRatePeriodStruc/scatterQuery'), params)
}

// 曲线利率期限结构 - 点线图数据
export async function curveStrucPointLineQuery(params) {
  return ajax.post(serverPre('/api/interRatePeriodStruc/curveStrucPointLineQuery'), params)
}

// 曲线利率走势分析- 点线图数据
export async function pointLineAnalQuery(params) {
  return ajax.post(serverPre('/api/interRateTrendAnal/pointLineAnalQuery'), params)
}

// 债券偏离度分析 - 曲线汇总
export async function sumQuery(params) {
  return ajax.post(serverPre('/api/interRateTrendAnal/sumQuery'), params)
}

// 债券偏离度分析-曲线形态图数据
export async function modtQuery(params) {
  return ajax.post(serverPre('/api/interRateTrendAnal/modtQuery'), params)
}

// 债券偏离度分析-曲线图参数
export async function paramQuery(params) {
  return ajax.post(serverPre('/api/interRatePeriodStruc/paramQuery'), params)
}

// 债券偏离度分析-echarts
export async function trePointLineDevQuery(params) {
  return ajax.post(serverPre('/api/interRateTrendAnal/pointLineDevQuery'), params)
}

// 债券偏离度分析-散点表
export async function treScatterQuery(params) {
  return ajax.post(serverPre('/api/interRateTrendAnal/bndScatterQuery'), params)
}
// 单曲线偏离度分析-散点表
export async function curveScatterQuery(params) {
  return ajax.post(serverPre('/api/interRateTrendAnal/curveScatterQuery'), params)
}

// 单曲线导出数据
export async function treCruveDeviExcel(params) {
  return ajax.fileBlob(serverPre('/api/interRateTrendAnal/cruveDeviExcel'), params)
}

// 债券偏离度分析-导出
export async function treBndDeviExcel(params) {
  return ajax.fileBlob(serverPre('/api/interRateTrendAnal/bndDeviExcel'), params)
}

// 曲线利率走势分析-导出
export async function treCruveAnalExcel(params) {
  return ajax.fileBlob(serverPre('/api/interRateTrendAnal/cruveAnalExcel'), params)
}

// 期限结构-导出
export async function perCruveStrucExcel(params) {
  return ajax.fileBlob(serverPre('/api/interRatePeriodStruc/cruveStrucExcel'), params)
}

// 标准曲线-导出
export async function stdCruveExcel(params) {
  return ajax.fileBlob(serverPre('/api/interRatePeriodStruc/stdCruveExcel'), params)
}

// 人工校验数据-导出
export async function manuVeriDataExcel(params) {
  return ajax.fileBlob(serverPre('/api/interRatePeriodStruc/manuVeriDataExcel'), params)
}

// 自定义曲线-导出
export async function customCruveExcel(params) {
  return ajax.fileBlob(serverPre('/api/interRatePeriodStruc/customCruveExcel'), params)
}

// 重新计算
export async function perCurveCalc(params) {
  return ajax.post(serverPre('/api/interRatePeriodStruc/curveCalc'), params)
}
// 重新计算-保存
export async function saveCalc(params) {
  return ajax.post(serverPre('/api/interRatePeriodStruc/saveCalc'), params)
}

// 曲线试算点线图
export async function curveCalcPointLineQuery(params) {
  return ajax.post(serverPre('/api/interRatePeriodStruc/curveCalcPointLineQuery'), params)
}

export async function testTimeOut() {
  return ajax.post(serverPre('api/test/testTimeOut?time=70000'))
}
