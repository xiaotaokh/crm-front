<template>
  <!-- 用户管理 -->
  <div class="userManage">
    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <!-- 搜索 -->
      <app-search>
        <el-form
          @submit.native.prevent
          size="small"
          :inline="true"
          ref="searchForm"
          :model="searchForm"
          label-width="80px"
        >
          <el-form-item label="角色名称：">
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入角色名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </app-search>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userManage',
  watch: {
      
  },
  data () {
    return {
      // 搜索
      searchForm: {
        name: ""
      },
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
