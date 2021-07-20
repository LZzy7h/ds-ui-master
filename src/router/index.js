import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import ParentView from '@/components/ParentView';
import permission from '../store/modules/permission'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
// const indexPath = localStorage.getItem('SET_ROUTES')
// console.log(permission.state);
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  // {
  //   path: '/user',
  //   component: Layout,
  //   hidden: true,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'profile',
  //       component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
  //       name: 'Profile',
  //       meta: { title: '个人中心', icon: 'user' }
  //     }
  //   ]
  // },
  {
    path: '/newProfile',
    component: (resolve) => require(['@/views/system/user/newProfile'], resolve),
    hidden: true
  },
  // {
  //   path: '/data/list',
  //   component: (resolve) => require(['@/views/data/dataSet/list-tree'], resolve),
  //   hidden: true
  // },

  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit/:tableId(\\d+)',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  // {
  //   path: '/operator',
  //   component: Layout,
  //   redirect: '/operator/statisticsReport',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Operator',
  //   meta: {
  //     title: '运营方',
  //     icon: 'process_2_2x',
  //     // roles: ['operator'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'statisticsReport',
  //       component: () => import('@/views/operator/statisticsReport/index'),
  //       name: 'statisticsReport',
  //       meta: {
  //         title: '统计报告',
  //         icon: 'pie-chart',
  //         // roles: ['operator'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'dataSetList',
  //       component: () => import('@/views/operator/dataSet/list'),
  //       name: 'dataSetList',
  //       meta: {
  //         title: '数据集列表',
  //         icon: 'database',
  //         // roles: ['operator'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'sampleView',
  //       component: () => import('@/views/operator/dataSet/sampleView'),
  //       name: 'sampleView',
  //       hidden:true,
  //       meta: {
  //         title: '样例查看',
  //         icon: 'lock',
  //         // roles: ['operator'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'applicationList',
  //       component: () => import('@/views/operator/applicationList/list'),
  //       name: 'applicationList',
  //       meta: {
  //         title: '应用列表',
  //         icon: 'application',
  //         // roles: ['operator'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'contractDetail',
  //       component: () => import('@/views/operator/applicationList/contractDetail'),
  //       name:'contractDetail',
  //       hidden:true,
  //       meta: {
  //         title: '合约详情',
  //         icon: 'lock',
  //         // roles: ['operator'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'executionRecords',
  //       component: () => import('@/views/operator/executionRecords/list'),
  //       name: 'executionRecords',
  //       meta: {
  //         title: '执行记录',
  //         icon: 'notebook',
  //         // roles: ['operator'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'scenarioSetting',
  //       component: () => import('@/views/systemManagement/scenarioSetting/index'),
  //       name: 'scenarioSetting',
  //       meta: {
  //         title: '场景设置',
  //         icon: 'system',
  //         // roles: ['operator'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'participantsManagement',
  //       component: () => import('@/views/systemManagement/participantsManagement/list'),
  //       name: 'participantsManagement',
  //       meta: {
  //         title: '参与方管理',
  //         icon: 'team-management',
  //         // roles: ['operator'] // or you can only set roles in sub nav
  //       }
  //     },
  //   ]
  // },
  // {
  //   path: '/data',
  //   component: Layout,
  //   redirect: '/data/dataBaseManagement',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'data',
  //   meta: {
  //     title: '数据方',
  //     icon: 'process_2_2x',
  //     roles: ['data_provider', 'provider_consumer'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'dataBaseManagement',
  //       component: () => import('@/views/data/dataBaseManagement/list'),
  //       name: 'dataBaseManagement',
  //       meta: {
  //         title: '数据库管理',
  //         icon: 'database',
  //         roles: ['data_provider', 'provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //   ]
  // },
  //     {
  //       path:'addDataSet',
  //       component:() => import('@/views/data/dataSet/addDataSet'),
  //       hidden:true,
  //       name:'addDataSet',
  //       meta: {
  //         title: '我的数据集',
  //         icon: 'lock',
  //         roles: ['data_provider','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'createDataSet',
  //       component:() => import('@/views/data/dataSet/createDataSet'),
  //       hidden:true,
  //       name:'createDataSet',
  //       meta: {
  //         title: '生成数据集',
  //         icon: 'lock',
  //         roles: ['data_provider','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'addSampleDataset',
  //       component:() => import('@/views/data/dataSet/addSampleDataset'),
  //       hidden:true,
  //       name:'addSampleDataset',
  //       meta: {
  //         title: '样例数据集上传',
  //         icon: 'lock',
  //         roles: ['data_provider','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'createSampleDataset',
  //       component:() => import('@/views/data/dataSet/createSampleDataset'),
  //       hidden:true,
  //       name:'createSampleDataset',
  //       meta: {
  //         title: '样例数据集上传',
  //         icon: 'lock',
  //         roles: ['data_provider','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'datasetUsage',
  //       component:() => import('@/views/data/dataSet/datasetUsage'),
  //       hidden:true,
  //       name:'datasetUsage',
  //       meta: {
  //         title: '数据集使用情况',
  //         icon: 'lock',
  //         roles: ['data_provider','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'contractApproval',
  //       component: () => import('@/views/data/contractApproval/list'),
  //       name: 'contractApproval',
  //       meta: {
  //         title: '合约审批',
  //         icon: 'application',
  //         roles: ['data_provider','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'contractDetail',
  //       component: () => import('@/views/data/contractApproval/contractDetail'),
  //       name: 'dataContractDetail',
  //       hidden:true,
  //       meta: {
  //         title: '合约详情',
  //         icon: 'lock',
  //         roles: ['data_provider','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/application',
  //   component: Layout,
  //   redirect: '/application/dataSetList',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'data',
  //   meta: {
  //     title: '应用方',
  //     icon: 'process_2_2x',
  //     roles: ['data_consumer','provider_consumer'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'dataSetList',
  //       component: () => import('@/views/application/dataSetList/list'),
  //       name: 'dataSetList',
  //       meta: {
  //         title: '数据集列表',
  //         icon: 'database',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'myApp',
  //       component: () => import('@/views/application/myApp/list'),
  //       name: 'myApp',
  //       meta: {
  //         title: '我的应用',
  //         icon: 'application',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'contractManagement',
  //       component: () => import('@/views/application/contractManagement/list'),
  //       // redirect: 'contractManagement/list',
  //       name: 'contractManagement',
  //       meta: {
  //         title: '合约管理',
  //         icon: 'contract',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'createContract',
  //       component: () => import('@/views/application/contractManagement/createContract'),
  //       name:'createContract',
  //       hidden:true,
  //       meta: {
  //         title: '创建合约',
  //         icon: 'lock',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'editContract',
  //       component: () => import('@/views/application/contractManagement/editContract'),
  //       name:'editContract',
  //       hidden:true,
  //       meta: {
  //         title: '编辑合约',
  //         icon: 'lock',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'contractDetail',
  //       component: () => import('@/views/application/contractManagement/contractDetail'),
  //       name:'contractDetail',
  //       hidden:true,
  //       meta: {
  //         title: '合约详情',
  //         icon: 'lock',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'algorithm',
  //       component: () => import('@/views/application/contractManagement/algorithm'),
  //       name: 'algorithm',
  //       hidden:true,
  //       meta: {
  //         title: '算法库',
  //         icon: 'lock',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'addAlgorithm',
  //       component: () => import('@/views/application/contractManagement/addAlgorithm'),
  //       name: 'addAlgorithm',
  //       hidden:true,
  //       meta: {
  //         title: '添加算法',
  //         icon: 'lock',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path:'editAlgorithm',
  //       component: () => import('@/views/application/contractManagement/editAlgorithm'),
  //       name: 'editAlgorithm',
  //       hidden:true,
  //       meta: {
  //         title: '修改算法',
  //         icon: 'lock',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'sampleView',
  //       component: () => import('@/views/application/dataSetList/sampleView'),
  //       // name: 'sampleView',
  //       hidden:true,
  //       meta: {
  //         title: '样例查看',
  //         icon: 'lock',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'executionRecords',
  //       component: () => import('@/views/application/executionRecords/list'),
  //       name: 'executionRecords',
  //       meta: {
  //         title: '执行记录',
  //         icon: 'notebook',
  //         roles: ['data_consumer','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/systemManagement',
  //   component: Layout,
  //   redirect: '/systemManagement/dataSetList',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'systemManagement',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'settings',
  //     roles: ['data_provider', 'data_consumer', 'operator','provider_consumer'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'paramConfig',
  //       component: () => import('@/views/systemManagement/paramConfig/list'),
  //       name: 'dataSetList',
  //       meta: {
  //         title: '参数配置',
  //         icon: 'settings',
  //         roles: ['data_provider', 'data_consumer', 'operator','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'userManagement',
  //       component: () => import('@/views/systemManagement/userManagement/list'),
  //       name: 'userManagement',
  //       meta: {
  //         title: '用户管理',
  //         icon: 'user',
  //         roles: ['data_provider', 'data_consumer', 'operator','provider_consumer'] // or you can only set roles in sub nav
  //       }
  //     }
  //   ]
  // }
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
