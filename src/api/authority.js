import ajax from '@utils/ajax';

// const serverPre = ajax.serverUrlMock;
const serverPre = ajax.serverUrl;
const serverName = '/auth-management';
const dataServer = '/auth-data-management';

const productServerUrl = `${dataServer}/product/`;
const roleServerUrl = `${serverName}/role/`;
const userServerUrl = `${serverName}/user/`;
const menuServerUrl = `${serverName}/menu/`;
const deptServerUrl = `${serverName}/dept/`;
const actionsServerUrl = `${serverName}/actions/`;

// 12月初菜单管理页改版，以下为新增接口
// 菜单新增
export async function menuAdd(params) {
    return ajax.post(serverPre(`${menuServerUrl}addMenu`), params);
}

// 菜单删除
export async function menuDel(params) {
    return ajax.get(serverPre(`${menuServerUrl}delMenuById`), params);
}

// 菜单详情获取
export async function menuDetail(params) {
    return ajax.get(serverPre(`${menuServerUrl}queryMenuById`), params);
}

// 菜单修改
export async function menuEdit(params) {
    return ajax.post(serverPre(`${menuServerUrl}editMenu`), params);
}

// 功能点新增
export async function actionAdd(params) {
    return ajax.post(serverPre(`${actionsServerUrl}addResource`), params);
}

// 功能点删除
export async function actionDel(params) {
    return ajax.get(serverPre(`${actionsServerUrl}delResource`), params);
}

// 功能点详情获取
export async function actionDetail(params) {
    return ajax.get(serverPre(`${actionsServerUrl}queryResourceById`), params);
}

// 功能点修改
export async function actionEdit(params) {
    return ajax.post(serverPre(`${actionsServerUrl}editResource`), params);
}

// 结束
// 角色查询
export async function roleQuery(params) {
    return ajax.get(serverPre(`${roleServerUrl}query`), params);
}

// 产品列表查询
export async function productQuery(params) {
    return ajax.get(serverPre(`${productServerUrl}query`), params);
}

// 产品类型下拉列表查询
export async function productDictsQuery(params) {
    return ajax.get(serverPre(`${productServerUrl}dict`), params);
}

// 添加角色
export async function roleAdd(data) {
    return ajax.post(serverPre(`${roleServerUrl}add`), data);
}

// 编辑角色
export async function roleEdit({id, data}) {
    return ajax.post(serverPre(`${roleServerUrl}edit/${id}`), data);
}

// 获取角色详情
export async function roleDetail(id) {
    return ajax.get(serverPre(`${roleServerUrl}detail/${id}`));
}

// 删除角色
export async function roleRemove(id) {
    return ajax.get(serverPre(`${roleServerUrl}del/${id}`));
}

// 为用户授权相应功能点菜单
export async function userActionsEdit({id, data}) {
    return ajax.post(serverPre(`${userServerUrl}right/edit/${id}`), data);
}

// 用户授权时，获取用户有的功能点详情
export async function userActionSDetail(id) {
    return ajax.get(serverPre(`${userServerUrl}detail/${id}`));
}

// 用户刷新
export async function userLoad() {
    return ajax.get(serverPre(`${userServerUrl}data/source`));
}

// 用户查询
export async function userQuery(params) {
    return ajax.get(serverPre(`${userServerUrl}query`), params);
}

// 用户字典查询
export async function userDictQuery(params) {
    return ajax.get(serverPre(`${userServerUrl}dict`), params);
}

// 用户是否锁定
export async function userLocked(id, obj) {
    return ajax.post(serverPre(`${userServerUrl}lock/${id}`), obj);
}

// 用户功能授权
export async function userAuthorize(id, obj) {
    return ajax.post(serverPre(`${userServerUrl}operate/grant/${id}`), obj);
}

// 用户角色查询
export async function userRoleQuery(id) {
    return ajax.get(serverPre(`${userServerUrl}role/query/${id}`));
}

// 用户密码重置
export async function passwordReset(id) {
    return ajax.post(serverPre(`${userServerUrl}password/reset/${id}`));
}

// 用户权限复制
export async function authCopy(param) {
    return ajax.get(serverPre(`${userServerUrl}auth-copy`), param);
}

// 新增用户
export async function addUsers(data) {
    return ajax.post(serverPre(`${userServerUrl}add`), data);
}

// 修改用户
export async function editUsers(id, data) {
    return ajax.post(serverPre(`${userServerUrl}edit/${id}`), data);
}

// 菜单树查询
export async function queryMenus(params) {
    return ajax.get(serverPre(`${menuServerUrl}menutree`), params);
}

// // 菜单信息初始化
// export async function initMenu(params) {
//     return ajax.post(serverPre(`${menuServerUrl}init`), params);
// }
// 菜单信息保存
export async function saveMenu(params) {
    return ajax.post(serverPre(`${menuServerUrl}adjust`), params);
}

// 部门下拉列表查询
export async function deptQuery() {
    return ajax.get(serverPre(`${deptServerUrl}query`));
}
