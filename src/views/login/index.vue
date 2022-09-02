<template>
  <div class="login">
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../../assets/logo.png" alt="">
      </div>
      <!-- 表单区域 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="demo-ruleForm login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="el-icon-lock" show-password placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item class="login-button">
          <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
          <el-button type="info" @click="resetForm('loginForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/login/login.js'
export default {
  name: 'Login',
  data() {
    return {
      // 登录表单数据
      loginForm: {
        username: '',
        password: ''
      },
      // 登录表单验证规则
      loginRules: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6-15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录事件
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const res = await login(this.loginForm)
          if (res.meta.status !== 200) {
            return this.$message.error('登录失败')
          }

          // Message组件 全局配置后，可通过 this.$message 直接使用
          this.$message.success('登录成功')
          window.sessionStorage.setItem('token', res.data.token)
          window.sessionStorage.setItem('username', res.data.username)

          // 保存 token后 跳转页面
          this.$router.push('/home')
        }
      })
    },
    // 重置事件
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-225px, -150px);
    padding: 20px;
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    box-sizing: border-box;

    .avatar-box {
      position: absolute;
      left: 50%;
      top: -65px;
      transform: translate(-50%);
      padding: 10px;
      height: 130px;
      width: 130px;
      background-color: #fff;
      border: 1px solid #eee;
      border-radius: 50%;
      box-shadow: 0 0 10px #ddd;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login-form {
      margin-top: 120px;

      .login-button {
        display: flex;
        justify-content: right;
      }
    }
  }
}
</style>