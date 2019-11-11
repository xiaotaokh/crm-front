<template>
  <div class="login">
    <div class="img">
      <img src="../assets/images/login.svg" alt />
    </div>
    <div class="header">
      <span>国威永耀</span>
      crm
      <span>管理平台</span>
    </div>
    <div class="login-form">
      <div class="login-form-title">用户登录</div>
      <div class="login-form-ipt">
        <el-input placeholder="请输入用户名" v-model="username" size="medium" clearable autofocus>
          <template slot="prepend">
            <i class="iconfont iconxingmingyonghumingnicheng"></i>
          </template>
        </el-input>
        <el-input
          show-password
          placeholder="请输入密码"
          v-model="password"
          @keyup.enter.native="login"
          clearable
          size="medium"
        >
          <template slot="prepend">
            <i class="iconfont iconmima"></i>
          </template>
        </el-input>
        <el-button
          @click="verifyHandle"
          :type="verifyType"
          class="login-verify"
          size="small"
        >{{ verifyText }}</el-button>
        <!-- <SliderVerificationCode v-model="verify" /> -->
        <el-button
          @click="login"
          :loading="loading"
          type="primary"
          class="login-btn"
          size="small"
        >登 录</el-button>
        <!-- 验证码 -->
        <slide-verify
          v-if="verifyShow"
          :l="42"
          :r="10"
          :w="310"
          :h="155"
          @success="onSuccess"
          @fail="onFail"
          @refresh="onRefresh"
          :slider-text="text"
        ></slide-verify>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  watch: {},
  data() {
    return {
      username: "admin",
      password: "123456",
      verifyShow: false, // 显示验证
      verifyType: "info", // 验证按钮类型
      verifyText: "点击验证", // 验证text
      verify: false, // 验证结果
      text: "向右滑",
      loading: false
    };
  },
  methods: {
    // 验证码成功
    onSuccess() {
      this.$message({
        message: "验证成功！",
        type: "success"
      });
      this.verify = true;
      this.verifyShow = false;
      this.verifyType = "success";
      this.verifyText = "验证成功";
    },
    // 验证码失败
    onFail() {
      this.$message({
        message: "验证失败,请重新验证！",
        type: "error"
      });
      this.verifyType = "danger";
      this.verifyText = "验证失败";
      setTimeout(() => {
        this.verifyType = "warning";
        this.verifyText = "向右滑动重新验证";
      }, 500);
    },
    // 验证码刷新
    onRefresh() {
      this.$message({
        message: "验证码刷新成功！",
        type: "success"
      });
      this.verify = false;
      this.verifyType = "info";
      this.verifyText = "点击验证";
    },

    // 点击验证
    verifyHandle() {
      this.verifyShow = true;
      if (this.verifyType == "success") {
        this.verifyShow = false;
        return;
      }
    },

    login() {
      if (this.username == "") {
        this.$message({
          message: "请输入用户名",
          type: "warning"
        });
        return false;
      } else if (this.password == "") {
        this.$message({
          message: "请输入密码",
          type: "warning"
        });
        return false;
      }
      // else if (this.verify == false) {
      //   this.$message({
      //     message: "请先点击验证解锁",
      //     type: "warning"
      //   });
      //   return false;
      // }

      this.loading = true; // 登录加载
      // 向后台发送请求获取查询结果数据
      let formData = {
        userName: this.username,
        password: this.password
      };
      var url = "toLogin";
      this.$axios
        .post(url, formData)
        .then(res => {
          // 成功
          if (res.data.code == 1) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });

            // 把拿到的token存放在localStorage里面
            localStorage.setItem("token", res.data.data);

            // 设置延迟器加载菜单
            this.$router.push({ path: "/appMain" }); // 跳转页面

            this.loading = false; // 关闭loading
            this.verifyType = "info"; // 设置验证按钮类型
            this.verifyText = "点击验证"; // 设置验证text
            this.verify = false; // 验证状态为false
          } else {
            // 弹出失败原因
            this.$message({
              message: res.data.msg,
              type: "error"
            });
            this.loading = false; // 关闭loading
            this.verifyType = "info";
            this.verifyText = "点击验证";
            this.verify = false; // 验证状态为false
          }
        })
        .catch(error => {
          this.loading = false; // 关闭loading
          this.verifyType = "info"; // 设置验证按钮类型
          this.verifyText = "点击验证"; // 设置验证text
          this.verify = false; // 验证状态为false
          // 弹出失败原因
          // this.$message({
          //   message: "后台连接不成功，登录失败!",
          //   type: "error"
          // });
        });
    }
  },
  created() {}
};
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  min-height: 760px;
  position: relative;
  /* background: #f0f0f0; */
  background: #3e7b82;
  background-image: url(../assets/images/login_bg.svg);
  background-size: 100%;
  overflow: auto;
  /* Safari 5.1 - 6.0 */
  /* background: -webkit-linear-gradient(
    left top,
    #6b80bd,
    #6bb4ce,
    #84c5a3,
    #8dad98
  );  */
  /* Opera 11.1 - 12.0 */
  /* background: -o-linear-gradient(
    bottom right,
    #6b80bd,
    #6bb4ce,
    #84c5a3,
    #8dad98
  );  */
  /* Firefox 3.6 - 15 */
  /* background: -moz-linear-gradient(
    bottom right,
    #6b80bd,
    #6bb4ce,
    #84c5a3,
    #8dad98
  );  */
  /* 标准的语法 */
  /* background: linear-gradient(
    to bottom right,
    #6b80bd,
    #6bb4ce,
    #84c5a3,
    #8dad98
  );  */
}
/* 登录窗口 */
.login .login-form {
  position: absolute;
  left: 50%;
  top: 55%;
  transform: translate(-50%, -50%);
  width: 330px;
  height: 350px;
  background: rgba(255, 255, 255, 0);
  border: 1px solid #ccc;
  border-radius: 5px;
}
.login .login-form:hover {
  box-shadow: 0 0 8px #fff;
}
/* 标题 */
.login .login-form .login-form-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  margin-top: 20px;
  text-align: center;
  font-family: cursive;
  font-weight: 700;
  font-size: 24px;
  color: #F2F6FC;
}
/* 输入框 */
.login .login-form .login-form-ipt {
  width: 100%;
  height: 340px;
  text-align: center;
  padding: 60px 30px 0 30px;
}
.login .el-input:nth-child(2) {
  margin-top: 30px;
}
/* 登录按钮 */
.login .login-form .login-btn {
  width: 270px;
  margin-top: 20px;
  font-size: 14px;
  margin-left: 0px;
}
/* 滑动解锁 */
.login .app-drag {
  border-radius: 3px;
  margin-top: 20px;
}
/* 滑动解锁颜色 */
.login .app-drag {
  background: rgb(105, 105, 105) !important;
}
/* 背景图片 */
.login .img {
  position: absolute;
  right: 2%;
  bottom: 0%;
  width: 32%;
  height: 47%;
}
.login .img img {
  width: 100%;
  height: 100%;
}
/* 标题 */
.login .header {
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  margin-top: 4%;
  font-family: cursive;
}
.login .header span {
  letter-spacing: 5px;
}

/* 验证按钮 */
.login .login-form .login-verify {
  width: 270px;
  margin-top: 20px;
  font-size: 14px;
}

/* 验证码 */
.login .slide-verify {
  position: absolute;
  top: 10px;
  left: 10px;
}
</style>