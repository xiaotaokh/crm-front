<template>
  <!-- 角色管理 -->
  <div class="roleManage">
    <app-breadcrumb></app-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'roleManage',
  watch: {
      
  },
  data () {
    return {
        
    }
  },
  methods: {
    
  },
  mounted(){
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
  }
}
</script>

<style scoped>
.roleManage {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
