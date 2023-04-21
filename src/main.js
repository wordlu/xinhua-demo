import Vue from 'vue'
import ElementUI from 'element-ui'
import '@assets/scss/_element-variables.scss'
import '@components/directives/directives.js'
import { globalDictMap, globalDictLabel } from '@utils/dict'
import App from './App.vue'
import router from '@router/index'
import '@/src/permission'
import store from '@store'
import '@icons'
import moment from 'moment'
import jm from 'vue-jsmind'
import md5 from 'js-md5'
import directivePlugin from './utils/directive'
require('./mock')
Vue.use(ElementUI)
Vue.use(directivePlugin)
ElementUI.Dialog.props.lockScroll.default = false

Vue.nextTick(() => {
  document.querySelectorAll('svg title').forEach(v => v.parentNode.removeChild(v)) // 移除svg title
})

Vue.prototype.globalDictMap = globalDictMap
Vue.prototype.globalDictLabel = globalDictLabel
Vue.prototype.$moment = moment
moment.suppressDeprecationWarnings = true // 关闭警告提示
Vue.prototype.$md5 = md5
moment.locale('zh-cn')
Vue.use(jm)
if (window.jsMind) {
  Vue.prototype.jsMind = window.jsMind
}
const app = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// If running e2e tests...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`.
  window.__app__ = app
}
