<template>
  <!-- 项目维护 -->
  <div class="itemMaintain">
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
          <el-form-item label="项目名称：">
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入项目名称"
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
            <el-table-column align="center" label="项目名称" width="220" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="价格" width="120">
              <template slot-scope="scope">{{ scope.row.price }}</template>
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
            <el-table-column align="center" label="创建时间" width="160" prop="createAt" sortable>
              <template slot-scope="scope">{{ scope.row.createAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="修改时间" width="160">
              <template slot-scope="scope">{{ scope.row.updateAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column label="备注" min-width="180" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.note }}</template>
            </el-table-column>
            <el-table-column fixed="right" width="160" align="center" label="操作">
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
    <el-dialog append-to-body center title="添加项目" :visible.sync="globalaAddDialogFormVisible">
      <el-form
        :model="addDialogForm"
        ref="addDialogForm"
        :label-width="addDialogForm.addDialogFormLabelWidth"
        :rules="addDialogForm.addDialogFormRules"
      >
        <el-form-item label="项目名称：" prop="name">
          <el-input v-model="addDialogForm.name" placeholder="请输入项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="价格：" prop="price">
          <el-input v-model="addDialogForm.price" placeholder="请输入项目价格" clearable></el-input>
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
        <el-form-item label="项目名称：">
          <el-input v-model="viewDetailForm.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input v-model="viewDetailForm.price" readonly></el-input>
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
        <el-form-item label="创建时间：">
          <el-input v-model="viewDetailForm.createAt_new" readonly></el-input>
        </el-form-item>
        <el-form-item label="修改时间：">
          <el-input v-model="viewDetailForm.updateAt_new" readonly></el-input>
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
        :rules="editDialogForm.editDialogFormRules"
      >
        <el-form-item label="项目名称：" prop="name">
          <el-input v-model="editDialogForm.name" placeholder="请输入项目名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="价格：" prop="price">
          <el-input v-model="editDialogForm.price" placeholder="请输入项目单位" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="name">
          <el-switch
            v-model="editDialogForm.status"
            active-value="ACTIVE"
            inactive-value="DEL"
            active-text="启用"
            inactive-text="禁用"
          ></el-switch>
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
import { myMixins } from "@/mixins/index";
let that;
export default {
  mixins: [myMixins],
  name: "itemMaintain",
  watch: {},
  data() {
    return {
      // 搜索
      searchForm: {
        name: ""
      },

      tableHeight: window.innerHeight - 300, // 表格高度

      // 添加dialog form
      addDialogForm: {
        addDialogFormVisible: false,
        addDialogFormLabelWidth: "100px",
        note: "",
        price: "",
        name: "",
        addDialogFormRules: {
          name: [
            { required: true, message: "请输入项目名称", trigger: "blur" }
          ],
          price: [
            { required: true, message: "请输入项目价格", trigger: "blur" }
          ]
        }
      },

      // 查看详情dialog
      viewDetailForm: {},
      viewDetailFormLabelWidth: "100px",

      // 编辑dialog form
      editDialogForm: {
        name: "", // 项目名称
        price: "", // 价格
        status: "", // 状态
        note: "", // 备注
        // updateId: "", 
        // createId: "", 
        // updateAt: "", 
        // createAt: "", 
        // id:"",
        // 编辑菜单弹窗form表单校验规则
        editDialogFormRules: {
          name: [
            { required: true, message: "请输入项目名称", trigger: "blur" }
          ],
          price: [
            { required: true, message: "请输入项目价格", trigger: "blur" }
          ]
        }
      }
    };
  },
  methods: {
    // 搜索
    searchSubmit() {
      this.globalSearchUrl = "product/getProductByName";
      this.globalSearchFormData = {
        name: this.searchForm.name
      };
      this.searchSubmitGlobal();
    },
    // 获取表格数据
    getTableData() {
      this.globalGetTableDataUrl = "product/getAll";
      this.getTableDataGlobal();
    },
    // 添加表单重置
    addReset() {
      this.addDialogForm.note = "";
      this.addDialogForm.price = "";
      this.addDialogForm.name = "";
    },
    // 添加确定
    addDialogFormSubmit() {
      var url = "product/addProduct";
      let formData = {
        note: this.addDialogForm.note,
        price: this.addDialogForm.price,
        name: this.addDialogForm.name,
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
    // 表格行查看详情
    handleDetail(index, row) {
      let url = "product/getProductById";
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
      let url = "product/getProductById";
      let formData = {
        id: row.id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.globalaEditDialogFormVisible = true; // 弹出层
            this.editDialogForm = res.data.data;
          }
        })
        .catch(err => {});
    },
    // 表格行编辑确定
    editDialogFormSubmit() {
      var url = "product/updateProduct";
      let formData = {
        name: this.editDialogForm.name,
        price: this.editDialogForm.price,
        status: this.editDialogForm.status,
        note: this.editDialogForm.note,
        updateId: this.editDialogForm.updateId,
        createId: this.editDialogForm.createId,
        updateAt: this.editDialogForm.updateAt,
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
      this.globalDeleteUrl = "product/deleteProduct";
      this.globalDeleteFormData = {
        id: row.id
      };
      this.handleDeleteGlobal();
    },
    // 表格switch事件
    menuStatus(index, row) {
      this.globalMenuStatusUrl = "product/udateStatus";
      this.globalMenuStatusFormData = {
        id: row.id,
        status: row.status
      };
      this.globalMenuStatus();
    },
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.globalListenHeight(); // 监听页面变化，修改表格高度
    this.getTableData(); // 获取表格数据
  }
};
</script>

<style scoped>
.itemMaintain {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
</style>
