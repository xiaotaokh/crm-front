# 项目名称：crm-front (国威永耀crm平台)

> 

## 打包Build、运行Setup

**使用教程**：

``` bash
# 安装
npm install

# 服务与热更新  本地主机端口:8080
npm run dev

# 打包发布
npm run build

# 为生产构建并查看bundle analyzer报告
npm run build --report
```

**项目简介**：

> 公司crm管理平台。



**全局方法**
- mixins/index.js

```javascript
// 例如：全局获取当前用户信息
this.getUserInformationGlobal();
```

**axios请求拦截**
- min.js

```javascript
// 对axios进行请求拦截处理  
axios.interceptors.request.use(config => {
  // 添加token
  let token = localStorage.getItem("token");
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
```
```javascript
// 对axios进行响应拦截处理
axios.interceptors.response.use(res => {
  // 拦截所有请求，根据状态码，做出相应处理
  if (res.data && res.data.code == 418) {
    // 状态码 418 表示未登录/token失效，退出系统，跳转到登录页
    localStorage.removeItem("token"); // 清除token
    // Vue.prototype.$message({
    //   message: '您长时间未操作，请重新登录！',
    //   type: 'warning'
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
      message: "后台接口访问失败！",
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
```

**跨域拦截处理：**
- config/index.js
```javascript
// 跨域拦截请求   设置跨域重启项目(npm start)
proxyTable: {
    '/api': {
    // target: "http://47.92.153.134:8899/", // 打包接口地址
    target: "http://192.168.3.40:8899/", // 本地后台接口地址
    pathRewrite: {
        '^/api': ''
    }
    }
},
```

**插件js文件**
- plugin/xx.js

    省市县三级联动在select_area.js里面

**静态文件**
- /assets

    iconfont在assets/fonts里面
    
**面包屑**
```javascript
this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
```

**监听页面变化，修改表格高度**
```javascript
this.globalListenHeight(); // 监听页面变化，修改表格高度
```