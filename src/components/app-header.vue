<template>
  <div class="app-header">
    <div
      class="logo"
      :style="'width: '+this.$store.state.sliderWidth+'px'"
      v-if="this.$store.state.isHeaderLogo"
    >
      <!-- <img src="../assets/logo.png" class="img_1" alt /> -->
      <img src="../assets/logo_v9.png" class="img_1" alt />
    </div>
    <div
      class="logo"
      :style="'width: '+this.$store.state.sliderWidth+'px'"
      v-if="!this.$store.state.isHeaderLogo"
    >
      <!-- <img src="../assets/logo_v2.png" class="img_2" alt /> -->
      <img src="../assets/logo_v4.png" class="img_2" alt />
    </div>
    <div
      class="header-right clearfix"
      :style="'position: absolute;left: '+
      this.$store.state.appContentWidth+
      'px;width: calc(100% - '+
      this.$store.state.appContentWidth+
      'px)'"
    >
      <!-- 菜单展开收缩 -->
      <div class="isCollapse" v-if="this.$store.state.isHeaderLogo">
        <el-tooltip class="item" effect="dark" content="折叠菜单" placement="right">
          <el-button type="text" @click="handleSliderIsCollapse">
            <i class="iconfont iconcaidan_shousuo"></i>
          </el-button>
        </el-tooltip>
      </div>
      <div class="isCollapse" v-if="!this.$store.state.isHeaderLogo">
        <el-tooltip class="item" effect="dark" content="展开菜单" placement="right">
          <el-button type="text" @click="handleSliderIsCollapse">
            <i class="iconfont iconcaidan_zhankai"></i>
          </el-button>
        </el-tooltip>
      </div>
      <!-- 搜索框 -->
      <div class="search">
        <el-input placeholder="请输入您想要查询的关键词..." v-model="headerSearch" size="small" clearable>
          <el-button
            class="search-btn"
            type="primary"
            slot="append"
            size="small"
            icon="el-icon-search"
          ></el-button>
        </el-input>
      </div>
      <ul class="clearfix">
        <!-- 用户名 -->
        <li class="userIcon">
          <el-button type="text" class="user-name-icon">
            <i class="iconfont iconyonghu"></i>
          </el-button>
          <el-dropdown append-to-body :hide-on-click="false">
            <span class="el-dropdown-link">{{ this.$store.state.globalUserInformation.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>用户名：{{ this.$store.getters.getGlobalUserInformation.userName }}</el-dropdown-item>
              <el-dropdown-item>角色：{{ this.$store.getters.getGlobalUserInformation.rolesId | rolesFilter }}</el-dropdown-item>
              <el-dropdown-item>所属公司：{{ this.$store.getters.getGlobalUserInformation.companyId | fatherCompany }}</el-dropdown-item>
              <el-dropdown-item>
                状态：
                <el-switch
                  v-model="this.$store.getters.getGlobalUserInformation.status"
                  disabled
                  active-value="ACTIVE"
                  inactive-value="DEL"
                  active-text="启用"
                  inactive-text="禁用"
                ></el-switch>
              </el-dropdown-item>
              <el-dropdown-item>手机号：{{ this.$store.getters.getGlobalUserInformation.phoneNumber }}</el-dropdown-item>
              <el-dropdown-item class="update-pass">
                <el-button type="primary" size="mini" @click="updateNews" plain>修改信息</el-button>
                <el-button type="primary" size="mini" @click="updatePass" plain>修改密码</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <!-- 通知 -->
        <li>
          <el-badge :value="10" class="item" :max="99" type="success">
            <el-button type="text" class="notice">
              <i class="iconfont icongonggao"></i>
            </el-button>
          </el-badge>
        </li>
        <!-- 邮件 -->
        <li>
          <el-badge :value="999" class="item" :max="99">
            <el-button type="text" class="email">
              <i class="iconfont iconyouxiang"></i>
            </el-button>
          </el-badge>
        </li>
        <!-- 首页 -->
        <li>
          <router-link to="/appMain">
            <el-tooltip class="item" effect="dark" content="返回首页" placement="left">
              <el-button type="text" class="returnHome">
                <i class="iconfont iconiconfontzhizuobiaozhun023101"></i>
              </el-button>
            </el-tooltip>
          </router-link>
        </li>
        <!-- 退出 -->
        <li>
          <el-tooltip effect="dark" content="退出" placement="left">
            <el-button type="text" class="exitOut" @click="exit">
              <i class="iconfont icon084tuichu"></i>
            </el-button>
          </el-tooltip>
        </li>
      </ul>
    </div>
    <!-- 修改密码 dialog -->
    <el-dialog
      append-to-body
      center
      :title="this.$store.state.globalUserInformation.name + ' - 密码修改'"
      :visible.sync="updatePassForm.updatePassFormVisible"
    >
      <el-form
        :model="updatePassForm"
        ref="updatePassForm"
        :rules="updatePassForm.updatePassFormRules"
        label-width="140px"
      >
        <el-form-item label="请输入原密码：" prop="oldlPassword">
          <el-input
            v-model="updatePassForm.oldlPassword"
            show-password
            placeholder="请输入原密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="请输入新密码：" prop="newPassword_v1">
          <el-input
            v-model="updatePassForm.newPassword_v1"
            show-password
            placeholder="请输入新密码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="请再次输入新密码：" prop="newPassword_v2">
          <el-input
            v-model="updatePassForm.newPassword_v2"
            show-password
            placeholder="请再次输入新密码"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="updatePassFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="updatePassFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改信息 dialog -->
    <el-dialog
      append-to-body
      center
      :title="updateNewsForm.updateNewsFormlist.name + ' - 信息修改'"
      :visible.sync="updateNewsForm.updateNewsFormVisible"
    >
      <el-form
        :model="updateNewsForm"
        label-width="140px"
        :rules="updateNewsForm.updateNewsFormRules"
        ref="updateNewsForm"
      >
        <el-form-item label="用户名：">
          <el-input v-model="updateNewsForm.updateNewsFormlist.userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="updateNewsForm.updateNewsFormlist.name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="gender">
          <el-radio-group v-model="updateNewsForm.updateNewsFormlist.gender">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="所属公司：" v-if="isShowCompanySelect == true">
          <el-input v-model="updateNewsForm.fatherCompany" placeholder="请输入所属公司" disabled clearable></el-input>
        </el-form-item>
        <el-form-item label="所属公司：" prop="companyId" v-if="isShowCompanySelect == false">
          <el-select v-model="updateNewsForm.selectCompanyDefault" size="small" placeholder="请选择公司">
            <el-option label="暂无所属公司" value="0"></el-option>
            <el-option
              v-for="item in updateNewsForm.selectCompanyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入职日期：" prop="entryDate">
          <el-date-picker
            disabled
            v-model="updateNewsForm.updateNewsFormlist.entryDate"
            type="date"
            placeholder="请选择入职日期"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="年龄：">
          <el-input v-model="updateNewsForm.updateNewsFormlist.age" placeholder="请输入年龄" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phoneNumber">
          <el-input
            v-model="updateNewsForm.updateNewsFormlist.phoneNumber"
            placeholder="请输入手机号码"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="出生日期：">
          <el-date-picker
            v-model="updateNewsForm.updateNewsFormlist.birthday"
            type="date"
            placeholder="请选择出生日期"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态：">
          <el-switch
            :disabled="isShowCompanySelect"
            v-model="updateNewsForm.updateNewsFormlist.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="ACTIVE"
            inactive-value="DEL"
          ></el-switch>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8}"
            placeholder="请输入备注"
            v-model="updateNewsForm.updateNewsFormlist.note"
            maxlength="250"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="info" @click="updateNewsFormCancle">取 消</el-button>
        <el-button size="small" type="primary" @click="updateNewsFormSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { myMixins } from "@/mixins/index";
let that;
export default {
  inject: ["reload"],
  mixins: [myMixins],
  name: "app-header",
  filters: {
    // 所属角色过滤器
    rolesFilter: function(value) {
      for (let item of that.rolesFilterList) {
        if (value == item.id) {
          return item.role;
        }
      }
    },
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
  computed: {},
  data() {
    // 新密码2校验
    var checkNewPassword_v2 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请再次输入新密码"));
      } else {
        if (this.updatePassForm.newPassword_v1 != value) {
          return callback(new Error("两次密码输入不一致，请重新输入"));
        } else {
          callback();
        }
      }
    };
    // 检测手机号
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入手机号码"));
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
      headerSearch: "", // 头部搜索
      rolesFilterList: [], // 角色列表
      fatherCompanyList: [], // 父公司列表

      // 修改密码 dialogForm
      updatePassForm: {
        updatePassFormVisible: false,
        oldlPassword: "", // 原密码
        newPassword_v1: "", // 新密码1
        newPassword_v2: "", // 新密码2
        updatePassFormRules: {
          oldlPassword: {
            required: true,
            message: "请输入原密码",
            trigger: "blur"
          },
          newPassword_v1: {
            required: true,
            message: "请输入新密码",
            trigger: "blur"
          },
          newPassword_v2: {
            required: true,
            validator: checkNewPassword_v2,
            trigger: "blur"
          }
        }
      },

      isShowCompanySelect: false, // 是否显示公司select
      // 修改信息 dialogForm
      updateNewsForm: {
        updateNewsFormVisible: false,
        updateNewsFormRules: {
          // name: {
          //   required: true,
          //   message: "请输入姓名",
          //   trigger: "blur"
          // },
          // phoneNumber: {
          //   required: true,
          //   validator: checkPhone,
          //   trigger: "blur"
          // }
        },
        updateNewsFormlist: {}, // 修改用户信息列表  用户信息
        selectCompanyList: [], // 当前用户为总公司显示选择下拉菜单列表
        selectCompanyDefault: "" // 下拉公司列表默认值 id
      }
    };
  },
  methods: {
    // 侧边栏是否收起
    handleSliderIsCollapse() {
      this.$store.commit(
        "setsLiderIsCollapse",
        !this.$store.state.sliderIsCollapse
      );
      // 菜单展开关闭
      if (this.$store.state.sliderIsCollapse == false) {
        this.$store.commit("setAppContentWidth", 220); // 主体区域变化
        this.$store.commit("setSliderWidth", 220); // 侧边栏宽度变化
        this.$store.commit("setIsHeaderLogo", true); // 头部logo显示隐藏
      } else {
        this.$store.commit("setAppContentWidth", 64); // 主体区域变化
        this.$store.commit("setSliderWidth", 64); // 侧边栏宽度变化
        this.$store.commit("setIsHeaderLogo", false); // 头部logo显示隐藏
      }
    },
    // 退出
    exit() {
      this.$confirm("是否继续?", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var url = "logout";
          this.$axios
            .post(url)
            .then(res => {
              this.$message({
                message: "退出成功!",
                type: "success",
                duration:1000,
              });
              localStorage.removeItem("token"); // 清除token
              this.$router.push({ path: "/login" }); // 跳转页面
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    // 修改信息
    updateNews() {
      this.updateNewsForm.updateNewsFormVisible = true;
      this.getUserInformation(); // 获取用户信息
      // 如果当前公司为子公司  根据当前用户公司id显示公司名称
      if (
        this.isShowCompanySelect &&
        this.updateNewsForm.selectCompanyList.length == 0
      ) {
        this.updateNewsForm["fatherCompany"] = this.$options.filters[
          "fatherCompany"
        ](this.updateNewsForm.selectCompanyDefault); // 新增父公司key - value
      }
    },
    // 修改信息取消
    updateNewsFormCancle() {
      this.updateNewsForm.updateNewsFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消修改信息!"
      });
    },
    // 修改信息确定
    updateNewsFormSubmit() {
      if (this.updateNewsForm.updateNewsFormlist.name == "") {
        this.$message({
          type: "warning",
          message: "姓名不能为空!"
        });
      } else if (this.updateNewsForm.updateNewsFormlist.phoneNumber == "") {
        this.$message({
          type: "warning",
          message: "手机号不能为空!"
        });
      } else {
        var url = "user/updateUserById";
        var companyId = "";
        if (this.updateNewsForm.selectCompanyList.length == 0) {
          companyId = this.updateNewsForm.updateNewsFormlist.companyId;
        } else {
          companyId = this.updateNewsForm.selectCompanyDefault;
        }
        let formData = {
          userName: this.updateNewsForm.updateNewsFormlist.userName,
          password: this.updateNewsForm.updateNewsFormlist.password,
          name: this.updateNewsForm.updateNewsFormlist.name,
          gender: this.updateNewsForm.updateNewsFormlist.gender,
          companyId: companyId,
          age: this.updateNewsForm.updateNewsFormlist.age,
          phoneNumber: this.updateNewsForm.updateNewsFormlist.phoneNumber,
          birthday: this.updateNewsForm.updateNewsFormlist.birthday,
          status: this.updateNewsForm.updateNewsFormlist.status,
          entryDate: this.updateNewsForm.updateNewsFormlist.entryDate,
          updateAt: this.updateNewsForm.updateNewsFormlist.updateAt,
          note: this.updateNewsForm.updateNewsFormlist.note,
          createAt: this.updateNewsForm.updateNewsFormlist.createAt,
          id: this.updateNewsForm.updateNewsFormlist.id
        };
        this.$refs.updateNewsForm.validate(valid => {
          if (valid) {
            this.$axios.post(url, formData).then(res => {
              if (res.data.code == 1) {
                this.$message({
                  type: "success",
                  message: res.data.msg
                });
                this.updateNewsForm.updateNewsFormVisible = false;
                this.getUserInformationGlobal(); // 全局同步用户信息
                // 如果当前页是用户管理页面  刷新页面信息
                if (
                  this.$route.fullPath == "/appMain/systemManage/userManage"
                ) {
                  // this.$router.go(0);  // 整个页面刷新
                  this.reload();
                }
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
      }
    },
    // 修改密码
    updatePass() {
      this.updatePassForm.updatePassFormVisible = true;
    },
    // 修改密码取消
    updatePassFormCancle() {
      this.updatePassForm.updatePassFormVisible = false;
      this.$message({
        type: "info",
        message: "已取消修改密码!"
      });
    },
    // 修改密码确定
    updatePassFormSubmit() {
      this.$refs.updatePassForm.validate(valid => {
        if (valid) {
          let url = "user/updateCurrentUserPassword";
          let formData = {
            id: this.$store.getters.getGlobalUserInformation.id,
            oldPassword: this.updatePassForm.oldlPassword,
            password: this.updatePassForm.newPassword_v2
          };
          this.$axios.post(url, formData).then(res => {
            if (res.data.code == 1) {
              this.$message({
                type: "success",
                message: "密码已修改，请重新登录!"
              });
              this.updatePassForm.updatePassFormVisible = false;
              // this.exit(); // 退出
              this.$axios
                .post("logout")
                .then(res => {
                  this.$message({
                    message: "退出成功!",
                    type: "success"
                  });
                  localStorage.removeItem("token"); // 清除token
                  this.$router.push({ path: "/login" }); // 跳转页面
                })
                .catch(error => {});
            } else if (res.data.code == 0) {
              // 原密码不一样
              this.$message({
                type: "error",
                message: res.data.msg
              });
              this.updatePassForm.oldlPassword = "";
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
    // 获取当前用户信息
    getUserInformation() {
      let url = "user/getCurrentUser";
      let formData = {};
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.updateNewsForm.updateNewsFormlist = res.data.data;
          }
        })
        .catch(err => {
          return err;
        });
    },
    // 获取角色列表
    getRoleFilterList() {
      let url = "roles/getAll";
      let formData = {};
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.code == 1) {
            this.rolesFilterList = res.data.data;
          }
        })
        .catch(err => {
          return err;
        });
    },
    // 所有公司列表
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
    },
    // 根据用户返回公司
    getCompanyByUser() {
      let url = "user/selectCompanyByUser";
      let formData = {
        status: "ACTIVE"
      };
      this.$axios
        .post(url, formData)
        .then(res => {
          if (res.data.data == null) {
            // 未设置公司的员工 所属公司为空
            this.isShowCompanySelect = true;
            this.updateNewsForm.fatherCompany = "暂无所属公司";
            return;
          } else {
            if (res.data.data instanceof Array) {
              this.updateNewsForm.selectCompanyList = res.data.data; // 赋给修改信息dialog父公司select
              this.updateNewsForm.selectCompanyDefault = res.data.data[0].id; // 下拉公司列表默认值
              this.isShowCompanySelect = false;
            } else {
              this.updateNewsForm.selectCompanyDefault = res.data.data.id;
              this.isShowCompanySelect = true;
              // this.updateNewsForm["fatherCompany"] = this.$options.filters[
              //   "fatherCompany"
              // ](this.updateNewsForm.selectCompanyDefault); // 新增父公司key - value
            }
          }
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
    this.getUserInformationGlobal(); // 获取用户信息
    this.getRoleFilterList(); // 获取角色列表
    this.handleFatherCompanyList(); // 获取父公司列表
    this.getCompanyByUser(); // 根据用户返回公司
  }
};
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 60px;
  position: relative;
}
.app-header .logo {
  position: absolute;
  left: 0;
  top: 0;
  /* width: 240px; */
  height: 60px;
}
.app-header .logo .img_1 {
  width: 220px;
  height: 60px;
  transition: all 1s;
}
.app-header .logo .img_2 {
  width: 64px;
  height: 60px;
}
.app-header .header-right {
  /* width: calc(100% - 240px); */
  position: absolute;
  /* left: 240px; */
  top: 0;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.app-header .header-right > div {
  float: left;
}
/* 是否展开菜单 */
.app-header .header-right .isCollapse {
  margin-left: 10px;
}
.app-header .header-right .isCollapse i {
  font-weight: 700;
  color: #409eff;
}
.app-header .header-right .search {
  width: 320px;
  margin-left: 20px;
  float: left;
}
.app-header .header-right ul {
  float: right;
}
.app-header .header-right ul li {
  float: left;
  margin: 0 30px 0 0;
}
/* 搜索框 */
.app-header .header-right .el-input-group__append button.el-button {
  color: #fff;
}
/* user */
.app-header .header-right .userIcon {
  height: 60px;
}
.app-header .user-name-icon {
  color: #303133;
}
.app-header .header-right .userIcon .iconyonghu {
  font-size: 24px;
}

.app-header .header-right .userIcon .el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
.app-header .header-right .userIcon .el-icon-arrow-down {
  font-size: 12px;
}
/* 修改密码 el-dropdown没在body之上，因此不需要带.app-header*/
.update-pass {
  background: #fff !important;
  text-align: center;
  margin-top: 10px;
}
/* 用户下拉下拉菜单背景色 */
.el-dropdown-menu__item:hover {
  /* background: #fff !important;
  color:#303133 !important;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3) !important;  */
}
/* 通知 */
.app-header .header-right .notice i {
  font-size: 24px;
}
/* 邮件 */
.app-header .header-right .email i {
  font-size: 22px;
}
/* 主页 */
.app-header .header-right .returnHome i {
  font-size: 24px;
}
/* 退出 */
.app-header .header-right .exitOut i {
  font-size: 20px;
}
</style>
