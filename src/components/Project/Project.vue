<template>
    <div>
        <el-container class="layout-container">
            <el-header class="header" height="7vh">
                <div class="header-box">
                    <el-menu
                        default-active="/project"
                        class="top-menu"
                        mode="horizontal"
                        router
                    >
                        <el-menu-item index="/project"><h3>工作台</h3></el-menu-item>
                        <el-menu-item index="/organization"><h3>组织</h3></el-menu-item>
                    </el-menu>
                    <div style="margin-top: 0px">
                      <el-popover
                          trigger="click"
                          placement="bottom"
                          :width="500"
                          popper-style="height: 600px;"
                      >
                        <template #reference>
                          <el-badge :value='Message_use.length' >
                            <el-icon :size="25" @click="getMessage"><Bell /></el-icon>
                          </el-badge>
                        </template>
                        <el-card shadow="never" >
                          <template #header>
                            <div class="messageCard-header">
                              <h3>消息列表</h3>
                            </div>
                          </template>
                          <div style="height: 460px;">
                            <el-scrollbar height="460px">
                            <el-badge is-dot v-for="(item, index) in Message_use" :key="index" class="singleMessageNR" style="margin-right: 10px;">
                              <h4 style="color:#0e0e0e;">新消息</h4>
                              <template v-if="item.type === 1">
                                <div class="singleMessageText" style="margin-top: 5px; color: #31c2fb">
                                  {{item.message.split('/')[0]}}
                                </div>
                                <span style="margin-left: 290px">
                                  <el-button style="margin-top: 5px;" type="success" @click="agreejoin(item, index)">同意</el-button>
                                  <el-button style="margin-top: 5px; margin-left: 10px" type="danger" @click="refusejoin(item, index)">拒绝</el-button>
                                </span>
                              </template>
                              <template v-else>
                                <div class="singleMessageText" style="margin-top: 10px; color: #31c2fb">
                                  {{item.message}}
                                </div>
                                <span style="margin-left: 290px">
                                  <el-button style="margin-top: 5px; margin-left: 70px; margin-right: 20px" type="info" @click="deleteMessage(item, index)">已读</el-button>
                                </span>
                              </template>
                              <el-divider style="margin: 10px"/>
                            </el-badge>
                            </el-scrollbar>
                          </div>
                        </el-card>
                      </el-popover>
                      <el-divider direction="vertical" style="height: 40px; margin-left: 20px; margin-right: 20px" />
                      <el-badge>
                        <el-icon :size="30" @click="handleInformation"><User /></el-icon>
                      </el-badge>
                    </div>
                </div>
            </el-header>
            <el-container>
                <el-aside width="180px">
                    <el-menu
                        background-color="#fefefe"
                        class="aside-menu"
                        default-active="this.$route.path"
                        router
                    >
                        <el-sub-menu>
                            <template #title>
                                <el-icon><Plus /></el-icon>
                                <span>新建问卷</span>
                            </template>
                            <el-menu-item-group>
                                <el-menu-item index="" @click="handleBlank">空白问卷</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>
                        <el-menu-item index="/project/individual">
                            <el-icon><document /></el-icon>
                            <span>个人问卷</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main style="background-color: #f9f9f9; overflow-x: hidden">
                    <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                         viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
                      <defs>
                        <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                      </defs>
                      <g class="parallax">
                        <use xlink:href="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
                        <use xlink:href="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
                        <use xlink:href="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
                        <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
                      </g>
                    </svg>
                    <div style="margin-left: 20px; margin-right: 20px">
                      <router-view></router-view>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>

    <el-dialog v-model="dialogBlankQuestionnaireAdd" title="新建空白问卷" @close="initNewQuestionnaire">
        <el-form :model="newQuestionnaire">
            <el-form-item label="问卷名称" label-width="140px">
                <el-input v-model="newQuestionnaire.name" autocomplete="off" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="问卷描述" label-width="140px">
                <el-input v-model="newQuestionnaire.description" autocomplete="off" style="width: 300px"/>
            </el-form-item>
            <el-form-item label="问卷类型" label-width="140px">
                <el-select v-model="newQuestionnaire.type" placeholder="请选择问卷类型">
                    <el-option label="考试问卷" value="考试" />
                    <el-option label="非考试问卷" value="非考试" />
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogBlankQuestionnaireAdd = false">取消</el-button>
                <el-button type="primary" @click="addBlankQuestionnaire()">
                确认
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="showInformation" title="个人信息">
        <div class="informationDisplay">
            <el-avatar :size="150" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <el-divider direction="vertical" style="height: 155px; margin-bottom: 25px; margin-left: 20px;"/>
            <div style="height: 150px; width: 350px; margin-left: 20px" >
              <div class="informationText" style="font-size: 30px; margin-top: 2px">昵称：{{user.name}}</div>
              <div class="informationText">邮箱:{{user.email}}</div>
            </div>
        </div>
    </el-dialog>
