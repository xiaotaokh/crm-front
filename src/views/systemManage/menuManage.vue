<template>
  <!-- 菜单管理 -->
  <div class="menuManage">
    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <!-- 按钮组 -->
      <el-row type="flex" justify="start" class="app-btn-group">
        <el-col :span="24">
          <el-button size="mini" type="primary" @click="add">添加</el-button>
        </el-col>
      </el-row>
      <!-- 表格table -->
      <el-row class="app-content-table">
        <el-col :span="24">
          <!-- row-key="id" 树形表格时必填 -->
          <el-table
            ref="tableData"
            :data="globalTableData"
            tooltip-effect="dark"
            style="width: 100%;margin-bottom:20px table-layout:fixed"
            :max-height="tableHeight"
            row-key="id"
            stripe
            size="medium"
            border
            v-loading="globalTableLoading"
          >
            <el-table-column fixed label="菜单 / 按钮名称" width="180" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.navName }}</template>
            </el-table-column>
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
            <el-table-column label="路由地址" width="300" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.route }}</template>
            </el-table-column>
            <el-table-column label="状态" align="center" width="180">
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
            <el-table-column min-width="180" label="菜单描述">
              <template slot-scope="scope">{{ scope.row.content }}</template>
            </el-table-column>
            <el-table-column fixed="right" width="140" align="center" label="操作">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    circle
                    @click="handleEdit(scope.$index, scope.row)"
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
    <!-- 编辑dialog -->
    <el-dialog
      custom-class="editDialogFormDialog"
      append-to-body
      center
      :title="editDialogForm.name"
      :visible.sync="editDialogFormVisible"
    >
      <el-form
        :model="editDialogForm"
        :label-width="editDialogFormLabelWidth"
        :rules="editDialogFormRules"
        ref="editDialogForm"
      >
        <el-form-item label="菜单 / 按钮名称：" prop="name">
          <el-input v-model="editDialogForm.name" placeholder="请输入菜单 / 按钮名称.." clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单图标：" v-show="editDialogForm.resIcon">
          <i class="iconfont table-icon" :class="editDialogForm.resIcon"></i>
        </el-form-item>
        <el-form-item label="菜单类型：">
          <el-tag
            size="small"
            :type="editDialogForm.type == 1 ? '' : 'success' "
            effect="dark"
          >{{ editDialogForm.type == 1 ? "菜单" : '按钮' }}</el-tag>
        </el-form-item>
        <el-form-item label="路由地址：" prop="url">
          <el-input v-model="editDialogForm.url" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-switch
            v-model="editDialogForm.status"
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
            v-model="editDialogForm.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="editDialogFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="editDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加dialog -->
    <el-dialog
      custom-class="addDialogFormDialog"
      append-to-body
      center
      title="添加菜单"
      :visible.sync="addDialogForm.addDialogFormVisible"
    >
      <el-form
        :model="addDialogForm"
        ref="addDialogForm"
        :label-width="addDialogForm.addDialogFormLabelWidth"
        :rules="addDialogForm.addDialogFormRules"
      >
        <el-form-item label="菜单 / 按钮名称：" prop="name">
          <el-input
            v-model="addDialogForm.name"
            placeholder="请输入菜单 / 按钮名称.."
            clearable
            autofocus="true"
          ></el-input>
        </el-form-item>
        <el-form-item label="当前菜单 / 按钮级别：" prop="addMenuLevelCode">
          <el-select
            @change="addMenuLevelSelect"
            v-model="addDialogForm.addMenuLevelCode"
            placeholder="请选择菜单 / 按钮级别"
          >
            <el-option
              v-for="item in addDialogForm.addMenuLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="请选择一级菜单："
          prop="firstMenuResourcesDefault"
          v-if="addDialogForm.firstMenuResourcesVisible"
        >
          <el-select
            @change="firstMenuSelect"
            v-model="addDialogForm.firstMenuResourcesDefault"
            placeholder="请选择一级菜单"
          >
            <el-option
              v-for="item in addDialogForm.firstMenuResources"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="请选择二级菜单："
          prop="secMenuResourcesDefault"
          v-if="addDialogForm.secMenuResourcesVisible"
        >
          <el-select
            @change="secMenuSelect"
            v-model="addDialogForm.secMenuResourcesDefault"
            placeholder="请选择二级菜单"
          >
            <el-option
              v-for="item in addDialogForm.secMenuResources"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              v-show="item.type == 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="请选择三级菜单："
          prop="thirdMenuResourcesDefault"
          v-if="addDialogForm.thirdMenuResourcesVisible"
        >
          <el-select
            @change="thirdMenuSelect"
            v-model="addDialogForm.thirdMenuResourcesDefault"
            placeholder="请选择三级菜单"
          >
            <el-option
              v-for="item in addDialogForm.thirdMenuResources"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              v-show="item.type == 1"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型：" prop="type" v-else-if="addDialogForm.addMenuLevelCode == 1">
          <el-select disabled v-model="addDialogForm.type" placeholder="请选择菜单类型">
            <el-option label="菜单" value="1"></el-option>
            <el-option label="按钮" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="菜单类型："
          prop="type"
          v-if="addDialogForm.addMenuLevelCode == 2 || addDialogForm.addMenuLevelCode == 3 "
        >
          <el-select v-model="addDialogForm.type" placeholder="请选择菜单类型">
            <el-option label="菜单" value="1"></el-option>
            <el-option label="按钮" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型：" prop="type" v-else-if="addDialogForm.addMenuLevelCode == 4">
          <el-select disabled v-model="addDialogForm.type" placeholder="请选择菜单类型">
            <el-option label="菜单" value="1"></el-option>
            <el-option label="按钮" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单图标类名：" prop="resIcon" v-if="addDialogForm.type == 1">
          <el-input v-model="addDialogForm.resIcon" placeholder="请输入图标类名.." clearable></el-input>
        </el-form-item>
        <el-form-item label="路由地址：" prop="route">
          <el-input v-model="addDialogForm.route" placeholder="请输入路由地址.." clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单描述：" prop="content">
          <el-input v-model="addDialogForm.content" placeholder="请输入菜单描述.." clearable></el-input>
        </el-form-item>
        <el-form-item label="菜单状态：" prop="menuSwitch">
          <el-switch
            v-model="addDialogForm.menuSwitch"
            active-text="启用"
            @change="menuSwitch"
            inactive-text="禁用"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="addDialogFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="addDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myMixins } from '@/mixins/index'
