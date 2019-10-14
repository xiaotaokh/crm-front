<template>
  <!-- 销售目标管理 -->
  <div class="salesTargetManage">
    <app-breadcrumb></app-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "salesTargetManage",
  watch: {},
  data() {
    return {};
  },
  methods: {},
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