</template>


<script setup>
import {onMounted, reactive, ref, watch} from "vue";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";
import {
  Bell,
  Document,
  Menu as IconMenu, MessageBox,
  Plus,
  Setting, User,
} from '@element-plus/icons-vue'
import {useRouter} from "vue-router";
import axios from "axios";
const router = useRouter()
const store = useStore()
onMounted(()=>{
  router.replace('../project/individual')
  getMessage()
})
const dialogBlankQuestionnaireAdd = ref(false)
const dialogTemplateQuestionnaireAdd = ref(false)
const showInformation = ref(false)
const token = ref(store.state.User.token)
const user = reactive({
  name: store.state.User.user_name,
  email: store.state.User.user_email,
})
watch(() => store.state.User.token, (newVal, oldVal) => {
  token.value = newVal
})
const newQuestionnaire = reactive({
    name: '',
    organization: -1,
    number: true,
    background_URL: './static/mediaquestionnaire/temp/edit_cache/defult.png',//问卷背景图
    background_Content:'',
    title_URL:'',//表头背景图
    title_Content:'',
    questions: [],//问卷的问题列表（数组）
    id: -1, //问卷的Id,是前端与后端问卷唯一的识别标志，按照目前的想法这个Id由后端给
    current_date: '',
    description: '',
    font_color : '#FFFFFF',
    type: '',
    results: 0,
    state: '未开放',
    get: false,
})
function completeDate(value) {
    return value < 10 ? "0"+value:value;
}
function getNowDate() {
    let myDate = new Date;
    let year = myDate.getFullYear(); //获取当前年
    let mon = myDate.getMonth() + 1; //获取当前月
    let date = myDate.getDate(); //获取当前日
    let hours = myDate.getHours(); //获取当前小时
    let minutes = myDate.getMinutes(); //获取当前分钟
    let seconds = myDate.getSeconds(); //获取当前秒
    let now = year + "-" + completeDate(mon) + "-" + completeDate(date) + " " + completeDate(hours) + ":" + completeDate(minutes) + ":" + completeDate(seconds);
    return now;
}
function handleBlank(){
  dialogBlankQuestionnaireAdd.value = true
}
function handleTemplate(){
  dialogTemplateQuestionnaireAdd.value = true
}
function handleInformation(){
  showInformation.value = true
}
function initNewQuestionnaire(){
    newQuestionnaire.name=''
    newQuestionnaire.organization = -1
    newQuestionnaire.number = true
    newQuestionnaire.background_URL='./static/mediaquestionnaire/temp/edit_cache/defult.png'
    newQuestionnaire.background_Content = ''
    newQuestionnaire.title_URL=''
    newQuestionnaire.title_Content = ''
    newQuestionnaire.questions=[]
    newQuestionnaire.id = -1
    newQuestionnaire.current_date=''
    newQuestionnaire.description = ''
    newQuestionnaire.font_color = '#FFFFFF'
    newQuestionnaire.type=''
    newQuestionnaire.results=0
    newQuestionnaire.state='未开放'
    newQuestionnaire.get = 'false'
}
function addBlankQuestionnaire(){
    if (newQuestionnaire.name===''){
        ElMessage.error('请输入问卷名称！')
        return;
    }
    if (newQuestionnaire.type===''){
        ElMessage.error('请选择问卷类型！')
        return;
    }
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/edit_qn/save_qn',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      name: newQuestionnaire.name,
      type: newQuestionnaire.type === '考试' ? 1 : 0,
      public: false,
      permission: 0,
      state: 0,
      title: newQuestionnaire.name,
      background_image: newQuestionnaire.background_URL,
      description: newQuestionnaire.description,
      font_color: '#FFFFFF',
      questions: [],
      header_font_color: getNowDate()
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res.data)
    newQuestionnaire.current_date = getNowDate()
    newQuestionnaire.id = res.data.qn_id
    console.log(newQuestionnaire)
    store.commit('addProject',newQuestionnaire)
    ElMessage.success('创建成功')
    dialogBlankQuestionnaireAdd.value=false
    initNewQuestionnaire()
  }).catch(err=>{
    console.log(err)
  })
}
const Message_use = ref(store.state.Message.Messages)
watch(store.state.Message.Messages, (newVal)=>{
  console.log(newVal)

})
function id2title(id){
  let title
  if(id === 1){
    title = '收到邀请'
  }
  else if(id === 2){
    title = '被移除组织'
  }
  else if(id === 3){
    title = '权限更改'
  }
  else if(id === 4){
    title = '组织解散'
  }
  else if(id === 5){
    title = '收到申请'
  }
  else if(id === 6){
    title = '组织发布问卷'
  }
  else if(id === 7){
    title = '申请结果'
  }
  return title
}
function getMessage(){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/message/list',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno === 0){
      const messages = res.data.info
      store.commit('changeMessage', messages)
      Message_use.value = store.state.Message.Messages
    }
  }).catch(err=>{
    console.log(err)
  })
}
function deleteMessage(item, index){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/message/delete',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      message_id: item.id
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno === 0){
      store.commit('removeMessage', index)
    }
  }).catch(err=>{
    console.log(err)
  })
}
function agreejoin(item, index){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/approve_join',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: parseInt(item.message.split('/')[1]),
      approved: 1,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno === 0){
      ElMessage.success('成功同意邀请')
      deleteMessage(item, index)
    }
  }).catch(err=>{
    console.log(err)
  })
}
function refusejoin(item, index){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/approve_join',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: parseInt(item.message.split('/')[1]),
      approved: 0,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno === 0){
      ElMessage.success('成功拒绝邀请')
      deleteMessage(item, index)
    }
  }).catch(err=>{
    console.log(err)
  })
}
</script>

