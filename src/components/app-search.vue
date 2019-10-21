<template>
  <div class="app-search">
    <!-- 搜索 -->
    <el-row type="flex" justify="start">
      <el-col :span="24">
        <slot></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "app-search",
  props: [],
  computed: {},
  watch: {},
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
/* 搜索 */
.app-search {
  width: 100%;
  padding: 10px 0 0 10px;
}
</style>
