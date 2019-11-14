<template>
  <!-- 销售目标管理 -->
  <div class="salesTargetManage">
    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <el-button type="primary" @click="push">点我</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "salesTargetManage",
  watch: {},
  data() {
    return {
      id: 1243
    };
  },
  methods: {
    push() {
      // params
      // this.$router.push({
      //   name: "appMain/customerManage/salesTarget/salesTargetManage_router",
      //   params: {
      //     id: this.id
      //   }
      // });
      // query
      // this.$router.push({
      //   path: "/appMain/customerManage/salesTarget/salesTargetManage_router",
      //   query: {
      //     id: this.id
      //   }
      // });
      // 不存在历史记录
      // this.$router.replace({
      //   path: "/appMain/customerManage/salesTarget/salesTargetManage_router"
      // });
    }
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
  }
};
</script>

<style scoped>
.salesTargetManage {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
