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



**全局表格post请求:**

```javascript
var url = "menu/getAll";
let formData = {};
this.$store.dispatch("postTableData",url,formData);
```

**post返回参数数据:**

```javascript
this.$store.state.postTableData
```



