<template>
  <div class="login-container">
    <div class="user">
      <svg t="1733928341564" class="user-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
        p-id="1469" width="200" height="200">
        <path d="M528.936186 271.549061m-234.809307 0a41.6 41.6 0 1 0 469.618613 0 41.6 41.6 0 1 0-469.618613 0Z"
          fill="#0066ff" p-id="1470"></path>
        <path
          d="M947.190263 738.345447C938.723582 427.336005 730.443211 465.718295 730.443211 465.718295c-51.928981 42.903499-97.649063 81.280145-197.555907 81.280145-129.822453 0-211.102598-82.973481-211.102598-82.973481C110.682108 456.122723 107.859881 738.909893 107.859881 738.909893l0 124.177999c3.945474 65.475672 49.6712 101.600181 112.88909 101.600181l609.601085 0c76.200136 0 110.631308-45.155636 117.404653-101.600181C951.705827 767.696611 947.190263 738.345447 947.190263 738.345447z"
          fill="#0066ff" p-id="1471"></path>
        <path d="M528.936186 546.99844" fill="#0066ff" p-id="1472"></path>
      </svg>
      <h2>{{ isLogin ? '账 号 登 录' : '账 号 注 册' }}</h2>
    </div>

    <div class="login-box" v-show="isLogin">
      <img src="../../assets/images/user.jpg" alt="">
      <h2>Welcome back</h2>
      <el-form :model="form" ref="ruleFormRef" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Key" show-password />
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" @click="goLogin()">登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="signup">
        <span>没有账号？</span>
        <a href="javascript:void(0)" @click="isLogin = false">注册</a>
      </div>
    </div>
    <div class="login-box registered-box" v-show="!isLogin">
      <img src="../../assets/images/user.jpg" alt="">
      <el-form v-model="form">
        <el-form-item>
          <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.email" placeholder="请输入邮箱" :prefix-icon="Message" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" type="password" placeholder="请输入密码" :prefix-icon="Key" show-password />
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.confirmPassword" type="password" placeholder="请再次确认密码" :prefix-icon="Key"
            show-password />
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn">注 册</el-button>
        </el-form-item>
      </el-form>
      <div class="signup">
        <span>已经有账号？</span>
        <a href="javascript:void(0)" @click="isLogin = true">去登录</a>
      </div>
    </div>


    <svg xmlns="http://www.w3.org/2000/svg" class="bottom-bg" viewBox="0 0 1440 320">
      <path fill="#0099ff" fill-opacity="1"
        d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
      </path>
    </svg>
  </div>
</template>

<script setup>
import { User, Key, Message } from '@element-plus/icons-vue'
import { ref, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '@/api/login'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'


const router = useRouter()
const userStore = useUserStore()
const ruleFormRef = ref(null)
const data = reactive({
  form: {
    username: '',
    password: '',
    email: '',
    confirmPassword: ''
  },
  rules: {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
    ],
  },
  isLogin: true
})

const goLogin = () => {
  ruleFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      let params = JSON.parse(JSON.stringify(data.form))
      delete params.email
      delete params.confirmPassword

      let res = await login(params)
      sessionStorage.setItem('userInfo', JSON.stringify(res))
      sessionStorage.setItem('token', res.token)
      userStore.setUserInfo(res)
      userStore.setToken(res.token)
      router.push('/')
    } else {
      console.log('error submit!!', fields);
      ElMessage.error(fields.message || '请检查文本框内容')
    }
  })


}

const { form, rules, isLogin } = toRefs(data)

</script>

<style lang="less" scoped>
.login-container {
  position: relative;
  width: 100%;
  height: 100%;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #3399ff;
    clip-path: circle(20% at 100% 0);
  }

  .user {
    position: absolute;
    top: 250px;
    left: 80px;
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .user-icon {
      height: 80px;
    }

    h2 {
      font-size: 30px;
      text-transform: uppercase;
      user-select: none;
      text-shadow: 1px 1px 1px rgba(16, 16, 16, 0.1), 1px 2px 1px rgba(16, 16, 16, 0.1), 1px 3px 1px rgba(16, 16, 16, 0.1), 1px 4px 1px rgba(16, 16, 16, 0.1), 1px 5px 1px rgba(16, 16, 16, 0.1), 1px 6px 1px rgba(16, 16, 16, 0.1), 1px 7px 1px rgba(16, 16, 16, 0.1), 1px 8px 1px rgba(16, 16, 16, 0.1);
    }
  }

  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 320px;
    height: 448px;
    box-shadow: 0 0 1px #3399ff;
    border-radius: 30px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      border: 1px solid #3399ff;
      margin-bottom: 20px;
    }

    h2 {
      font-size: 30px;
      margin-bottom: 30px;
    }

    :deep(.el-input__wrapper) {
      width: 266px;
      height: 40px;
      border-radius: 15px;
      color: #000;
    }

    :deep(.el-icon) {
      font-size: 16px;
      color: #000;
    }

    .login-btn {
      background-color: #0066ff;
      color: #fff;
      font-weight: 500;
      width: 266px;
      height: 40px;
      border-radius: 15px;
    }

    .signup {
      color: #888;
      font-size: 14px;
      text-align: right;
    }
  }

  .bottom-bg {
    position: absolute;
    bottom: 0;
    pointer-events: none;
  }
}
</style>