/**
 * 该文件是页面缓存，再次点击左侧菜单清空缓存使用，需要做页签缓存的页面需要引入
 * 不需要缓存的页面请不要引入
 *
 * 页签缓存需要满足以下两点
 * 1. 路由文件里对应页面配置项的name属性值，以及页面组件的组件name值需要一致，都是大驼峰格式（不要加缓存页面，不要写一致）
 * 2. 左侧菜单中需要加缓存的对应页面，需要进入这个mixin文件
 */
export default {
  beforeRouteEnter(to, from, next) {
    next(vm => {
      setTimeout(() => {
        let clickType = vm.$store.getters.clickType
        let clickLeftArr = vm.$store.getters.clickLeftArr
        // 如果点击的是左侧菜单，并且是已经访问过的页面，清除缓存
        if (clickType === 'left' && clickLeftArr.includes(to.name)) {
          localStorage.removeItem('analysis')
          localStorage.removeItem('structure')
          vm.removeCache(vm)
          vm.$forceUpdate()
        }
      })
    })
  },
  methods: {
    removeCache(vm) {
      let key = vm.$vnode.key || vm.$vnode.parent.key
      let cache =
        vm.$vnode.parent.componentInstance.cache || vm.$vnode.parent.parent.componentInstance.cache
      let keys =
        vm.$vnode.parent.componentInstance.keys || vm.$vnode.parent.parent.componentInstance.keys
      if (cache[key]) {
        if (vm._inactive) {
          vm.$destroy(this.$route.name)
          delete cache[key]
          let index = keys.indexOf(key)
          if (index > -1) {
            keys.splice(index, 1)
          }
        }
      }
    }
  }
}
