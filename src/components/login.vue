<template>
  <div class="login">
    <!-- el-form：表单组件 -->
    <!-- :model 表单的数据 -->
    <!-- label-width label的宽度 -->
    <el-form ref="ruleForm"
             status-icon
             :rules="rules"
             :model="form"
             label-width="80px">
      <img src="../assets/avatar.jpg"
           alt />
      <el-form-item label="用户名"
                    prop="username">
        <el-input placeholder="请输入用户名"
                  v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码"
                    prop="password">
        <el-input placeholder="请输入密码"
                  type="password"
                  v-model="form.password"
                  @keyup.enter.native="login('ruleForm')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="login('ruleForm')">登入</el-button>
        <el-button @click="
                   resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
    },
    login (formName) {
      // 调用了组件的validate方法
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // 提交表单
          // 发ajax请求
          let res = await this.axios({
            url: 'login',
            method: 'post',
            data: this.form
          })
          console.log(res)
          if (res.data.meta.status === 200) {
            // 登入成功
            // console.log('登入成功')
            this.$message({
              message: '登入成功',
              type: 'success',
              duration: 1000
            })
            // 直接成功就下面这种写法，需要改参数，需要上面这种写法
            // this.$message.success('登入成功')
            // 把返回的token保存起来
            localStorage.setItem('token', res.data.data.token)

            // 要先token再跳转，不然会被拦截
            this.$router.push('/home')
          } else {
            // 登入失败
            // console.log('用户名或密码错误')
            this.$message.error('用户名或密码错误')
          }
        } else {
          console.log('表单校验失败!!')
          return false
        }
      })
    }
  }
}
</script>

// scoped样式只在当前组件生效
<style lang="less" scoped>
.login {
  background-color: #2d434c;
  height: 100%;
  overflow: hidden;

  .el-form {
    width: 400px;
    background-color: #fff;
    margin: 200px auto;
    padding: 75px 40px 15px 40px;
    border-radius: 20px;
    position: relative;
    img {
      position: absolute;
      width: 120px;
      height: 120px;
      top: -80px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 50%;
      border: 10px solid #fff;
    }
    .el-button + .el-button {
      margin-left: 80px;
    }
  }
}
</style>
