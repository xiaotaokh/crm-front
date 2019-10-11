import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login'                 // 登录
import appMain from '@/views/app-main'            // 主体页
import index from '@/views/index'                 // 首页

// 客户管理
import customerManage from '@/views/customerManage/customerManage'                  // 客户管理
import salesTarget from '@/views/customerManage/salesTarget/salesTarget'            // 销售目标
import salesTargetManage from '@/views/customerManage/salesTarget/salesTargetManage'                     // 销售目标管理
import salesTargetStatistic from '@/views/customerManage/salesTarget/salesTargetStatistic'               // 销售目标管理

// 系统管理
import systemManage from '@/views/systemManage/systemManage'               // 系统管理
import userManage from '@/views/systemManage/userManage'                   // 用户管理
import roleManage from '@/views/systemManage/roleManage'                   // 角色管理

Vue.use(Router)

const router = new Router({
  mode:'history',
  routes: [
    {
      path: '/', redirect: '/login', component: login,                                                              // 重定向到login
    },
    {
      path: '/login', name: '/login',  component: login,                                                                            // 登录
    },
    {
      path: '/appMain', redirect: '/appMain/index', component: index,                                                               // 首页
    },
    {
      path: '/appMain', name: '/appMain', component: appMain,                                                                       // 主体页
      children:[
        {
          path: '/appMain/index', name: 'appMain/index', component: index,                                                          // 首页
        },
        // 客户管理
        {
          path: '/appMain/customerManage/customerManage', name: 'appMain/customerManage/customerManage', component: customerManage,                               // 客户管理
          children:[
            // 销售目标
            {
              path: '/appMain/customerManage/salesTarget/salesTarget', name: 'appMain/customerManage/salesTarget/salesTarget', component: salesTarget,            
              children:[
                {
                  path: '/appMain/customerManage/salesTarget/salesTargetManage', name: 'appMain/customerManage/salesTarget/salesTargetManage', component: salesTargetManage,                      // 销售目标管理
                },
                {
                  path: '/appMain/customerManage/salesTarget/salesTargetStatistic', name: 'appMain/customerManage/salesTarget/salesTargetStatistic', component: salesTargetStatistic,             // 销售目标统计
                }
              ]
            },
            // 公海客户
            // {
            //   path: '', name: '', component: ""
            // }
          ]
        },
        // 系统管理
        {
          path: '/appMain/systemManage/systemManage', name: 'appMain/systemManage/systemManage', component: systemManage,    // 系统管理
          children:[
            {
              path: '/appMain/systemManage/userManage', name: 'appMain/systemManage/userManage', component: userManage,      // 用户管理
            },
            {
              path: '/appMain/systemManage/roleManage', name: 'appMain/systemManage/roleManage', component: roleManage,      // 角色管理
            }
          ]
        }
      ]
    }
  ]
})
export default router