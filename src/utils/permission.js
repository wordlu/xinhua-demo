function switchRouterToMenu(parent, routers) {
  let menus = []
  routers.forEach(item => {
    let menu = {}

    menu.path = item.path
    if (item.meta) {
      let meta = item.meta
      if (meta.hidden) {
        return
      }
      menu.title = meta.title
      menu.code = meta.authority
      menu.icon = meta.icon ? meta.icon : ''
      menu.type = meta.type
      menu.order = meta.order
      menu.id = meta.id
      menu.ignoreAuth = meta.ignoreAuth
      if (meta.actions) {
        menu.children = meta.actions.map(act => {
          return {
            code: `${parent}_${menu.code}:${act.code}`,
            name: act.name,
            // id: `${parent}_${menu.code}:${act.code}`,
            type: 1
          }
        })
      }
      if (item.children) {
        menu.children = switchRouterToMenu(menu.code, item.children)
      }
      menus.push(menu)
    }
  })
  return menus
}
// 给路由添加属性和排序
export const addRouter = function(RouterList) {
  return switchRouterToMenu('', RouterList).sort(function(a, b) {
    return (a.order || 1) - (b.order || (a.order || 1) + 1)
  })
}
