<template>
  <!-- 公司列表 -->
  <div class="companyList">
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
          <el-form-item label="公司名称：">
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入公司名称"
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
import { myMixins } from "@/mixins/index";
export default {
  mixins: [myMixins],
  name: 'companyList',
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
    // 搜索
    searchSubmit() {
      this.globalSearchUrl = "roles/findRolesByName";
      this.globalSearchFormData = {
        role: this.searchForm.name
      };
      this.searchSubmitGlobal();
    },
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
