import axios from '../utils/ajax';
// let serverUrl = axios.serverUrlMock;
let serverUrl = axios.serverUrl;
const serverName = '/message-center';

// 查询交接板
export async function queryJunctionList(params) {
  return axios.get(
      serverUrl(
          `${serverName}/premise-station/querySendList`
      ),
      params
  );
}
  // 获取消息模板
export async function getJunctionModels(params) {
    return axios.get(
        serverUrl(
            `${serverName}/premise-station/queryTemplateList`
        ),
        params
    );

}

export async function saveModel(params) {
    return axios.post(
        serverUrl(
            `${serverName}/premise-station/saveTemplate`
        ),
        params
    );
}

export async function handSendMsg(params) {
    return axios.post(
        serverUrl(
            `${serverName}/premise-station/handSendMsg`
        ),
        params
    );
}

export async function delMsg(params) {
    return axios.get(
        serverUrl(
            `${serverName}/premise-station/delMsg`
        ),
        params
    );
}