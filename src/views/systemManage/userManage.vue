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
          <el-form-item label="姓名：">
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入用户名称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </app-search>
      <!-- 下拉菜单和按钮组 -->
      <el-row type="flex" justify="start" class="select-btn-group">
        <el-col :span="24">
          <el-form
            inline
            ref="selectCompanyAllForm"
            :model="selectCompanyAllForm"
            label-width="90px"
          >
            <el-form-item label="所属公司：" v-if="selectCompanyAllForm.isShowSelectCompanyList">
              <el-select
                v-model="selectCompanyAllForm.selectCompanyDefault"
                size="small"
                @change="selectCompanyAll"
                placeholder="请选择公司"
              >
                <el-option label="未设置公司的员工" value="0"></el-option>
                <el-option
                  v-for="item in selectCompanyAllForm.selectCompanyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="form-item-add">
              <el-button size="mini" type="primary" @click="addGlobal">添加</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="primary" @click="batchStart">批量启用</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="warning" @click="batchDisable">批量禁用</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="danger" @click="batchDel">批量删除</el-button>
            </el-form-item>
          </el-form>
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
            <el-table-column align="center" label="用户名" width="160" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.userName }}</template>
            </el-table-column>
            <el-table-column align="center" label="姓名" width="160" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="性别" width="100">
              <template slot-scope="scope">{{ scope.row.gender }}</template>
            </el-table-column>
            <el-table-column align="center" label="年龄" width="120">
              <template slot-scope="scope">{{ scope.row.age }}</template>
            </el-table-column>
            <el-table-column align="center" label="手机号码" width="140">
              <template slot-scope="scope">{{ scope.row.phoneNumber }}</template>
            </el-table-column>
            <el-table-column align="center" label="出生日期" width="180">
              <template slot-scope="scope">{{ scope.row.birthday | dateFilter }}</template>
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
            <el-table-column align="center" label="入职日期" width="180">
              <template slot-scope="scope">{{ scope.row.entryDate | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="180">
              <template slot-scope="scope">{{ scope.row.createAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="修改时间" width="180">
              <template slot-scope="scope">{{ scope.row.updateAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column label="备注" min-width="180" show-overflow-tooltip>
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
    <el-dialog append-to-body center title="添加用户" :visible.sync="globalaAddDialogFormVisible">
      <el-form
        :model="addDialogForm"
        ref="addDialogForm"
        :label-width="addDialogForm.addDialogFormLabelWidth"
        :rules="addDialogForm.addDialogFormRules"
      >
        <el-form-item label="用户名：" prop="userName">
          <el-input
            @blur="userNmaeBlur"
            v-model="addDialogForm.userName"
            placeholder="请输入用户名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="addDialogForm.password" placeholder="请输入密码" show-password clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="addDialogForm.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="gender">
          <el-radio-group v-model="addDialogForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属公司：" v-if="addDialogForm.addSelectCompanyList.length == 0">
          <el-input
            v-model="addDialogForm.addDialogCompany.name"
            placeholder="请输入所属公司"
            disabled
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属公司："
          prop="companyId"
          v-if="addDialogForm.addSelectCompanyList.length != 0"
        >
          <el-select v-model="addDialogForm.companyId" size="small" placeholder="请选择公司">
            <el-option label="暂无所属公司" value="0"></el-option>
            <el-option
              v-for="item in addDialogForm.addSelectCompanyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期：" prop="entryDate">
          <el-date-picker
            v-model="addDialogForm.entryDate"
            type="date"
            placeholder="请选择入职日期"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="年龄：">
          <el-input v-model="addDialogForm.age" placeholder="请输入年龄" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneNumber">
          <el-input v-model="addDialogForm.phoneNumber" placeholder="请输入手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="出生日期：">
          <el-date-picker
            v-model="addDialogForm.birthday"
            type="date"
            placeholder="请选择出生日期"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch
            v-model="addDialogForm.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="ACTIVE"
            inactive-value="DEL"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入备注"
            v-model="addDialogForm.note"
            maxlength="250"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="addDialogFormCancleGlobal">取 消</el-button>
        <el-button size="small" type="primary" @click="addDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑dialog -->
    <el-dialog append-to-body center title="编辑用户信息" :visible.sync="globalaEditDialogFormVisible">
      <el-form
        :model="editDialogForm"
        :label-width="editDialogForm.editDialogFormLabelWidth"
        :rules="editDialogForm.editDialogFormRules"
        ref="editDialogForm"
      >
        <el-form-item label="用户名：">
          <el-input v-model="editDialogForm.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="editDialogForm.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="gender">
          <el-radio-group v-model="editDialogForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属公司：" v-if="editDialogForm.addSelectCompanyList.length == 0">
          <el-input
            v-model="editDialogForm.addDialogCompany.name"
            placeholder="请输入所属公司"
            disabled
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="所属公司："
          prop="companyId"
          v-if="editDialogForm.addSelectCompanyList.length != 0"
        >
          <el-select v-model="editDialogForm.companyId" size="small" placeholder="请选择公司">
            <el-option label="暂无所属公司" value="0"></el-option>
            <el-option
              v-for="item in editDialogForm.addSelectCompanyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期：" prop="entryDate">
          <el-date-picker
            v-model="editDialogForm.entryDate"
            type="date"
            placeholder="请选择入职日期"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="年龄：">
          <el-input v-model="editDialogForm.age" placeholder="请输入年龄" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneNumber">
          <el-input v-model="editDialogForm.phoneNumber" placeholder="请输入手机号码" clearable></el-input>
        </el-form-item>
        <el-form-item label="出生日期：">
          <el-date-picker
            v-model="editDialogForm.birthday"
            type="date"
            placeholder="请选择出生日期"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch
            v-model="editDialogForm.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="ACTIVE"
            inactive-value="DEL"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入备注"
            v-model="editDialogForm.note"
            maxlength="250"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="editDialogFormCancleGlobal">取 消</el-button>
        <el-button size="small" type="primary" @click="editDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myMixins } from "@/mixins/index";
export default {
  mixins: [myMixins],
  name: "userManage",
  watch: {},
  data() {
    // 检测电话
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号码"));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      tableDataObj: {}, // 公司数据对象
      // 搜索
      searchForm: {
        name: ""
      },
      tableRowId: "", // 用于授权dialog请求使用  表格行Id

      tableHeight: window.innerHeight - 300, // 表格高度
      // select 公司
      selectCompanyAllForm: {
        isShowSelectCompanyList: false, // 是否显示下拉菜单
        selectCompanyDefault: "", // 默认值
        selectCompanyDefaultInvariant: "", // 公司列表默认值不变（一直为父公司）
        selectCompanyList: []
      },
      // 添加dialog form
      addDialogForm: {
        addDialogFormLabelWidth: "140px",
        userName: "", // 用户名
        password: "", // 密码
        name: "", //  姓名
        gender: "", //  性别
        companyId: "", // 所属公司
        age: "", //  年龄
        phoneNumber: "", //  手机号码
        birthday: "", //  出生日期
        status: "ACTIVE", //  状态
        entryDate: "", //  入职日期
        note: "", //  备注
        addDialogFormRules: {
          userName: {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          password: { required: true, message: "请输入密码", trigger: "blur" },
          name: { required: true, message: "请输入姓名", trigger: "blur" },
          gender: { required: true, message: "请选择性别", trigger: "change" },
          companyId: {
            required: true,
            message: "请选择所属公司",
            trigger: "change"
          },
          entryDate: {
            required: true,
            message: "请选择入职日期",
            trigger: "change"
          },
          phoneNumber: {
            required: true,
            validator: checkPhone,
            trigger: "blur"
          }
        },
        addSelectCompanyList: [], // 添加dialog父公司select
        addDialogCompany: {} // 当分公司时候，所属公司定死
      },
      // 编辑dialog form
      editDialogForm: {
        editDialogFormLabelWidth: "140px",
        userName: "", // 用户名
        password: "", // 密码
        name: "", //  姓名
        gender: "", //  性别
        companyId: "", // 所属公司
        age: "", //  年龄
        phoneNumber: "", //  手机号码
        birthday: "", //  出生日期
        status: "ACTIVE", //  状态
        entryDate: "", //  入职日期
        note: "", //  备注
        updateAt:"",
        createAt:"",
        id:"",
        // 编辑菜单弹窗form表单校验规则
        editDialogFormRules: {
          password: { required: true, message: "请输入密码", trigger: "blur" },
          name: { required: true, message: "请输入姓名", trigger: "blur" },
          gender: { required: true, message: "请选择性别", trigger: "change" },
          companyId: {
            required: true,
            message: "请选择所属公司",
            trigger: "change"
          },
          entryDate: {
            required: true,
            message: "请选择入职日期",
            trigger: "change"
          },
          phoneNumber: {
            required: true,
            validator: checkPhone,
            trigger: "blur"
          }
        },
        addSelectCompanyList: [], // 添加dialog父公司select
        addDialogCompany: {} // 当分公司时候，所属公司定死
      },
      multipleSelection: [], // 存放表格选中项信息
      ids: "", // 存放表格选中项id
      rowRole: "", // 存放当前行id
      // 默认显示第一条
      currentPage: 1
    };
  },
  methods: {
    // 搜索
    searchSubmit() {
      this.globalSearchUrl = "user/selectUserByName";
      this.globalSearchFormData = {
        name: this.searchForm.name
      };
      // 判断查询条件是否为空
      for (var key in this.searchForm) {
        if (!this.searchForm[key]) {
          this.$message({
            message: "查询条件为空显示全部数据！",
            type: "warning",
            showClose: true,
            duration: 1000
          });
        }
      }
      this.globalTableLoading = true;
      this.$axios
        .post(this.globalSearchUrl, this.globalSearchFormData)
        .then(res => {
          if (res.data.code == 1) {
            this.globalTableLoading = false;
            if (res.data.data instanceof Array == true) {
              // 分公司
              this.globalTableData = res.data.data;
              this.totalCount = res.data.data.length; // 将数据的长度赋值给totalCount
              this.selectCompanyAllForm.isShowSelectCompanyList = false; // 隐藏公司列表
            } else if (
              res.data.data == null &&
              res.data.data instanceof Array == false
            ) {
              // 分公司没有该用户
              this.$message({
                message: "没有该用户，请重新查询！",
                type: "warning",
                showClose: true,
                duration: 1000
              });
              this.globalTableData = [];
              this.totalCount = 0; // 将数据的长度赋值给totalCount
              this.selectCompanyAllForm.isShowSelectCompanyList = false; // 隐藏公司列表
            } else if (
              JSON.stringify(res.data.data) != "{}" &&
              !(res.data.data instanceof Array)
            ) {
              // 父公司搜索有该用户

              this.tableDataObj = res.data.data;
              if (res.data.data[1]) {
                this.selectCompanyAllForm.selectCompanyDefault = this.selectCompanyAllForm.selectCompanyDefaultInvariant; // 下拉菜单显示父公司
                this.globalTableData = res.data.data[1];
                this.totalCount = res.data.data[1].length; // 将数据的长度赋值给totalCount
                this.selectCompanyAllForm.isShowSelectCompanyList = true; // 显示公司列表
              } else {
                this.selectCompanyAllForm.selectCompanyDefault = this.selectCompanyAllForm.selectCompanyDefaultInvariant; // 下拉菜单显示父公司
                this.globalTableData = [];
                this.totalCount = 0; // 将数据的长度赋值给totalCount
                this.selectCompanyAllForm.isShowSelectCompanyList = true; // 显示公司列表
              }
            } else if (
              JSON.stringify(res.data.data) == "{}" &&
              !(res.data.data instanceof Array)
            ) {
              // 父公司没有该用户
              this.$message({
                message: "没有该用户，请重新查询！",
                type: "warning",
                showClose: true,
                duration: 1000
              });
              this.globalTableData = [];
              this.totalCount = 0; // 将数据的长度赋值给totalCount
              this.selectCompanyAllForm.isShowSelectCompanyList = false; // 隐藏公司列表
            }
          }
        })
        .catch(err => {
          return;
        });
    },
    // 选择公司
    selectCompanyAll(val) {
      this.globalTableLoading = true;
      setTimeout(() => {
        this.globalTableLoading = false;
        if (this.tableDataObj[val]) {
          // tableDataObj下存在val
          this.globalTableData = this.tableDataObj[val];
        } else {
          this.globalTableData = [];
        }
      }, 500);
    },
    // 表格行编辑事件
    handleEdit(index, row) {
      this.editDialogGlobal();
      var url = "user/getUserById";
      let formData = {
        id: row.id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.editDialogForm.userName = res.data.data.userName;
            this.editDialogForm.password = res.data.data.password;
            this.editDialogForm.name = res.data.data.name;
            this.editDialogForm.gender = res.data.data.gender;
            this.editDialogForm.companyId = res.data.data.companyId;
            this.editDialogForm.age = res.data.data.age;
            this.editDialogForm.phoneNumber = res.data.data.phoneNumber;
            this.editDialogForm.birthday = res.data.data.birthday;
            this.editDialogForm.status = res.data.data.status;
            this.editDialogForm.entryDate = res.data.data.entryDate;
            this.editDialogForm.note = res.data.data.note;
            this.editDialogForm.updateAt = res.data.data.updateAt;
            this.editDialogForm.createAt = res.data.data.createAt;
            this.editDialogForm.id = res.data.data.id;
          }
        })
        .catch(err => {});
    },
    // 表格行编辑确定
    editDialogFormSubmit() {
      var url = "user/getCurrentUser";
      var companyId = "";
      if (this.editDialogForm.addSelectCompanyList.length == 0) {
        companyId = this.editDialogForm.addDialogCompany.id;
      } else {
        companyId = this.editDialogForm.companyId;
      }
      let formData = {
        userName: this.editDialogForm.userName,
        password: this.editDialogForm.password,
        name: this.editDialogForm.name,
        gender: this.editDialogForm.gender,
        companyId: companyId,
        age: this.editDialogForm.age,
        phoneNumber: this.editDialogForm.phoneNumber,
        birthday: this.editDialogForm.birthday,
        status: this.editDialogForm.status,
        entryDate: this.editDialogForm.entryDate,
        updateAt: this.editDialogForm.updateAt,
        note: this.editDialogForm.note,
        createAt: this.editDialogForm.createAt,
        id: this.editDialogForm.id,
      };
      this.$refs.editDialogForm.validate(valid => {
        if (valid) {
          this.$axios.post(url, formData).then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.globalaEditDialogFormVisible = false;
              this.getTableData();
            }
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
    // 添加确定
    addDialogFormSubmit() {
      var url = "user/addUser";
      var companyId = "";
      if (this.addDialogForm.addSelectCompanyList.length == 0) {
        companyId = this.addDialogForm.addDialogCompany.id;
      } else {
        companyId = this.addDialogForm.companyId;
      }
      let formData = {
        userName: this.addDialogForm.userName,
        password: this.addDialogForm.password,
        name: this.addDialogForm.name,
        gender: this.addDialogForm.gender,
        companyId: companyId,
        age: this.addDialogForm.age,
        phoneNumber: this.addDialogForm.phoneNumber,
        birthday: this.addDialogForm.birthday / 1000,
        status: this.addDialogForm.status,
        entryDate: this.addDialogForm.entryDate / 1000,
        note: this.addDialogForm.note
      };
      this.$refs.addDialogForm.validate(valid => {
        if (valid) {
          this.$axios.post(url, formData).then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.globalaAddDialogFormVisible = false;
              this.addReset();
              this.getTableData(); // 重置表单数据
            }
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
    // 添加用户名失去焦点
    userNmaeBlur() {
      let url = "user/checkUserName";
      let formData = {
        userName: this.addDialogForm.userName
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 0) {
            this.$message({
              message: res.data.msg,
              type: "warning",
              showClose: true,
              duration: 1000
            });
            this.addDialogForm.userName = "";
          }
        })
        .catch(err => {});
    },
    // 添加表单重置
    addReset() {
      this.addDialogForm.userName = "";
      this.addDialogForm.password = "";
      this.addDialogForm.name = "";
      this.addDialogForm.gender = "";
      this.addDialogForm.companyId = "";
      this.addDialogForm.age = "";
      this.addDialogForm.phoneNumber = "";
      this.addDialogForm.birthday = "";
      this.addDialogForm.status = "ACTIVE";
      this.addDialogForm.entryDate = "";
      this.addDialogForm.note = "";
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
    // 分页
    handleSizeChange(val) {
      this.PageSize = val; // 改变每页显示的条数
      this.currentPage = 1; // 注意：在改变每页显示的条数时，要将页码显示到第一页
    },
    handleCurrentChange(val) {
      this.currentPage = val; // 改变默认的页数
    },
    // 获取表格数据
    getTableData() {
      this.globalTableLoading = true;
      let url = "user/selectAll";
      let formData = {};
      this.$axios
        .post(url, formData)
        .then(res => {
          this.globalTableLoading = false;
          this.tableDataObj = res.data.data;
          if (res.data.data[1][0]) {
            this.globalTableData = res.data.data[1];
            this.totalCount = res.data.data[1].length; // 将数据的长度赋值给totalCount
            this.selectCompanyAllForm.isShowSelectCompanyList = true; // 显示公司列表
          } else {
            this.globalTableData = res.data.data;
            this.totalCount = res.data.data.length; // 将数据的长度赋值给totalCount
            this.selectCompanyAllForm.isShowSelectCompanyList = false; // 隐藏公司列表
          }
        })
        .catch(err => {
          return err;
        });
    },

    // 获取所有公司信息
    getCompanyAll() {
      let url = "user/selectCompanyByUser";
      let formData = {
        status: "ACTIVE"
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.data instanceof Array) {
            this.selectCompanyAllForm.selectCompanyList = res.data.data; // 赋给公司下拉select
            this.addDialogForm.addSelectCompanyList = res.data.data; // 赋给添加dialog父公司select
            this.editDialogForm.addSelectCompanyList = res.data.data; // 赋给编辑dialog父公司select
            this.selectCompanyAllForm.selectCompanyDefault =
              res.data.data[0].name; // 公司列表默认值
            this.selectCompanyAllForm.selectCompanyDefaultInvariant =
              res.data.data[0].name; // 公司列表默认值不变（一直为父公司）
          } else {
            this.addDialogForm.addDialogCompany = res.data.data; // 添加时候公司名称
            this.editDialogForm.addDialogCompany = res.data.data; // 添加时候公司名称
          }
        })
        .catch(err => {
          return err;
        });
    }
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.globalListenHeight(); // 监听页面变化，修改表格高度

    // 获取表格数据
    this.getTableData();

    // 获取所有公司
    this.getCompanyAll();
  }
};
</script>

<style scoped>
.userManage {
  width: 100%;
  height: 100%;
  position: relative;
}
.userManage .select-btn-group .el-form-item {
  margin: 10px 18px 0 0;
}
.userManage .select-btn-group .form-item-add {
  margin-left: 10px;
}
</style>
