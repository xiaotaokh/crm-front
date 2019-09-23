<template>
  <div class="app-sidebar">
    <el-menu style="height:100%" :default-openeds="['1']">
      <el-submenu index="1">
        <template slot="title"><i class="iconfont icon-daohang" style="color:#000"></i>&nbsp;导航栏</template>
        <router-link to="/appMain/figure"><el-menu-item index="1-0">数据分析图</el-menu-item></router-link>
        <router-link to="/appMain/first"><el-menu-item index="1-1">1县（村）基本信息表</el-menu-item></router-link>
        <router-link to="/appMain/second"><el-menu-item index="1-2">2村贫困信息表</el-menu-item></router-link>
        <router-link to="/appMain/third"><el-menu-item index="1-3">3产业基地信息表</el-menu-item></router-link>
        <router-link to="/appMain/fifth"><el-menu-item index="1-5">4产业信息表</el-menu-item></router-link>
        <router-link to="/appMain/eleventh"><el-menu-item index="1-11">5特色产业规模信息表</el-menu-item></router-link>
        <router-link to="/appMain/twelfth"><el-menu-item index="1-12">6县贫困信息表</el-menu-item></router-link>
        <router-link to="/appMain/eighth"><el-menu-item index="1-8">7公司（专业合作社）信息表</el-menu-item></router-link>
        <router-link to="/appMain/seventh"><el-menu-item index="1-7">8公司规模及带动贫困户情况表</el-menu-item></router-link>
        <router-link to="/appMain/sixth"><el-menu-item index="1-6">9个人基本信息表</el-menu-item></router-link>
        <router-link to="/appMain/thirteenth"><el-menu-item index="1-13">10致富带头人信息表</el-menu-item></router-link>
        <router-link to="/appMain/fourth"><el-menu-item index="1-4">11创业项目收益表</el-menu-item></router-link>
        <router-link to="/appMain/tenth"><el-menu-item index="1-10">12户主家庭情况2</el-menu-item></router-link>
        <router-link to="/appMain/ninth"><el-menu-item index="1-9">13户主家庭情况1</el-menu-item></router-link>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "app-sidebar",
    computed: {
      
    },
    data() {
      return {
        
      };
    },
    methods: {
      
    }
  };
</script>

<style>
  
</style>
