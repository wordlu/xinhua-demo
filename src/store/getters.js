const getters = {
  authorizes: state => state.user.authorizes,
  menuData: state => state.routes.menuData,
  permission_routes: state => state.permission.routes,
  ableDate: state => state.user.ableDate,
  roleName: state => state.user.roleName,
  clickType: state => state.tagsView.clickType,
  clickLeftArr: state => state.tagsView.clickLeftArr
}

export default getters
