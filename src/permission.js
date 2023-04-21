import store from '@store'
import { recursion } from '@views/login/lis'
import routerList from '@/src/router/routerList'
import router from '@router/index'
import cloneDeep from 'lodash/cloneDeep'
import { getStorage } from '@utils/storage'
const whiteList = ['/login', '/404', '/sso']
router.beforeEach((to, from, next) => {
  let token = null
  const { loginName, userInfo, menuIds } = store.state.user

  if (loginName) {
    token = getStorage(`${loginName}auth_token`)
  } else if (getStorage('auth_token')) {
    token = getStorage('auth_token')
  } else {
    let num = window.localStorage.length
    for (let i = 0; i < num; i++) {
      if (window.localStorage.key(i).includes('auth_token')) {
        token = getStorage(window.localStorage.key(i))
        break
      }
    }
  }
  if (token) {
    if (to.path === '/login' || to.path === '/sso') {
      next()
    } else {
      next()
      if (!userInfo.userId) {
        store.dispatch('fetchDictDaa')
        store.dispatch('fetchAbleDate')
        store.dispatch('getUserInfoFN', to.path).then(() => {
          next({
            path: to.path
          })
        })
      } else {
        if (!to.name) {
          next({ ...to, replace: true })
          let newRouterList = cloneDeep(routerList)
          const menuId = cloneDeep(menuIds)
          const newlist = recursion(menuId, newRouterList)
          if (newlist[0].children.length === 1 && newlist[0].meta.title === '首页') {
            newlist[0].children[0].meta.title = `${store.state.user.roleName}首页`
          }
          router.addRoutes(newlist)
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/sso')
    }
  }
})
