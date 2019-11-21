<template>
  <!-- 个人目标管理 -->
  <div class="perSalesmanage">
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
          <el-form-item label="销售目标：">
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入销售目标"
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
          <el-form-item>
            <el-button type="primary" @click="searchSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </app-search>
      <!-- 表格table -->
      <el-row class="app-content-table">
        <el-col :span="24">
          <el-table
            ref="tableData"
            :data="globalTableData.slice((currentPage-1)*PageSize,currentPage*PageSize)"
            style="width: 100%;"
            :max-height="tableHeight"
            stripe
            size="medium"
            border
            row-key="id"
            :default-sort="{prop: 'createAt', order: 'ascending'}"
            v-loading="globalTableLoading"
          >
            <el-table-column label="展开行" width="80" type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="销售目标">
                    <span>{{ scope.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="客户名称">
                    <span>{{ scope.row.customerName }}</span>
                  </el-form-item>
                  <el-form-item label="项目名称">
                    <span>{{ scope.row.productName }}</span>
                  </el-form-item>
                  <el-form-item label="项目价格">
                    <span>{{ scope.row.price }}</span>
                  </el-form-item>
                  <el-form-item label="售出价格">
                    <span>{{ scope.row.sellingPrice }}</span>
                  </el-form-item>
                  <el-form-item label="跟进人员">
                    <span>{{ scope.row.userName }}</span>
                  </el-form-item>
                  <el-form-item label="预计开销">
                    <span>{{ scope.row.estimatedCost }}</span>
                  </el-form-item>
                  <el-form-item label="实际开销">
                    <span>{{ scope.row.actualCost }}</span>
                  </el-form-item>
                  <el-form-item label="销售状态">
                    <span>
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
                    </span>
                  </el-form-item>
                  <el-form-item label="添加时间">
                    <span>{{ scope.row.createAt | dateFilter }}</span>
                  </el-form-item>
                  <el-form-item label="修改时间">
                    <span>{{ scope.row.updateAt | dateFilter }}</span>
                  </el-form-item>
                  <el-form-item label="备注">
                    <span>{{ scope.row.note }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column label="序号" width="80" align="center">
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
                <el-tooltip effect="dark" content="行程记录" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="tripRecord(scope.$index, scope.row)"
                    circle
                  ><i class="iconfont iconjilu" style="font-size:12px"></i></el-button>
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
          <el-input v-model="editObj.name" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="项目：">
          <el-input v-model="editObj.productName" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="审批开销：" prop="estimatedCost">
          <el-input v-model="editObj.estimatedCost" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="实际开销：" prop="actualCost">
          <el-input v-model="editDialogForm.actualCost" placeholder="请输入实际开销" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售状态：">
          <el-tag size="small" v-if="editObj.saleStatus == 0" type="danger" effect="dark">未进行</el-tag>
          <el-tag size="small" v-else-if="editObj.saleStatus == 1" effect="dark">进行中</el-tag>
          <el-tag size="small" v-else-if="editObj.saleStatus == 2" type="success" effect="dark">2已完成</el-tag>
        </el-form-item>
        <el-form-item label="客户：" prop="customerId">
          <el-input v-model="editObj.customerName" disabled></el-input>
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
  name: "perSalesmanage",
  watch: {},
  data() {
    return {
      tableHeight: window.innerHeight - 240, // 表格高度
      // 搜索
      searchForm: {
        name: "",
        customerName: "",
        productName: "",
      },
      staffList: [], // 员工列表
      // 编辑dialog form
      editDialogForm: {
        isEditUserName: false,
        actualCost: "",
        sellingPrice: "",
        note: "",
        // 编辑菜单弹窗form表单校验规则
        editDialogFormRules: {
          actualCost: [
            { required: true, message: "请输入实际开销", trigger: "blur" }
          ],
          // sellingPrice: [
          //   { required: true, message: "请输入售出价格", trigger: "blur" }
          // ]
        }
      },
      // 根据id获取的销售目标对象
      editObj: {}
    };
  },
  methods: {
    // 搜索
    searchSubmit() {
      this.globalSearchUrl = "sale/getSaleByCurrentUsers";
      this.globalSearchFormData = {
        name: this.searchForm.name,
        customerName: this.searchForm.customerName,
        productName: this.searchForm.productName,
      };
      this.searchSubmitGlobal();
    },
    // 获取表格数据
    getTableData() {
      this.globalTableLoading = true;
      let url = "sale/getSaleByCurrentUsers";
      let formData = {
        name: "",
        customerName: "",
        productName: "",
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
            this.editDialogForm.actualCost = res.data.data.actualCost;
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
      let formData = {
        note: this.editDialogForm.note,
        productId: this.editObj.productId,
        productName: this.editObj.productName,
        updateAt: this.editObj.updateAt,
        estimatedCost: this.editObj.estimatedCost,
        actualCost: this.editDialogForm.actualCost,
        saleStatus: this.editObj.saleStatus,
        userId: this.editObj.userId,
        userName:this.editObj.userName,
        createAt: this.editObj.createAt,
        customerName:this.editObj.customerName,
        customerId: this.editObj.customerId,
        updateId: this.editObj.updateId,
        sellingPrice: this.editDialogForm.sellingPrice,
        createId: this.editObj.createId,
        price: this.editObj.price,
        name: this.editObj.name,
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
    },
    // 表格行 - 行程记录
    tripRecord(index,row) {
      // query  地址栏显示参数
      // this.$router.push({
      //   path: "/appMain/customerManage/salesTarget/tripRecord",
      //   query: {
      //     id: this.id
      //   }
      // });
      // 不存在历史记录
      // this.$router.replace({
      //   path: "/appMain/customerManage/salesTarget/tripRecord"
      // });
      // params 传参  地址栏不显示参数
      this.$router.push({
        name: "appMain/customerManage/salesTarget/tripRecord",
        params: {
          row: row,
        }
      });
    }
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.globalListenHeight(); // 监听页面变化，修改表格高度
    this.getTableData(); // 获取表格数据

    this.getCompanySelectGlobal(); // 获取公司下拉菜单
    this.getCustomerSelectGlobal(); // 获取公司下拉菜单
    this.getProductSelectGlobal(); // 获取公司下拉菜单
  }
};
</script>

<style scoped>
.perSalesmanage {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
.perSalesmanage .demo-table-expand {
  font-size: 0;
}
.perSalesmanage .demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}
.perSalesmanage .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 25%;
}
</style>
