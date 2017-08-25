<template>
  <div class="login">
    <div class="login-wrapper">
      <div class="login-logo">
        <img src="../../assets/img/login_logo.png" alt="">
      </div>
      <div class="form" @keyup.enter="submitForm('loginForm')">
        <el-row>
          <el-col :span="13" :xs="24">
            <div class="login-copy">
              <img src="../../assets/img/login_copy.png" alt="">
            </div>
          </el-col>
          <el-col :span="11" :xs="24">
            <el-form :model="loginForm" label-width="0" :rules="lginRules" ref="loginForm" class="demo-ruleForm">
              <el-form-item label="" prop="username">
                <el-input type="text" size="large" v-model="loginForm.username" placeholder="用户名" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input type="password" size="large" v-model="loginForm.password" placeholder="密码" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="large" @click="submitForm('loginForm')" :loading="loginLoading">登录</el-button>
                <!-- <el-button @click="resetForm('loginForm')">重置</el-button> -->
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
import {
  Message
} from 'element-ui'
import urlStore from '../../api/urlStore.js'
export default {
  data: function() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      lginRules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }]
      },
      loginLoading: false
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loginLoading = true
          this.$http.post(urlStore.login, {
            username: this.loginForm.username,
            password: this.loginForm.password
          }, {
            emulateJSON: true
          }).then(res => {
            if (res.ok && res.body.status == 'success') {
              this.$store.commit('login', res.body.user)
              if (this.$route.query && this.$route.query.redirect) {
                this.$router.push(this.$route.query.redirect)
              } else {
                this.$router.push('/')
              }
            } else if (res.body.status == 'fail') {
              Message({
                message: res.body.msg,
                type: 'warning'
              })
            } else {
              Message({
                message: '登录失败',
                type: 'warning'
              })
            }
            this.loginLoading = false
          }).catch(err => {
            this.loginLoading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}

</script>
<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #6380df;
  background: radial-gradient(ellipse at center, #7db9e8 1%, #6380df 66%);
  .login-wrapper {
    width: 100%;
    height: 450px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    .login-logo {
      img {
        margin: 0 auto 20px;
        display: block;
        width: 100%;
        max-width: 500px;
        transform: translateX(-30px);
      }
    }
    .form {
      background-color: rgb(195, 219, 246);
      .el-row {
        max-width: 900px;
        margin: auto;
      }
      .login-copy {
        img {
          display: block;
          width: 100%;
          margin-top: 50px;
        }
      }
      form {
        padding: 30px;
      }
      button {
        width: 100%;
        margin: auto;
        display: block;
        background: rgb(81, 115, 211);
        border-color: rgb(81, 115, 211);
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .login .login-wrapper {
    height: 450px;
    .form .el-row {
      max-width: 400px;
      .login-copy {
        img {
          width: 80%;
          margin: 20px auto 0;
        }
      }
    }
  }
}

</style>
