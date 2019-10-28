<template>
  <!-- 销售目标统计 -->
  <div class="salesTargetStatistic">
    <app-breadcrumb></app-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'salesTargetStatistic',
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
.salesTargetStatistic {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
