<template>
  <!-- 返回 -->
  <div class="app-back">
    <el-tooltip class="item" effect="dark" content="返回" placement="top">
      <router-link :to="appBackPath">
        <el-button type="text">
          <i class="iconfont iconfanhui"></i>
        </el-button>
      </router-link>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: "app-back",
  props: [
    "appBackPath" // 返回路径 appBackPath
  ],
  watch: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped>
.app-back {
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
  padding: 0 0 0 10px;
  border-bottom: 1px solid #eaeaea;
}
.app-back .iconfanhui {
  font-size: 20px;
}
</style>
