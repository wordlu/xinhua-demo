import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMeta from 'vue-meta'
import CommonRoutesMap from './commonRouters'
// import RoutesMapConfig from './routes';

Vue.use(VueRouter)
Vue.use(VueMeta, {
  keyName: 'page'
})

// const routers = [...CommonRoutesMap]

const routerInstance = () =>
  new VueRouter({
    routes: CommonRoutesMap,
    mode: 'history',
    linkActiveClass: 'active',
    scrollBehavior: () => ({
      y: 0
    })
  })
const router = routerInstance()
export function resetRouter() {
  const newRouter = routerInstance()
  router.matcher = newRouter.matcher // 新路由实例matcer，赋值给旧路由实例的matcher，（相当于replaceRouter）
}
export default router
