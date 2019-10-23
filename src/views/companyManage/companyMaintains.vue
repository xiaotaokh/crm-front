<template>
  <!-- 公司维护 -->
  <div class="companyMaintains">
    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <!-- 新增 / 修改-->
      <div class="companyMaintainsForm">
        <el-form
          :model="companyMaintainsForm"
          :label-width="companyMaintainsFormLabelWidth"
          :rules="companyMaintainsFormRules"
          ref="companyMaintainsForm"
        >
          <el-form-item label="菜单 / 按钮名称：" prop="name">
            <el-input v-model="companyMaintainsForm.name" placeholder="请输入菜单 / 按钮名称.." clearable></el-input>
          </el-form-item>
          <el-form-item label="菜单图标：" v-show="companyMaintainsForm.resIcon">
            <i class="iconfont table-icon" :class="companyMaintainsForm.resIcon"></i>
          </el-form-item>
          <el-form-item label="菜单类型：">
            <el-tag
              size="small"
              :type="companyMaintainsForm.type == 1 ? '' : 'success' "
              effect="dark"
            >{{ companyMaintainsForm.type == 1 ? "菜单" : '按钮' }}</el-tag>
          </el-form-item>
          <el-form-item label="路由地址：" prop="url">
            <el-input v-model="companyMaintainsForm.url" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-switch
              v-model="companyMaintainsForm.status"
              @change="menuStatus"
              active-value="ACTIVE"
              inactive-value="DEL"
              active-text="启用"
              inactive-text="禁用"
            ></el-switch>
          </el-form-item>
          <el-form-item label="描述：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入描述.."
              v-model="companyMaintainsForm.content"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "companyMaintains",
  watch: {},
  data() {
    return {
      companyMaintainsForm:{},
      companyMaintainsFormLabelWidth:"140px",
      companyMaintainsFormRules:{},

    };
  },
  methods: {},
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
  }
};
</script>

<style scoped>
.companyMaintains {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
.companyMaintains .companyMaintainsForm {
  padding: 10px;
  width: 600px;
  overflow: auto;
}
</style>
