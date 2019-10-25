<template>
  <!-- 公司管理 -->
  <div class="companyManage">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "companyManage",
  watch: {},
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  },
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
