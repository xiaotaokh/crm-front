<template>
  <!-- 公司维护 -->
  <div class="companyMaintains">
    <app-breadcrumb></app-breadcrumb>
    <!-- 除去面包屑主体 -->
    <div class="content-main">
      <!-- 新增公司信息 / 修改-->
      <div class="companyMaintainsForm">
        <el-divider>
          <i class="iconfont iconicon_gongsixinxiweihu"></i>
          {{ companyMaintainsForm.companyNewsList == null ? "新增公司信息" : "修改公司信息" }}
        </el-divider>
        <el-form
          :model="companyMaintainsForm"
          :label-width="companyMaintainsFormLabelWidth"
          :rules="companyMaintainsFormRules"
          ref="companyMaintainsForm"
          id="companyMaintainsForm"
          status-icon
        >
          <el-form-item label="公司名称：" prop="name">
            <el-input v-model="companyMaintainsForm.name" placeholder="请输入公司名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="父公司：" prop="fatherCompany">
            <el-select clearable v-model="companyMaintainsForm.fatherCompany" placeholder="请选择父公司">
              <el-option label="无" value="0"></el-option>
              <el-option
                v-for="item in companyMaintainsForm.fatherCompanyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="统一社会代码：" prop="unifiedSocialCode">
            <el-input
              v-model="companyMaintainsForm.unifiedSocialCode"
              placeholder="请输入统一社会代码"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="法人：" prop="legalPerson">
            <el-input v-model="companyMaintainsForm.legalPerson" placeholder="请输入法人" clearable></el-input>
          </el-form-item>
          <el-form-item label="法人电话：" prop="telephone">
            <el-input v-model="companyMaintainsForm.telephone" placeholder="请输入法人电话" clearable></el-input>
          </el-form-item>
          <el-form-item label="成立日期：" prop="establishmentTime">
            <el-date-picker
              v-model="companyMaintainsForm.establishmentTime"
              type="date"
              placeholder="请选择成立日期"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="省市县：" prop="area" v-if="companyMaintainsForm.companyMaintainsShow">
            <el-cascader
              :options="companyMaintainsForm.options2"
              v-model="companyMaintainsForm.areaList"
              expand-trigger="hover"
              @change="handleChange"
              clearable
              :props="companyMaintainsForm.optionProps"
              placeholder="请选择省市县"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="通讯地址(详细)：" prop="postalAddress">
            <el-input
              @input="updateCompanyMaintainsShow"
              v-model="companyMaintainsForm.postalAddress"
              placeholder="请输入通讯地址"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="营业执照：" prop="businessLicense">
            <el-upload
              action
              :show-file-list="false"
              :auto-upload="false"
              :on-change="uploadChange"
            >
              <el-button
                slot="trigger"
                size="small"
                type="primary"
              >{{ (!companyMaintainsForm.fileList[0].fileName && !companyMaintainsForm.selFileList[0].name) ? '上传文件' : '重新上传' }}</el-button>
              <div slot="tip" class="el-upload__tip">
                文件不能超过
                <span>10M</span>
              </div>
              <div slot v-if="companyMaintainsForm.fileList[0].fileName">
                已上传文件：
                <el-tooltip class="item" effect="dark" content="点击下载" placement="right">
                  <el-button
                    type="text"
                    @click="uploadDown"
                  >{{ companyMaintainsForm.fileList[0].fileName }}</el-button>
                </el-tooltip>
              </div>
              <div slot v-if="companyMaintainsForm.selFileList[0].name != ''">
                已选择文件：
                <el-button type="text">{{ companyMaintainsForm.selFileList[0].name }}</el-button>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入备注"
              v-model="note"
              maxlength="250"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="submit">
          <el-button
            :loading="btnLoading"
            size="small"
            type="primary"
            @click="companyMaintainsSubmit"
          >{{ companyMaintainsForm.companyNewsList == null ? "添加信息" : "修改信息" }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 引入省市县js文件
import areaJs from "../../plugin/select_area.js";
import { myMixins } from "@/mixins/index";
export default {
  inject: ["reload"],
  mixins: [myMixins],
  name: "companyMaintains",
  watch: {},
  data() {
    var validateUpload = (rule, value, callback) => {
      if (
        !this.companyMaintainsForm.fileList[0].fileName &&
        !this.companyMaintainsForm.selFileList[0].name
      ) {
        return callback(new Error("请上传营业执照"));
      }
      callback();
    };
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入法人电话"));
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
      // 表单
      companyMaintainsForm: {
        name: "", // 公司名称
        // 父公司
        fatherCompany: "", // 父公司下拉菜单默认值
        fatherCompanyList: [], // 父公司下拉菜单
        // 省市县
        area: "", // 省市县
        options2: areajson,
        areaList: [], // 省市县el-cascader默认值
        // el-cascader 配置项
        optionProps: {
          value: "label",
          label: "label",
          children: "children"
        },
        unifiedSocialCode: "", // 统一社会代码
        establishmentTime: "", // 成立日期
        postalAddress: "", // 通讯地址
        businessLicense: "", // 营业执照
        legalPerson: "", // 法人
        telephone: "", // 法人电话
        companyMaintainsShow: true,
        // 上传成功文件
        fileList: [
          {
            businessLicense: "",
            fileName: ""
          }
        ],
        // 选择文件
        selFileList: [
          {
            file: "",
            name: "",
            url: ""
          }
        ],
        companyNewsList: {}, // 获取的公司信息
        downloadhttp: "" // 文件下载地址
      },
      note: "", // 备注
      companyMaintainsFormLabelWidth: "140px", // 表单lable宽
      // 表单验证
      companyMaintainsFormRules: {
        name: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: "blur"
          }
        ],
        fatherCompany: [
          {
            required: true,
            message: "请选择父公司",
            trigger: "change"
          }
        ],
        unifiedSocialCode: [
          {
            required: true,
            message: "请输入统一社会代码",
            trigger: "blur"
          }
        ],
        legalPerson: [
          {
            required: true,
            message: "请输入法人",
            trigger: "blur"
          }
        ],
        telephone: [{ validator: checkPhone, trigger: "blur" }],
        establishmentTime: [
          {
            required: true,
            message: "请选择成立日期",
            trigger: "change"
          }
        ],
        area: [
          {
            required: true,
            message: "请选择省市县",
            trigger: "change"
          }
        ],
        postalAddress: [
          {
            required: true,
            message: "请输入通讯地址",
            trigger: "blur"
          }
        ],
        businessLicense: [{ validator: validateUpload }]
      }
    };
  },
  methods: {
    // 获取公司表单信息
    getFormData() {
      let url = "company/findCompanyByUser";
      this.$axios
        .get(url)
        .then(res => {
          if (res.data.code == 1) {
            console.log(res.data)
            this.companyMaintainsForm.companyNewsList = res.data.data; // 赋给公司信息表单

            this.companyMaintainsForm.fatherCompany = res.data.data.pid;
            this.companyMaintainsForm.name = res.data.data.name;
            this.companyMaintainsForm.unifiedSocialCode =
              res.data.data.unifiedSocialCode;
            this.companyMaintainsForm.establishmentTime =
              res.data.data.establishmentTime;
            this.companyMaintainsForm.postalAddress =
              res.data.data.postalAddress;
            this.companyMaintainsForm.legalPerson = res.data.data.legalPerson;
            this.companyMaintainsForm.telephone = res.data.data.telephone;
            this.companyMaintainsForm.fileList.businessLicense =
              res.data.data.businessLicense;
            this.companyMaintainsForm.fileList[0].fileName =
              res.data.data.fileName;
            this.note = res.data.data.note;
            this.companyMaintainsForm.companyMaintainsShow = false;

            this.globalFileName = res.data.data.fileName; // 用于下载问件时候的文件名

            this.handleFatherCompanyChange(); // 获取父公司下拉列表
            // 父公司默认值
            if (this.companyMaintainsForm.fatherCompany == 0) {
              this.companyMaintainsForm.fatherCompany = "无"; // pid为0 显示无
            } else {
              // 通过父公司pid 找到父公司name
              for (var i of this.companyMaintainsForm.fatherCompanyList) {
                if (this.companyMaintainsForm.fatherCompany == i.id) {
                  this.companyMaintainsForm.fatherCompany == i.name;
                }
              }
            }
          }
        })
        .catch(err => {
          return err;
        });
    },
    // 父公司下拉框
    handleFatherCompanyChange() {
      let url = "company/getCompanyByStatus";
      let formData = {
        status: "ACTIVE"
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          this.companyMaintainsForm.fatherCompanyList = res.data.data;
          // 截取掉父公司里相同的option
          for (var index in this.companyMaintainsForm.fatherCompanyList) {
            if (
              this.companyMaintainsForm.fatherCompanyList[index].name ==
              this.companyMaintainsForm.companyNewsList.name
            ) {
              this.companyMaintainsForm.fatherCompanyList.splice(index, 1);
            }
          }
        })
        .catch(err => {
          return err;
        });
    },
    // 选择文件之后
    uploadChange(file, fileList) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("上传文件不能超过不能超过 10MB!");
      } else {
        this.companyMaintainsForm.selFileList[0].file = file;
        this.companyMaintainsForm.selFileList[0].name = file.name;
      }
      return isLt10M;
    },

    // 省市县
    handleChange(value) {
      // 赋值给省市县字段 （先数组转字符串，再去掉所有的逗号）
      this.companyMaintainsForm.area = value.toString().replace(/,/g, "");
    },

    // 提交表单
    companyMaintainsSubmit() {
      this.$refs.companyMaintainsForm.validate(valid => {
        if (valid) {
          let title =
            this.companyMaintainsForm.companyNewsList == null
              ? "添加信息"
              : "修改信息";
          this.$confirm("是否" + title, title, {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.btnLoading = true;
              let companyMaintainsForm = document.getElementById(
                "companyMaintainsForm"
              );
              let formData = new FormData(companyMaintainsForm);
              // 父公司pid
              let pid = 0;
              if (this.companyMaintainsForm.fatherCompanyList.length != 0) {
                for (var i of this.companyMaintainsForm.fatherCompanyList) {
                  if (
                    this.companyMaintainsForm.fatherCompany == "无" ||
                    this.companyMaintainsForm.fatherCompany == 0
                  ) {
                    pid = 0;
                  } else if (
                    this.companyMaintainsForm.fatherCompany == i.id ||
                    this.companyMaintainsForm.fatherCompany == i.name
                  ) {
                    pid = i.id;
                  }
                }
              }
              formData.append("pid", pid);
              formData.append("name", this.companyMaintainsForm.name);
              formData.append(
                "unifiedSocialCode",
                this.companyMaintainsForm.unifiedSocialCode
              );
              formData.append(
                "establishmentTime",
                this.companyMaintainsForm.establishmentTime
              );
              formData.append(
                "postalAddress",
                this.companyMaintainsForm.area +
                  this.companyMaintainsForm.postalAddress
              );
              formData.append(
                "legalPerson",
                this.companyMaintainsForm.legalPerson
              );
              formData.append(
                "telephone",
                Number(this.companyMaintainsForm.telephone)
              );
              formData.append(
                "file",
                this.companyMaintainsForm.selFileList[0].file
              );
              formData.append("note", this.note);

              if (this.companyMaintainsForm.companyNewsList == null) {
                let url = "company/addCompany";
                // 添加信息
                this.$axios
                  .post(url, formData)
                  .then(res => {
                    this.btnLoading = false;
                    if (res.data.code == 1) {
                      this.reload();
                      this.$message({
                        message: res.data.msg,
                        type: "success"
                      });
                    } else if (res.data.code == 0) {
                      this.$message({
                        message: res.data.msg,
                        type: "error"
                      });
                    }
                  })
                  .catch(error => {
                    this.btnLoading = false;
                  });
              } else {
                let url = "company/updateCompany";
                formData.append(
                  "businessLicense",
                  this.companyMaintainsForm.companyNewsList.businessLicense
                );
                formData.append(
                  "createAt",
                  this.companyMaintainsForm.companyNewsList.createAt
                );
                formData.append(
                  "createId",
                  this.companyMaintainsForm.companyNewsList.createId
                );
                formData.append(
                  "id",
                  this.companyMaintainsForm.companyNewsList.id
                );
                formData.append(
                  "status",
                  this.companyMaintainsForm.companyNewsList.status
                );
                formData.append(
                  "updateAt",
                  this.companyMaintainsForm.companyNewsList.updateAt
                );
                formData.append(
                  "updateId",
                  this.companyMaintainsForm.companyNewsList.updateId
                );
                // 修改信息
                this.$axios
                  .post(url, formData)
                  .then(res => {
                    this.btnLoading = false;
                    if (res.data.code == 1) {
                      this.reload();
                      this.$message({
                        message: res.data.msg,
                        type: "success"
                      });
                    } else if (res.data.code == 0) {
                      this.$message({
                        message: res.data.msg,
                        type: "error"
                      });
                    }
                  })
                  .catch(error => {
                    this.btnLoading = false;
                  });
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消" + title + "!"
              });
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

    // 详细地址的改变事件
    updateCompanyMaintainsShow() {
      if (this.companyMaintainsForm.postalAddress == "") {
        this.companyMaintainsForm.companyMaintainsShow = true;
      }
    },

    // 下载
    uploadDown() {
      let url = "company/getBusinessLicenseByCompanyId";
      let formData = {
        id: this.companyMaintainsForm.companyNewsList.id
      };
      this.downloadFile(url, formData);
    }
  },
  mounted() {
    this.$store.commit("editBreadcrumb", this.$route.matched); // 面包屑
    this.getFormData();
  }
};
</script>

<style scoped>
.companyMaintains {
  width: 100%;
  height: 100%;
  position: relative;
  background: #fff;
}
/* form表单 */
.companyMaintains .companyMaintainsForm {
  padding: 10px;
  width: 700px;
  overflow: auto;
}
/* 父公司select */
.companyMaintains .el-select {
  width: 280px;
}
/* 上传 */
.companyMaintains .el-upload__tip span {
  color: #f56c6c;
}
/* 提交 */
.companyMaintains .submit {
  text-align: center;
}
/* 下载 */
.companyMaintains .download {
  color: #67c23a;
}
</style>
