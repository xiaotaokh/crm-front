<template>
  <!-- 公司列表 -->
  <div class="companyList">
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
          <el-form-item label="公司名称：">
            <el-input
              v-model="searchForm.name"
              @keyup.enter.native="searchSubmit"
              placeholder="请输入公司名称"
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
            style="width: 100%; table-layout:fixed"
            :max-height="tableHeight"
            stripe
            size="medium"
            border
            row-key="id"
            :default-sort = "{prop: 'establishmentTime', order: 'ascending'}"
            v-loading="globalTableLoading"
          >
            <el-table-column label="序号" fixed width="80" align="center">
              <template slot-scope="scope">
                <span>{{scope.$index+(currentPage - 1) * PageSize + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="公司名称" width="240" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.name }}</template>
            </el-table-column>
            <el-table-column align="center" label="法人" width="120">
              <template slot-scope="scope">{{ scope.row.legalPerson }}</template>
            </el-table-column>
            <el-table-column align="center" label="父公司" width="240" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.pid | fatherCompany }}</template>
            </el-table-column>
            <el-table-column align="center" label="统一社会代码" width="180">
              <template slot-scope="scope">{{ scope.row.unifiedSocialCode }}</template>
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
            <el-table-column align="center" label="法人电话" width="140">
              <template slot-scope="scope">{{ scope.row.telephone }}</template>
            </el-table-column>
            <el-table-column align="center" label="成立日期" width="160" prop="establishmentTime" sortable>
              <template slot-scope="scope">{{ scope.row.establishmentTime | dateFilter }}</template>
            </el-table-column>
            <el-table-column label="通讯地址" width="320" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.postalAddress }}</template>
            </el-table-column>
            <el-table-column label="备注" min-width="280" show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- <el-popover
                  placement="top-start"
                  width="400"
                  trigger="hover"
                  :content="scope.row.note"
                >
                  <span slot="reference">{{scope.row.note}}</span>
                </el-popover>-->
                {{scope.row.note}}
              </template>
            </el-table-column>
            <el-table-column fixed="right" width="140" align="center" label="操作">
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
    <!-- 查看详情dialog -->
    <el-dialog append-to-body center :title="viewDetailForm.name" :visible.sync="viewDetailFormVisible">
      <el-form :model="viewDetailForm" :label-width="viewDetailFormLabelWidth" ref="viewDetailForm">
        <el-form-item label="公司名称：">
          <el-input v-model="viewDetailForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="法人：">
          <el-input v-model="viewDetailForm.legalPerson" disabled></el-input>
        </el-form-item>
        <el-form-item label="父公司：">
          <el-input v-model="viewDetailForm.fatherCompany" disabled></el-input>
        </el-form-item>
        <el-form-item label="统一社会代码：">
          <el-input v-model="viewDetailForm.unifiedSocialCode" disabled></el-input>
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
        <el-form-item label="法人电话：">
          <el-input v-model="viewDetailForm.telephone" disabled></el-input>
        </el-form-item>
        <el-form-item label="成立日期：">
          <el-input v-model="viewDetailForm.establishmentTimeFilters" disabled></el-input>
        </el-form-item>
        <el-form-item label="通讯地址：">
          <el-input v-model="viewDetailForm.postalAddress" disabled></el-input>
        </el-form-item>
        <el-form-item label="营业执照：">
          <el-tooltip class="item" effect="dark" content="点击下载" placement="right">
            <el-button type="text" @click="uploadDown">{{ viewDetailForm.fileName }}</el-button>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            disabled
            v-model="viewDetailForm.note"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="viewDetailDialogFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="viewDetailDialogFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myMixins } from "@/mixins/index";
let that;
export default {
  mixins: [myMixins],
  name: "companyList",
  filters: {
    // 父公司过滤器
    fatherCompany: function(value) {
      if (value == 0) {
        // 当父公司pid为0时候，显示无
        return "无";
      } else {
        for (let item of that.fatherCompanyList) {
          if (value == item.id) {
            return item.name;
          }
        }
      }
    }
  },
  watch: {},
  data() {
    return {
      // 搜索
      searchForm: {
        name: ""
      },
      tableHeight: window.innerHeight - 300, // 表格高度
      fatherCompanyList: [], // 父公司列表
      // 查看详情dialog
      viewDetailForm: {},
      viewDetailFormVisible: false,
      viewDetailFormLabelWidth: "140px"
    };
  },
  methods: {
    // 搜索
    searchSubmit() {
      this.globalSearchUrl = "company/findCompanyByName";
      this.globalSearchFormData = {
        name: this.searchForm.name
      };
      this.searchSubmitGlobal();
    },
    // 获取表格数据
    getTableData() {
      this.globalGetTableDataUrl = "company/getAll";
      this.getTableDataGlobal();
    },
    // 表格行查看详情
    handleDetail(index, row) {
      let url = "company/getCompanyById";
      let formData = {
        id: row.id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.viewDetailForm = res.data.data;
            this.globalFileName = this.viewDetailForm.fileName; // 用于下载问件时候的文件名
            this.viewDetailFormVisible = true;  // 弹出层
            this.viewDetailForm["fatherCompany"] = this.$options.filters[
              "fatherCompany"
            ](this.viewDetailForm.pid); // 新增父公司key - value
            this.viewDetailForm[
              "establishmentTimeFilters"
            ] = this.$options.filters["dateFilter"](this.viewDetailForm.establishmentTime); // 新增转换后的成立日期key - value
          }
        })
        .catch(err => {});
    },
    // 表格行删除事件
    handleDelete(index, row) {
      this.globalDeleteUrl = "company/delCompanyById";
      this.globalDeleteFormData = {
        id: row.id
      };
      this.handleDeleteGlobal();
    },
    // 表格行查看详情取消
    viewDetailDialogFormCancle() {
      this.viewDetailFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消查看详情!"
      });
    },
    // 表格行查看详情确定
    viewDetailDialogFormSubmit() {
      this.viewDetailFormVisible = false;
    },
    // 表格switch事件
    menuStatus(index, row) {
      this.globalMenuStatusUrl = "company/updateCompanyStatus";
      this.globalMenuStatusFormData = {
        id: row.id,
        status: row.status
      };
      this.globalMenuStatus();
    },
    // 查看详情营业执照下载
    uploadDown() {
      let url = "company/getBusinessLicenseByCompanyId";
      let formData = {
        id: this.viewDetailForm.id
      };
      this.downloadFile(url, formData);
    },
    // 父公司列表
    handleFatherCompanyList() {
      let url = "company/getCompanyByStatus";
      let formData = {
        status: "ACTIVE"
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          this.fatherCompanyList = res.data.data;
        })
        .catch(err => {
          return err;
        });
    }
  },
  beforeCreate: function() {
    that = this;
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.globalListenHeight(); // 监听页面变化，修改表格高度
    this.getTableData();// 获取表格数据
    this.handleFatherCompanyList();  // 获取父公司列表
  }
};
</script>

<style scoped>
.companyList {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
</style>
