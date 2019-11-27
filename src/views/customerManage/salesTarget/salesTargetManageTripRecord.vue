<template>
  <!-- 销售目标管理 行程记录路由跳转页 -->
  <div class="salesTargetManageTripRecord">
    <!-- 返回 -->
    <app-back :appBackPath="'/appMain/customerManage/salesTarget/salesTargetManage'"></app-back>
    <!-- 除去返回主体 -->
    <div class="content-main">
      <el-divider>
        <i class="iconfont iconjilu"></i>
        &nbsp;
        {{ title }} - 行程记录
      </el-divider>
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
            :default-sort="{prop: 'startAt', order: 'ascending'}"
            v-loading="globalTableLoading"
          >
            <el-table-column label="展开行" width="80" type="expand">
              <template slot-scope="scope">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="开始时间">
                    <span>{{ scope.row.startAt | dateFilter }}</span>
                  </el-form-item>
                  <el-form-item label="结束时间">
                    <span>{{ scope.row.endAt | dateFilter }}</span>
                  </el-form-item>
                  <el-form-item label="详情">
                    <span>{{ scope.row.details }}</span>
                  </el-form-item>
                  <el-form-item label="开销">
                    <span>{{ scope.row.expenditure }}</span>
                  </el-form-item>
                  <el-form-item label="记录状态">
                    <span>
                      <el-tag
                        size="small"
                        :type="scope.row.recordStatus == 0 ? 'danger' : 'success'"
                        effect="dark"
                      >{{ scope.row.recordStatus == 0 ? "未提交" : "提交" }}</el-tag>
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
            <el-table-column align="center" label="开始时间" width="160" sortable prop="startAt">
              <template slot-scope="scope">{{ scope.row.startAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="结束时间" width="160">
              <template slot-scope="scope">{{ scope.row.endAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="详情" width="240" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.details }}</template>
            </el-table-column>
            <el-table-column align="center" label="开销" width="120">
              <template slot-scope="scope">{{ scope.row.expenditure }}</template>
            </el-table-column>
            <el-table-column align="center" label="记录状态" width="120">
              <template slot-scope="scope">
                <el-tag
                  size="small"
                  :type="scope.row.recordStatus == 0 ? 'danger' : 'success'"
                  effect="dark"
                >{{ scope.row.recordStatus == 0 ? "未提交" : "提交" }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center" label="添加时间" width="160">
              <template slot-scope="scope">{{ scope.row.createAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="修改时间" width="160">
              <template slot-scope="scope">{{ scope.row.updateAt | dateFilter }}</template>
            </el-table-column>
            <el-table-column align="center" label="备注" width="180" show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.note }}</template>
            </el-table-column>
            <el-table-column fixed="right" width="180" align="center" label="操作">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="查看详情" placement="top">
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleDetail(scope.$index, scope.row)"
                    circle
                    icon="el-icon-tickets"
                  ></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="附件管理" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleFileManage(scope.$index, scope.row)"
                    circle
                  >
                    <i class="iconfont iconfujian" style="font-size:12px"></i>
                  </el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="退回" placement="top">
                  <el-button
                    size="small"
                    circle
                    type="warning"
                    @click="back(scope.$index, scope.row)"
                    v-if="scope.row.recordStatus == 1"
                  >
                    <i class="iconfont icontuihui" style="font-size:12px"></i>
                  </el-button>
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
    <el-dialog append-to-body center title="行程记录详情" :visible.sync="globalViewDetailFormVisible">
      <el-form :model="globalViewDetailForm" label-width="100px">
        <el-form-item label="开始时间：" prop="startAt">
          <el-date-picker
            v-model="globalViewDetailForm.startAt"
            type="date"
            readonly
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endAt">
          <el-date-picker
            v-model="globalViewDetailForm.endAt"
            type="date"
            readonly
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开销：">
          <el-input v-model="globalViewDetailForm.expenditure" readonly clearable></el-input>
        </el-form-item>
        <el-form-item label="详情：">
          <el-input
            type="textarea"
            readonly
            :autosize="{ minRows: 4, maxRows: 8}"
            v-model="globalViewDetailForm.details"
            maxlength="250"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="记录状态：">
          <el-tag
            size="small"
            :type="globalViewDetailForm.recordStatus == 0 ? 'danger' : 'success'"
            effect="dark"
          >{{ globalViewDetailForm.recordStatus == 0 ? "未提交" : "提交" }}</el-tag>
        </el-form-item>
        <el-form-item label="修改时间：" prop="endAt">
          <el-date-picker
            v-model="globalViewDetailForm.updateAt"
            type="date"
            readonly
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endAt">
          <el-date-picker
            v-model="globalViewDetailForm.endAt"
            type="date"
            readonly
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            readonly
            v-model="globalViewDetailForm.note"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button size="small" type="info" @click="viewDetailDialogFormCancleGlobal">取 消</el-button> -->
        <el-button size="small" type="primary" @click="viewDetailDialogFormSubmitGlobal">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 附件管理dialog -->
    <el-dialog append-to-body center title="附件管理" :visible.sync="fileManageVisible">
      <el-table
        :data="fileManageTableData"
        stripe
        max-height="400px"
        size="medium"
        v-loading="fileManageTableLoading"
        border
      >
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column align="center" label="附件名称" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column align="center" label="上传时间">
          <template slot-scope="scope">{{ scope.row.createAt | dateFilter }}</template>
        </el-table-column>
        <el-table-column fixed="right" width="60" align="center" label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="查看" placement="top">
              <el-button
                type="primary"
                size="small"
                @click="fileView(scope.$index, scope.row)"
                circle
                icon="el-icon-download"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { myMixins } from "@/mixins/index";
export default {
  mixins: [myMixins],
  name: "salesTargetManageTripRecord",
  watch: {},
  data() {
    return {
      // appBackPath: "/appMain/customerManage/salesTarget/salesTargetManageTripRecord", // 返回路径 appBackPath
      tableHeight: window.innerHeight - 240, // 表格高度
      title: "", // 行程记录标题名称
      fileManageTableData: [], // 附件管理表格
      fileManageVisible: false, // 附件管理dialog
      fileManageTableLoading: false, // // 附件管理loading
      recordId: "", // 销售目标中行程记录的id
    };
  },
  methods: {
    // 获取表格数据
    getTableData() {
      this.globalTableLoading = true;
      this.globalGetTableDataUrl = "saleRecord/getRecords";
      this.globalGetTableDataFormData = {
        saleId: this.$route.params.row.id
      };
      this.getTableDataGlobal();
    },
    // 表格行退回事件
    back(index, row) {
      this.$confirm("此操作不可逆, 是否继续?", "退回行程记录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let url = "saleRecord/returnRecord";
          let formData = {
            id:row.id
          };
          this.$axios
            .post(url, formData)
            .then(res => {
              if (res.data.code == 1) {
                this.getTableData(); // 重新获取表格数据
                this.$message({
                  type: "success",
                  message: res.data.msg
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
            message: "已取消退回"
          });
        });
    },
    // 表格行查看详情
    handleDetail(index, row) {
      this.globalViewDetailFormVisible = true;
      let url = "saleRecord/getRecordById";
      let formData = {
        id: row.id
      };
      this.getViewDetailFormGlobal(url, formData);
    },
    // 获取行程记录 - 附件表格列表
    getFileList(id) {
      this.fileManageTableLoading = true;
      let url = "file/getRecordFile";
      let formData = {
        recordId: id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.fileManageTableLoading = false;
            this.fileManageTableData = res.data.data;
          }
        })
        .catch(err => {
          return err;
        });
    },
    // 表格行附件管理
    handleFileManage(index, row) {
      this.recordId = row.id; // 存放行程记录id
      this.fileManageVisible = true;
      this.getFileList(row.id);
    },
    // 表格行附件管理 文件查看
    fileView(index, row) {
      this.globalFileName = row.name; // 用于下载问件时候的文件名
      let url = "file/downloadFileById";
      let formData = {
        id: row.id
      };
      this.downloadFile(url, formData);
    },
  },
  mounted() {
    if (!this.$route.params.row) {
      this.$router.push({
        path: "/appMain/customerManage/salesTarget/salesTargetManage"
      });
      return false;
    } else {
      this.title = this.$route.params.row.name;
    }
    this.globalListenHeight(); // 监听页面变化，修改表格高度
    this.getTableData(); // 获取表格数据
  }
};
</script>

<style scoped>
.salesTargetManageTripRecord {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
.salesTargetManageTripRecord .demo-table-expand {
  font-size: 0;
}
.salesTargetManageTripRecord .demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}
.salesTargetManageTripRecord .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
