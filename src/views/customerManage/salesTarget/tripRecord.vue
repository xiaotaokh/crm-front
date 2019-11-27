<template>
  <!-- 个人目标管理 行程记录路由跳转页 -->
  <div class="tripRecord">
    <!-- 返回 -->
    <app-back :appBackPath="appBackPath"></app-back>
    <!-- 除去返回主体 -->
    <div class="content-main">
      <el-divider>
        <i class="iconfont iconjilu"></i>
        &nbsp;
        {{ title }} - 行程记录
      </el-divider>
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
            <el-table-column fixed="right" width="200" align="center" label="操作">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleEdit(scope.$index, scope.row)"
                    circle
                    icon="el-icon-edit"
                    v-if="scope.row.recordStatus == 0"
                  ></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="查看详情" placement="top">
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleDetail(scope.$index, scope.row)"
                    v-if="scope.row.recordStatus == 1"
                    circle
                    icon="el-icon-tickets"
                  ></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="提交" placement="top">
                  <el-button
                    type="primary"
                    size="small"
                    @click="tripRecordSubmit(scope.$index, scope.row)"
                    circle
                    v-if="scope.row.recordStatus == 0"
                  >
                    <i class="iconfont icontijiao1" style="font-size:12px"></i>
                  </el-button>
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
                <el-tooltip effect="dark" content="删除" placement="top">
                  <el-button
                    size="small"
                    circle
                    type="danger"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)"
                    v-if="scope.row.recordStatus == 0"
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
    <el-dialog append-to-body center title="添加行程记录" :visible.sync="globalaAddDialogFormVisible">
      <el-form
        :model="addDialogForm"
        ref="addDialogForm"
        :label-width="addDialogForm.addDialogFormLabelWidth"
        :rules="addDialogForm.addDialogFormRules"
      >
        <el-form-item label="开始时间：" prop="startAt">
          <el-date-picker
            v-model="addDialogForm.startAt"
            type="date"
            value-format="timestamp"
            placeholder="请选择开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="startAt">
          <el-date-picker
            v-model="addDialogForm.endAt"
            type="date"
            value-format="timestamp"
            placeholder="请选择结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开销：">
          <el-input v-model="addDialogForm.expenditure" placeholder="请输入开销" clearable></el-input>
        </el-form-item>
        <el-form-item label="详情：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入详情"
            v-model="addDialogForm.details"
            maxlength="250"
            show-word-limit
          ></el-input>
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
    <!-- 编辑dialog -->
    <el-dialog append-to-body center title="修改行程记录" :visible.sync="globalaEditDialogFormVisible">
      <el-form
        :model="editDialogForm"
        ref="editDialogForm"
        label-width="100px"
        :rules="editDialogForm.editDialogFormRules"
      >
        <el-form-item label="开始时间：" prop="startAt">
          <el-date-picker
            v-model="editDialogForm.startAt"
            type="date"
            value-format="timestamp"
            placeholder="请选择开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endAt">
          <el-date-picker
            v-model="editDialogForm.endAt"
            type="date"
            value-format="timestamp"
            placeholder="请选择结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="开销：">
          <el-input v-model="editDialogForm.expenditure" placeholder="请输入开销" clearable></el-input>
        </el-form-item>
        <el-form-item label="详情：">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入详情"
            v-model="editDialogForm.details"
            maxlength="250"
            show-word-limit
          ></el-input>
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
      <!-- 按钮组 -->
      <el-row type="flex" justify="start" class="app-btn-group" v-if="fileUploadDel">
        <el-col :span="24">
          <el-form id="upload">
            <el-upload action :auto-upload="false" :on-change="upload" :show-file-list="false">
              <el-button
                :loading="uploadFileLoading"
                icon="el-icon-upload"
                size="mini"
                type="primary"
              >上传</el-button>
            </el-upload>
          </el-form>
        </el-col>
      </el-row>
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
        <el-table-column fixed="right" width="120" align="center" label="操作">
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
            <el-tooltip effect="dark" content="删除" placement="top" v-if="fileUploadDel">
              <el-button
                size="small"
                circle
                type="danger"
                icon="el-icon-delete"
                @click="handleDelFile(scope.$index, scope.row)"
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
  name: "tripRecord",
  watch: {},
  data() {
    return {
      appBackPath: "/appMain/customerManage/salesTarget/perSalesmanage", // 返回路径 appBackPath
      tableHeight: window.innerHeight - 300, // 表格高度
      title: "", // 行程记录标题名称
      // 添加dialog form
      addDialogForm: {
        addDialogFormVisible: false,
        addDialogFormLabelWidth: "100px",
        expenditure: "", // 开销
        endAt: "", // 结束时间
        details: "", // 详情
        startAt: "", // 开始时间
        note: "", // 备注
        addDialogFormRules: {
          startAt: [
            { required: true, message: "请选择开始时间", trigger: "change" }
          ],
          endAt: [
            { required: true, message: "请选择结束时间", trigger: "change" }
          ]
        }
      },
      // 编辑dialog form
      editDialogForm: {
        editDialogFormObj: {}, // 存放临时的记录对象
        expenditure: "", // 开销
        endAt: "", // 结束时间
        details: "", // 详情
        startAt: "", // 开始时间
        note: "", // 备注
        // 编辑菜单弹窗form表单校验规则
        editDialogFormRules: {
          startAt: [
            { required: true, message: "请选择开始时间", trigger: "change" }
          ],
          endAt: [
            { required: true, message: "请选择结束时间", trigger: "change" }
          ]
        }
      },
      fileManageTableData: [], // 附件管理表格
      fileManageVisible: false, // 附件管理dialog
      fileManageTableLoading: false, // // 附件管理loading
      recordId: "", // 销售目标中行程记录的id
      uploadFileLoading: false, // 附件上传按钮 Loading
      fileUploadDel:true,  // 附件管理上传按钮显示
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
    // 添加表单重置
    addReset() {
      this.addDialogForm.expenditure = "";
      this.addDialogForm.endAt = "";
      this.addDialogForm.details = "";
      this.addDialogForm.startAt = "";
      this.addDialogForm.note = "";
    },
    // 添加确定
    addDialogFormSubmit() {
      var url = "saleRecord/addRecord";
      let formData = {
        expenditure: this.addDialogForm.expenditure,
        note: this.addDialogForm.note,
        saleId: this.$route.params.row.id,
        endAt: this.addDialogForm.endAt,
        details: this.addDialogForm.details,
        startAt: this.addDialogForm.startAt
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
    // 表格行编辑事件
    handleEdit(index, row) {
      let url = "saleRecord/getRecordById";
      let formData = {
        id: row.id
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.globalaEditDialogFormVisible = true; // 弹出层
            this.editDialogForm.editDialogFormObj = res.data.data;
            this.editDialogForm.startAt = res.data.data.startAt;
            this.editDialogForm.endAt = res.data.data.endAt;
            this.editDialogForm.expenditure = res.data.data.expenditure;
            this.editDialogForm.details = res.data.data.details;
            this.editDialogForm.note = res.data.data.note;
          }
        })
        .catch(err => {});
    },
    // 表格行编辑确定
    editDialogFormSubmit() {
      var url = "saleRecord/updateRecord";
      let formData = {
        expenditure: this.editDialogForm.expenditure,
        note: this.editDialogForm.note,
        endAt: this.editDialogForm.endAt,
        details: this.editDialogForm.details,
        startAt: this.editDialogForm.startAt,
        saleId: this.editDialogForm.editDialogFormObj.saleId,
        updateAt: this.editDialogForm.editDialogFormObj.updateAt,
        createAt: this.editDialogForm.editDialogFormObj.createAt,
        updateId: this.editDialogForm.editDialogFormObj.updateId,
        recordStatus: this.editDialogForm.editDialogFormObj.recordStatus,
        createId: this.editDialogForm.editDialogFormObj.createId,
        id: this.editDialogForm.editDialogFormObj.id,
        status: this.editDialogForm.editDialogFormObj.status
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
    // 表格行行程记录提交
    tripRecordSubmit(index, row) {
      let url = "saleRecord/submitRecord";
      let formData = {
        id: row.id
      };
      this.$confirm("此操作不可逆，是否继续？", "提交行程记录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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
            message: "已取消提交!"
          });
        });
    },
    // 表格行删除事件
    handleDelete(index, row) {
      this.globalDeleteUrl = "file/delFile";
      this.globalDeleteFormData = {
        id: row.id
      };
      this.handleDeleteGlobal();
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
      // 根据记录状态是否显示上传按钮
      if(row.recordStatus == 1) {
        this.fileUploadDel = false;
      }else {
        this.fileUploadDel = true;
      }
      this.fileManageVisible = true;
      this.getFileList(row.id);
    },
    // 附件管理上传
    upload(file) {
      this.uploadFileLoading = true;
      let url = "file/addRecordFile";
      let upload = document.getElementById("upload");
      let formData = new FormData(upload);
      // let formData = new URLSearchParams()
      formData.append("file", file);
      formData.append("recordId", this.recordId);
      this.$axios
        .post(url, formData, {
          headers: {
            enctype: "multipart/form-data",
            dataType: "text",
            processData: false,
            contentType: false
          }
        })
        .then(res => {
          // console.log(formData.get("file"))
          if (res.data.code == 1) {
            this.$message({
              type: "success",
              message: res.data.msg
            });
            this.uploadFileLoading = false;
            this.getFileList(this.recordId); // 刷新该行程记录附件列表
          }
        })
        .catch(err => {
          return err;
        });
    },
    // 文件查看
    fileView(index, row) {
      this.globalFileName = row.name; // 用于下载问件时候的文件名
      let url = "file/downloadFileById";
      let formData = {
        id: row.id
      };
      this.downloadFile(url, formData);
    },
    // 文件删除
    handleDelFile(index, row) {
      let url = "file/delFile";
      let formData = {
        id: row.id
      };
      this.$confirm("此操不可逆, 是否继续?", "删除信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .post(url, formData)
            .then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
              }
              this.getFileList(this.recordId); // 刷新该行程记录附件列表
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
    }
  },
  mounted() {
    if (!this.$route.params.row) {
      this.$router.push({
        path: "/appMain/customerManage/salesTarget/perSalesmanage"
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
.tripRecord {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
.tripRecord .demo-table-expand {
  font-size: 0;
}
.tripRecord .demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}
.tripRecord .demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
