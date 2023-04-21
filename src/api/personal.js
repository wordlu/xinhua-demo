import ajax from '@utils/ajax';
let serverPre = ajax.serverUrl;
const serverName = '/operation-homepage';
// 获取 个人首页-工作管理 负责人
export async function getChargePersons() {
  return ajax.get(serverPre(`${serverName}/personal/getChargePersons`));
}
// 获取 个人首页-工作管理 待办工作
export async function getTasks() {
  return ajax.get(serverPre(`${serverName}/personal/getTasks`));
}
// 获取运营部所有人员列表
export async function getOperatorsList() {
  return ajax.get(serverPre(`${serverName}/personal/getOperators`));
}

// 获取待办理任务列表
export async function getPersonalTodoList() {
  return ajax.get(serverPre(`${serverName}/personal/todoList`));
}

// 修改待办理任务
export async function modifyTask(params) {
  return ajax.post(serverPre(`${serverName}/personal/modify`), params);
}

// 置顶/取消置顶
export async function taskTop(params) {
  return ajax.post(serverPre(`${serverName}/personal/top`), params);
}

// 单条工作交接
export async function handoverWork(params) {
  return ajax.post(serverPre(`${serverName}/personal/handover`), params);
}

// 获取登陆用户信息
export async function getUserInfo() {
  return ajax.get(serverPre(`${serverName}/personal/personalInfo`));
}

// 获取资讯列表
export async function getNewsList() {
  return ajax.get(serverPre(`${serverName}/personal/newsList`));
}

// 获取常用工作台
export async function getWorkbenchList() {
  return ajax.get(serverPre(`${serverName}/personal/workbenchList`));
}

// 设置常用工作台
export async function setWorkbench(params) {
  return ajax.post(serverPre(`${serverName}/personal/setWorkbench`), params);
}

// 获取工作内容
export async function getWorkList() {
  return ajax.post(serverPre(`${serverName}/personal/getMenu`));
}

// 工作模块和日常检查交接
export async function workHandover(param) {
  return ajax.post(serverPre(`${serverName}/personal/workHandover`), param);
}

// 获取工作自查的完成情况的统计数据
export async function getCheckStatus() {
  return ajax.get(serverPre(`${serverName}/personal/checkStatus`));
}

// 获取定时检查table数据
export async function getTimingCheck() {
  return ajax.get(serverPre(`${serverName}/personal/timingCheck`));
}

// 获取自查表的table数据
export async function getCheckTableList(params) {
  return ajax.get(serverPre(`${serverName}/personal/checkList`), params);
}

// 获取自查表的备选值
export async function getCheckSelectList() {
  return ajax.get(serverPre(`${serverName}/personal/selectList`));
}

// 设置自查表
export async function setCheck(params) {
  return ajax.post(serverPre(`${serverName}/personal/setCheck`), params);
}

// 删除自查表
export async function deleteCheckTableList(params) {
  return ajax.post(serverPre(`${serverName}/personal/deleteCheck`), params);
}

// 获取日历的信息
export async function getCalendarInfo(params) {
  return ajax.get(serverPre(`${serverName}/personal/calendarInfo`), params);
}

// 获取日历旁边滚动区域内容
export async function getImportantEvents(params) {
  return ajax.get(serverPre(`${serverName}/personal/importantEvents`), params);
}

// 获取日程列表
export async function getEvents(param) {
  return ajax.get(serverPre(`${serverName}/personal/getEvents`), param);
}

// 新建待办事项
export async function setCalendarEvents(params) {
  return ajax.post(serverPre(`${serverName}/personal/addMemo`), params);
}

// 完成待办事项
export async function finishEvents(params) {
  return ajax.post(serverPre(`${serverName}/personal/finishMemo`), params);
}

// 删除待办事项
export async function deleteEvents(params) {
  return ajax.post(serverPre(`${serverName}/personal/deleteMemo`), params);
}

// 上传用户头像或生日
export async function updateUser(params) {
  // return ajax.post(serverPre(`${serverName}/personal/updateUser`), params, {
  //   'Content-Type': 'multipart/form-data'
  // });
  return ajax.post(serverPre(`${serverName}/personal/uploadHeadImg`), params, {
    'Content-Type': 'multipart/form-data'
  });
}

// 获取用户头像
export async function getAvatar(params) {
  // return ajax.get(serverPre(`${serverName}/personal/getImage`), params);
  return ajax.get(serverPre(`${serverName}/personal/getUserImage`), params);
}
// 新闻资讯列表查询
export async function queryNewsList(params) {
  return ajax.post(
    serverPre(`${serverName}/personal/news-information/query`),
    params
  );
}
// 新闻资讯机构名称列表
export async function orgNamesList(params) {
  return ajax.get(
    serverPre(`${serverName}/personal/news-information/org-names-query`),
    params
  );
}
// 新闻资讯是否已读
export async function isVisited(params) {
  return ajax.get(
    serverPre(`${serverName}/personal/news-information/url-visited`),
    params
  );
}
export async function getDefaultJob(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/default-job`), params);
}
export async function getWorkManageList(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/query`), params);
}
export async function getJobTitle(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/job-title`), params);
}
export async function getCharger(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/charger`), params);
}
export async function getFrequency(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/frequency`), params);
}
export async function getSation(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/station`), params);
}
export async function getJobCategory(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/job-category`), params);
}
export async function delWorkManage(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/delete`), params);
}
export async function getWorkDetail(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/detail`), params);
}
export async function setAnable(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/enable`), params);
}
export async function addWorkManage(params) {
  return ajax.post(serverPre(`${serverName}/work-manage/add`), params);
}
export async function editWorkManage(params) {
  return ajax.post(serverPre(`${serverName}/work-manage/update`), params);
}
export async function workSet(params) {
  return ajax.post(serverPre(`${serverName}/work-manage/set`), params);
}
export async function getStaJob(params) {
  return ajax.get(serverPre(`${serverName}/work-manage/set-query`), params);
}
export async function toOther(params) {
  return ajax.post(serverPre(`${serverName}/work-manage/to-another`), params);
}

export async function getToDoWork(params) {
  return ajax.get(serverPre(`${serverName}/personal/pending-work`), params);
}
// 领导-工作统计
export async function workStatistics(params) {
  return ajax.get(serverPre(`${serverName}/personal/work-statistics`), params);
}
export async function completeSign(params) {
  return ajax.post(serverPre(`${serverName}/personal/complete-sign`), params);
}
export async function setRemarks(params) {
  return ajax.post(serverPre(`${serverName}/personal/remarks`), params);
}
export async function getWorkTask(params) {
  return ajax.get(serverPre(`${serverName}/personal/getWorkTask`), params);
}
