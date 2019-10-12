<template>
  <!-- 面包屑 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/appMain/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/appMain/systemManage/systemManage' }">系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "breadcrumb",
  watch: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped>
.breadcrumb {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
