<template>
  <!-- 客户列表 -->
  <div class="customerList">
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
          label-width="120px"
        >
          <el-form-item label="联系人姓名：">
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入联系人姓名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="区域：">
            <el-cascader
              :options="areaOption"
              v-model="searchForm.areaList"
              expand-trigger="hover"
              @change="handleAreaChange"
              clearable
              :props="optionProps"
              placeholder="请输入/选择区域"
              filterable
              @keyup.enter.native="searchSubmit"
            ></el-cascader>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </app-search>
      <!-- 按钮组 -->
      <el-row type="flex" justify="start" class="app-btn-group">
        <el-col :span="24">
          <el-button size="mini" type="primary" @click="addGlobal">添加</el-button>
        </el-col>
      </el-row>
      <!-- 表格table -->
      <el-row class="app-content-table">
        <el-col :span="24">
          <el-table
            ref="tableData"
            :data="globalTableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
            style="width: 100%; table-layout:fixed"
            :max-height="tableHeight"
            stripe
            size="medium"
            border
            row-key="id"
            :default-sort="{prop: 'createAt', order: 'ascending'}"
            v-loading="globalTableLoading"
          >
            <el-table-column label="序号" fixed width="80" align="center">
              <template slot-scope="scope">
                <span>{{scope.$index+(currentPage - 1) * PageSize + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="联系人姓名" width="140" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="区域" width="240" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.address }}</template>
            </el-table-column>
            <el-table-column align="center" label="单位名称" width="240" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.company }}</template>
            </el-table-column>
            <el-table-column align="center" label="职务" width="140" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.post }}</template>
            </el-table-column>
            <el-table-column align="center" label="联系方式" width="140">
              <template slot-scope="scope">{{ scope.row.phone }}</template>
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
            <el-table-column align="center" label="添加时间" width="160" prop="createAt" sortable>
              <template slot-scope="scope">{{ scope.row.createAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column label="备注" min-width="280" show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.note}}</template>
            </el-table-column>
            <el-table-column fixed="right" width="200" align="center" label="操作">
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
                <el-tooltip effect="dark" content="查看添加人" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="viewAddUser(scope.$index, scope.row)"
                    circle
                  >
                    <i class="iconfont icontubiao-tianjiaren" style="font-size:12px"></i>
                  </el-button>
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
    <el-dialog append-to-body center title="添加客户" :visible.sync="globalaAddDialogFormVisible">
      <el-form
        :model="addDialogForm"
        ref="addDialogForm"
        :label-width="addDialogForm.addDialogFormLabelWidth"
        :rules="addDialogForm.addDialogFormRules"
      >
        <el-form-item label="联系人姓名：" prop="name">
          <el-input v-model="addDialogForm.name" placeholder="请输入联系人姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="区域：" prop="areaList">
          <el-cascader
            :options="areaOption"
            v-model="addDialogForm.areaList"
            expand-trigger="hover"
            @change="handleAreaChange"
            clearable
            :props="optionProps"
            placeholder="请输入/选择区域"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model="addDialogForm.phone" placeholder="请输入联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item label="单位名称：">
          <el-input v-model="addDialogForm.company" placeholder="请输入单位名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="职务：">
          <el-input v-model="addDialogForm.post" placeholder="请输入职务" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="addDialogForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄：">
          <el-input v-model="addDialogForm.age" placeholder="请输入客户年龄" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注：">
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
    <!-- 查看详情dialog -->
    <el-dialog
      append-to-body
      center
      :title="viewDetailForm.name"
      :visible.sync="globalViewDetailFormVisible"
    >
      <el-form :model="viewDetailForm" :label-width="viewDetailFormLabelWidth" ref="viewDetailForm">
        <el-form-item label="联系人姓名：">
          <el-input v-model="viewDetailForm.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="区域：">
          <el-input v-model="viewDetailForm.address" readonly></el-input>
        </el-form-item>
        <el-form-item label="单位名称：">
          <el-input v-model="viewDetailForm.company" readonly></el-input>
        </el-form-item>
        <el-form-item label="职务：">
          <el-input v-model="viewDetailForm.post" readonly></el-input>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model="viewDetailForm.phone" readonly></el-input>
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
        <el-form-item label="状态：" prop="name">
          <el-switch
            disabled
            v-model="viewDetailForm.status"
            active-value="ACTIVE"
            inactive-value="DEL"
            active-text="启用"
            inactive-text="禁用"
          ></el-switch>
        </el-form-item>
        <el-form-item label="修改时间：">
          <el-input v-model="viewDetailForm.updateAt_new" readonly></el-input>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-input v-model="viewDetailForm.createAt_new" readonly></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            readonly
            v-model="viewDetailForm.note"
            maxlength="250"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="viewDetailDialogFormCancleGlobal">取 消</el-button>
        <el-button size="small" type="primary" @click="viewDetailDialogFormSubmitGlobal">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看添加人 -->
    <el-dialog
      append-to-body
      center
      :title="viewAddUserForm.viewAddUserFormTitle"
      :visible.sync="viewAddUserForm.viewAddUserFormVisible"
    >
      <el-form :model="viewAddUserForm" label-width="120px" ref="viewAddUserForm">
        <el-form-item label="添加人：">
          <el-input v-model="globalUserInformation.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="所属公司：">
          <el-input v-model="globalCompanyInformation.name" readonly></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="viewAddUserFormCancle">取 消</el-button>
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
        ref="editDialogForm"
        label-width="100px"
        :rules="editDialogFormRules"
      >
        <el-form-item label="联系人姓名：" prop="name">
          <el-input v-model="editDialogForm.name" placeholder="请输入联系人姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="区域：" v-if="!isAddress">
          <el-input v-model="editDialogForm.address" readonly style="width:80%" clearable></el-input>
          <el-button type="text" @click="isAddress = true">修改</el-button>
        </el-form-item>
        <el-form-item label="区域：" prop="areaList" v-if="isAddress">
          <el-cascader
            :options="areaOption"
            v-model="editDialogAreaList"
            expand-trigger="hover"
            @change="handleAreaChange"
            clearable
            :props="optionProps"
            placeholder="请输入/选择区域"
            filterable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="联系方式：" prop="phone">
          <el-input v-model="editDialogForm.phone" placeholder="请输入联系方式" clearable></el-input>
        </el-form-item>
        <el-form-item label="单位名称：">
          <el-input v-model="editDialogForm.company" placeholder="请输入客户单位名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="职务：">
          <el-input v-model="editDialogForm.post" placeholder="请输入职务" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio-group v-model="editDialogForm.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄：">
          <el-input v-model="editDialogForm.age" placeholder="请输入客户年龄" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="name">
          <el-switch
            disabled
            v-model="editDialogForm.status"
            active-value="ACTIVE"
            inactive-value="DEL"
            active-text="启用"
            inactive-text="禁用"
          ></el-switch>
        </el-form-item>
        <el-form-item label="修改时间：">
          <el-input v-model="editDialogForm.updateAt_new" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-input v-model="editDialogForm.createAt_new" disabled></el-input>
        </el-form-item>
        <el-form-item label="备注：">
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
// 引入省市县js文件
import areaJs from "../../plugin/select_area.js";
import { myMixins } from "@/mixins/index";
let that;
export default {
  mixins: [myMixins],
  name: "customerList",
  watch: {},
  data() {
    return {
      // 搜索
      searchForm: {
        name: "",
        areaList: []
      },
      tableHeight: window.innerHeight - 300, // 表格高度
      areaOption: areajson,
      // el-cascader 配置项
      optionProps: {
        value: "label",
        label: "label",
        children: "children",
        checkStrictly: true
      },
      area: "", // 级联区域 字段转换后的值
      // 添加dialog form
      addDialogForm: {
        addDialogFormVisible: false,
        addDialogFormLabelWidth: "100px",
        name: "",
        company: "",
        gender: "",
        age: "",
        phone: "",
        address: "",
        note: "",
        post: "",
        areaList: [], // 级联区域el-cascader默认值
        addDialogFormRules: {
          name: [
            { required: true, message: "请输入联系人姓名", trigger: "blur" }
          ],
          phone: [
            { required: true, message: "请输入联系方式", trigger: "blur" }
          ],
          areaList: [
            { required: true, message: "请输入/选择区域", trigger: "change" }
          ]
        }
      },

      // 查看详情dialog
      viewDetailForm: {},
      viewDetailFormLabelWidth: "100px",

      // 查看添加人dialog form
      viewAddUserForm: {
        viewAddUserFormVisible: false,
        viewAddUserFormTitle: "" // 查看添加人dialog title
      },
      // 编辑dialog form
      editDialogForm: {
        name: "", // 联系人姓名
        company: "", // 单位名称
        gender: "", // 性别
        age: "", // 年龄
        phone: "", // 联系方式
        address: "", // 区域
        note: "", // 备注
        post: ""
      },
      editDialogAreaList: [], // 级联区域el-cascader默认值
      isAddress: false, // 编辑dialog里面的区域
      // 编辑菜单弹窗form表单校验规则
      editDialogFormRules: {
        name: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        areaList: [
          { required: true, message: "请输入/选择区域", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    // 搜索
    searchSubmit() {
      this.globalSearchUrl = "customer/getCustomerByName";
      this.globalSearchFormData = {
        name: this.searchForm.name,
        address: this.area
      };
      this.searchSubmitGlobal();
    },
    // 获取表格数据
    getTableData() {
      this.globalGetTableDataUrl = "customer/getAll";
      this.getTableDataGlobal();
    },
    // 区域设置
    handleAreaChange(value) {
      // 赋值给区域字段 （先数组转字符串，再去掉所有的逗号）
      this.area = value.toString().replace(/,/g, "");
    },
    // 添加表单重置
    addReset() {
      this.addDialogForm.address = "";
      this.addDialogForm.gender = "";
      this.addDialogForm.name = "";
      this.addDialogForm.company = "";
      this.addDialogForm.age = "";
      this.addDialogForm.phone = "";
      this.addDialogForm.note = "";
    },
    // 添加确定
    addDialogFormSubmit() {
      var url = "customer/addCustomer";
      let formData = {
        address: this.area,
        gender: this.addDialogForm.gender,
        name: this.addDialogForm.name,
        company: this.addDialogForm.company,
        age: this.addDialogForm.age,
        phone: this.addDialogForm.phone,
        note: this.addDialogForm.note,
        post: this.addDialogForm.post
      };
      this.$refs.addDialogForm.validate(valid => {
        if (valid) {
          this.$axios.post(url, formData).then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.area = "";
              this.addDialogForm.areaList = [];
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
    // 表格行查看详情
    handleDetail(index, row) {
      let url = "customer/getCustomerById";
      let formData = {
        id: row.id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.globalViewDetailFormVisible = true; // 弹出层
            this.viewDetailForm = res.data.data;
            this.viewDetailForm["updateAt_new"] = this.$options.filters[
              "dateFilter"
            ](this.viewDetailForm.updateAt); // 新增转换后的修改时间key - value
            this.viewDetailForm["createAt_new"] = this.$options.filters[
              "dateFilter"
            ](this.viewDetailForm.createAt); // 新增转换后的创建时间key - value
          }
        })
        .catch(err => {});
    },
    // 表格行编辑事件
    handleEdit(index, row) {
      let url = "customer/getCustomerById";
      let formData = {
        id: row.id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.globalaEditDialogFormVisible = true; // 弹出层
            this.editDialogForm = res.data.data;
            this.editDialogForm["updateAt_new"] = this.$options.filters[
              "dateFilter"
            ](this.editDialogForm.updateAt); // 新增转换后的修改时间key - value
            this.editDialogForm["createAt_new"] = this.$options.filters[
              "dateFilter"
            ](this.editDialogForm.createAt); // 新增转换后的创建时间key - value
          }
        })
        .catch(err => {});
    },
    // 表格行编辑确定
    editDialogFormSubmit() {
      this.isAddress = true;
      var url = "customer/updateCustomer";
      let formData = {
        address: this.area,
        gender: this.editDialogForm.gender,
        updateAt: this.editDialogForm.updateAt,
        createAt: this.editDialogForm.createAt,
        updateId: this.editDialogForm.updateId,
        createId: this.editDialogForm.createId,
        name: this.editDialogForm.name,
        company: this.editDialogForm.company,
        id: this.editDialogForm.id,
        age: this.editDialogForm.age,
        status: this.editDialogForm.status,
        post: this.editDialogForm.post
      };
      this.$refs.editDialogForm.validate(valid => {
        if (valid) {
          if (this.isAddress && this.editDialogAreaList.length == 0) {
            this.$message({
              type: "warning",
              message: "请先选择区域"
            });
            return false;
          }
          this.$axios.post(url, formData).then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: res.data.msg
              });
              this.isAddress = false;
              this.area = "";
              this.editDialogAreaList=[];
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
      this.globalDeleteUrl = "customer/deleteCustomer";
      this.globalDeleteFormData = {
        id: row.id
      };
      this.handleDeleteGlobal();
    },
    // 表格switch事件
    menuStatus(index, row) {
      this.globalMenuStatusUrl = "customer/udateStatus";
      this.globalMenuStatusFormData = {
        id: row.id,
        status: row.status
      };
      this.globalMenuStatus();
    },
    // 表格行查看添加人
    viewAddUser(index, row) {
      this.viewAddUserForm.viewAddUserFormTitle = row.name;
      // 根据添加人id获取添加人信息
      this.getIdUserInformationGlobal(row.createId);
      this.viewAddUserForm.viewAddUserFormVisible = true;
    },
    // 表格行添加人取消
    viewAddUserFormCancle() {
      this.viewAddUserForm.viewAddUserFormVisible = false;
      this.$message({
        type: "info",
        message: "取消添加人查看"
      });
    }
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.globalListenHeight(); // 监听页面变化，修改表格高度
    this.getTableData(); // 获取表格数据
  }
};
</script>

<style scoped>
.customerList {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
</style>
