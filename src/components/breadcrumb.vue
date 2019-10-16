<template>
  <!-- 面包屑 -->
  <div class="breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- 通过路由meta属性记录，得到当前路由下所有的路径地址以及菜单名称  this.$route.matched -->
      <el-breadcrumb-item v-for="(item,index) in breadcrumb" :key="index" :to="{ path: item.path }">{{ item.meta }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "breadcrumb",
  watch: {},
  data() {
    return {
      breadcrumb:[],   // 面包屑
    };
  },
  methods: {},
  mounted() {
    setTimeout(()=>{
      this.breadcrumb = this.$store.getters.getBreadcrumb;   // 全局获取面包屑   因为同步，设置延迟器
    })
  }
};
</script>

<style scoped>
.breadcrumb {
  width: 100%;
  height: 40px;
  position: relative;
  padding: 13px 0 0 10px;
  border-bottom: 1px solid #eaeaea;
}
</style>
