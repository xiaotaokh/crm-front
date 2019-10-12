<template>
  <!-- 菜单管理 -->
  <div class="menuManage">
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark"></div></el-col>
    </el-row>
    <app-breadcrumb></app-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'menuManage',
  watch: {
      
  },
  data () {
    return {
        
    }
  },
  methods: {
    
  },
  mounted(){
    this.$store.dispatch('addStore');
  }
}
</script>

<style scoped>
.menuManage {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
