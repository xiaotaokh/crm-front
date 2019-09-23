import Vue from 'vue'
import Router from 'vue-router'
import appMain from '@/views/app-main'
import index from '@/views/index'                 // 首页
import figure from '@/views/figure'               // 数据图
import f1 from '@/views/f1'               // 1
import f2 from '@/views/f2'               // 2
import f3 from '@/views/f3'               // 3
import f4 from '@/views/f4'               // 4
import f5 from '@/views/f5'               // 5

import login from '@/views/login'      // login

Vue.use(Router)

const router = new Router({
  mode:'history',
  routes: [
    {
      path: '/', name: '/login', redirect: '/login', component: login,   // 重定向到login
    },
    {
      path: '/login', name: '/login',  component: login,
    },
    {
      path: '/appMain', redirect: '/appMain/index', component: index,
    },
    {
      path: '/appMain', name: '/appMain', component: appMain,
      children:[
        {
          path: '/appMain/index', name: 'appMain/index', component: index,
        },
        {
          path: '/appMain/figure', name: 'appMain/figure', component: figure,
        },
        {
          path: '/appMain/f1', name: 'appMain/f1', component: f1,
        },
        {
          path: '/appMain/f2', name: 'appMain/f2', component: f2,
        },
        {
          path: '/appMain/f3', name: 'appMain/f3', component: f3,
        },
        {
          path: '/appMain/f4', name: 'appMain/f4', component: f4,
        },
        {
          path: '/appMain/f5', name: 'appMain/f5', component: f5,
        }
      ]
    }
  ]
})
export default router