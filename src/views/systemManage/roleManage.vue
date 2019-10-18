<template>
  <!-- 角色管理 -->
  <div class="roleManage">
    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <!-- 按钮组 -->
      <el-row type="flex" justify="start" class="app-btn-group">
        <el-col :span="24">
          <el-button size="mini" type="primary" @click="add">添加</el-button>
          <el-button size="mini" type="primary" @click="add">批量启用</el-button>
          <el-button size="mini" type="warning" @click="add">批量禁用</el-button>
          <el-button size="mini" type="danger" @click="add">批量删除</el-button>
        </el-col>
      </el-row>
      <!-- 表格table -->
      <el-row class="app-content-table">
        <el-col :span="24">
          <el-table
            ref="tableData"
            class="tableData"
            :data="this.$store.state.postTableData.data"
            style="width: 100%; table-layout:fixed"
            :max-height="tableHeight"
            stripe
            size="medium"
            border
            v-loading="this.$store.state.tableLoading"
          >
            <el-table-column align="center" fixed type="selection" width="60"></el-table-column>
            <el-table-column align="center" fixed type="index" width="60"></el-table-column>
            <el-table-column align="center" fixed label="角色名称" width="180">
              <template slot-scope="scope">{{ scope.row.role }}</template>
            </el-table-column>
            <el-table-column label="授权状态 / 授权" align="center" width="260">
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  :type="scope.row.typeStatus == '1' ? 'success' : 'warning' "
                  effect="dark"
                >{{ scope.row.typeStatus == '1' ? "已授权" : '未授权' }}</el-tag>
                <el-tooltip effect="dark" content="修改授权状态" placement="top">
                  <el-button
                    type="text"
                    class="auth-btn"
                    @click="handleDelete(scope.$index, scope.row)"
                  >授权</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="160">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  @change="menuStatus(scope.$index, scope.row)"
                  active-value="ACTIVE"
                  inactive-value="DEL"
                  active-text="启用"
                  inactive-text="禁用"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="180">
              <template slot-scope="scope">{{ scope.row.createAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="修改时间" width="180">
              <template slot-scope="scope">{{ scope.row.updateAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column label="备注" min-width="180">
              <template slot-scope="scope">{{ scope.row.note }}</template>
            </el-table-column>
            <el-table-column fixed="right" width="140" align="center" label="操作">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                    circle
                    icon="el-icon-edit"
                  ></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top">
                  <el-button
                    size="small"
                    circle
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <!-- 添加dialog -->
    <el-dialog
      append-to-body
      center
      title="添加角色"
      :visible.sync="addDialogForm.addDialogFormVisible"
    >
      <el-form
        :model="addDialogForm"
        ref="addDialogForm"
        :label-width="addDialogForm.addDialogFormLabelWidth"
        :rules="addDialogForm.addDialogFormRules"
      >
        <el-form-item label="角色名称：" prop="role">
          <el-input v-model="addDialogForm.role" placeholder="请输入角色名称" clearable autofocus="true"></el-input>
        </el-form-item>
        <el-form-item label="角色状态：" prop="status">
          <el-switch
            v-model="addDialogForm.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="ACTIVE"
            inactive-value="DEL"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="addDialogForm.note" placeholder="请输入备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="addDialogFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="addDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑dialog -->
    <el-dialog
      append-to-body
      center
      title="编辑角色"
      :visible.sync="editDialogForm.editDialogFormVisible"
    >
      <el-form
        :model="editDialogForm"
        :label-width="editDialogForm.editDialogFormLabelWidth"
        :rules="editDialogForm.editDialogFormRules"
        ref="editDialogForm"
      >
        <el-form-item label="角色名称：" prop="role">
          <el-input
            v-model="editDialogForm.editDialogFormData.role"
            placeholder="请输入角色名称"
            clearable
            autofocus="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色状态：" prop="status">
          <el-switch
            v-model="editDialogForm.editDialogFormData.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="ACTIVE"
            inactive-value="DEL"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="editDialogForm.editDialogFormData.note" placeholder="请输入备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="editDialogFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="editDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "roleManage",
  watch: {},
  data() {
    return {
      tableHeight: window.innerHeight - 200, // 表格高度
      // 添加dialog form
      addDialogForm: {
        addDialogFormVisible: false,
        addDialogFormLabelWidth: "140px",
        role: "",
        status: "ACTIVE",
        note: "",
        addDialogFormRules: {
          role: [
            {
              required: true,
              message: "请输入角色名称",
              trigger: "blur"
            }
          ]
        }
      },
      // 编辑dialog form
      editDialogForm: {
        editDialogFormVisible: false,
        editDialogFormLabelWidth: "140px",
        // 编辑菜单弹窗form表单校验规则
        editDialogFormRules: {
          role: [
            {
              required: true,
              message: "请输入角色名称",
              trigger: "blur"
            }
          ]
        },
        editDialogFormData: {} // 存放 根据id获取到的行信息
      }
    };
  },
  methods: {
    // 添加
    add() {
      this.addDialogForm.addDialogFormVisible = true;
    },
    // 表格行编辑事件
    handleEdit(index, row) {
      this.editDialogForm.editDialogFormVisible = true; // 打开dialog
      this.editDialogForm.editDialogFormData = row; // 行数据赋值给弹窗form表单
      var url = "roles/getRolesById";
      let formData = {
        id: row.id
      };
      this.$axios.post(url, formData).then(res => {
        this.editDialogForm.editDialogFormData = res.data.data;
      });
    },
    // 表格行编辑确定
    editDialogFormSubmit() {
      // console.log(this.editDialogForm.editDialogFormData)
      var url = "roles/updateRolesById";
      this.$refs.editDialogForm.validate(valid => {
        if (valid) {
          this.$axios.post(url, this.editDialogForm.editDialogFormData).then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            }
            this.editDialogForm.editDialogFormVisible = false;
            this.getTableData(); // 重置表单数据
          });
        } else {
          this.$message({
            type: "warning",
            message: "请先填写必填项!"
          });
          return false;
        }
      });
    },
    // 表格行编辑取消
    editDialogFormCancle() {
      this.editDialogForm.editDialogFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消编辑!"
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
          let url = "roles/delById";
          let formData = {
            id: row.id
          };
          this.$axios
            .post(url, formData)
            .then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
              }
              this.getTableData();
            })
            .catch(err => {
              this.$message({
                type: "error",
                message: res.data.msg
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除!"
          });
        });
    },
    // 表格switch事件
    menuStatus(index, row) {
      let url = "roles/updateStatusById";
      let formData = {
        id: row.id,
        status: row.status
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: res.data.msg
            });
          }
          this.getTableData();
        })
        .catch(err => {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        });
    },
    // 添加取消
    addDialogFormCancle() {
      this.addDialogForm.addDialogFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消添加!"
      });
      this.addReset();
    },
    // 添加确定
    addDialogFormSubmit() {
      var url = "roles/addRoles";
      let formData = {
        note: this.addDialogForm.note,
        role: this.addDialogForm.role,
        status: this.addDialogForm.status
      };
      this.$refs.addDialogForm.validate(valid => {
        if (valid) {
          this.$axios.post(url, formData).then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            }
            this.addDialogForm.addDialogFormVisible = false;
            this.addReset();
            this.getTableData(); // 重置表单数据
          });
        } else {
          this.$message({
            type: "warning",
            message: "请先填写必填项!"
          });
          return false;
        }
      });
    },
    // 添加表单重置
    addReset() {
      this.addDialogForm.note = "";
      this.addDialogForm.role = "";
      this.addDialogForm.status = "ACTIVE";
    },
    // 获取表格数据
    getTableData() {
      // 获取表格数据
      var url = "roles/getAll";
      let formData = {};
      this.$store.dispatch("postTableData", url, formData);
    }
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑

    // 监听页面高度 赋值给tableHeight
    var self = this;
    window.onresize = () => {
      self.tableHeight = document.body.clientHeight - 200;
    };

    // 获取表格数据
    this.getTableData();
  }
};
</script>

<style scoped>
.roleManage {
  width: 100%;
  height: 100%;
  position: relative;
}
/* 授权按钮 */
.roleManage .tableData .el-table__row .cell {
  position: relative;
}
.roleManage .tableData .el-table__row .cell .auth-btn {
  position: absolute;
  top: 20px;
  right: 15px;
}
</style>
