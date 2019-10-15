<template>
  <!-- 菜单管理 -->
  <div class="menuManage">
    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <!-- 按钮组 -->
      <el-row type="flex" justify="start" class="app-btn-group">
        <el-col :span="24">
          <el-button size="mini" type="primary">添加</el-button>
        </el-col>
      </el-row>
      <!-- 表格table -->
      <el-row class="app-content-table">
        <el-col :span="24">
          <!-- row-key="id" 树形表格时必填 -->
          <el-table
            ref="tableData"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;margin-bottom:20px"
            :max-height="tableHeight"
            row-key="id"
            stripe
            size="medium"
            border
            v-loading="this.$store.state.tableLoading"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="name" label="菜单 / 按钮名称" width="180"></el-table-column>
            <el-table-column label="图标" align="center" width="80">
              <template slot-scope="scope">
                <i class="iconfont table-icon" :class="scope.row.icon"></i>
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型" width="120">
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  :type="scope.row.type == 'a' ? '' : 'success' "
                  effect="dark"
                >{{ scope.row.type == "a" ? "菜单" : '按钮' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="route" label="路由"></el-table-column>
            <el-table-column fixe="right" width="140" align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  circle
                  @click="handleEdit(scope.$index, scope.row)"
                  icon="el-icon-edit"
                ></el-button>
                <el-button
                  size="small"
                  circle
                  type="danger"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <!-- 编辑dialog -->
    <el-dialog custom-class="dialogFormDialog" append-to-body center title="菜单编辑" :visible.sync="dialogFormVisible">
      <el-form :model="dialogForm" :label-width="dialogFormLabelWidth">
        <el-form-item label="菜单按钮名称">
          <el-input v-model="dialogForm.name" clearable autofocus></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" v-show="dialogForm.icon">
          <i class="iconfont table-icon" :class="dialogForm.icon"></i>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-tag
            size="small"
            :type="dialogForm.type == 'a' ? '' : 'success' "
            effect="dark"
          >{{ dialogForm.type == "a" ? "菜单" : '按钮' }}</el-tag>
        </el-form-item>
        <el-form-item label="菜单路由">
          <el-input v-model="dialogForm.route" clearable autofocus></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "menuManage",
  watch: {},
  data() {
    return {
      tableHeight: window.innerHeight - 200, // 表格高度
      tableData: [
        {
          id: 1, // id 唯一
          name: "客户管理",
          icon: "iconziyuan",
          route: "/appMain/customerManage",
          type: "a", // a：菜单，b：按钮 不同的状态码即可
          children: [
            {
              id: 11,
              name: "销售目标",
              icon: "",
              route: "/appMain/systemManage/menuManage",
              type: "a",
              children: [
                {
                  id: 111,
                  name: "销售目标管理",
                  icon: "",
                  route: "/appMain/systemManage/menuManage",
                  type: "a"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          name: "系统管理",
          icon: "iconxitongguanli",
          route: "/appMain/systemManage/systemManage",
          type: "a",
          children: [
            {
              id: 21,
              name: "菜单管理",
              icon: "",
              route: "/appMain/systemManage/menuManage",
              type: "a",
              children: [
                {
                  id: 211,
                  name: "添加",
                  icon: "",
                  route: "",
                  type: "b"
                }
              ]
            },
            {
              id: 22,
              name: "用户管理",
              icon: "",
              route: "/appMain/userManage",
              type: "a"
            }
          ]
        }
      ],
      dialogFormVisible: false, // 编辑dialog
      dialogFormLabelWidth: "120px", // dialog form表单lable宽
      dialogForm: {} // dialog菜单form表单
    };
  },
  methods: {
    // 表格行编辑事件
    handleEdit(index, row) {
      this.dialogFormVisible = true; // 打开dialog
      this.dialogForm = row; // 行数据赋值给弹窗form表单
    },
    // 表格行删除事件
    handleDelete(index, row) {
      this.$confirm("此操不可逆, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑

    // 监听页面高度 赋值给tableHeight
    var self = this;
    window.onresize = () => {
      self.tableHeight = document.body.clientHeight - 200;
    };

    // 获取列表数据
    // let formData = {
    //   userName: this.username,
    //   password: this.password
    // };
    // var url = "http://localhost:3001/api/action/menuManage";
    // this.$axios.post(url,formData).then(res => {
    //   console.log(res.data);
    // })
  }
};
</script>

<style scoped>
.menuManage {
  width: 100%;
  height: 100%;
  position: relative;
}
/* 表格中菜单图标 */
.menuManage .table-icon {
  font-size: 20px;
  color: #38acf8;
  font-weight: 700;
}
.dialogFormDialog .table-icon {
  font-size: 24px;
  color: #38acf8;
  font-weight: 700;
}
</style>
