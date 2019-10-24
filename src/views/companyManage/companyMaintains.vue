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
        >
          <el-form-item label="公司名称：" prop="name">
            <el-input v-model="companyMaintainsForm.name" placeholder="请输入公司名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="父公司：" prop="fatherCompany">
            <el-select v-model="companyMaintainsForm.fatherCompany" placeholder="请选择父公司">
              <el-option
                v-for="item in companyMaintainsForm.options"
                :key="item.id"
                :label="item.label"
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
          <el-form-item label="成立日期：" prop="establishmentTime">
            <el-date-picker
              v-model="companyMaintainsForm.establishmentTime"
              type="date"
              placeholder="选择日期"
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
              placeholder="请输入省市县"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="通讯地址(详细)：" prop="postalAddress">
            <el-input @input="updateCompanyMaintainsShow" v-model="companyMaintainsForm.postalAddress" placeholder="请输入通讯地址" clearable></el-input>
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
              >{{ companyMaintainsForm.selFileList[0].name == "" ? '选择文件' : '重新选择' }}</el-button>
              <div slot="tip" class="el-upload__tip">
                文件不能超过
                <span>10M</span>
              </div>
              <div slot class v-if="companyMaintainsForm.fileList[0].fileName">
                已上传文件：
                <el-tooltip class="item" effect="dark" content="点击下载" placement="right">
                  <el-button
                    style="color:#67C23A"
                    type="text"
                  >{{ companyMaintainsForm.fileList[0].fileName }}</el-button>
                </el-tooltip>
              </div>
              <div slot class v-if="companyMaintainsForm.selFileList[0].name != ''">
                已选择文件：
                <el-button type="text">{{ companyMaintainsForm.selFileList[0].name }}</el-button>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="备注：" :prop="note">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 8}"
              placeholder="请输入备注"
              v-model="note"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="submit">
          <el-button
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
export default {
  name: "companyMaintains",
  watch: {},
  data() {
    return {
      // 表单
      companyMaintainsForm: {
        name: "", // 公司名称
        // 父公司
        fatherCompany: "", // 父公司下拉菜单默认值
        options: [
          {
            id: 1,
            label: "法拉利"
          },
          {
            id: 2,
            label: "宝马"
          },
          {
            id: 3,
            label: "劳斯莱斯"
          },
          {
            id: 4,
            label: "宾利"
          },
          {
            id: 5,
            label: "路虎"
          }
        ],
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
        companyMaintainsShow:true,
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
        companyNewsList: {} // 获取的公司信息
      },
      companyMaintainsFormLabelWidth: "140px", // 表单lable宽
      companyMaintainsFormRules: {}, // 表单验证
      note: "" // 备注
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
            this.companyMaintainsForm.companyNewsList = res.data.data;
            this.companyMaintainsForm.fatherCompany = res.data.data.pid;
            this.companyMaintainsForm.name = res.data.data.name;
            this.companyMaintainsForm.unifiedSocialCode =
              res.data.data.unifiedSocialCode;
            this.companyMaintainsForm.establishmentTime =
              res.data.data.establishmentTime;
            this.companyMaintainsForm.postalAddress =
              res.data.data.postalAddress;
            this.companyMaintainsForm.legalPerson = res.data.data.legalPerson;
            this.companyMaintainsForm.fileList.businessLicense =
              res.data.data.businessLicense;
            this.companyMaintainsForm.fileList[0].fileName =
              res.data.data.fileName;
            this.note = res.data.data.note;
            this.companyMaintainsForm.companyMaintainsShow = false
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
          let url = "company/addCompany";
          let companyMaintainsForm = document.getElementById(
            "companyMaintainsForm"
          );
          let formData = new FormData(companyMaintainsForm);
          formData.append("pid", this.companyMaintainsForm.fatherCompany);
          formData.append("name", this.companyMaintainsForm.name);
          formData.append(
            "unifiedSocialCode",
            this.companyMaintainsForm.unifiedSocialCode
          );
          formData.append(
            "establishmentTime",
            this.companyMaintainsForm.establishmentTime / 1000
          );
          formData.append(
            "postalAddress",
            this.companyMaintainsForm.area +
              this.companyMaintainsForm.postalAddress
          );
          formData.append("legalPerson", this.companyMaintainsForm.legalPerson);
          formData.append(
            "file",
            this.companyMaintainsForm.selFileList[0].file
          );
          formData.append("note", this.note);
          console.log();
          this.$axios
            .post(url, formData)
            .then(res => {
              if (res.data.code == 1) {
                this.$message({
                  message: res.data.msg,
                  type: "success"
                });
              }
            })
            .catch(error => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消" + title + "!"
          });
        });
    },
    // 详细地址的改变事件
    updateCompanyMaintainsShow() {
      if(this.companyMaintainsForm.postalAddress == "") {
        this.companyMaintainsForm.companyMaintainsShow = true
      }
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
/* 上传 */
.companyMaintains .el-upload__tip span {
  color: #f56c6c;
}
/* 提交 */
.companyMaintains .submit {
  text-align: center;
}
</style>
