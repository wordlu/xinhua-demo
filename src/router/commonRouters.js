import Layouts from '@src/layouts/main.vue'
export default [
  {
    path: '/login',
    meta: {
      title: '登录',
      id: 1
    },
    component: () => import('@views/login')
  },
  {
    path: '/',
    redirect: '/sso'
  },
  {
    path: '/welcome',
    component: Layouts,
    meta: {
      title: '欢迎',
      order: 1,
      ignoreAuth: true,
      type: 1,
      id: 2
    },
    redirect: '/welcome/users',
    children: [
      {
        path: 'users',
        name: 'users',
        meta: {
          title: '欢迎您',
          affix: true,
          ignoreAuth: true,
          type: 1,
          id: 3
        },
        component: () => import('@views/homes')
      }
    ]
  },
  {
    path: '/404',
    meta: {
      title: 'Page Not Fond',
      ignoreAuth: true,
      id: 4
    },
    component: () => import('@views/_404')
  },
  {
    path: '/sso',
    meta: {
      title: 'sso',
      id: 7
    },
    component: () => import('@views/login/sso')
  }
  // { path: '*', redirect: '/404' }
]
