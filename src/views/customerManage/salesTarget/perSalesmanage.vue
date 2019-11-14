<template>
  <!-- 个人目标管理 -->
  <div class="perSalesmanage">
    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      
    </div>
  </div>
</template>

<script>
export default {
  name: "perSalesmanage",
  watch: {},
  data() {
    return {
      id: 1243
    };
  },
  methods: {
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
  }
};
</script>

<style scoped>
.perSalesmanage {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
