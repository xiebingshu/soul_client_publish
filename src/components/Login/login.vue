<template>
  <div class="body">
    <div class="shell">
      <div class="container a-container" ref="a_container">
        <form action="" class="form" ref="a_form">
          <h2 class="form_title title">创建账号</h2>
          <div class="form_icons">
            <i class="iconfont icon-QQ"></i>
            <i class="iconfont icon-weixin"></i>
            <i class="iconfont icon-bilibili-line"></i>
          </div>
          <input type="text" class="form_input" placeholder="Name"  v-model="signForm.username">
          <input type="text" class="form_input" placeholder="Email" v-model="signForm.email">
          <input type="password" class="form_input" placeholder="Password" v-model="signForm.password">
          <span style="width: 350px">
            <input type="text" class="form_input" placeholder="验证码" style="width: 60%" v-model="signForm.captcha">
             <el-button type="primary" style="margin-left: 10%;width: 30%;height: 40px;background: #4B70E2" @click="getCaptcha">{{captcha_time}}</el-button>
          </span>
          <button class="form_button button submit" @click="signUp">SIGN UP</button>
        </form>
      </div>

      <div class="container b-container" ref="b_container">
        <form action="" class="form" ref="b_form">
          <h2 class="form_title title">登入账号</h2>
          <div class="form_icons">
            <i class="iconfont icon-QQ"></i>
            <i class="iconfont icon-weixin"></i>
            <i class="iconfont icon-bilibili-line"></i>
          </div>
          <input type="text" class="form_input" style="margin-top: 10px" placeholder="Name" v-model="loginForm.username">
          <input type="password" class="form_input" placeholder="Password" v-model="loginForm.password">
          <a class="form_link">忘记密码？</a>
          <button class="form_button button submit" @click="logIn">SIGN IN</button>
        </form>
      </div>

      <div class="switch" ref="switch_cnt">
        <div class="switch_circle" ref="switch_circle0"></div>
        <div class="switch_circle switch_circle-t" ref="switch_circle1"></div>
        <div class="switch_container" ref="switch_c1">
          <h2 class="switch_title title" style="letter-spacing: 0;">Welcome Back！</h2>
          <p class="switch_description description">已经有账号了嘛，去登入账号来进入奇妙世界吧！！！</p>
          <button class="switch_button button switch-btn" @click="changeForm">SIGN IN</button>
        </div>

        <div class="switch_container is-hidden" ref="switch_c2">
          <h2 class="switch_title title" style="letter-spacing: 0;">Hello Friend！</h2>
          <p class="switch_description description">去注册一个账号，成为尊贵的粉丝会员，让我们踏入奇妙的旅途！</p>
          <button class="switch_button button switch-btn" @click="changeForm">SIGN UP</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref, watch} from "vue"
