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
          label-width="55px"
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
                clearable
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
              <el-button
                size="mini"
                type="primary"
                @click="batchStartGlobal('user/updateUserStatusByIds')"
              >批量启用</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                size="mini"
                type="warning"
                @click="batchDisableGlobal('user/updateUserStatusByIds')"
              >批量禁用</el-button>
            </el-form-item>
            <el-form-item>
              <el-button size="mini" type="danger" @click="batchDelGlobal('user/delUserByIds')">批量删除</el-button>
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
            @selection-change="handleSelectionChangeGlobal"
            :default-sort="{prop: 'entryDate', order: 'descending'}"
            v-loading="globalTableLoading"
          >
            <el-table-column
              align="center"
              fixed
              type="selection"
              width="60"
              :reserve-selection="true"
            ></el-table-column>
            <el-table-column label="序号" width="80" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span>{{scope.$index+(currentPage - 1) * PageSize + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="用户名" width="140" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.userName }}</template>
            </el-table-column>
            <el-table-column align="center" label="姓名" width="140" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="所属角色" width="160" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.rolesId | rolesFilter }}</template>
            </el-table-column>
            <!-- <el-table-column align="center" label="性别" width="100">
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
            </el-table-column>-->
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
            <el-table-column align="center" label="入职日期" width="180" prop="entryDate" sortable>
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
            <el-table-column fixed="right" width="240" align="center" label="操作">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="查看详情" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleDetail(scope.$index, scope.row)"
                    circle
                    icon="el-icon-tickets"
                  ></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                    circle
                    icon="el-icon-edit"
                  ></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="赋予角色" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleAuth(scope.$index, scope.row)"
                    circle
                  >
                    <i class="iconfont iconshouquan" style="font-size:12px"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="密码重置" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="resetPassword(scope.$index, scope.row)"
                    circle
                  >
                    <i class="iconfont iconmimazhongzhi" style="font-size:12px"></i>
                  </el-button>
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
    <el-dialog
      append-to-body
      center
      :title="editDialogForm.name"
      :visible.sync="globalaEditDialogFormVisible"
    >
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
    <!-- 查看详情dialog -->
    <el-dialog
      append-to-body
      center
      :title="viewDetailForm.name"
      :visible.sync="globalViewDetailFormVisible"
    >
      <el-form :model="viewDetailForm" :label-width="viewDetailFormLabelWidth" ref="viewDetailForm">
        <el-form-item label="用户名：">
          <el-input v-model="viewDetailForm.userName" readonly></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input v-model="viewDetailForm.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group disabled v-model="viewDetailForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄：">
          <el-input v-model="viewDetailForm.age" readonly></el-input>
        </el-form-item>
        <el-form-item label="手机号码：">
          <el-input v-model="viewDetailForm.phoneNumber" readonly></el-input>
        </el-form-item>
        <el-form-item label="出生日期：">
          <el-input v-model="viewDetailForm.birthdayNew" readonly></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="viewDetailForm.status"
            disabled
            active-text="启用"
            inactive-text="禁用"
            active-value="ACTIVE"
            inactive-value="DEL"
          ></el-switch>
        </el-form-item>
        <el-form-item label="入职日期：">
          <el-input v-model="viewDetailForm.entryDateNew" readonly></el-input>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-input v-model="viewDetailForm.createAtNew" readonly></el-input>
        </el-form-item>
        <el-form-item label="修改时间：">
          <el-input v-model="viewDetailForm.updateAtNew" readonly></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            readonly
            v-model="viewDetailForm.note"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="viewDetailDialogFormCancleGlobal">取 消</el-button>
        <el-button size="small" type="primary" @click="viewDetailDialogFormSubmitGlobal">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 赋予角色dialog -->
    <el-dialog
      append-to-body
      center
      :title="rowName + ' 赋予角色'"
      :visible.sync="authForm.authFormVisible"
    >
      <el-form :model="authForm" ref="authForm" :label-width="authForm.authFormLabelWidth">
        <el-form-item label="请选择角色：">
          <el-select v-model="authForm.defaultAuthRoleId" placeholder="请选择赋予角色">
            <el-option
              v-for="item in authForm.authFormData"
              :key="item.id"
              :label="item.role"
              :value="item.id"
            ></el-option>
          </el-select>
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
let that;
export default {
  mixins: [myMixins],
  name: "userManage",
  filters: {
    // 所属角色过滤器
    rolesFilter: function(value) {
      if (value == null) {
        return "无";
      } else {
        for (let item of that.rolesFilterList) {
          if (value == item.id) {
            return item.role;
          }
        }
      }
    }
  },
  watch: {},
  data() {
    // 检测手机号
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
        updateAt: "",
        createAt: "",
        id: "",
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

      ids: "", // 存放表格选中项id
      // 查看详情dialog
      viewDetailForm: {},
      viewDetailFormLabelWidth: "140px",

      tableRowId: "", // 用于赋予角色dialog请求使用  表格行用户Id
      rowName: "", // 存放当前行用户名称
      // 赋予角色form
      authForm: {
        authFormData: [],
        authFormLabelWidth: "38%",
        authFormVisible: false,
        defaultAuthRoleId: "" // 角色select绑定值
      },

      // 角色列表
      rolesFilterList: []
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
      var url = "user/updateUserById";
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
        id: this.editDialogForm.id
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
              this.selectCompanyAllForm.selectCompanyDefault = this.selectCompanyAllForm.selectCompanyDefaultInvariant; // 当前页面公司下拉菜单默认值

              this.getUserInformationGlobal(); // 全局同步用户信息
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
      this.globalDeleteUrl = "user/delUserByIds";
      this.globalDeleteFormData = {
        ids: row.id
      };
      this.handleDeleteGlobal();
    },
    // 表格switch事件
    menuStatus(index, row) {
      this.globalMenuStatusUrl = "user/updateUserStatusByIds";
      this.globalMenuStatusFormData = {
        ids: row.id,
        status: row.status
      };
      this.globalMenuStatus();
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
        birthday: this.addDialogForm.birthday,
        status: this.addDialogForm.status,
        entryDate: this.addDialogForm.entryDate,
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
    // 表格行查看详情按钮事件
    handleDetail(index, row) {
      var url = "user/getUserById";
      let formData = {
        id: row.id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.globalViewDetailFormVisible = true; // 弹出层
            this.viewDetailForm = res.data.data;
            this.viewDetailForm["birthdayNew"] = this.$options.filters[
              "dateFilter"
            ](this.viewDetailForm.birthday); // 新增转换后的成立日期key - value
            this.viewDetailForm["entryDateNew"] = this.$options.filters[
              "dateFilter"
            ](this.viewDetailForm.entryDate); // 新增转换后的入职日期key - value
            this.viewDetailForm["createAtNew"] = this.$options.filters[
              "dateFilter"
            ](this.viewDetailForm.createAt); // 新增转换后的创建时间key - value
            this.viewDetailForm["updateAtNew"] = this.$options.filters[
              "dateFilter"
            ](this.viewDetailForm.updateAt); // 新增转换后的修改时间key - value
          }
        })
        .catch(err => {});
    },
    // 赋予角色
    handleAuth(index, row) {
      this.rowName = row.name;
      this.tableRowId = row.id; // 把表格行id传给全局，以备authFormSubmit()使用
      this.authForm.defaultAuthRoleId = row.rolesId; // 赋予角色下拉菜单默认值
      this.authForm.authFormVisible = true;
      let url = "roles/getActiveRoles";
      let formData = {};
      this.$axios
        .post(url, formData)
        .then(res => {
          this.authForm.authFormData = res.data.data;
        })
        .catch(err => {});
    },
    // 赋予角色确定
    authFormSubmit() {
      let url = "user/updateRoles";
      let formData = {
        userId: this.tableRowId,
        rolesId: this.authForm.defaultAuthRoleId
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
            this.getUserInformationGlobal(); // 全局同步用户信息
          }
        })
        .catch(err => {});
    },
    // 赋予角色取消
    authFormCancle() {
      this.authForm.authFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消赋予角色!"
      });
    },
    // 密码重置
    resetPassword(index, row) {
      this.$confirm("此操作将重置该用户密码, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "user/updatePassword";
          let formData = {
            id: row.id
          };
          this.$axios
            .post(url, formData)
            .then(res => {
              if (res.data.code == 418) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
              } else if (res.data.code == 1) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
              }
            })
            .catch(err => {
              return err;
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置密码"
          });
        });
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
          if (res.data.data[1] == undefined) {
            this.globalTableData = res.data.data;
            this.totalCount = res.data.data.length; // 将数据的长度赋值给totalCount
            this.selectCompanyAllForm.isShowSelectCompanyList = false; // 隐藏公司列表
          } else {
            if (res.data.data[1][0]) {
              this.globalTableData = res.data.data[1];
              this.totalCount = res.data.data[1].length; // 将数据的长度赋值给totalCount
              this.selectCompanyAllForm.isShowSelectCompanyList = true; // 显示公司列表
              setTimeout(() => {
                this.selectCompanyAllForm.selectCompanyDefault = this.selectCompanyAllForm.selectCompanyDefaultInvariant; // 当前页面公司下拉菜单默认值
              }, 500);
            } else {
              this.globalTableData = res.data.data;
              this.totalCount = res.data.data.length; // 将数据的长度赋值给totalCount
              this.selectCompanyAllForm.isShowSelectCompanyList = false; // 隐藏公司列表
            }
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
          if (res.data.data == null) {
            // 未设置公司的员工 所属公司为空
            return;
          } else {
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
              this.editDialogForm.addDialogCompany = res.data.data; // 编辑时候公司名称
            }
          }
        })
        .catch(err => {
          return err;
        });
    },
    // 获取角色列表
    getRoleFilterList() {
      let url = "roles/getAll";
      let formData = {};
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.rolesFilterList = res.data.data;
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

    this.getCompanyAll(); // 获取所有公司

    this.getTableData(); // 获取表格数据

    this.getRoleFilterList(); // 获取角色列表
  },
  beforeCreate: function() {
    that = this;
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
