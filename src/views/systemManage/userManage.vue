<template>
  <!-- 用户管理 -->
  <div class="userManage">
    <app-breadcrumb></app-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'userManage',
  watch: {
      
  },
  data () {
    return {
        
    }
  },
  methods: {
    
  },
  mounted(){
    this.$store.commit("editBreadcrumb", this.$route.matched);  // 面包屑
  }
}
</script>

<style scoped>
.userManage {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