import {mapState, mapGetters, mapMutations, createNamespacedHelpers} from 'vuex'
import {useStore} from "vuex";
import {ElMessage} from "element-plus";
import axios from "axios";
import {useRouter} from "vue-router";
import {encodeUtf8} from "node-forge/lib/util.js";
import {Base64} from "js-base64";
const Store = useStore()
const switch_c2 = ref(null)
const switch_c1 = ref(null)
const switch_cnt = ref(null)
const a_container = ref(null)
const a_form = ref(null)
const b_container = ref(null)
const b_form = ref(null)
const switch_circle0 = ref(null)
const switch_circle1 = ref(null)
const router = useRouter()
const signForm = reactive({
  username: '',
  password: '',
  email: '',
  captcha: '',
  captcha_get: '',
  email_change: false
})
const loginForm = reactive({
  username: '',
  password: '',
})
const captcha_time = ref('获取验证码')
function signUp(){
  if(signForm.username == ''){
    ElMessage.error('用户名不能为空')
    return
  }
  if(signForm.password == ''){
    ElMessage.error('密码不能为空')
    return
  }
  if(!signForm.password.match('^[a-zA-Z0-9_-]{6,16}$')){
    ElMessage.error('密码不符合规范')
    return
  }
  if(signForm.email_change === true){
    ElMessage.error('邮箱改变，请重新获取验证码')
    return
  }
  if(signForm.captcha === ''){
    ElMessage.error('请输入验证码')
    return
  }
  if(signForm.captcha != signForm.captcha_get){
    ElMessage.error('验证码不正确')
    return
  }
  if(signForm.captcha == signForm.captcha_get && signForm.captcha_get != ''){
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      url: 'http://82.156.174.104/api/user_about/register',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: JSON.stringify({
        username: signForm.username,
        password: signForm.password,
        email: signForm.email
      }),
// 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      console.log(res)
      if(res.data.errno == 1007){
        ElMessage.error("用户名已存在")
        return
      }
      if(res.data.errno == 1008){
        ElMessage.error("邮箱已存在")
        return
      }
      else {
        loginForm.username = signForm.username
        changeForm()
        signForm.username = ''
        signForm.email = ''
        signForm.password = ''
        signForm.captcha = ''
        signForm.captcha_get = ''
        signForm.email_change = false
      }
    }).catch(err=>{
      console.log(err)
    })
  }
}
watch(() => signForm.email, (newVal, oldVal) => {
  if(signForm.captcha_get != ''){
    signForm.email_change = true
    signForm.captcha_get = ''
  }
},{deep: true})
function logIn(){
  if(loginForm.username == ''){
    ElMessage.error('用户名不能为空')
    return
  }
  if(loginForm.password == ''){
    ElMessage.error('密码不能为空')
    return
  }
  if(!loginForm.password.match('^[a-zA-Z0-9_-]{6,16}$')){
    ElMessage.error('密码不符合规范')
    return
  }
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/login',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      username: loginForm.username,
      password: loginForm.password
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 1002){
      ElMessage.error("用户名不存在")
      return
    }
    if(res.data.errno == 1003){
      ElMessage.error("密码错误")
      return
    }
    else {
      const user = {
        user_name: res.data.username,
        user_email: res.data.email,
        token: res.data.token,
      }
      Store.commit('loginSuccess', user)
      loginForm.password = ''
      loginForm.username = ''
      ElMessage.success('登录成功')
      router.push('project')
    }
  }).catch(err=>{
    console.log(err)
  })
}
function getCaptcha(){
  if(signForm.email === ''){
    ElMessage.error('请输入邮箱')
    return
  }
  if(captcha_time.value === '获取验证码'){
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      url: 'http://82.156.174.104/api/user_about/register/captcha',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: JSON.stringify({
        email:signForm.email
      }),
// 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      if(res.data.errno == 1002){
        ElMessage.error("邮箱不符合规范")
        return
      }
      else {
        signForm.email_change = false
        signForm.captcha_get = Base64.decode(encodeUtf8(res.data.verification))
      }
    }).catch(err=>{
      console.log(err)
    })
    let timer
    let mount = 60
    timer = setInterval(()=>{
      captcha_time.value = mount + 's'
      mount --;
      if(mount <= 0){
        captcha_time.value = '获取验证码'
        clearInterval(timer)
      }
    },1000)
  }
}
function changeForm(){
  switch_cnt.value.classList.add('is-gx');
  setTimeout(function () {
    switch_cnt.value.classList.remove('is-gx')
  }, 1500)
  switch_cnt.value.classList.toggle('is-txr')
  switch_circle0.value.classList.toggle('is-txr')
  switch_circle1.value.classList.toggle('is-txr')
  switch_c1.value.classList.toggle('is-hidden')
  switch_c2.value.classList.toggle('is-hidden')
  a_container.value.classList.toggle('is-txl')
  b_container.value.classList.toggle('is-txl')
  b_container.value.classList.toggle('is-z')
}
</script>

<style scoped>
  @import "login.css";
</style>