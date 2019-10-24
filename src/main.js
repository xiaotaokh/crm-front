import Vue from 'vue'
import App from './App'
import router from './router'

// 处理element  NavigationDuplicated  错误
import Router from 'vue-router'
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

import '@/assets/styles/main.css' // 全局主样式文件
import '@/assets/styles/media.css' // 响应式布局样式文件
import '@/assets/styles/reset.css' // 全局样式重置

import 'es6-promise/auto' // Vuex依赖 Promise
import Vuex from 'vuex' // Vuex全局状态管理
Vue.use(Vuex)
import store from './store/index' // 引入vuex 全局状态管理js

// 全局函数
import common from './plugin/common' // 引入
Vue.use(common) // 添加

// 时间戳filter
import * as dateFilter from '@/common/filters/index' // 引入时间戳
// 全局注册  时间戳dateFilter
Object.keys(dateFilter).forEach(key => {
  Vue.filter(key, dateFilter[key])
})

// ElementUI
import ElementUI from 'element-ui' // element-ui
import 'element-ui/lib/theme-chalk/index.css' // element-ui css

import 'aigodata-element-theme' // aigo定制element-ui
import '@/assets/styles/theme.css'
Vue.use(ElementUI)

import '@/assets/fonts/iconfont.css' // 阿里图标字体
import '@/assets/fonts/iconfont.js' // 阿里图标字体

// url-loader
import urlLoader from './router'
Vue.use(urlLoader);

// 滑动验证码
import SliderVerificationCode from 'slider-verification-code';
import 'slider-verification-code/lib/slider-verification-code.css';
Vue.use(SliderVerificationCode);

// 图片对照滑动验证码  npm install --save vue-monoplasty-slide-verify   
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);

// axios
import axios from 'axios';
Vue.prototype.$axios = axios; // axios  $为全局请求定义方式
// axios.defaults.baseURL = '/api' // 跨域解决
// axios.defaults.headers.post['Content-Type'] = 'application/json';   // 跨域解决  可以在axios.interceptors.request.use下设置  application/x-www-form-urlencoded;charset=UTF-8
axios.defaults.baseURL = 'http://192.168.3.40:8899/' // url接口地址全局定义    使用跨域解决不打开此行  修改config/index.js即可
// axios.defaults.baseURL = 'http://47.92.153.134:8899/'             // 打包接口地址全局定义    使用跨域解决不打开此行  修改config/index.js即可
axios.defaults.timeout = 3000; // 每次请求间隔时间 3s
// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : "";  // 全局设置请求头 添加token  错误

import Qs from 'qs' // 对post请求parms进行数据格式处理
// axios.defaults.transformRequest = [obj => Qs.stringify(obj)]

// 对axios进行请求拦截处理
axios.interceptors.request.use(config => {
  // 添加token
  let token = sessionStorage.getItem("token");
  if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = token;
  }
  // 设置post请求体parms格式
  if (config.method === 'post') {
    // 如果 请求体为FormData 类型的（例如带文件的请求体），不使用qs去转换
    if(config.data instanceof FormData) {
    }else{
      config.data = Qs.stringify(config.data); // 普通请求体转换请求体格式
    }
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  return config;
}, err => Promise.reject(err));

// 对axios进行响应拦截处理
axios.interceptors.response.use(res => {
  // 拦截所有请求，根据状态码，做出相应处理
  if (res.data && res.data.code == 418) {
    // 状态码 418 表示未登录/token失效，退出系统，跳转到登录页
    sessionStorage.removeItem("token"); // 清除token
    // Vue.prototype.$message({
    //   message: '您长时间未操作，请重新登录！',
    //   type: 'error'
    // });
    router.replace({
      path: '/login',
    })
  } else if (res.data && res.data.code == 403) {
    // 状态码 403 表示权限不足
    Vue.prototype.$message({
      message: res.data.msg,
      type: 'warning'
    });
  }
  return res;
  // }, err => Promise.reject(err));
}, error => {
  if (!error.response) {
    Vue.prototype.$message({
      message: "出错了！",
      type: 'warning'
    });
  }
  if (error.response.status === 404) {
    Vue.prototype.$message({
      message: "404错误！",
      type: 'warning'
    });
  }
  if (error.response.status === 401) {
    Vue.prototype.$message({
      message: "401错误",
      type: 'warning'
    });
  }
  if (error.response.status === 500) {
    Vue.prototype.$message({
      message: "500错误",
      type: 'warning'
    });
  }
  return Promise.resolve(error.response)
})

Vue.config.productionTip = false

import Components from './components';
Vue.use(Components);

new Vue({
  el: '#app',
  router, // 使用router
  store, // 使用store
  components: {
    App
  },
  template: '<App/>'
})
