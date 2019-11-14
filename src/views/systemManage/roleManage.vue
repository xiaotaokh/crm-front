<template>
  <!-- 角色管理 -->
  <div class="roleManage">
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
      <!-- 按钮组 -->
      <el-row type="flex" justify="start" class="app-btn-group">
        <el-col :span="24">
          <el-button size="mini" type="primary" @click="add">添加</el-button>
          <el-button size="mini" type="primary" @click="batchStart">批量启用</el-button>
          <el-button size="mini" type="warning" @click="batchDisable">批量禁用</el-button>
          <el-button size="mini" type="danger" @click="batchDel">批量删除</el-button>
        </el-col>
      </el-row>
      <!-- 表格table -->
      <el-row class="app-content-table">
        <el-col :span="24">
          <el-table
            ref="tableData"
            class="tableData"
            :data="globalTableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
            style="width: 100%; table-layout:fixed"
            :max-height="tableHeight"
            stripe
            size="medium"
            border
            row-key="id"
            @selection-change="handleSelectionChange"
            :default-sort="{prop: 'createAt', order: 'ascending'}"
            v-loading="globalTableLoading"
          >
            <el-table-column
              align="center"
              fixed
              type="selection"
              width="60"
              :reserve-selection="true"
            ></el-table-column>
            <el-table-column label="序号" width="80" align="center">
              <template slot-scope="scope">
                <span>{{scope.$index+(currentPage - 1) * PageSize + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="角色名称" width="160" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.role }}</template>
            </el-table-column>
            <el-table-column label="授权状态 / 授权" align="center" width="200">
              <template slot-scope="scope">
                <el-tag
                  size="mini"
                  :type="scope.row.typeStatus == '1' ? 'success' : 'warning' "
                  effect="dark"
                >{{ scope.row.typeStatus == '1' ? "已授权" : '未授权' }}</el-tag>
                <el-tooltip effect="dark" content="角色授权" placement="top">
                  <el-button
                    type="text"
                    class="auth-btn"
                    @click="handleAuth(scope.$index, scope.row)"
                  >授权</el-button>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="180">
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
            <el-table-column align="center" label="创建时间" width="180" prop="createAt" sortable>
              <template slot-scope="scope">{{ scope.row.createAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="修改时间" width="180">
              <template slot-scope="scope">{{ scope.row.updateAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column label="备注" min-width="180" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.note }}</template>
            </el-table-column>
            <el-table-column fixed="right" width="120" align="center" label="操作">
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
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="PageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      ></el-pagination>
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
      :title="editDialogForm.role"
      :visible.sync="editDialogForm.editDialogFormVisible"
    >
      <el-form
        :model="editDialogForm"
        :label-width="editDialogForm.editDialogFormLabelWidth"
        :rules="editDialogForm.editDialogFormRules"
        ref="editDialogForm"
      >
        <el-form-item label="角色名称：" prop="role">
          <el-input v-model="editDialogForm.role" placeholder="请输入角色名称" clearable autofocus="true"></el-input>
        </el-form-item>
        <el-form-item label="角色状态：" prop="status">
          <el-switch
            v-model="editDialogForm.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="ACTIVE"
            inactive-value="DEL"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="editDialogForm.note" placeholder="请输入备注" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="editDialogFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="editDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 授权dialog -->
    <el-dialog append-to-body center :title="rowRole" :visible.sync="authForm.authFormVisible">
      <el-form :model="authForm" ref="authForm" :label-width="authForm.authFormLabelWidth">
        <el-form-item label="请点击授权项授权：">
          <el-tree
            :data="authForm.authFormData"
            :check-strictly="authForm.checkStrictly"
            show-checkbox
            node-key="id"
            @node-click="nodeClick"
            @check="nodeClick"
            :default-expanded-keys="authForm.authFormDefaultKey"
            :default-checked-keys="authForm.authFormDefaultKey"
            :props="authForm.defaultProps"
            ref="authFormTree"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="authFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="authFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myMixins } from "@/mixins/index";
export default {
  mixins: [myMixins],
  name: "roleManage",
  watch: {},
  data() {
    return {
      // 搜索
      searchForm: {
        name: ""
      },
      tableRowId: "", // 用于授权dialog请求使用  表格行Id

      tableHeight: window.innerHeight - 300, // 表格高度
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
        role: "",
        status: "",
        note: "",
        editDialogFormData: {} // 存放 根据id获取到的行信息
      },
      multipleSelection: [], // 存放表格选中项信息
      ids: "", // 存放表格选中项id
      rowRole: "", // 存放当前行名称
      // 授权form
      authForm: {
        authFormData: [],
        authFormLabelWidth: "140px",
        authFormVisible: false,
        // 授权的默认字段
        defaultProps: {
          children: "children",
          label: "navName"
        },
        authFormDefaultKey: [], // 默认展开字段
        checkStrictly: false // 默认父子是否联动    设置不联动状态下为true
      },
      // 默认显示第一条
      currentPage: 1
    };
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
        this.editDialogForm.role = res.data.data.role;
        this.editDialogForm.status = res.data.data.status;
        this.editDialogForm.note = res.data.data.note;
      });
    },
    // 表格行编辑确定
    editDialogFormSubmit() {
      var url = "roles/updateRolesById";
      // 把form表单值放在请求体里
      this.editDialogForm.editDialogFormData.role = this.editDialogForm.role;
      this.editDialogForm.editDialogFormData.status = this.editDialogForm.status;
      this.editDialogForm.editDialogFormData.note = this.editDialogForm.note;
      this.$refs.editDialogForm.validate(valid => {
        if (valid) {
          this.$axios
            .post(url, this.editDialogForm.editDialogFormData)
            .then(res => {
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
      this.globalDeleteUrl = "roles/delById";
      this.globalDeleteFormData = {
        id: row.id
      };
      this.handleDeleteGlobal();
    },
    // 表格switch事件
    menuStatus(index, row) {
      this.globalMenuStatusUrl = "roles/updateStatusById";
      this.globalMenuStatusFormData = {
        id: row.id,
        status: row.status
      };
      this.globalMenuStatus();
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
    // 获取表格选中项信息
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量启用
    batchStart() {
      if (this.multipleSelection.length != 0) {
        for (var i of this.multipleSelection) {
          this.ids += i.id + ",";
        }

        let url = "roles/updateStatusByIds";
        let formData = {
          ids: this.ids.slice(0, -1),
          status: "ACTIVE"
        };
        this.$axios
          .post(url, formData)
          .then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.getTableData();
              this.ids = ""; // ids清空
            }
          })
          .catch(err => {});
      } else {
        this.$message({
          type: "warning",
          message: "请先选择角色!"
        });
      }
    },
    // 批量禁用
    batchDisable() {
      if (this.multipleSelection.length != 0) {
        for (var i of this.multipleSelection) {
          this.ids += i.id + ",";
        }

        let url = "roles/updateStatusByIds";
        let formData = {
          ids: this.ids.slice(0, -1),
          status: "DEL"
        };
        this.$axios
          .post(url, formData)
          .then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.getTableData();
              this.ids = ""; // ids清空
            }
          })
          .catch(err => {});
      } else {
        this.$message({
          type: "warning",
          message: "请先选择角色!"
        });
      }
    },
    // 批量删除
    batchDel() {
      if (this.multipleSelection.length != 0) {
        this.$confirm("此操不可逆, 是否继续?", "删除角色", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            for (var i of this.multipleSelection) {
              this.ids += i.id + ",";
            }
            let url = "roles/delByIds";
            let formData = {
              ids: this.ids.slice(0, -1)
            };
            this.$axios
              .post(url, formData)
              .then(res => {
                if (res.data.code == 1) {
                  this.$message({
                    type: "success",
                    message: res.data.msg
                  });
                  this.getTableData();
                  this.ids = ""; // ids清空
                }
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
      } else {
        this.$message({
          type: "warning",
          message: "请先选择角色!"
        });
      }
    },
    // 授权
    handleAuth(index, row) {
      // this.authForm.checkStrictly = true; // 改变树形组件联动状态
      this.rowRole = row.role;
      this.tableRowId = row.id; // 把表格行id传给全局，以备authFormSubmit()使用
      this.authForm.authFormVisible = true;
      let url = "roles/rolesAndResource";
      let formData = {
        roleId: row.id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          this.authForm.authFormData = res.data.data.dataOne;
          this.authForm.authFormDefaultKey = res.data.data.dataTow;
        })
        .catch(err => {});
    },
    // 授权确定
    authFormSubmit() {
      let url = "roles/addRolesAndResource";
      var resourcesIds = this.$refs.authFormTree.getCheckedKeys();
      let formData = {
        roleId: this.tableRowId,
        resourcesIds: resourcesIds
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.getTableData();
            this.authForm.authFormVisible = false;
            this.$message({
              type: "success",
              message: res.data.msg
            });
            this.getSliderBarGlobal(); // 刷新左边侧边栏slider
          } else if (res.data.code == 0) {
            this.$message({
              type: "warning",
              message: res.data.msg
            });
          }
        })
        .catch(err => {});
    },
    // 授权取消
    authFormCancle() {
      // this.authForm.checkStrictly = true; // 改变树形组件联动状态
      this.authForm.authFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消授权!"
      });
    },
    // 树形组件被点击时触发
    nodeClick() {
      // this.authForm.checkStrictly = false; // 改变树形组件联动状态
    },
    // 获取表格数据
    getTableData() {
      this.globalGetTableDataUrl = "roles/getAll";
      this.getTableDataGlobal();
    }
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.globalListenHeight(); // 监听页面变化，修改表格高度

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
