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
            style="width: 100%;margin-bottom:20px table-layout:fixed"
            :max-height="tableHeight"
            row-key="id"
            stripe
            size="medium"
            border
            v-loading="this.$store.state.tableLoading"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="navName" label="菜单 / 按钮名称" width="180"></el-table-column>
            <el-table-column label="图标" align="center" width="80">
              <template slot-scope="scope">
                <i class="iconfont table-icon" :class="scope.row.icon"></i>
              </template>
            </el-table-column>
            <el-table-column align="center" label="类型" width="120">
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  :type="scope.row.type == 1 ? '' : 'success' "
                  effect="dark"
                >{{ scope.row.type == 1 ? "菜单" : '按钮' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="路由地址" width="280" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.route }}</template>
            </el-table-column>
            <el-table-column label="菜单说明">
              <template slot-scope="scope">{{ scope.row.content }}</template>
            </el-table-column>
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
    <el-dialog
      custom-class="dialogFormDialog"
      append-to-body
      center
      title="编辑菜单"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="dialogForm" :label-width="dialogFormLabelWidth">
        <el-form-item label="菜单 / 按钮名称：">
          <el-input v-model="dialogForm.name" placeholder="请输入菜单 / 按钮名称.." clearable autofocus></el-input>
        </el-form-item>
        <el-form-item label="菜单图标：" v-show="dialogForm.resIcon">
          <i class="iconfont table-icon" :class="dialogForm.resIcon"></i>
        </el-form-item>
        <el-form-item label="菜单类型：">
          <el-tag
            size="small"
            :type="dialogForm.type == 1 ? '' : 'success' "
            effect="dark"
          >{{ dialogForm.type == 1 ? "菜单" : '按钮' }}</el-tag>
        </el-form-item>
        <el-form-item label="路由地址：" v-show="dialogForm.url">
          <el-input v-model="dialogForm.url" clearable autofocus></el-input>
        </el-form-item>
        <el-form-item label="说明：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入说明.."
            v-model="dialogForm.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="dialogFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogFormSubmit">确 定</el-button>
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
      tableData: [],
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
      var url = "menu/getResourcesById";
      let formData = {
        id: row.id
      };
      this.$axios.post(url, formData).then(res => {
        this.dialogForm = res.data.data;
      });
    },
    // 表格行删除事件
    handleDelete(index, row) {
      this.$confirm("此操不可逆, 是否继续?", "删除菜单", {
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
            message: "已取消删除!"
          });
        });
    },
    // 表格dialog确定
    dialogFormSubmit() {
      this.dialogFormVisible = false;
      this.$message({
        type: "success",
        message: "菜单修改成功!"
      });
    },
    // 表格dialog取消
    dialogFormCancle() {
      this.dialogFormVisible = false;
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
    let formData = {
      userName: this.username,
      password: this.password
    };
    var url = "menu/getAll";
    this.$axios.post(url, formData).then(res => {
      this.tableData = res.data.data;
      // console.log(this.tableData)
    });
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