export default {
  mixins:[myMixins],
  name: "menuManage",
  watch: {},
  data() {
    return {
      tableHeight: window.innerHeight - 200, // 表格高度
      editDialogFormVisible: false, // 编辑dialog
      editDialogFormLabelWidth: "140px", // 编辑dialog form表单lable宽
      editDialogForm: {}, // 编辑dialog菜单form表单,
      editDialogFormRules: {
        // 编辑菜单弹窗form表单校验规则
        name: [
          {
            required: true,
            message: "请输入菜单 / 按钮名称",
            trigger: "blur"
          }
        ],
        status: [
          { required: true, message: "请选择菜单状态", trigger: "change" }
        ],
        url: [{ required: true, message: "请输入路由地址", trigger: "blur" }]
      },
      addDialogForm: {
        addDialogFormVisible: false, // 添加dialog
        addDialogFormLabelWidth: "160px", // 添加dialog form表单lable宽
        addMenuLevelCode: "", // 添加菜单级别
        addMenuLevel: [
          // 添加菜单级别数组
          {
            value: 1,
            label: "一级"
          },
          {
            value: 2,
            label: "二级"
          },
          {
            value: 3,
            label: "三级"
          },
          {
            value: 4,
            label: "四级"
          }
        ],
        firstMenuResources: [], // 一级菜单
        firstMenuResourcesDefault: "", // 一级菜单默认  当前菜单pid
        firstMenuResourcesVisible: false, // 一级菜单显示隐藏
        secMenuResources: [], // 二级菜单
        secMenuResourcesDefault: "", // 二级菜单默认
        secMenuResourcesVisible: false, // 二级菜单显示隐藏
        thirdMenuResources: [], // 三级菜单
        thirdMenuResourcesDefault: "", // 三级菜单默认
        thirdMenuResourcesVisible: false, // 三级菜单显示隐藏
        // 添加dialog菜单form表单
        name: "",
        pid: 0,
        ppid: 0,
        pppid: 0,
        route: "",
        content: "",
        type: "",
        resId: "",
        resIcon: "",
        menuSwitch: true, // 添加switch字段
        menuStatus: true, // 表格的switch
        status: "ACTIVE",
        addDialogFormRules: {
          // 添加菜单弹窗form表单校验规则
          name: [
            {
              required: true,
              message: "请输入菜单 / 按钮名称",
              trigger: "blur"
            }
          ],
          addMenuLevelCode: [
            {
              required: true,
              message: "请选择当前菜单 / 按钮级别",
              trigger: "change"
            }
          ],
          type: [
            { required: true, message: "请选择菜单类型", trigger: "change" }
          ],
          route: [
            { required: true, message: "请输入路由地址", trigger: "blur" }
          ]
        }
      }
    };
  },
  methods: {
    // 表格行编辑事件
    handleEdit(index, row) {
      this.editDialogFormVisible = true; // 打开dialog
      this.editDialogForm = row; // 行数据赋值给弹窗form表单
      var url = "menu/getResourcesById";
      let formData = {
        id: row.id
      };
      this.$axios.post(url, formData).then(res => {
        this.editDialogForm = res.data.data;
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
          let url = "menu/delResourceById";
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
    // 表格行编辑确定
    editDialogFormSubmit() {
      var url = "menu/updateResources";
      this.$refs.editDialogForm.validate(valid => {
        if (valid) {
          this.$axios.post(url, this.editDialogForm).then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            }
            this.editDialogFormVisible = false;
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
      this.editDialogFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消编辑!"
      });
    },
    // 表格switch事件
    menuStatus(index, row) {
      let url = "menu/updateStatusById";
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
    //添加
    add() {
      this.addDialogForm.addDialogFormVisible = true;
    },
    // 添加  级别select事件
    addMenuLevelSelect() {
      if (this.addDialogForm.addMenuLevelCode == 1) {
        // 菜单类型为菜单
        this.addDialogForm.type = "1";
        this.addDialogForm.firstMenuResourcesDefault = "";
        this.addDialogForm.secMenuResourcesDefault = "";
        this.addDialogForm.thirdMenuResourcesDefault = "";
        this.addDialogForm.firstMenuResourcesVisible = false; // 一级菜单显示隐藏
        this.addDialogForm.secMenuResourcesVisible = false; // 二级菜单显示隐藏
        this.addDialogForm.thirdMenuResourcesVisible = false; // 三级菜单显示隐藏
      } else if (this.addDialogForm.addMenuLevelCode == 2) {
        this.addDialogForm.firstMenuResourcesDefault = "";
        this.addDialogForm.secMenuResourcesDefault = "";
        this.addDialogForm.thirdMenuResourcesDefault = "";
        this.addDialogForm.secMenuResourcesVisible = false; // 二级菜单显示隐藏
        this.addDialogForm.thirdMenuResourcesVisible = false; // 三级菜单显示隐藏
        // 选择二级菜单显示一级菜单
        var url = "menu/getFirstResources";
        let formData = {};
        this.$axios.post(url, formData).then(res => {
          this.addDialogForm.firstMenuResources = res.data.data;
        });
        this.addDialogForm.firstMenuResourcesVisible = true;
      } else if (this.addDialogForm.addMenuLevelCode == 3) {
        this.addDialogForm.firstMenuResourcesDefault = "";
        this.addDialogForm.secMenuResourcesDefault = "";
        this.addDialogForm.thirdMenuResourcesDefault = "";
        this.addDialogForm.secMenuResourcesVisible = false; // 二级菜单显示隐藏
        this.addDialogForm.thirdMenuResourcesVisible = false; // 三级菜单显示隐藏
        // 选择三级菜单显示一级菜单
        var url = "menu/getFirstResources";
        let formData = {};
        this.$axios.post(url, formData).then(res => {
          this.addDialogForm.firstMenuResources = res.data.data;
        });
        this.addDialogForm.firstMenuResourcesVisible = true;
      } else if (this.addDialogForm.addMenuLevelCode == 4) {
        this.addDialogForm.firstMenuResourcesDefault = "";
        this.addDialogForm.secMenuResourcesDefault = "";
        this.addDialogForm.thirdMenuResourcesDefault = "";
        this.addDialogForm.secMenuResourcesVisible = false; // 二级菜单显示隐藏
        this.addDialogForm.thirdMenuResourcesVisible = false; // 三级菜单显示隐藏
        // 菜单类型为按钮
        this.addDialogForm.type = "2";
        // 选择四级菜单显示一级菜单
        var url = "menu/getFirstResources";
        let formData = {};
        this.$axios.post(url, formData).then(res => {
          this.addDialogForm.firstMenuResources = res.data.data;
        });
        this.addDialogForm.firstMenuResourcesVisible = true;
        // this.thirdMenuResourcesVisible = true;
      }
    },

    // 一级菜单选择
    firstMenuSelect() {
      this.addDialogForm.secMenuResourcesDefault = "";
      this.addDialogForm.thirdMenuResourcesDefault = "";
      this.addDialogForm.pid = this.addDialogForm.firstMenuResourcesDefault;
      if (this.addDialogForm.addMenuLevelCode == 2) {
      } else if (
        this.addDialogForm.addMenuLevelCode == 3 ||
        this.addDialogForm.addMenuLevelCode == 4
      ) {
        // 如果添加的是三级菜单，显示二级
        // 请求二级菜单
        var url = "menu/getSecondByPid";
        let formData = {
          pid: this.addDialogForm.pid
        };
        this.$axios.post(url, formData).then(res => {
          this.addDialogForm.secMenuResources = res.data.data;
        });
        this.addDialogForm.secMenuResourcesVisible = true; // 显示二级菜单
      }
    },

    // 二级菜单选择
    secMenuSelect() {
      this.addDialogForm.thirdMenuResourcesDefault = "";
      this.addDialogForm.ppid = this.addDialogForm.secMenuResourcesDefault;

      if (this.addDialogForm.addMenuLevelCode == 3) {
      } else if (this.addDialogForm.addMenuLevelCode == 4) {
        // 如果添加的是四级菜单，显示三级
        // 请求三级菜单
        var url = "menu/getThirdByPpid";
        let formData = {
          ppid: this.addDialogForm.ppid
        };
        this.$axios.post(url, formData).then(res => {
          this.addDialogForm.thirdMenuResources = res.data.data;
        });
        this.addDialogForm.thirdMenuResourcesVisible = true; // 显示三级菜单
      }
    },
    // 三级菜单选择
    thirdMenuSelect() {
      this.addDialogForm.pppid = this.addDialogForm.thirdMenuResourcesDefault;
    },
    // 添加菜单switch事件
    menuSwitch() {
      if (this.addDialogForm.menuSwitch == true) {
        this.addDialogForm.status = "ACTIVE";
      } else {
        this.addDialogForm.status = "DEL";
      }
    },
    // 添加确定
    addDialogFormSubmit() {
      var url = "menu/addResources";
      let formData = {
        name: this.addDialogForm.name,
        pid: this.addDialogForm.pid,
        ppid: this.addDialogForm.ppid,
        pppid: this.addDialogForm.pppid,
        url: this.addDialogForm.route,
        content: this.addDialogForm.content,
        type: this.addDialogForm.type,
        resId: this.addDialogForm.resId,
        resIcon: this.addDialogForm.resIcon,
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
    // 添加取消
    addDialogFormCancle() {
      this.addDialogForm.addDialogFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消添加!"
      });
      this.addReset(); // 表单重置
    },
    // 添加表单重置
    addReset() {
      this.$refs.addDialogForm.resetFields(); // 表单重置
      this.addDialogForm.firstMenuResourcesVisible = false; // 一级菜单显示隐藏
      this.addDialogForm.secMenuResourcesVisible = false; // 二级菜单显示隐藏
      this.thirdMenuResourcesVisible = false; // 三级菜单显示隐藏
      this.addDialogForm.firstMenuResources = [];
      this.addDialogForm.secMenuResources = [];
      this.addDialogForm.thirdMenuResources = [];
      this.addDialogForm.firstMenuResourcesDefault = "";
      this.addDialogForm.secMenuResourcesDefault = "";
      this.addDialogForm.thirdMenuResourcesDefault = "";
    },
    // 获取表格数据
    getTableData() {
      this.globalGetTableDataUrl = "menu/getAll";
      this.getTableDataGlobal();
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
.editDialogFormDialog .table-icon {
  font-size: 24px;
  color: #38acf8;
  font-weight: 700;
}
</style>
