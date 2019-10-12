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

import axios from 'axios';   // axios
Vue.prototype.$axios = axios;  // axios  $为全局请求定义方式
// axios.defaults.baseURL = 'http://47.92.153.134:8911/nanning/'             // url接口地址全局定义
axios.defaults.baseURL = 'http://192.168.3.40:8099/'             // url接口地址全局定义
// 全局设置请求头token
axios.defaults.headers.common['Authorization'] = sessionStorage.getItem("token") ? sessionStorage.getItem("token") : '';


// axios.defaults.headers.post['Content-Type'] = 'application/json';

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
