import Vue from 'vue'
import App from './App'
import router from './router'

import ElementUI from 'element-ui'  // element-ui
import 'element-ui/lib/theme-chalk/index.css'  // element-ui css

import '@/assets/styles/reset.css'							// 重置样式
import '@/assets/fonts/iconfont.css'						// 图标字体
import '@/assets/fonts/iconfont.js'						// 图标字体

import 'aigodata-element-theme'                // 定制element-ui
import '@/assets/styles/theme.css'
Vue.use(ElementUI)

import SliderVerificationCode from 'slider-verification-code';    // 滑动验证码
import 'slider-verification-code/lib/slider-verification-code.css';
Vue.use(SliderVerificationCode);

// npm install --save vue-monoplasty-slide-verify   // 图片滑动验证码
import SlideVerify from 'vue-monoplasty-slide-verify';
Vue.use(SlideVerify);

import '@/assets/styles/theme.css'   // 主样式文件

// axios
import axios from 'axios';
Vue.prototype.$axios = axios;  // axios  $为全局请求定义方式
axios.defaults.baseURL = '/api'          // 跨域解决
// axios.defaults.headers.post['Content-Type'] = 'application/json';   // 跨域解决  可以在axios.interceptors.request.us下设置
// axios.defaults.baseURL = 'http://192.168.3.40:8099/'             // url接口地址全局定义    使用跨域解决不打开此行  修改config/index.js即可
axios.defaults.timeout = 3000;  // 每次请求间隔时间 3s
axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : '';  // 全局设置请求头 添加token

import Qs from 'qs'     // 对post请求parms进行数据格式处理
// axios.defaults.transformRequest = [obj => Qs.stringify(obj)]
// 对axios进行拦截处理，设置parms格式以及请求头
axios.interceptors.request.use(config => {
  if (config.method === "post") {
      config.data = Qs.stringify(config.data);  // 转换请求体格式
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  }
  return config;
}, err => Promise.reject(err));
 

Vue.config.productionTip = false

import Components from './components'; 
Vue.use(Components);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})


// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';  // 跨域解决option问题

//Axios请求拦截器 设置 token
// axios.interceptors.request.use(config => {
//   let token = sessionStorage.getItem("token");
//   if (token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
//       config.headers.Authorization = token;
//       console.log('interceptors config=',config)
//   }
//   return config
// }, error => {
//   return Promise.reject(error)
// })

// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'   // 没用到