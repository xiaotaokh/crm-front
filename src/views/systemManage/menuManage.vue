<template>
  <!-- 菜单管理 -->
  <div class="menuManage">
    <app-breadcrumb></app-breadcrumb>
    <!-- 按钮组 -->
    <el-row type="flex" justify="start" class="app-btn-group">
      <el-col :span="24">
        <el-button size="mini" type="primary">添加</el-button>
      </el-col>
    </el-row>
    <el-row class="app-content-table">
      <el-col :span="24">
        <el-table
          :data="tableData"
          style="width: 100%;margin-bottom: 20px;"
          row-key="id"
          border
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="date" label="菜单 / 按钮名称" width="180"></el-table-column>
          <el-table-column prop="name" label="图标" width="80"></el-table-column>
          <el-table-column prop="name" label="路由" width="280"></el-table-column>
          <el-table-column prop="name" label="类型" width="120"></el-table-column>
          <el-table-column prop="address" label="操作"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "menuManage",
  watch: {},
  data() {
    return {
      tableData: [],
    };
  },
  methods: {},
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
  }
};
</script>

<style scoped>
.menuManage {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
