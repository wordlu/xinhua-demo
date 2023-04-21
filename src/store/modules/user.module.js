import { handleLogin } from '@api/user'
import { getDictDataList2, canAbleDate } from '@api/productFlow'
import { removeSessionStorage, setStorage, removeStorage, getStorage } from '../../utils/storage'
import dicts from '@assets/json/dict.json'
import { addRouter } from '@utils/permission'
import {
  getInfoAPI,
  getLoginLogAPI,
  getLogoutLogAPI,
  getUserInfoAPI,
  getKickFlagAPI
} from '@api/login'
import router, { resetRouter } from '@router/index'
import cloneDeep from 'lodash/cloneDeep'
import routerList from '@/src/router/routerList'
import { recursion } from '@views/login/lis'
import { Loading, Message } from 'element-ui'
const authToken = 'auth_token'

function initMenuAuthorize(menus, parentCode, parentRouterCode) {
  menus.forEach(item => {
    // 目前返回的菜单树和功能点都叫children，type=0 表示目录：可以下拉。type=1 菜单：一级菜单
    // 因目前没有菜单反面的接口，部分接口使用 code
    if (item.type === 0) {
      item.routerCode = parentRouterCode ? parentRouterCode + '/' + item.code : '/' + item.code
      if (parentCode) {
        item.authorize = `${parentCode}_${item.code}`
      }
      if (item.children && item.children.length > 0) {
        initMenuAuthorize(item.children, item.code, item.routerCode)
      }
    } else if (item.type === 1) {
      item.routerCode = `${item.path}`
    }
  })
}
const user = {
  // namespaced: true, // 用于报表管理 发送人回显
  state: {
    userInfo: {},
    authorizes: [],
    assign: null,
    authSwitch: true,
    dictData: [],
    canAbleDate: [],
    menuIds: [],
    roleList: [],
    roleId: '',
    roleName: '',
    flag: true,
    ableDate: null,
    routerList: [],
    btnId: [],
    userId: '',
    loginName: '',
    cascaderData: []
  },

  mutations: {
    USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo
      // setSessionStorage('userInfo', userInfo)
    },
    SET_AUTHORIZES: (state, authorizes) => {
      state.authorizes = authorizes
    },
    UPDATE_ASSIGN: (state, assign) => {
      state.assign = assign
    },
    UPDATE_DICDATA: (state, dictData) => {
      state.dictData = dictData
      setStorage('dictData', dictData[4002])
    },
    UPDATE_DATE: (state, ableDate) => {
      state.ableDate = ableDate
    },
    GET_MENUIDS: (state, data) => {
      state.menuIds = data
    },
    Get_ROULIST: (state, data) => {
      state.roleList = data
    },
    GET_ROLEID: (state, data) => {
      state.roleId = data
      setStorage('roleId', data)
    },
    GET_NAME: (state, data) => {
      state.roleName = data
    },
    FLAG(state, data) {
      state.flag = data
    },
    ROUTER_LIST(state, data) {
      state.routerList = data
    },
    GET_BTNID(state, data) {
      state.btnId = data
    },
    loginName(state, data) {
      state.loginName = data
    },
    cascaderData(state, data) {
      state.cascaderData = data
    }
  },

  actions: {
    login({ dispatch, commit }, userInfo) {
      return new Promise((resolve, reject) => {
        commit('USER_INFO', {
          name: userInfo.username
        })
        handleLogin(userInfo)
          .then(({ data, error }) => {
            if (data) {
              if (data.token) {
                // 修改为loca存储
                setStorage(authToken, data.token)
                // dispatch('authVerify', data.token);
                resolve(data.state)
              } else {
                resolve(data.state)
              }
            } else {
              resolve(error)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 登出
    async logOut(store, flag = true) {
      if (flag) {
        await getLogoutLogAPI({ userId: store.state.userInfo.userId })
      } else {
        let num = localStorage.getItem('num_token')
        num = num + 1
        localStorage.setItem('num_token', num)
        if (num < 2) {
          const { data } = await getKickFlagAPI({ userName: store.state.userInfo.loginName })
          if (data === 'true') {
            Message.error('您的账号已在其他设备登录，请重新登陆！')
          } else {
            Message.error('登录过期，请重新登录！')
          }
        }
      }
      if (store.state.loginName) {
        removeStorage(`${store.state.loginName}${authToken}`)
      } else {
        removeStorage(`${store.state.userInfo.loginName}${authToken}`)
      }
      removeStorage(authToken)
      removeStorage('expiration_time')
      removeStorage('roleId')
      removeSessionStorage('structure')
      removeSessionStorage('analysis')
      removeSessionStorage('vuex')
      store.commit('USER_INFO', {})
      store.commit('SET_AUTHORIZES', [])
      store.commit('UPDATE_ASSIGN', null)
      store.commit('GET_ROLEID', '')
      store.commit('GET_MENUIDS', [])
      store.commit('Get_ROULIST', [])
      store.commit('Get_ROULIST', [])
      store.dispatch('tagsView/delAllViews') // 登出清空访问菜单数组
      store.commit('FLAG', true)
      store.commit('GET_NAME', '')
      store.commit('loginName', '')
      resetRouter()
      if (flag) {
        router.push('/login')
      } else {
        let num = window.localStorage.length
        for (let i = 0; i < num; i++) {
          if (window.localStorage.key(i) && window.localStorage.key(i).includes('auth_token')) {
            removeStorage(window.localStorage.key(i))
          }
        }
        router.push('/sso')
      }
    },
    fetchAuthorizes({ commit }, data) {
      let arr = cloneDeep(data)
      let newRouter = addRouter(arr)
      if (newRouter && newRouter.length > 0) {
        initMenuAuthorize(newRouter, null, null)
      }
      commit('SET_AUTHORIZES', newRouter)
    },
    async fetchDictDaa({ commit }) {
      let params = dicts.map(item => {
        return item.code
      })
      getDictDataList2(params)
        .then(res => {
          if (res) {
            let { data } = res
            commit('UPDATE_DICDATA', data)
          }
        })
        .catch(err => {
          this.$message.error(err.message || '获取字典值失败')
        })
    },
    fetchAbleDate({ commit }) {
      canAbleDate().then(res => {
        if (res && res.status === 200) {
          let { data } = res
          commit('UPDATE_DATE', data)
        }
      })
    },
    // 获取用户权限点标识
    async getUserRule(store) {
      const { data } = await getInfoAPI({
        userId: store.state.userInfo.userId,
        roleId: getStorage('roleId') || store.state.roleId
      })
      store.commit('GET_BTNID', data.buttonIds)
      store.commit('GET_MENUIDS', data.menuIds)
      store.commit('Get_ROULIST', data.roleList)
      if (getStorage('roleId')) {
        let roleName = store.state.roleList.filter(item => {
          return item.code === getStorage('roleId')
        })
        store.commit('GET_NAME', roleName[0].name)
      }
      Loading.service({ fullscreen: true }).close()

      if (!store.state.roleName && data.roleList.length > 0) {
        store.commit('GET_NAME', data.roleList[0].name)
      }
      return data.menuIds
    },
    // 点击切换角色的时候
    switchingRoles({ commit }) {
      commit('GET_MENUIDS', [])
      commit('SET_AUTHORIZES', [])
      commit('USER_INFO', {})
      resetRouter()
    },
    // 获取当前用户信息
    async getUserInfoFN(store) {
      Loading.service({ fullscreen: true, text: '正在加载中' })
      const { data } = await getUserInfoAPI()
      store.commit('USER_INFO', data.sysUser)
      if (store.state.flag) {
        await getLoginLogAPI({ userId: data.sysUser.userId })
        store.commit('FLAG', false)
      }
      let newRouterList = cloneDeep(routerList)
      await store.dispatch('getUserRule')
      const menuIds = cloneDeep(store.state.menuIds)
      const newlist = recursion(menuIds, newRouterList)
      Loading.service({ fullscreen: true }).close()
      if (newlist[0] && newlist[0].children.length === 1 && newlist[0].meta.title === '首页') {
        newlist[0].children[0].meta.title = `${store.state.roleName}首页`
      }
      store.commit('ROUTER_LIST', newlist)
      store.dispatch('fetchAuthorizes', newlist)
      router.addRoutes(newlist)
      if (newlist.length > 0) {
        const father = newlist[0].path
        const son = newlist[0].children[0].path
        const jumpRoute = `${father}/${son}`
        router.push(jumpRoute)
      } else {
        router.push('/welcome/users')
      }
    }
  }
}

export default user
