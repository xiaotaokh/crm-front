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
          <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
          <el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
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
      tableData: [
        {
          id: 1,
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
          children: [
            {
              id: 11,
              date: "2016-05-01",
              name: "王小虎",
              address: "上海市普陀区金沙江路 1519 弄",
              children: [
                {
                  id: 111,
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1519 弄"
                },
                {
                  id: 112,
                  date: "2016-05-01",
                  name: "王小虎",
                  address: "上海市普陀区金沙江路 1519 弄"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
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
