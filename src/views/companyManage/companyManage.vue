<template>
  <!-- 公司管理 -->
  <div class="companyManage">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "companyManage",
  watch: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped>
.companyManage {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
</style>
