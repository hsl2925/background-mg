<template>
  <div class="login_container">
    <el-form class="login-box" ref="ruleForm" :model="login_form" :rules="loginFormRules">
      <h2 class="title">Login</h2>
      <el-form-item class="input-box" prop="username">
        <el-input type="text" placeholder="用户名" prefix-icon="el-icon-user-solid" v-model="login_form.username"/>
      </el-form-item>
      <el-form-item class="input-box" prop="password">
        <el-input type="password" placeholder="密码" prefix-icon="el-icon-lock" v-model="login_form.password"/>
      </el-form-item>
      <el-form-item class="inputbox" prop="checkCode">
        <el-input placeholder="验证码" prefix-icon="el-icon-lock" v-model="login_form.checkCode" style="width:70%" />
        <img :src="codeUrl" class="login-code-imgs" />
        <div class="login-code" @click="getCode()" v-html="code" style="vertical-align:middle"></div>
      </el-form-item>
      <div class="btn-box">
        <a href="#">忘记密码?</a>
        <div>
          <button @click="login()">登录</button>
          <a @click="registerPage()">没有账户?立即注册</a>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    const validateUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      }
      callback()
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      }
      callback()
    }
    const validateCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      }
      callback()
    }
    return {
      // 登录表单数据绑定对象
      login_form: {
        username: 'admin2',
        password: '123456',
        checkCode: ''
      },
      codeUrl: '',
      code: '',
      codeText: '',
      // 表单验证规则
      loginFormRules: {
        username: [
          { validator: validateUser, trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkCode: [
          { validator: validateCode, trigger: 'blur' }
        ]
      },
      id: 1
    }
  },
  methods: {
    registerPage () {
      this.$router.push('/register')
    },
    login () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return

        const { data: res } = await this.$http.post('/api/login', this.login_form)
        console.log(res)

        if (res.status !== 0) return this.$message.error('用户名或密码错误!')
        window.sessionStorage.setItem('token', res.token) // 保存 token

        if (this.login_form.checkCode.toLowerCase() !== this.codeText.toLowerCase()) return this.$message.error('验证码错误!')

        this.$message.success('登录成功')

        this.$router.push('/home') // 编程式导航到后台主页
      })
    },
    // 验证码
    async getCode () {
      const { data: res } = await this.$http.get('/api/checkCode')
      console.log(res)

      this.code = res.data
      this.codeText = res.text
    },
    created () {
      this.login()
      this.getCode()
    }
  }
}
</script>

<style scoped>
  @import '../assets/css/login.css';
</style>
