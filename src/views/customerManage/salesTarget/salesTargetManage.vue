<template>
  <!-- 销售目标管理 -->
  <div class="salesTargetManage">
    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <!-- 搜索 -->
      <app-search :isUnfold="true" :searchNum="5">
        <el-form
          @submit.native.prevent
          size="small"
          :inline="true"
          ref="searchForm"
          :model="searchForm"
          label-width="100px"
        >
          <el-form-item label="销售目标：">
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入销售目标"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="跟进人员：">
            <el-input
              v-model="searchForm.userName"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入跟进人员"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="客户：">
            <el-input
              v-model="searchForm.customerName"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入客户"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="项目：">
            <el-input
              v-model="searchForm.productName"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入项目"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="所属公司：" prop="companyId">
            <el-select v-model="searchForm.companyId" size="small" placeholder="请选择所属公司">
              <el-option
                v-for="item in globalCompanySelect"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button class="search-submit" size="mini" type="primary" @click="searchSubmit">查询</el-button>
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
            <el-table-column align="center" label="销售目标" width="180" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="客户名称" width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.customerName }}</template>
            </el-table-column>
            <el-table-column align="center" label="项目名称" width="180" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.productName }}</template>
            </el-table-column>
            <el-table-column align="center" label="项目价格" width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.price }}</template>
            </el-table-column>
            <el-table-column align="center" label="售出价格" width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.sellingPrice }}</template>
            </el-table-column>
            <el-table-column align="center" label="跟进人员" width="120" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.userName }}</template>
            </el-table-column>
            <el-table-column align="center" label="预计开销" width="120">
              <template slot-scope="scope">{{ scope.row.estimatedCost }}</template>
            </el-table-column>
            <el-table-column align="center" label="实际开销" width="120">
              <template slot-scope="scope">{{ scope.row.actualCost }}</template>
            </el-table-column>
            <el-table-column align="center" label="销售状态" width="120">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  v-if="scope.row.saleStatus == 0"
                  type="danger"
                  effect="dark"
                >未进行</el-tag>
                <el-tag size="small" v-else-if="scope.row.saleStatus == 1" effect="dark">进行中</el-tag>
                <el-tag
                  size="small"
                  v-else-if="scope.row.saleStatus == 2"
                  type="success"
                  effect="dark"
                >2已完成</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="添加时间" width="160" prop="createAt" sortable>
              <template slot-scope="scope">{{ scope.row.createAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="修改时间" width="160">
              <template slot-scope="scope">{{ scope.row.updateAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="备注" width="180" show-overflow-tooltip>
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
    <el-dialog append-to-body center title="添加销售目标" :visible.sync="globalaAddDialogFormVisible">
      <el-form
        :model="addDialogForm"
        ref="addDialogForm"
        :label-width="addDialogForm.addDialogFormLabelWidth"
        :rules="addDialogForm.addDialogFormRules"
      >
        <el-form-item label="销售目标：" prop="name">
          <el-input v-model="addDialogForm.name" placeholder="请输入销售目标" clearable></el-input>
        </el-form-item>
        <el-form-item label="跟进人员所属公司：" prop="companyId">
          <el-select
            v-model="addDialogForm.companyId"
            size="small"
            @change="selectCompany"
            placeholder="请选择跟进人员所属公司"
          >
            <el-option
              v-for="item in globalCompanySelect"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进人员：" prop="staffId">
          <el-select v-model="addDialogForm.staffId" size="small" placeholder="请选择跟进人员">
            <el-option v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户：" prop="customerId">
          <el-select v-model="addDialogForm.customerId" size="small" placeholder="请选择客户">
            <el-option
              v-for="item in globalCustomerSelect"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目：" prop="productId">
          <el-select v-model="addDialogForm.productId" size="small" placeholder="请选择项目">
            <el-option
              v-for="item in globalProductSelect"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计开销：" prop="estimatedCost">
          <el-input v-model="addDialogForm.estimatedCost" placeholder="请输入预计开销" clearable></el-input>
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
      @close="editDialogForm.isEditUserName = false"
    >
      <el-form
        :model="editDialogForm"
        ref="editDialogForm"
        label-width="140px"
        :rules="editDialogForm.editDialogFormRules"
      >
        <el-form-item label="销售目标：" prop="name">
          <el-input v-model="editDialogForm.name" placeholder="请输入销售目标" clearable></el-input>
        </el-form-item>
        <el-form-item label="项目：">
          <el-input v-model="editObj.productName" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="审批开销：" prop="estimatedCost">
          <el-input v-model="editDialogForm.estimatedCost" placeholder="请输入审批开销" clearable></el-input>
        </el-form-item>
        <el-form-item label="实际开销：" prop="actualCost">
          <el-input v-model="editDialogForm.actualCost" placeholder="请输入实际开销" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售状态：">
          <el-tag size="small" v-if="editObj.saleStatus == 0" type="danger" effect="dark">未进行</el-tag>
          <el-tag size="small" v-else-if="editObj.saleStatus == 1" effect="dark">进行中</el-tag>
          <el-tag size="small" v-else-if="editObj.saleStatus == 2" type="success" effect="dark">2已完成</el-tag>
        </el-form-item>
        <el-form-item label="跟进人员：" v-if="!editDialogForm.isEditUserName">
          <el-input style="width:50%;margin-right:10px" v-model="editObj.userName" disabled></el-input>
          <el-button type="text" @click="editUserName">修改</el-button>
        </el-form-item>
        <el-form-item label="跟进人员所属公司：" prop="companyId" v-if="editDialogForm.isEditUserName">
          <el-select
            v-model="editDialogForm.companyId"
            size="small"
            @change="selectCompanyEdit"
            placeholder="请选择跟进人员所属公司"
          >
            <el-option
              v-for="item in globalCompanySelect"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进人员：" prop="staffId" v-if="editDialogForm.isEditUserName">
          <el-select v-model="editDialogForm.staffId" size="small" placeholder="请选择跟进人员">
            <el-option v-for="item in staffList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户：" prop="customerId">
          <el-select v-model="editDialogForm.customerId" size="small" placeholder="请选择客户">
            <el-option
              v-for="item in globalCustomerSelect"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目价格：">
          <el-input v-model="editObj.price" disabled></el-input>
        </el-form-item>
        <el-form-item label="售出价格：" prop="sellingPrice">
          <el-input v-model="editDialogForm.sellingPrice" placeholder="请输入售出价格" clearable></el-input>
        </el-form-item>
        <el-form-item label="修改时间：">
          <el-input v-model="editObj.updateAt_new" disabled></el-input>
        </el-form-item>
        <el-form-item label="创建时间：">
          <el-input v-model="editObj.createAt_new" disabled></el-input>
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
  name: "salesTargetManage",
  watch: {},
  data() {
    return {
      tableHeight: window.innerHeight - 380, // 表格高度
      // 搜索
      searchForm: {
        name: "",
        userName: "",
        customerName: "",
        productName: "",
        companyId: ""
      },
      // 添加dialog form
      addDialogForm: {
        addDialogFormVisible: false,
        addDialogFormLabelWidth: "140px",
        name: "",
        companyId: "", // 公司id
        staffId: "", // 跟进人员id
        customerId: "", // 客户 id
        productId: "", // 项目 id
        estimatedCost: "", // 预计开销
        addDialogFormRules: {
          name: [
            { required: true, message: "请输入销售目标", trigger: "blur" }
          ],
          companyId: [
            {
              required: true,
              message: "请选择跟进人员所属公司",
              trigger: "change"
            }
          ],
          staffId: [
            { required: true, message: "请选择跟进人员", trigger: "change" }
          ],
          customerId: [
            { required: true, message: "请选择客户", trigger: "change" }
          ],
          productId: [
            { required: true, message: "请选择项目", trigger: "change" }
          ],
          estimatedCost: [
            { required: true, message: "请输入预计开销", trigger: "blur" }
          ]
        }
      },
      staffList: [], // 员工列表
      // 编辑dialog form
      editDialogForm: {
        isEditUserName: false,
        name: "",
        estimatedCost: "",
        actualCost: "",
        staffId: "",
        customerId: "",
        sellingPrice: "",
        note: "",
        companyId: "",
        customerId: "",
        // 编辑菜单弹窗form表单校验规则
        editDialogFormRules: {
          name: [
            { required: true, message: "请输入销售目标", trigger: "blur" }
          ],
          estimatedCost: [
            { required: true, message: "请输入预计开销", trigger: "blur" }
          ],
          actualCost: [
            { required: true, message: "请输入实际开销", trigger: "blur" }
          ],
          customerId: [
            { required: true, message: "请选择客户", trigger: "change" }
          ],
          sellingPrice: [
            { required: true, message: "请输入售出价格", trigger: "blur" }
          ]
        }
      },
      // 根据id获取的销售目标对象
      editObj: {}
    };
  },
  methods: {
    // 搜索
    searchSubmit() {
      this.globalSearchUrl = "sale/getAll";
      this.globalSearchFormData = {
        name: this.searchForm.name,
        userName: this.searchForm.userName,
        customerName: this.searchForm.customerName,
        productName: this.searchForm.productName,
        companyId: this.searchForm.companyId
      };
      this.searchSubmitGlobal();
    },
    // 获取表格数据
    getTableData() {
      this.globalTableLoading = true;
      let url = "sale/getAll";
      let formData = {
        name: "",
        userName: "",
        customerName: "",
        productName: "",
        companyId: ""
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          this.globalTableData = res.data.data; // 获取表格数据
          this.globalTableLoading = false;
          this.totalCount = res.data.data.length; // 将数据的长度赋值给totalCount
        })
        .catch(err => {});
    },
    // 添加表单重置
    addReset() {
      this.addDialogForm.name = "";
      this.addDialogForm.companyId = "";
      this.addDialogForm.staffId = "";
      this.addDialogForm.customerId = "";
      this.addDialogForm.productId = "";
      this.addDialogForm.estimatedCost = "";
    },
    // 添加确定
    addDialogFormSubmit() {
      var url = "sale/addSale";
      var userId = "";
      if (this.addDialogForm.staffId == "请选择跟进人员") {
        this.$message({
          type: "warning",
          message: "请先选择跟进人员!"
        });
        return false;
      } else {
        userId = this.addDialogForm.staffId;
      }
      let formData = {
        name: this.addDialogForm.name,
        userId: userId,
        customerId: this.addDialogForm.productId,
        productId: this.addDialogForm.productId,
        estimatedCost: this.addDialogForm.estimatedCost
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
              this.addReset(); // 重置表单数据
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
    // 表格行编辑事件
    handleEdit(index, row) {
      let url = "sale/getSaleById";
      let formData = {
        id: row.id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.globalaEditDialogFormVisible = true; // 弹出层
            this.editObj = res.data.data;
            this.editDialogForm.name = res.data.data.name;
            this.editDialogForm.estimatedCost = res.data.data.estimatedCost;
            this.editDialogForm.actualCost = res.data.data.actualCost;
            this.editDialogForm.customerId = res.data.data.customerId;
            this.editDialogForm.sellingPrice = res.data.data.sellingPrice;
            this.editDialogForm.note = res.data.data.note;

            this.editObj["updateAt_new"] = this.$options.filters["dateFilter"](
              this.editObj.updateAt
            ); // 新增转换后的修改时间key - value
            this.editObj["createAt_new"] = this.$options.filters["dateFilter"](
              this.editObj.createAt
            ); // 新增转换后的创建时间key - value
          }
        })
        .catch(err => {});
    },
    // 表格行编辑确定
    editDialogFormSubmit() {
      var url = "sale/updateSale";
      // 跟进人员id
      var userId = "";
      if (this.editDialogForm.isEditUserName) {
        if (this.editDialogForm.staffId != "") {
          userId = this.editDialogForm.staffId;
        } else {
          this.$message({
            type: "warning",
            message: "请先选择跟进人员!"
          });
          return false;
        }
      } else {
        userId = this.editObj.userId;
      }
      if (isNaN(userId)) {
        this.$message({
          type: "warning",
          message: "请先选择跟进人员!"
        });
        return false;
      } else {
      }
      let formData = {
        note: this.editDialogForm.note,
        productId: this.editObj.productId,
        productName: this.editObj.productName,
        updateAt: this.editObj.updateAt,
        estimatedCost: this.editDialogForm.estimatedCost,
        actualCost: this.editDialogForm.actualCost,
        saleStatus: this.editObj.saleStatus,
        userId: userId,
        createAt: this.editObj.createAt,
        customerId: this.editDialogForm.customerId,
        updateId: this.editObj.updateId,
        sellingPrice: this.editDialogForm.sellingPrice,
        createId: this.editObj.createId,
        price: this.editObj.price,
        name: this.editDialogForm.name,
        id: this.editObj.id,
        status: this.editObj.status
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
    // 编辑form表单的跟进人员是否改变
    editUserName() {
      this.editDialogForm.isEditUserName = true;
      this.editDialogForm.staffId = "";
    },
    // 表格行删除事件
    handleDelete(index, row) {
      this.globalDeleteUrl = "sale/deleteSaleById";
      this.globalDeleteFormData = {
        id: row.id
      };
      this.handleDeleteGlobal();
    },
    // 新增时 - 公司下拉菜单 改变
    selectCompany() {
      // 把跟进人selsect清空
      this.addDialogForm.staffId = "请选择跟进人员";
      // 根据公司id获取员工信息
      let url = "user/getUserSelectByCurrentUsers";
      let formData = {
        companyId: this.addDialogForm.companyId
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.staffList = res.data.data;
          }
        })
        .catch(err => {});
    },
    // 编辑时 - 公司下拉菜单 改变
    selectCompanyEdit() {
      // 把跟进人清空
      this.editDialogForm.staffId = "请选择跟进人员";
      // 根据公司id获取员工信息
      let url = "user/getUserSelectByCurrentUsers";
      let formData = {
        companyId: this.editDialogForm.companyId
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.staffList = res.data.data;
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.globalListenHeight(); // 监听页面变化，修改表格高度
    this.getTableData(); // 获取表格数据

    this.getCompanySelectGlobal(); // 获取公司下拉菜单
    this.getCustomerSelectGlobal(); // 获取客户下拉菜单
    this.getProductSelectGlobal(); // 获取项目下拉菜单
  }
};
</script>

<style scoped>
.salesTargetManage {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
</style>
