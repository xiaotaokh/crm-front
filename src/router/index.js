import Vue from 'vue'
import Router from 'vue-router'
import appMain from '@/views/app-main'
import index from '@/views/index'                 // 首页
import figure from '@/views/figure'               // 数据图
import first from '@/views/first'
import second from '@/views/second'
import third from '@/views/third'
import fourth from '@/views/fourth'
import fifth from '@/views/fifth'
import sixth from '@/views/sixth'
import seventh from '@/views/seventh'
import eighth from '@/views/eighth'
import ninth from '@/views/ninth'
import tenth from '@/views/tenth'
import eleventh from '@/views/eleventh'
import twelfth from '@/views/twelfth'
import thirteenth from '@/views/thirteenth'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/', redirect: '/appMain/index', component: index,
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
          path: '/appMain/first', name: 'appMain/first', component: first,
        },
        {
          path: '/appMain/second', name: 'appMain/second', component: second,
        },
        {
          path: '/appMain/third', name: 'appMain/third', component: third
        },
        {
          path: '/appMain/fourth', name: 'appMain/fourth', component: fourth
        },
        {
          path: '/appMain/fifth', name: 'appMain/fifth', component: fifth
        },
        {
          path: '/appMain/sixth', name: 'appMain/sixth', component: sixth
        },
        {
          path: '/appMain/seventh', name: 'appMain/seventh', component: seventh
        },
        {
          path: '/appMain/eighth', name: 'appMain/eighth', component: eighth
        },
        {
          path: '/appMain/ninth', name: 'appMain/ninth', component: ninth
        },
        {
          path: '/appMain/tenth', name: 'appMain/tenth', component: tenth
        },
        {
          path: '/appMain/eleventh', name: 'appMain/eleventh', component: eleventh
        },
        {
          path: '/appMain/twelfth', name: 'appMain/twelfth', component: twelfth
        },
        {
          path: '/appMain/thirteenth', name: 'appMain/thirteenth', component: thirteenth
        }
      ]
    }
  ]
})
