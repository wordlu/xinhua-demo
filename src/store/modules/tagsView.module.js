import cloneDeep from 'lodash/cloneDeep'
const tagsView = {
  namespaced: true,
  state: {
    visitedViews: [],
    visitedSubViews: [],
    cachedViews: [],
    optionsData: [],
    selectTag: '',
    isShowState: '',
    clickType: 'top',
    clickLeftArr: []
  },
  mutations: {
    ADD_CLICK_TYPE(state, type) {
      state.clickType = type
    },
    ADD_CLICK_ARR_VIEWS(state, view) {
      if (state.clickLeftArr.includes(view.name)) return
      state.clickLeftArr.push(view.name)
    },
    DEL_ALL_CLICK_ARR_VIEWS(state) {
      state.clickLeftArr = []
    },
    DEL_ITEM_CLICK_ARR_VIEWS(state, view) {
      state.clickLeftArr = state.clickLeftArr.filter(v => v !== view.name)
    },
    CLEARcachedViews(state, data) {
      state.cachedViews = []
    },
    CLEAR_visitedViews(state, data) {
      state.visitedViews = []
    },
    CHANGE_SELECT_TAG: (state, flag) => {
      state.selectTag = flag
    },
    CHANGE_SHOW: (state, flag) => {
      state.isShowState = flag
    },
    SET_CACHE_VIEWS: (state, views) => {
      state.cachedViews = views
    },
    SUB_OPTIONS_DATA: (state, data) => {
      if (data) {
        for (let prop in data) {
          if (
            prop === 'scaleTrendChart' ||
            prop === 'netTrendChart' ||
            prop === 'assetsDistributionChart'
          ) {
            delete data.netTrendChart
            delete data.assetsDistributionChart
            delete data.scaleTrendChart
          }
        }
        let index = state.optionsData.findIndex(item => {
          return item.productCode === Date.productCode
        })
        if (index !== -1) {
          state.optionsData[index] = cloneDeep(data)
        } else {
          state.optionsData.push(data)
        }
      }
    },
    ADD_SUB_VISITED_VIEW: (state, view) => {
      if (view) {
        let index = state.visitedSubViews.findIndex(item => {
          return item.name === view.name
        })
        if (index !== -1) {
          state.isShowState = view.name
        } else {
          state.visitedSubViews.push({
            title: view.title,
            name: view.name,
            productCode: view.productCode,
            isShowState: view.isShow,
            active: view.active
          })
          state.isShowState = view.isShow
        }
      }
    },
    DEL_SUB_VISITED_VIEW: (state, view) => {
      state.visitedSubViews.forEach((item, index) => {
        if (item.productCode === view.productCode) {
          state.visitedSubViews.splice(index, 1)
        }
      })
      state.optionsData.forEach((item, index) => {
        if (item.productCode === view.productCode) {
          state.visitedSubViews.splice(index, 1)
        }
      })
      if (state.visitedSubViews.length === 0) {
        // "MergeDetail"
        let index = state.visitedViews.findIndex(item => {
          return item.name.toString() === 'MergeDetail'
        })
        state.visitedViews.splice(index, 1)
      }
    },
    DEL_ALL_SUB_VISITED_VIEW: (state, view) => {
      if (view.name === 'MergeDetail') {
        state.visitedSubViews = []
        state.optionsData = []
      }
    },
    TURN_SUB_VISITED_VIEW: (state, params) => {
      if (params.sourceCode) {
        let index = state.visitedSubViews.findIndex(item => {
          return item.productCode.toString() === params.sourceCode.toString()
        })
        let index2 = state.visitedSubViews.findIndex(item => {
          return item.productCode.toString() === params.targetCode.toString()
        })
        if (index2 !== -1) {
          state.selectTag = params.sourceCode
        } else {
          if (index !== -1) {
            state.visitedSubViews[index].productCode = params.targetCode
            state.visitedSubViews[index].name = params.targetName
            state.visitedSubViews[index].title = params.targetName + params.targetCode
          }
        }
      } else {
      }
    },
    ADD_VISITED_VIEW: (state, view) => {
      let index = state.visitedViews.findIndex(item => {
        if (view.meta.hidden) {
          return item.title === view.meta.parentInfo.meta.title
        } else {
          return item.title === view.meta.title && item.fullPath.includes(view.path)
        }
      })
      if (index !== -1) {
        state.visitedViews[index].path = view.path
        state.visitedViews[index].fullPath = view.fullPath
        state.visitedViews[index].name = view.name
        state.visitedViews[index].query = view.query
      } else {
        state.visitedViews.push({
          title: view.meta.hidden ? view.meta.parentInfo.meta.title : view.meta.title || 'no-title',
          name: view.name,
          path: view.path,
          meta: { ...view.meta },
          fullPath: view.fullPath,
          query: view.query
        })
      }
    },
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.includes(view.name)) return
      if (!view.meta.noCache) {
        state.cachedViews.push(view.name)
      }
    },
    DEL_VISITED_VIEW: (state, view) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.fullPath === view.fullPath) {
          state.visitedViews.splice(i, 1)
          break
        }
      }
    },
    DEL_CACHED_VIEW: (state, view) => {
      state.cachedViews = state.cachedViews.filter(v => v !== view.name)
    },
    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
      state.visitedViews = state.visitedViews.filter(v => {
        return v.meta.affix || v.path === view.path
      })
    },
    DEL_OTHERS_CLICK_VIEWS: (state, view) => {
      const index = state.clickLeftArr.indexOf(view.name)
      if (index > -1) {
        state.clickLeftArr = state.clickLeftArr.slice(index, index + 1)
      } else {
        state.clickLeftArr = []
      }
    },
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
      const index = state.cachedViews.indexOf(view.name)
      if (index > -1) {
        state.cachedViews = state.cachedViews.slice(index, index + 1)
      } else {
        state.cachedViews = []
      }
    },
    DEL_ALL_VISITED_VIEWS: state => {
      const affixTags = state.visitedViews.filter(tag => tag.meta.affix)
      state.visitedViews = affixTags
    },
    DEL_ALL_CACHED_VIEWS: state => {
      state.cachedViews = []
    },
    UPDATE_VISITED_VIEW: (state, view) => {
      for (let v of state.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view)
          break
        }
      }
    }
  },
  actions: {
    changeSeletTag({ commit }, flag) {
      commit('CHANGE_SELECT_TAG', flag)
    },
    changeisShowState({ commit }, flag) {
      commit('CHANGE_SHOW', flag)
    },
    changeHeight({ commit }, flag) {
      commit('CHANGE_HEIGHT', flag)
    },
    viewData({ commit }, data) {
      commit('SUB_OPTIONS_DATA', data)
    },
    addSubView({ dispatch }, view) {
      dispatch('addSubVisitedView', view)
      // dispatch('addCachedView', view);
    },
    delSubView({ dispatch }, view) {
      dispatch('delSubVisitedView', view)
      // dispatch('addCachedView', view);
    },
    addSubVisitedView({ commit }, view) {
      commit('ADD_SUB_VISITED_VIEW', view)
    },
    delSubVisitedView({ commit }, view) {
      commit('DEL_SUB_VISITED_VIEW', view)
    },
    delAllSubVisitedView({ commit }, view) {
      commit('DEL_ALL_SUB_VISITED_VIEW', view)
    },
    turnSubVistiedView({ commit }, params) {
      commit('TURN_SUB_VISITED_VIEW', params)
    },
    addView({ dispatch }, view) {
      dispatch('addVisitedView', view)
      dispatch('addCachedView', view)
    },
    addVisitedView({ commit }, view) {
      commit('ADD_VISITED_VIEW', view)
    },
    addCachedView({ commit }, view) {
      if (view.matched && view.matched.length >= 3) {
        // 若为三级及其以上路由点击打开标签页时，将三级路由或以上的根目录路由塞入缓存路由name list中
        commit('ADD_CACHED_VIEW', view.matched[1])
      }
      commit('ADD_CACHED_VIEW', view)
    },
    delView({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delVisitedView', view)
        dispatch('delCachedView', view)
        dispatch('delItemClickLeftViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews],
          clickLeftArr: [...state.clickLeftArr]
        })
      })
    },
    delVisitedView({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_VISITED_VIEW', view)
        resolve([...state.visitedViews])
      })
    },
    delCachedView({ commit, state }, view) {
      return new Promise(resolve => {
        if (view.matched && view.matched.length >= 3) {
          commit('DEL_CACHED_VIEW', view.matched[1])
        }
        commit('DEL_CACHED_VIEW', view)
        resolve([...state.cachedViews])
      })
    },
    delOthersViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delOthersVisitedViews', view)
        dispatch('delOthersCachedViews', view)
        dispatch('delOtherClickViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews]
        })
      })
    },
    delOtherClickViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CLICK_VIEWS', view)
        resolve([...state.clickLeftArr])
      })
    },
    delOthersVisitedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_VISITED_VIEWS', view)
        resolve([...state.visitedViews])
      })
    },
    delOthersCachedViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_OTHERS_CACHED_VIEWS', view)
        resolve([...state.cachedViews])
      })
    },
    delItemClickLeftViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_ITEM_CLICK_ARR_VIEWS', view)
        resolve([...state.clickLeftArr])
      })
    },
    delAllClickLeftViews({ commit, state }, view) {
      return new Promise(resolve => {
        commit('DEL_ALL_CLICK_ARR_VIEWS')
        resolve([...state.clickLeftArr])
      })
    },
    delAllViews({ dispatch, state }, view) {
      return new Promise(resolve => {
        dispatch('delAllVisitedViews', view)
        dispatch('delAllCachedViews', view)
        dispatch('delAllClickLeftViews', view)
        resolve({
          visitedViews: [...state.visitedViews],
          cachedViews: [...state.cachedViews],
          clickLeftArr: [...state.clickLeftArr]
        })
      })
    },
    delAllVisitedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_VISITED_VIEWS')
        resolve([...state.visitedViews])
      })
    },
    delAllCachedViews({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS')
        resolve([...state.cachedViews])
      })
    },
    updateVisitedView({ commit }, view) {
      commit('UPDATE_VISITED_VIEW', view)
    }
  }
}
export default tagsView
