<template>
  <div class="login">
    <div class="login-wrapper">
      <div class="form">
        <el-card>
          <div class="color-bar"></div>
          <h2 class="login-title">智能审计分析系统</h2>
          <el-form :model="loginForm" label-width="0" :rules="lginRules" ref="loginForm" class="demo-ruleForm">
            <el-form-item label="" prop="username">
              <el-input type="text" size="large" v-model="loginForm.username" placeholder="用户名" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
              <el-input type="password" size="large" v-model="loginForm.password" placeholder="密码" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" @click="submitForm('loginForm')">登录</el-button>
              <!-- <el-button @click="resetForm('loginForm')">重置</el-button> -->
            </el-form-item>
          </el-form>
        </el-card>
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
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
  background-color: #1E3C50;
  .login-title {
    font-size: 22px;
    font-weight: 400;
    color: #1e3c50;
    text-align: center;
    margin-bottom: 30px
  }
  .el-card {
    border: none;
    padding: 20px 50px;
  }
  .color-bar {
    background: linear-gradient(135deg, #e74c3c 25%, #f1c40f 25%, #f1c40f 50%, #1abc9c 50%, #1abc9c 75%, #3498db 75%, #3498db 100%);
    height: 10px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  .login-wrapper {
    width: 500px;
    height: 360px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    .form {
      button {
        width: 50%;
        margin: auto;
        display: block;
      }
    }
  }
}
</style>
