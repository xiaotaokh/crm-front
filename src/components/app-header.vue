<template>
  <div class="app-header">
    <div class="logo">
      <img src="../assets/logo.png" alt />
    </div>
    <div class="header-right clearfix">
      <!-- 搜索框 -->
      <div class="search">
        <el-input placeholder="请输入您想要查询的关键词..." v-model="headerSearch" clearable>
          <el-button class="search-btn" type="primary" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
      <ul class="clearfix">
        <!-- 通知 -->
        <li>
          <el-badge :value="10" class="item" :max="99" type="success">
            <el-button type="text" class="notice">
              <i class="iconfont icongonggao"></i>
            </el-button>
          </el-badge>
        </li>
        <!-- 邮件 -->
        <li>
          <el-badge :value="999" class="item" :max="99">
            <el-button type="text" class="email">
              <i class="iconfont iconyouxiang"></i>
            </el-button>
          </el-badge>
        </li>
        <li>
          <router-link to="/appMain">
            <!-- <el-tooltip class="item" effect="dark" content="返回首页" placement="left"> -->
            <el-button type="text" class="returnHome">
              <i class="iconfont iconiconfontzhizuobiaozhun023101"></i>
            </el-button>
            <!-- </el-tooltip> -->
          </router-link>
        </li>
        <li>
          <el-button type="text" class="exitOut" @click="exit">
            <i class="iconfont icon084tuichu"></i>
          </el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "app-header",
  computed: {},
  data() {
    return {
      headerSearch: ""
    };
  },
  methods: {
    exit() {
      // 向后台发送请求获取查询结果数据
      var url = "logout";
      this.$axios
        .post(url)
        .then(res => {
          this.$message({
            message: "退出成功",
            type: "success"
          });
          sessionStorage.removeItem("token"); // 清除token
          this.$router.push({ path: "/login" }); // 跳转页面
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 60px;
  position: relative;
}
.app-header .logo {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  height: 60px;
}
.app-header .logo img {
  width: 240px;
  height: 60px;
}
.app-header .header-right {
  width: calc(100% - 240px);
  position: absolute;
  left: 240px;
  top: 0;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.app-header .header-right > div {
  float: left;
}
.app-header .header-right .search {
  width: 320px;
  margin-left: 100px;
  float: left;
}
.app-header .header-right ul {
  float: right;
}
.app-header .header-right ul li {
  float: left;
  margin: 0 40px 0 0;
}
/* 搜索框 */
.app-header .header-right .el-input-group__append button.el-button {
  color: #fff;
}
/* 通知 */
.app-header .header-right .notice i {
  font-size: 24px;
}
/* 邮件 */
.app-header .header-right .email i {
  font-size: 22px;
}
/* 主页 */
.app-header .header-right .returnHome i {
  font-size: 24px;
}
/* 退出 */
.app-header .header-right .exitOut i {
  font-size: 20px;
}
</style>
