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
import menuManage from '@/views/systemManage/menuManage'                   // 菜单管理

Vue.use(Router)

const router = new Router({
  mode:'history',
  routes: [
    {
      path: '/', redirect: '/login', component: login,                       // 重定向到login
    },
    {
      path: '/login', name: '/login',  component: login, meta:"登录",          // 登录
    },
    {
      path: '/appMain', redirect: '/appMain/index', component: index           // 重定向到首页
    },
    {
      path: '/appMain', name: '/appMain', component: appMain, meta:"首页",       // 主体页
      children:[
        {
          path: '/appMain/index', name: 'appMain/index', component: index,        // 首页
        },
        // 客户管理
        {
          path: '/appMain/customerManage/customerManage', redirect: '/appMain/customerManage/salesTarget/salesTargetManage', component: salesTargetManage                 // 客户管理重定向到销售目标管理
        },
        {
          path: '/appMain/customerManage/customerManage', name: 'appMain/customerManage/customerManage', component: customerManage, meta:"客户管理",                               // 客户管理
          children:[
            // 销售目标
            {
              path: '/appMain/customerManage/salesTarget/salesTarget', redirect: '/appMain/customerManage/salesTarget/salesTargetManage', component: salesTargetManage                  // 销售目标重定向到销售目标管理
            },
            {
              path: '/appMain/customerManage/salesTarget/salesTarget', name: 'appMain/customerManage/salesTarget/salesTarget', component: salesTarget, meta:"销售目标",           
              children:[
                {
                  path: '/appMain/customerManage/salesTarget/salesTargetManage', name: 'appMain/customerManage/salesTarget/salesTargetManage', component: salesTargetManage, meta:"销售目标管理",                       // 销售目标管理
                },
                {
                  path: '/appMain/customerManage/salesTarget/salesTargetStatistic', name: 'appMain/customerManage/salesTarget/salesTargetStatistic', component: salesTargetStatistic, meta:"销售目标统计",              // 销售目标统计
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
          path: '/appMain/systemManage/systemManage', redirect: '/appMain/systemManage/menuManage', component: menuManage,   // 系统管理重定向到菜单管理
        },
        {
          path: '/appMain/systemManage/systemManage', name: 'appMain/systemManage/systemManage', component: systemManage, meta:"系统管理",    // 系统管理
          children:[
            {
              path: '/appMain/systemManage/userManage', name: 'appMain/systemManage/userManage', component: userManage, meta:"用户管理",      // 用户管理
            },
            {
              path: '/appMain/systemManage/roleManage', name: 'appMain/systemManage/roleManage', component: roleManage, meta:"角色管理",      // 角色管理
            },
            {
              path: '/appMain/systemManage/menuManage', name: 'appMain/systemManage/menuManage', component: menuManage, meta:"菜单管理",      // 菜单管理
            }
          ]
        }
      ]
    }
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果是登录页面的话，直接next()  只做/login处理，其他路由跳转 均由请求返回的code码（例如418）去处理
  if (to.path == '/login') {
    // 获取浏览器缓存的用户信息 如果已经登录的话
    if (sessionStorage.getItem('token')) { 
      next("/appMain");
      Vue.prototype.$message({
        message: '您已经登录，欢迎使用！',
        type: 'success'
      });
    } else {
      // next();
    }
  }
  next();
})

export default router