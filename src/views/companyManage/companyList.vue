<template>
  <!-- 公司列表 -->
  <div class="companyList">
    <app-breadcrumb></app-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'companyList',
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
.companyList {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
</style>
