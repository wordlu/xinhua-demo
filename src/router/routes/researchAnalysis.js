// 研究分析
import Layouts from '@src/layouts/main.vue'
// import { recursion } from '@views/login/lis'
// import store from '@store';

export const routers = [
  {
    path: '/parameter',
    component: Layouts,
    meta: {
      title: '参数管理',
      order: 2,
      ignoreAuth: true,
      id: 20000,
      type: 1
    },
    redirect: '/parameter/configuration',
    children: [
      {
        path: 'configuration',
        name: 'configuration',
        meta: {
          title: '参数管理',
          ignoreAuth: true,
          id: 21000,
          type: 1
        },
        component: () => import('@views/parameter/index')
      }
    ]
  },
  {
    path: '/research',
    meta: {
      title: '债券收益率查询',
      order: 3,
      ignoreAuth: true,
      id: 30000,
      type: 0,
      authority: 'research'
    },
    redirect: '/research/',
    component: Layouts,
    children: [
      {
        path: 'bond-trade-information',
        name: 'BondTradeInformation',
        meta: {
          title: '债券交易信息查询',
          ignoreAuth: true,
          id: 31000,
          type: 0,
          noCache: false,
          authority: 'bond-trade-information'
        },
        component: () => import('@views/bondYield/tradeInformation')
      },
      {
        path: 'bond-appraisement',
        name: 'BondAppraisement',
        meta: {
          title: '债券估值信息查询',
          ignoreAuth: true,
          id: 32000,
          type: 0,
          authority: 'bond-appraisement',
          noCache: false
        },
        component: () => import('@views/bondYield/appraisement')
      },
      {
        path: 'bond-turnover-rate',
        name: 'bond-turnover-rate',
        type: 0,
        meta: {
          title: '无风险利率查询',
          ignoreAuth: true,
          id: 33000,
          type: 0,
          authority: 'bond-turnover-rate'
        },
        redirect: '/research/bond-turnover-rate',
        component: { render: e => e('router-view') },
        children: [
          {
            path: 'trend',
            name: 'trend',
            meta: {
              title: '无风险利率走势分析',
              ignoreAuth: true,
              id: 33100,
              type: 0,
              authority: 'trend'
            },
            component: () => import('@views/bondYield/turnoverRate')
          },
          {
            path: 'time-limit',
            name: 'time-limit',
            meta: {
              title: '无风险利率期限结构',
              id: 33200,
              type: 0,
              authority: 'time-limit',
              ignoreAuth: true
            },
            component: () => import('@views/bondYield/timeLimit')
          }
        ]
      }
    ]
  },
  {
    path: '/curvemanagement',
    meta: {
      title: '曲线管理',
      order: 4,
      ignoreAuth: true,
      id: 40000,
      type: 0,
      authority: 'curvemanagement'
    },
    redirect: '/curvemanagement/',
    component: Layouts,
    children: [
      {
        path: 'curvemanagement-regulation',
        name: 'curvemanagement-regulation',
        meta: {
          title: '曲线规则查询与曲线配置',
          ignoreAuth: true,
          id: 41000,
          type: 0,
          authority: 'curvemanagement-regulation'
        },
        component: () => import('@views/curvemanagement/regulation/index')
      },
      {
        path: 'curvemanagement-grouping',
        name: 'curvemanagement-grouping',
        meta: {
          title: '曲线分组查询',
          ignoreAuth: true,
          id: 42000,
          type: 0,
          authority: 'curvemanagement-grouping'
        },
        component: () => import('@views/curvemanagement/grouping/index')
      },
      {
        path: 'curvemanagement-changerecord',
        name: 'curvemanagement-changerecord',
        meta: {
          title: '标准曲线分组变更记录查询',
          ignoreAuth: true,
          id: 43000,
          type: 0,
          authority: 'curvemanagement-changerecord'
        },
        component: () => import('@views/curvemanagement/changerecord/index.vue')
      },
      {
        path: 'curvemanagement-configuration',
        name: 'curvemanagement-configuration',
        meta: {
          title: '标准曲线簇规则配置',
          ignoreAuth: true,
          id: 44000,
          type: 0,
          authority: 'curvemanagement-configuration'
        },
        component: () => import('@views/curvemanagement/configuration/index')
      },
      {
        path: 'curvemanagement-appraisement',
        name: 'curvemanagement-appraisement',
        meta: {
          title: '标准估值异常情况查询',
          ignoreAuth: true,
          id: 45000,
          type: 0,
          authority: 'curvemanagement-appraisement'
        },
        component: () => import('@views/curvemanagement/appraisement/index')
      }
    ]
  },
  {
    path: '/curvefitting',
    meta: {
      title: '曲线拟合查询与分析',
      order: 5,
      ignoreAuth: true,
      id: 50000,
      type: 0,
      authority: 'curvefitting'
    },
    redirect: '/curvefitting/',
    component: Layouts,
    children: [
      {
        path: 'curvefitting-trial',
        name: 'curvefitting-trial',
        meta: {
          title: '曲线试算',
          ignoreAuth: true,
          id: 51000,
          type: 0,
          authority: 'curvefitting-trial'
        },
        component: () => import('@views/curvefitting/trial')
      },
      {
        path: 'curvefitting-structure',
        name: 'curvefitting-structure',
        meta: {
          title: '曲线利率期限结构',
          ignoreAuth: true,
          id: 52000,
          type: 0,
          authority: 'curvefitting-structure'
        },
        component: () => import('@views/curvefitting/structure')
      },
      {
        path: 'curvefitting-analysis',
        name: 'curvefitting-analysis',
        meta: {
          title: '曲线利率走势分析',
          ignoreAuth: true,
          id: 53000,
          type: 0,
          authority: 'curvefitting-analysis'
        },
        component: () => import('@views/curvefitting/analysis')
      },
      {
        path: 'curvefitting-deviation',
        name: 'curvefitting-deviation',
        meta: {
          title: '单曲线偏离度分析',
          ignoreAuth: true,
          id: 54000,
          type: 0,
          authority: 'curvefitting-deviation'
        },
        component: () => import('@views/curvefitting/deviation')
      },
      {
        path: 'curvefitting-debenture',
        name: 'curvefitting-debenture',
        meta: {
          title: '债券偏离度分析',
          ignoreAuth: true,
          id: 55000,
          type: 0,
          authority: 'curvefitting-debenture'
        },
        component: () => import('@views/curvefitting/debenture')
      }
    ]
  },
  {
    path: '/ratemanagement',
    meta: {
      title: '评级信息管理',
      order: 6,
      ignoreAuth: true,
      id: 60000,
      type: 0,
      authority: 'ratemanagement'
    },
    redirect: '/ratemanagement/',
    component: Layouts,
    children: [
      {
        path: 'object-management',
        name: 'object-management',
        meta: {
          title: '主体级别查询与管理',
          ignoreAuth: true,
          id: 61000,
          type: 0,
          authority: 'object-management'
        },
        component: () => import('@views/ratemanagement/object/index')
      },
      {
        path: 'bond-rate',
        name: 'bond-rate',
        meta: {
          title: '债项评级查询',
          ignoreAuth: true,
          id: 62000,
          type: 0,
          authority: 'bond-rate'
        },
        component: () => import('@views/ratemanagement/bond/index')
      },
      {
        path: 'rate-management',
        name: 'rate-management',
        meta: {
          title: '评级管理',
          ignoreAuth: true,
          id: 63000,
          type: 0,
          authority: 'rate-management'
        },
        component: () => import('@views/ratemanagement/rate/index')
      }
    ]
  },
  {
    path: '/valuation',
    meta: {
      title: '债券估值分析',
      order: 7,
      ignoreAuth: true,
      id: 70000,
      type: 0,
      authority: 'valuation'
    },
    redirect: '/valuation/',
    component: Layouts,
    children: [
      {
        path: 'standard',
        name: 'standard',
        type: 0,
        meta: {
          title: '标准估值',
          ignoreAuth: true,
          id: 71000,
          type: 0,
          authority: 'standard'
        },
        redirect: '/valuation/standard',
        component: { render: e => e('router-view') },
        children: [
          {
            path: 'single-bond',
            name: 'single-bond',
            meta: {
              title: '单一债券标准估值',
              ignoreAuth: true,
              id: 71100,
              type: 0,
              authority: 'single-bond'
            },
            component: () => import('@views/valuation/standard/singleBond/index')
          },
          {
            path: 'single-subject',
            name: 'single-subject',
            meta: {
              title: '单一主体标准估值',
              id: 71200,
              type: 0,
              authority: 'single-subject',
              ignoreAuth: true
            },
            component: () => import('@views/valuation/standard/singleSubject/index')
          }
        ]
      },
      {
        path: 'custom',
        name: 'custom',
        meta: {
          title: '自定义估值',
          ignoreAuth: true,
          id: 72000,
          type: 0,
          authority: 'custom'
        },
        component: () => import('@views/valuation/custom')
      },
      {
        path: 'multiagent',
        name: 'multiagent',
        type: 0,
        meta: {
          title: '多主体估值比较与汇总分析',
          ignoreAuth: true,
          id: 73000,
          type: 0,
          authority: 'multiagent'
        },
        redirect: '/valuation/multiagent',
        component: { render: e => e('router-view') },
        children: [
          {
            path: 'term',
            name: 'term',
            meta: {
              title: '多主体利率期限结构',
              ignoreAuth: true,
              id: 73100,
              type: 0,
              authority: 'term'
            },
            component: () => import('@views/valuation/multiagent/term')
          },
          {
            path: 'trend',
            name: 'trend',
            meta: {
              title: '多主体利率走势分析',
              id: 73200,
              type: 0,
              authority: 'trend',
              ignoreAuth: true
            },
            component: () => import('@views/valuation/multiagent/trend')
          }
        ]
      }
    ]
  },
  {
    path: '/administration',
    meta: {
      title: '系统管理',
      order: 8,
      ignoreAuth: true,
      id: 80000,
      type: 0,
      authority: 'administration'
    },
    redirect: '/administration/',
    component: Layouts,
    children: [
      {
        path: 'user',
        name: 'user',
        type: 0,
        meta: {
          title: '用户管理',
          ignoreAuth: true,
          id: 81000,
          type: 0,
          authority: 'user'
        },
        redirect: '/user',
        component: { render: e => e('router-view') },
        children: [
          {
            path: 'consumer',
            name: 'consumer',
            meta: {
              title: '用户管理',
              id: 81100,
              type: 0,
              ignoreAuth: true,
              authority: 'consumer'
            },
            component: () => import('@views/administration/user/consumer.vue')
          },
          {
            path: 'alteration',
            name: 'alteration',
            meta: {
              title: '用户变更记录',
              id: 81200,
              type: 0,
              ignoreAuth: true,
              authority: 'alteration'
            },
            component: () => import('@views/administration/user/alteration')
          },
          {
            path: 'role',
            name: 'role',
            meta: {
              title: '用户角色变更记录',
              id: 81300,
              type: 0,
              ignoreAuth: true,
              authority: 'role'
            },
            component: () => import('@views/administration/user/role')
          },
          {
            path: 'function',
            name: 'function',
            meta: {
              title: '用户功能变更记录',
              id: 81400,
              type: 0,
              ignoreAuth: true,
              authority: 'function'
            },
            component: () => import('@views/administration/user/function')
          },
          {
            path: 'add',
            name: 'add',
            meta: {
              title: '用户管理编辑',
              id: 81500,
              type: 0,
              ignoreAuth: false,
              authority: 'add'
            },
            component: () => import('@views/administration/user/add')
          },
          {
            path: 'password',
            name: 'password',
            meta: {
              title: '重置密码',
              id: 81600,
              type: 0,
              ignoreAuth: false,
              authority: 'password'
            },
            component: () => import('@views/administration/user/password')
          },
          {
            path: 'authorization',
            name: 'authorization',
            meta: {
              title: '用户授权',
              id: 81700,
              type: 0,
              ignoreAuth: false,
              authority: 'authorization'
            },
            component: () => import('@views/administration/user/authorization')
          }
        ]
      },
      {
        path: 'character',
        name: 'character',
        meta: {
          title: '角色管理',
          ignoreAuth: true,
          id: 82000,
          type: 0,
          authority: 'character'
        },
        component: { render: e => e('router-view') },
        redirect: '/administration/character/regulate',
        children: [
          {
            path: 'regulate',
            name: 'regulate',
            meta: {
              title: '角色管理',
              ignoreAuth: true,
              id: 82100,
              type: 1,
              authority: 'regulate'
            },
            component: () => import('@views/administration/character/index')
          },
          {
            path: 'compile',
            name: 'compile',
            meta: {
              title: '角色管理编辑',
              ignoreAuth: true,
              id: 82200,
              type: 1,
              authority: 'compile'
            },
            component: () => import('@views/administration/character/compile')
          },
          {
            path: 'authorization',
            name: 'authorization',
            meta: {
              title: '角色授权',
              ignoreAuth: true,
              id: 82300,
              type: 0,
              authority: 'authorization'
            },
            component: () => import('@/src/views/administration/character/authorizations.vue')
          }
        ]
      },
      {
        path: 'menu',
        name: 'menu',
        type: 0,
        meta: {
          title: '菜单管理',
          ignoreAuth: true,
          id: 83000,
          type: 0,
          authority: 'menu'
        },
        component: { render: e => e('router-view') },
        redirect: '/administration/menu/manage',
        children: [
          {
            path: 'manage',
            name: 'manage',
            type: 1,
            meta: {
              title: '菜单管理',
              ignoreAuth: true,
              id: 83100,
              type: 1,
              authority: 'manage'
            },
            component: () => import('@views/administration/menu/index.vue')
          },
          {
            path: 'edit',
            name: 'edit',
            meta: {
              title: '菜单管理编辑',
              id: 83200,
              type: 0,
              authority: 'edit',
              ignoreAuth: true
            },
            component: () => import('@views/administration/menu/edit.vue')
          }
        ]
      },
      {
        path: 'journal',
        name: 'journal',
        type: 0,
        meta: {
          title: '日志管理',
          ignoreAuth: true,
          id: 84000,
          type: 0,
          authority: 'journal'
        },
        redirect: '/administration/journal',
        component: { render: e => e('router-view') },
        children: [
          {
            path: 'operation',
            name: 'operation',
            meta: {
              title: '操作日志',
              ignoreAuth: true,
              id: 84100,
              type: 0,
              authority: 'operation'
            },
            component: () => import('@views/administration/journal/operation')
          },
          {
            path: 'task',
            name: 'task',
            meta: {
              title: '定时任务日志',
              id: 84200,
              type: 0,
              authority: 'task',
              ignoreAuth: true
            },
            component: () => import('@views/administration/journal/task')
          }
        ]
      }
    ]
  }
]
export default routers
