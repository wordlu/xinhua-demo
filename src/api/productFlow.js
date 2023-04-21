import ajax from '@utils/ajax'

let serverPre = ajax.serverUrl
let serverUrlMock = ajax.serverUrlMock

// 字典值
export async function getDictDataList(params) {
  return ajax.get(serverUrlMock(`/dicInfo/v1/dateColumnList/${params}`))
}

export async function getDictDataList2(params) {
  return ajax.post(serverUrlMock('/dicInfo/v1/dateColumnMap'), params)
}

export async function canAbleDate(params) {
  return ajax.get(serverPre('/bndValuatInfo/tradeDateList'), params)
}
