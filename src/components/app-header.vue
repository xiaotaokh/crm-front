<template>
  <div class="app-header">
    <div class="logo">
      <img src="../assets/logo.png" alt="">
    </div>
    <div class="header-right">
      <div class="search">
        <el-input placeholder="请输入您想要查询的关键字" v-model="headerSearch">
          <el-button class="search-btn" type="primary" slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="header">
      <!-- <i class="iconfont icondaohang"></i> -->
    </div>
    <!-- <router-link to="/appMain/index">
      <el-tooltip class="item" effect="dark" content="返回首页" placement="left">
        <el-button type="text" size="mini" circle><i class="iconfont icon-iconfontzhizuobiaozhun023101"></i>首页</el-button>
      </el-tooltip>
    </router-link>-->
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
  methods: {}
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
.app-header .logo img{
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
.app-header .header-right .search {
  width: 320px;
  margin-left: 100px;
}
.app-header .header-right .el-input-group__append button.el-button {
  color: #fff;
}
</style>
