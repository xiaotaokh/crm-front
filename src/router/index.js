import Vue from 'vue'
import Router from 'vue-router'
import login from '@/views/login' // 登录
import appMain from '@/views/app-main' // 主体页
import index from '@/views/index' // 首页

// 客户管理
import customerManage from '@/views/customerManage/customerManage' // 客户管理
import salesTarget from '@/views/customerManage/salesTarget/salesTarget' // 销售目标
import salesTargetManage from '@/views/customerManage/salesTarget/salesTargetManage' // 销售目标管理
import salesTargetStatistic from '@/views/customerManage/salesTarget/salesTargetStatistic' // 销售目标统计
import perSalesmanage from '@/views/customerManage/salesTarget/perSalesmanage' // 个人目标管理
import tripRecord from '@/views/customerManage/salesTarget/tripRecord' // 个人目标管理行程记录
import salesTargetManageTripRecord from '@/views/customerManage/salesTarget/salesTargetManageTripRecord' // 销售目标管理行程记录
import customerList from '@/views/customerManage/customerList' // 客户列表

// 系统管理
import systemManage from '@/views/systemManage/systemManage' // 系统管理
import userManage from '@/views/systemManage/userManage' // 用户管理
import roleManage from '@/views/systemManage/roleManage' // 角色管理
import menuManage from '@/views/systemManage/menuManage' // 菜单管理

// 公司管理
import companyManage from '@/views/companyManage/companyManage' // 公司管理
import companyMaintains from '@/views/companyManage/companyMaintains' // 公司维护
import companyList from '@/views/companyManage/companyList' // 公司列表

// 项目管理
import itemManage from '@/views/itemManage/itemManage' // 项目管理
import itemMaintain from '@/views/itemManage/itemMaintain' // 项目维护

Vue.use(Router)

const router = new Router({
  mode: 'history', // build打包时候要关闭
  routes: [{
      path: '/',
      redirect: '/login',
      component: login, // 重定向到login
    },
    {
      path: '/login',
      name: '/login',
      component: login,
      meta: "登录", // 登录
    },
    {
      path: '/appMain',
      redirect: '/appMain/index',
      component: index // 重定向到首页
    },
    {
      path: '/appMain',
      name: '/appMain',
      component: appMain,
      meta: "首页", // 主体页
      children: [{
          path: '/appMain/index',
          name: 'appMain/index',
          component: index,
          meta: "dashboard", // 首页
        },
        // 客户管理
        {
          path: '/appMain/customerManage/customerManage',
          redirect: '/appMain/customerManage/customerList',
          component: customerList // 客户管理重定向到客户列表
        },
        {
          path: '/appMain/customerManage/customerManage',
          name: 'appMain/customerManage/customerManage',
          component: customerManage,
          meta: "客户管理", // 客户管理
          children: [
            // 客户列表
            {
              path: '/appMain/customerManage/customerList',
              name: 'appMain/customerManage/customerList',
              component: customerList,
              meta: "客户列表", // 客户列表
            },
            // 销售目标
            {
              path: '/appMain/customerManage/salesTarget/salesTarget',
              redirect: '/appMain/customerManage/salesTarget/salesTargetManage',
              component: salesTargetManage // 销售目标重定向到销售目标管理
            },
            {
              path: '/appMain/customerManage/salesTarget/salesTarget',
              name: 'appMain/customerManage/salesTarget/salesTarget',
              component: salesTarget,
              meta: "销售目标",
              children: [{
                  path: '/appMain/customerManage/salesTarget/salesTargetManage',
                  name: 'appMain/customerManage/salesTarget/salesTargetManage',
                  component: salesTargetManage,
                  meta: "销售目标管理", // 销售目标管理
                },
                {
                  path: '/appMain/customerManage/salesTarget/tripRecord',
                  name: 'appMain/customerManage/salesTarget/tripRecord',
                  component: tripRecord,
                  meta: "个人目标管理行程记录", // 个人目标管理行程记录
                },
                {
                  path: '/appMain/customerManage/salesTarget/salesTargetManageTripRecord',
                  name: 'appMain/customerManage/salesTarget/salesTargetManageTripRecord',
                  component: salesTargetManageTripRecord,
                  meta: "销售目标管理行程记录", // 销售目标管理行程记录
                },
                {
                  path: '/appMain/customerManage/salesTarget/perSalesmanage',
                  name: 'appMain/customerManage/salesTarget/perSalesmanage',
                  component: perSalesmanage,
                  meta: "个人目标管理", // 个人目标管理
                },
                {
                  path: '/appMain/customerManage/salesTarget/salesTargetStatistic',
                  name: 'appMain/customerManage/salesTarget/salesTargetStatistic',
                  component: salesTargetStatistic,
                  meta: "销售目标统计", // 销售目标统计
                }
              ]
            },
          ]
        },
        // 项目管理
        {
          path: '/appMain/itemManage/itemManage',
          redirect: '/appMain/itemManage/itemMaintain',
          component: itemMaintain // 项目管理重定向到项目维护
        },
        {
          path: '/appMain/itemManage/itemManage',
          name: 'appMain/itemManage/itemManage',
          component: itemManage,
          meta: "项目管理", // 项目管理
          children: [
            // 项目维护
            {
              path: '/appMain/itemManage/itemMaintain',
              name: 'appMain/itemManage/itemMaintain',
              component: itemMaintain,
              meta: "项目维护", // 项目维护
            },
          ]
        },
        // 系统管理 
        {
          path: '/appMain/systemManage/systemManage',
          redirect: '/appMain/systemManage/menuManage',
          component: menuManage, // 系统管理重定向到菜单管理
        },
        {
          path: '/appMain/systemManage/systemManage',
          name: 'appMain/systemManage/systemManage',
          component: systemManage,
          meta: "系统管理", // 系统管理
          children: [{
              path: '/appMain/systemManage/userManage',
              name: 'appMain/systemManage/userManage',
              component: userManage,
              meta: "用户管理", // 用户管理
            },
            {
              path: '/appMain/systemManage/roleManage',
              name: 'appMain/systemManage/roleManage',
              component: roleManage,
              meta: "角色管理", // 角色管理
            },
            {
              path: '/appMain/systemManage/menuManage',
              name: 'appMain/systemManage/menuManage',
              component: menuManage,
              meta: "菜单管理", // 菜单管理
            }
          ]
        },
        // 公司管理
        {
          path: '/appMain/companyManage/companyManage',
          redirect: '/appMain/companyManage/companyMaintains',
          component: companyMaintains, // 公司管理重定向到公司维护
        },
        {
          path: '/appMain/companyManage/companyManage',
          name: 'appMain/companyManage/companyManage',
          component: companyManage,
          meta: "公司管理", // 公司管理
          children: [{
              path: '/appMain/companyManage/companyMaintains',
              name: 'appMain/companyManage/companyMaintains',
              component: companyMaintains,
              meta: "公司维护", // 公司维护
            },
            {
              path: '/appMain/companyManage/companyList',
              name: 'appMain/companyManage/companyList',
              component: companyList,
              meta: "公司列表", // 公司列表
            },
          ]
        },
      ]
    }
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果是登录页面的话，直接next()  只做/login处理，其他路由跳转 均由请求返回的code码（例如418）去处理
  if (to.path == '/login') {
    // 获取浏览器缓存的用户信息 如果已经登录的话
    if (localStorage.getItem('token')) {
      next("/appMain");
      Vue.prototype.$message({
        message: '您已经登录，欢迎使用！',
        type: 'success',
        duration:1500,
      });
      next();
    } else {
      next();
    }
  }
  next();
})

export default router
