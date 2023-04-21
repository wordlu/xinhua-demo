import Layouts from '@src/layouts/main.vue'

export default [
  {
    path: '/home',
    component: Layouts,
    meta: {
      title: '首页',
      order: 1,
      type: 0,
      ignoreAuth: true,
      id: 10000,
      authority: 'home',
      icon: '1-0587_home'
    },
    redirect: '/home/',
    children: [
      {
        path: 'investment-manager',
        name: 'InvestmentManager',
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
        name: 'CreditAnalyst',
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
        name: 'BusinessAdministrator',
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
  },
  {
    path: '/parameter',
    component: Layouts,
    meta: {
      title: '参数管理',
      order: 7,
      ignoreAuth: true,
      id: 20000,
      type: 1,
      icon: '7-0198_regulator_more'
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
      order: 2,
      ignoreAuth: true,
      id: 30000,
      type: 0,
      authority: 'research',
      icon: '3-0540_findfile'
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
        name: 'BondTurnoverRate',
        type: 0,
        meta: {
          title: '无风险收益率查询',
          ignoreAuth: true,
          id: 33000,
          type: 0,
          authority: 'bond-turnover-rate'
        },
        redirect: '/research/bond-turnover-rate',
        component: {
          name: 'BondTurnoverRate',
          render() {
            const route = <router-view />
            return route
          }
        },
        children: [
          {
            path: 'time-limit',
            name: 'RateLimit',
            meta: {
              title: '无风险利率期限结构',
              id: 33200,
              type: 0,
              authority: 'time-limit',
              ignoreAuth: true
            },
            component: () => import('@views/bondYield/timeLimit')
          },
          {
            path: 'trend',
            name: 'RateTrend',
            meta: {
              title: '无风险利率走势分析',
              ignoreAuth: true,
              id: 33100,
              type: 0,
              authority: 'trend'
            },
            component: () => import('@views/bondYield/turnoverRate')
          }
        ]
      }
    ]
  },
  {
    path: '/curvemanagement',
    meta: {
      title: '曲线管理',
      order: 3,
      ignoreAuth: true,
      id: 40000,
      type: 0,
      authority: 'curvemanagement',
      icon: '4-0633_chart_show2'
    },
    redirect: '/curvemanagement/',
    component: Layouts,
    children: [
      {
        path: 'curvemanagement-regulation',
        name: 'CurvemanagementRegulation',
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
        name: 'CurvemanagementGrouping',
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
        name: 'CurvemanagementChangerecord',
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
        name: 'CurvemanagementConfiguration',
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
        name: 'CurvemanagementAppraisement',
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
      order: 4,
      ignoreAuth: true,
      id: 50000,
      type: 0,
      authority: 'curvefitting',
      icon: '5-0091_chart_line'
    },
    redirect: '/curvefitting/',
    component: Layouts,
    children: [
      {
        path: 'curvefitting-trial',
        name: 'CurvefittingTrial',
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
        name: 'CurvefittingStructure',
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
        name: 'CurvefittingAnalysis',
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
        name: 'CurvefittingDeviation',
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
        name: 'CurvefittingDebenture',
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
      authority: 'ratemanagement',
      icon: '2-0625_folder_index'
    },
    redirect: '/ratemanagement/',
    component: Layouts,
    children: [
      {
        path: 'object-management',
        name: 'ObjectManagement',
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
        name: 'BondRate',
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
        name: 'RateManagement',
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
    name: 'valuation',
    meta: {
      title: '债券估值分析',
      order: 5,
      ignoreAuth: true,
      id: 70000,
      type: 0,
      authority: 'valuation',
      icon: '6-0265_chart_line_desktop'
    },
    redirect: '/valuation/',
    component: Layouts,
    children: [
      {
        path: 'standard',
        name: 'StandardSecondRoute',
        type: 0,
        meta: {
          title: '标准估值',
          ignoreAuth: true,
          id: 71000,
          type: 0,
          authority: 'standard'
        },
        redirect: '/valuation/standard',
        component: {
          name: 'StandardSecondRoute',
          render() {
            const route = <router-view />
            return route
          }
        },
        children: [
          {
            path: 'single-bond',
            name: 'SingleBond',
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
            name: 'SingleSubject',
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
        name: 'Custom',
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
        name: 'MultiagentSecondRoute',
        type: 0,
        meta: {
          title: '多主体估值比较与汇总分析',
          ignoreAuth: true,
          id: 73000,
          type: 0,
          authority: 'multiagent'
        },
        redirect: '/valuation/multiagent',
        component: {
          name: 'MultiagentSecondRoute',
          render() {
            const route = <router-view />
            return route
          }
        },
        children: [
          {
            path: 'term',
            name: 'MultiagentTerm',
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
            name: 'MultiagentTrend',
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
      authority: 'administration',
      icon: '8-0014_setting'
    },
    redirect: '/administration/',
    component: Layouts,
    children: [
      {
        path: 'user',
        name: 'UserPage',
        type: 0,
        meta: {
          title: '用户管理',
          ignoreAuth: true,
          id: 81000,
          type: 0,
          authority: 'user'
        },
        redirect: '/user',
        component: {
          name: 'UserPage',
          render() {
            const route = <router-view />
            return route
          }
        },
        children: [
          {
            path: 'consumer',
            name: 'Consumer',
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
            name: 'Alteration',
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
            name: 'Role',
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
            name: 'Function',
            meta: {
              title: '角色功能变更记录',
              id: 81400,
              type: 0,
              ignoreAuth: true,
              authority: 'function'
            },
            component: () => import('@views/administration/user/function')
          }
        ]
      },
      {
        path: 'character',
        name: 'Character',
        meta: {
          title: '角色管理',
          ignoreAuth: true,
          id: 82000,
          type: 0,
          authority: 'character'
        },
        component: {
          name: 'Character',
          render() {
            const route = <router-view />
            return route
          }
        },
        redirect: '/administration/character/regulate',
        children: [
          {
            path: 'regulate',
            name: 'Regulate',
            meta: {
              title: '角色管理',
              ignoreAuth: true,
              id: 82100,
              type: 1,
              authority: 'regulate'
            },
            component: () => import('@views/administration/character/index')
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
            name: 'Manage',
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
        component: {
          name: 'journal',
          render() {
            const route = <router-view />
            return route
          }
        },
        children: [
          {
            path: 'operation',
            name: 'Operation',
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
