<template>
  <div class="login">
    <div class="img">
      <img src="../assets/images/login.svg" alt="">
    </div>
    <div class="header">
      <span>国威永耀</span>
      crm
      <span>管理平台</span>
    </div>
    <div class="login-form">
      <div class="login-form-title">用户登录</div>
      <div class="login-form-ipt">
        <el-input 
          placeholder="请输入用户名" 
          v-model="username"
          size="medium"
          clearable
          autofocus>
          <template slot="prepend"><i class="iconfont iconxingmingyonghumingnicheng"></i></template>
        </el-input>
        <el-input 
          show-password 
          placeholder="请输入密码" 
          v-model="password" 
          clearable
          size="medium">
          <template slot="prepend"><i class="iconfont iconmima"></i></template>
        </el-input>
        <SliderVerificationCode v-model="value" />
        <el-button @click="login" :loading="loading" type="primary" class="login-btn" size="small" round>登 录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'login',
  watch: {
      
  },
  data () {
    return {
      username:"",
      password:"",
      value:false,  // 验证结果
      loading:false,
    }
  },
  methods: {
    login() {
      if(this.username == "") {
        this.$message({
          message: "请输入用户名",
          type: "warning"
        });
        return false;
      }else if(this.password == "") {
        this.$message({
          message: "请输入密码",
          type: "warning"
        });
        return false;
      }else if(this.value == false) {
        this.$message({
          message: "请先滑动解锁",
          type: "warning"
        });
        return false;
      };

      this.loading = true;   // 登录加载  请求失败吧loading设置为false
      this.$router.push({path:"/appMain"})
      // 向后台发送请求获取查询结果数据
      // let formData = {
      //   userName: this.username,
      //   password: this.password
      // };
      // var self = this;
      // var url = "http://192.168.3.40:8099/toLogin";
      // $.post(url,qs.stringify(formData))
      // .then(res=>{
      //   // 成功之后跳转页面
      //   this.$router.push({path:"/appMain"})
      // })
    },

  },
  created() {
    
  }
}
</script>

<style scoped>
.login {
  width: 100%;
  height: 100%;
  background:#152E71;
  position: relative;
  overflow: hidden;
  background: -webkit-linear-gradient(left top, #51e084 ,#d080c3 ,#4b8aa0, #5577dc); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(bottom right,  #51e084 ,#d080c3 ,#4b8aa0, #5577dc); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(bottom right, #51e084 ,#d080c3 ,#4b8aa0, #5577dc); /* Firefox 3.6 - 15 */
  background: linear-gradient(to bottom right,  #51e084 ,#d080c3 ,#4b8aa0, #5577dc); /* 标准的语法 */
}
/* 登录窗口 */
.login .login-form {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  width: 330px;
  height: 380px;
  background: rgba(255,255,255,0);
  box-shadow: 0 0 10px #fff;
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
  color: #fff;
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
  width: 100px;
  margin-top: 40px;
  font-size: 14px;
}
/* 滑动解锁 */
.login .app-drag {
  border-radius: 3px;
  margin-top: 20px;
}
/* 滑动解锁颜色 */
.login .app-drag{
  background: rgb(105,105,105) !important;
}
/* 背景图片 */
.login .img {
  position: absolute;
  right: 0;
  bottom: 0;
}
/* 标题 */
.login .header{
  height: 100px;
  line-height: 100px;
  text-align: center;
  font-size: 5vh;
  font-weight: 700;
  margin-top: 20px;
  font-family:cursive;
}
.login .header span{
  letter-spacing:5px;
}
</style>