<style scoped>
.el-main{
  padding: 0 0;
}
.layout-container .header{
    position: relative;
    /*background-color: var(--el-color-primary-light-7);*/
    color: var(--el-text-color-primary);
}
.layout-container .header .header-box{
    margin-left: 158px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.layout-container .header .top-menu{
    min-width: 300px;
    height: 7vh;
}
.layout-container .aside-menu{
    height: 93vh;
}
.dialog-footer button:first-child {
    margin-right: 10px;
}
.informationDisplay{
    margin-left: 50px;
    margin-right: 50px;
    display: flex;
}
.messageCard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.informationText{
  width: 360px;
  font-size: 24px;
}
.messageCard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.singleMessageNR{
  margin-top: 5px;
  margin-bottom: 35px;
  margin-right: 4px;
  width: 98%;
  height: 70px;
}
.singleMessageR{
  width: 98%;
  height: 70px;
}
.singleMessageText{
  width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.singleMessageTime{
  font-size: 12px;
  color: #999;
}
.waves {
  position: absolute;
  width: 87%;
  height:50vh;
  margin-bottom:-7px; /*Fix for safari gap*/
  background: linear-gradient(60deg, rgba(84,58,183,1) 0%, rgba(0,172,193,1) 100%);
  min-height:100px;
  max-height:150px;
}
/* Animation */

.parallax > use {
  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5)     infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px,0,0);
  }
  100% {
    transform: translate3d(85px,0,0);
  }
}
/*Shrinking for mobile*/
@media (max-width: 768px) {
  .waves {
    height:40px;
    min-height:40px;
  }
  .content {
    height:30vh;
  }
  h1 {
    font-size:24px;
  }
}
:deep(.el-scrollbar__bar.is-horizontal){
  height: 0 !important;
}
</style>
