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
            <el-table-column align="center" label="成立日期" width="160">
              <template slot-scope="scope">{{ scope.row.establishmentTime | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="通讯地址" width="320" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.postalAddress }}</template>
            </el-table-column>
            <el-table-column align="center" label="备注" min-width="280" show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- <el-popover
                  placement="top-start"
                  width="400"
                  trigger="hover"
                  :content="scope.row.note"
                >
                  <span slot="reference">{{scope.row.note}}</span>
                </el-popover> -->
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
  </div>
</template>

<script>
import { myMixins } from "@/mixins/index";
let that;
export default {
  mixins: [myMixins],
  name: "companyList",
  filters: {
    fatherCompany: function(value) {
      if (value == 0) {
        // 当父公司pid为0时候，显示无
        return "无";
      } else {
        for(let item of that.fatherCompanyList) {
          if(value == item.id) {
            return item.name
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
      fatherCompanyList: [] // 父公司列表
    };
  },
  methods: {
    // 搜索
    searchSubmit() {
      this.globalSearchUrl = "";
      this.globalSearchFormData = {
        role: this.searchForm.name
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
      console.log(row);
    },
    // 表格行删除事件
    handleDelete(index, row) {
      this.globalDeleteUrl = "";
      this.globalDeleteFormData = {
        id: row.id
      };
      this.handleDeleteGlobal();
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
          // for (let item of res.data.data) {
          //   if (item.pid == 0) {
          //     this.companyMaintainsForm.fatherCompany = "无";
          //   } else {
          //     if (this.companyMaintainsForm.fatherCompany == item.id) {
          //       this.companyMaintainsForm.fatherCompany = item.name;
          //     }
          //   }
          // }
        })
        .catch(err => {
          return err;
        });
    }
  },
 beforeCreate: function () {
     that = this;
 },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.globalListenHeight(); // 监听页面变化，修改表格高度

    // 获取表格数据
    this.getTableData();
    this.handleFatherCompanyList();
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
