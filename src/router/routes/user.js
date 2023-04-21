import Layout from '@layouts/main'
// import { recursion } from '@views/login/lis'
// import store from '@store';

export const routerList = [
  {
    path: '/home',
    component: Layout,
    meta: {
      title: '首页',
      order: 1,
      type: 0,
      ignoreAuth: true,
      id: 10000,
      authority: 'home'
    },
    redirect: '/home/',
    children: [
      {
        path: 'investment-manager',
        name: 'investment-manager',
        meta: {
          title: '投资经理首页',
          ignoreAuth: true,
          id: 11000,
          type: 0,
          authority: 'investment-manager'
        },
        component: () => import('@views/home/investmentManager')
      },
      {
        path: 'credit-analyst',
        name: 'credit-analyst',
        meta: {
          title: '信用分析师首页',
          ignoreAuth: true,
          id: 12000,
          type: 0,
          authority: 'credit-analyst'
        },
        component: () => import('@views/home/creditAnalyst')
      },
      {
        path: 'business-administrator',
        name: 'business-administrator',
        meta: {
          title: '业务管理员首页',
          ignoreAuth: true,
          id: 13000,
          type: 0,
          authority: 'business-administrator'
        },
        component: () => import('@views/home/businessAdministrator')
      }
    ]
  }
]
export default routerList
