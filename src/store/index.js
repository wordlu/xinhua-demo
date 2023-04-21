import Vue from 'vue'
import Vuex from 'vuex'

import modules from './modules'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const filter = obj => {
  let objArr = Object.keys(obj).filter(i => i !== 'clickLeftArr' && i !== 'clickType')
  let object = {}
  objArr.map(i => {
    object[i] = obj[i]
  })
  return object
}

const createPersisted = createPersistedState({
  storage: window.sessionStorage,
  key: 'NCAM',
  reducer(val) {
    const { tagsView, user } = val
    return {
      // 只储存state中的某些字段 注意：键值对名字要一致
      tagsView: filter(tagsView),
      user
    }
  }
})

const store = new Vuex.Store({
  modules: { ...modules },
  getters,
  // strict: process.env.NODE_ENV !== "production",
  plugins: [createPersisted],
  strict: false
})
export default store
