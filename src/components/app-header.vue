<template>
  <div class="app-header">
    <div class="header">
      <!-- <i class="iconfont icondaohang"></i> -->
    </div>
    <router-link to="/appMain/index">
      <el-tooltip class="item" effect="dark" content="返回首页" placement="left">
        <el-button type="text" size="mini" circle><i class="iconfont icon-iconfontzhizuobiaozhun023101"></i>首页</el-button>
      </el-tooltip>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: "app-header",
    computed: {
      
    },
    data() {
      return {
        
      };
    },
    methods: {
      
    }
  };
</script>

<style>
  .app-header {
    position: relative;
  }
  .app-header .header {
    font-size: 20px;
    font-weight: 700;
    text-align: center;
    height: 60px;
    line-height: 60px;
    font-family: 'Avenir';
    color: #0fc2d6;
  }
  .app-header .el-button {
    position: absolute;
    top: 5px;
    right: 20px;
  }
</style>
