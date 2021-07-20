<template>
  <div class="login-container flex">
    <div class="login-info">
      <div class="logo-info flex">
        <img class="logo-png" src="../../assets/login/logo.png"/>
        <p class="logo-txt">
          深圳公共数据可信计算服务平台
        </p>
      </div>
      <div class="login-form">
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login-ruleForm">
          <el-form-item prop="username">
            <img src="../../assets/login/username.png" class="login-info-png"/>
            <el-input v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <img src="../../assets/login/password.png" class="login-info-png"/>
            <el-input v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <div class="login-btn" @click="handleLogin('loginForm')">登录</div>
        </el-form>
      </div>
    </div>
    <div class="login-png">
      <img class="img1" src="../../assets/login/login_bg_1.png"/>
      <img class="img2" src="../../assets/login/login_bg_2.png"/>
    </div>
  </div>
</template>

<script>
import SocialSign from './components/SocialSignin'

export default {
  name: 'Login',
  components: { SocialSign },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    // if (this.loginForm.username === '') {
    //   this.$refs.username.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('login', this.loginForm)
            .then(() => {
              this.$router.push({path:'/'})
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  .el-form-item__content{

  }
  .login-info{
    width: 50%;
  }
  .logo-info{
    margin-top: 27px;
    margin-left: 100px;
  }
  .logo-png{
    width: 72px;
    height: 58px;
  }
  .logo-txt{
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #3F74DA;
    line-height: 3px;
    margin-left: 13px;
  }
  .login-png{
    width: 50%;
    position: relative;
    background: url("../../assets/login/login_bg.png") no-repeat;
    background-size: cover;
    .img1{
      position: absolute;
      width: 49.1%;
      top: 27%;
      left: 25%;
    }
    .img2{
      position: absolute;
      width: 29.1%;
      bottom: 19%;
      right: 18%;
    }
  }
  .login-info-png{
    width: 34px;
    height: 34px;
  }
  .login-form{
    width: 564px;
    margin: 190px auto 0;
  }
  .login-btn{
    width: 564px;
    height: 69px;
    background: #3F74DA;
    box-shadow: 0px 5px 10px 0px rgba(31, 76, 162, 0.2);
    border-radius: 10px;
    font-size: 27px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 69px;
    text-align: center;
    cursor: pointer;
    margin-top: 48px;
  }
}
</style>
