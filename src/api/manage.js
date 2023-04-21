import ajax from '@utils/ajax'
const serverPre = ajax.serverManager
const serverPra = ajax.serverDispatchJob
// 获取全部用户集合
export async function getUserListAPI(params) {
  return ajax.get(serverPre(`/user/getAllUser`), params)
}
// 重置密码
export async function postEditPasswordAPI(params) {
  return ajax.post(serverPre('/user/updateUserPassword'), params)
}
// 新增用户
export async function addUserAPI(params) {
  return ajax.post(serverPre('/user/addUsr'), params)
}
// 修改用户信息
export async function postEditUserAPI(params) {
  return ajax.post(serverPre('/user/updateUser'), params)
}
// 删除当前用户
export async function deleteUserAPI(params) {
  return ajax.post(serverPre(`/user/deleteUser`), params)
}
// 获取全部用户集合
export async function getMenuListAPI(params) {
  const { pageNum, pageSize } = params

  return ajax.get(serverPre(`/menu/page/${pageSize}/${pageNum}`))
}
// 获取角色
export async function getRoleListAPI(params) {
  // const { pageNum, pageSize, name } = params

  return ajax.get(serverPre(`/role/all`), params)
}
// 用户授权
export async function postImpowerAPI(params) {
  return ajax.post(serverPre(`/user/menu`), params)
}
// 添加角色
export async function postruleAPI(params) {
  return ajax.post(serverPre(`/role`), params)
}
// 修改角色
export async function updateRuleAPI(params) {
  return ajax.post(serverPre(`/role/updateRole`), params)
}
// 获取树形菜单集合
export async function getTreeListAPI(params) {
  return ajax.get(serverPre(`/menu/tree`), params)
}
// 删除角色
export async function deleteRoleAPI(params) {
  return ajax.get(serverPre(`/role/deleteRole?id=${params}`))
}
// 角色授权
export async function postRoleAPI(params) {
  return ajax.post(serverPre(`/role/menu`), params)
}
// 获取所有菜单类型
export async function getMenuTypeVoAPI(params) {
  return ajax.get(serverPre(`/menu/menuTypeVo`), params)
}
// 新增菜单
export async function postAddMenuAPI(params) {
  return ajax.post(serverPre(`/menu/addMenu`), params)
}
// 通过id查询菜单详细
export async function getMenuIdAPI(params) {
  return ajax.get(serverPre(`/menu/${params}`))
}
// 更新菜单
export async function postUpdateMenuAPI(params) {
  return ajax.post(serverPre(`/menu/updateMenu`), params)
}
// 删除菜单
export async function deleteMenuAPI(params) {
  return ajax.get(serverPre(`/menu/deleteMenu`), params)
}
// 日志查询
export async function postLoginQueryAPI(params) {
  return ajax.post(serverPre(`/log/operate/query`), params)
}
// 批量删除用户管理
export async function deleteBatchUserAPI(params) {
  return ajax.get(serverPre(`/user/deleteBatch`), params)
}
// 批量删除角色
export async function deleteBatchRoleAPI(params) {
  return ajax.get(serverPre(`/role/deleteBatch?roleIds=${params}`))
}
// 批量删除菜单管理
export async function deleteBatchMenuAPI(params) {
  return ajax.get(serverPre(`/menu/deleteBatch`), params)
}
// 用户角色变更记录
export async function getUserchanFgeListAPI(params) {
  return ajax.post(serverPre(`/user/getUserChangeList`), params)
}
// 获取变更的用户或者角色
export async function getUserChangeDropDownAPI(params) {
  return ajax.get(serverPre(`/user/getUserChangeDropDown`), params)
}
// 用户变更记录导出
export async function exportUserChange(params) {
  return ajax.fileBlob(serverPre(`/user/exportUserChange`), params)
}
// 用户角色变更记录导出
export async function exportUserRoleChange(params) {
  return ajax.fileBlob(serverPre(`/user/exportUserRoleChange`), params)
}
// 角色功能变更记录导出
export async function exportRoleMenuChange(params) {
  return ajax.fileBlob(serverPre(`/user/exportRoleMenuChange`), params)
}
// 根据id查询当前用户角色
export async function getUserRoleList(params) {
  return ajax.get(serverPre(`/role/${params}`))
}
// 获取定时任务日志的下拉框
export async function getTaskNameListAPI(params) {
  return ajax.get(serverPra(`/taskLog/getTaskNameList`), params)
}
// 获取定时任务日志的的列表
export async function postSelectLogListAPI(params) {
  return ajax.post(serverPra(`/taskLog/selectLogList`), params)
}
// 获取所有的登录账号
export async function getLoginNameAllListAPI(params) {
  return ajax.get(serverPre(`/user/getLoginNameAllList`), params)
}
// 获取所有的角色编码
export async function getRoleAllAPI(params) {
  return ajax.get(serverPre(`/role/getRoleCodeAllList`), params)
}
// 根据角色id获取当前角色的菜单
export async function getRresentMenyAPI(params) {
  return ajax.get(serverPre(`/menu/tree/${params}`))
}
// 获取全部角色名称
export async function getRoleNameAPI(params) {
  return ajax.get(serverPre(`/role/getRoleNameAllList`))
}
// 获取公司组织部门
export async function getDeptIdAPI(params) {
  return ajax.get(serverPre(`/user/getDeptId`))
}
// 操作日志导出
export async function exportOperateAPI(params) {
  return ajax.fileBlob(serverPre(`/log/exportOperate`), params)
}
