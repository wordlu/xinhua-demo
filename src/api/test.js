import ajax from '@utils/ajax';

let serverPre = ajax.serverUrlMock;
export async function test1 (params) {
  return ajax.get(serverPre('/api/bondTradeInfo/bondAttrList'), params);
}