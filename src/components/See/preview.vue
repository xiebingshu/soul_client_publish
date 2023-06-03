<template>
  <el-container style="height: 100%; " direction="vertical">
    <el-header height="50px">
      <div class="header">
        <el-button type="info" :icon="HomeFilled" @click="home">返回</el-button>
        <span class="see"><el-button type="info" :icon="Upload" @click="submit">提交</el-button></span>
      </div>
    </el-header>
    <el-main>
      <div class="main" :style="{ backgroundImage: 'url(' + background_Content+ ')'}">
        <el-container style="height: 100%">
          <el-aside>
<!--            <template v-for="(item, index) in type" :key="index">-->
<!--              <buttonglass :type="item"></buttonglass>-->
<!--            </template>-->
          </el-aside>
          <el-main>
            <display></display>
          </el-main>
          <el-aside>
<!--            <div class="co-container">-->
<!--              <el-collapse v-model="activeNames" @change="handleChange">-->
<!--                <el-collapse-item title="设置/外观" name="1">-->
<!--                  <el-divider></el-divider>-->
<!--                  <div class="outlook_form_container">-->
<!--                    <el-form ref="form_container" :model="form" label-width="100px" class="outlook-form" label-suffix="">-->
<!--                      <el-form-item label="编辑标题">-->
<!--                        <el-input v-model="name" :placeholder="name" size="small" style="margin-right: 5px"/>-->
<!--                      </el-form-item>-->
<!--                      <el-form-item label="编辑说明">-->
<!--                        <el-input v-model="description" :placeholder="description" size="small" style="margin-right: 5px"/>-->
<!--                      </el-form-item>-->
<!--                      <el-form-item label="插入题号">-->
<!--                        <el-checkbox v-model="number"></el-checkbox>-->
<!--                      </el-form-item>-->
<!--                      <el-form-item label="表头背景图">-->
<!--                        <el-button type="primary" @click="handleTitleUpload">-->
<!--                          <input-->
<!--                              ref="titleInput"-->
<!--                              type="file"-->
<!--                              style="display: none;"-->
<!--                              accept="image/*"-->
<!--                              @change="handleTitleChange"-->
<!--                          /><el-icon size="15px" style="margin-right: 5px;"><Picture/></el-icon>上传表头图</el-button>-->
<!--                      </el-form-item>-->
<!--                      <el-form-item label="页面背景图">-->
<!--                        <el-button type="primary" @click="handleBackgroundUpload">-->
<!--                          <input-->
<!--                              ref="fileInput"-->
<!--                              type="file"-->
<!--                              style="display: none;"-->
<!--                              accept="image/*"-->
<!--                              @change="handleBackgroundChange"-->
<!--                          />-->
<!--                          <el-icon size="15px" style="margin-right: 5px;"><Picture/></el-icon>上传背景图</el-button>-->
<!--                      </el-form-item>-->
<!--                      <el-form-item label="文字颜色">-->
<!--                        <div class="block">-->
<!--                          <el-color-picker v-model="font_color"></el-color-picker>-->
<!--                        </div>-->
<!--                      </el-form-item>-->
<!--                    </el-form>-->
<!--                  </div>-->
<!--                </el-collapse-item>-->
<!--                <el-collapse-item title="题目设置" name="2" v-if="current_Question_id != -1">-->
<!--                  <form_text v-if="current_Question_id != -1"></form_text>-->
<!--                </el-collapse-item>-->
<!--              </el-collapse>-->
<!--            </div>-->
          </el-aside>
        </el-container>
      </div>
    </el-main>
  </el-container>
</template>

<script setup>
import {useStore} from "vuex";
import {onMounted, provide, reactive, ref, toRaw, watch} from "vue";
const store = useStore()
function submit(){
  ElMessage.info('预览界面无法提交')
}
import {HomeFilled, MessageBox, Picture, Share, Upload, View} from "@element-plus/icons-vue";
import display from "./components/display.vue";
import Display from "./components/display.vue";
const font_color = ref(getProject_use().font_color)
import {useRouter} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";
onMounted(()=>{
  console.log(getProject_use().background_Content)
})
import {decodeUtf8, encodeUtf8} from "node-forge/lib/util.js";
const type=ref(['text', 'select', 'pulldown', 'date', 'number', 'grade', 'picture', 'file'])
const current_Question_id = ref(store.state.Project.currentQuestion)
const background_Url = ref(getProject_use().background_URL)
const background_Content = ref(getProject_use().background_Content)
const title_Url = ref(toRaw(getProject_use().title_URL))
const title_Content = ref(getProject_use().title_Content)
const name = ref(getProject_use().name)
const description = ref(getProject_use().description)
const number = ref(getProject_use().number)
const router = useRouter()
const token = ref(store.state.User.token)
const saveornot = ref(true)
watch(() => store.state.User.token, (newVal, oldVal) => {
  token.value = newVal
})
function home(){
  router.back()
}
function see(){
  router.push('see')
}
watch(()=>font_color.value, (newVal, oldVal) => {
  console.log(newVal, oldVal)
  const currentProjectEdit = getProject_edit()
  currentProjectEdit.font_color = font_color.value
  store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
})
watch(()=>name.value, (newVal, oldVal) => {
  const currentProjectEdit = getProject_edit()
  currentProjectEdit.name = name.value
  store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
})
watch(()=>description.value, (newVal, oldVal) => {
  const currentProjectEdit = getProject_edit()
  currentProjectEdit.description = description.value
  store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
})
watch(()=>number.value, (newVal, oldVal) => {
  const currentProjectEdit = getProject_edit()
  currentProjectEdit.number = number.value
  store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
})
function getProject_edit(){
  return JSON.parse(JSON.stringify(store.getters.get_currentProject))
}
function getProject_use(){
  return store.getters.get_currentProject
}
watch(() => store.state.Project.currentQuestion, (newVal, oldVal) => {
  current_Question_id.value = toRaw(newVal)
})
watch(()=>getProject_use().name, (newVal, oldVal)=>{
  name.value = toRaw(newVal)
})
watch(()=>getProject_use().description, (newVal, oldVal)=>{
  description.value = toRaw(newVal)
})
watch(()=>getProject_use().number, (newVal, oldVal)=>{
  number.value = toRaw(newVal)
})
watch(()=>getProject_use(),(newval, oldval)=>{
  saveornot.value = false
},{ deep: true })
const form_container = ref()
const form=reactive( {
  number: false,
})
function handleChange(val) {
  console.log(val);
}
const fileInput = ref()
const titleInput = ref()
function handleTitleUpload (){
  // titleInput.value = document.querySelector('input[type=file]')
  titleInput.value.click()
}
function handleBackgroundUpload (){
  // fileInput.value = document.querySelector('input[type=file]:nth-of-type(2)')
  fileInput.value.click()
}
function handleBackgroundChange (event){
  console.log('background')
  const file = event.target.files[0]
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    background_Content.value = e.target.result
    // 将文件内容转化为 Base64 编码的字符串，并赋值给 state 中的 imageUrl
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      url: 'http://82.156.174.104:8000/api/edit_qn/save_qn_file',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: JSON.stringify({
        token: token.value,
        file: e.target.result.split(',')[1],
        file_name: file.name,
      }),
// 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      if(res.data.errno === 0){
        ElMessage.success('上传成功')
        const currentProjectEdit = getProject_edit()
        currentProjectEdit.background_URL = res.data.url
        currentProjectEdit.background_Content = e.target.result
        store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
      }
      else{
        ElMessage.error('出错啦，找周霄')
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  reader.readAsDataURL(file)
}
function handleTitleChange (event){
  const file = event.target.files[0]
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    title_Content.value = e.target.result
    // 将文件内容转化为 Base64 编码的字符串，并赋值给 state 中的 imageUrl
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      url: 'http://82.156.174.104:8000/api/edit_qn/save_qn_file',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: JSON.stringify({
        token: token.value,
        file: e.target.result.split(',')[1],
        file_name: file.name,
      }),
// 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      console.log(res)
      if(res.data.errno === 0){
        ElMessage.success('上传成功')
        const currentProjectEdit = getProject_edit()
        currentProjectEdit.title_URL = res.data.url
        currentProjectEdit.title_Content = e.target.result
        store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
      }
      else{
        ElMessage.error('出错啦，找周霄')
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  reader.readAsDataURL(file)
}
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
function save_qn(){
  const questions = getProject_use().questions
  const questions_upload = []
  for(let i = 0; i < questions.length; i++)
  {
    let question = questions[i]
    let question_upload = {
      type: 0,
      description: '',
      necessary: '',
      surface: '',
      order: 0,
      content1: '',
      video: '',
      image: '',
      answer1: '',
      num_limit: 0,
      multi_lines: false,
      unit: '',
    }
    if(question.type === 'select' && question.mutex === false){
      question_upload.type = 1
      question_upload.description = question.description
      question_upload.necessary = question.must
      question_upload.surface = question.name
      question_upload.order = i
      question_upload.content1 = question.options
      question_upload.multi_lines = question.mutex == false ? 0 : 1
    }
    if(question.type === 'select' && question.mutex === true){
      question_upload.type = 2
      question_upload.description = question.description
      question_upload.necessary = question.must
      question_upload.surface = question.name
      question_upload.order = i
      question_upload.content1 = question.options
      question_upload.multi_lines = question.mutex == false ? 0 : 1
    }
    if(question.type === 'text'){
      question_upload.type = 3
      question_upload.description = question.description
      question_upload.necessary = question.must
      question_upload.surface = question.name
      question_upload.order = i
      question_upload.multi_lines = question.mutex == false ? 0 : 1
    }
    if(question.type === 'file'){
      question_upload.type = 4
      question_upload.description = question.description
      question_upload.necessary = question.must
      question_upload.surface = question.name
      question_upload.order = i
    }
    if(question.type === 'pulldown') {
      question_upload.type = 6
      question_upload.description = question.description
      question_upload.necessary = question.must
      question_upload.surface = question.name
      question_upload.order = i
      question_upload.content1 = question.options
    }
    if(question.type === 'number'){
      question_upload.type = 7
      question_upload.description = question.description
      question_upload.necessary = question.must
      question_upload.surface = question.name
      question_upload.order = i
      question_upload.unit = question.append
    }
    if(question.type === 'date'){
      question_upload.type = 8
      question_upload.description = question.description
      question_upload.necessary = question.must
      question_upload.surface = question.name
      question_upload.order = i
      question_upload.multi_lines = question.mutex == false ? 0 : 1
    }
    if(question.type === 'grade'){
      question_upload.type = 9
      question_upload.description = question.description
      question_upload.necessary = question.must
      question_upload.surface = question.name
      question_upload.order = i
      question_upload.num_limit = question.max
    }
    if(question.type === 'picture'){
      question_upload.type = 3
      question_upload.description = question.description
      question_upload.necessary = question.must
      question_upload.surface = question.name
      question_upload.order = i
      question_upload.multi_lines = question.mutex == false ? 0 : 1
      question_upload.image = question.picture_url
    }
    questions_upload.push(question_upload)
  }
  console.log(questions_upload)
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104:8000/api/edit_qn/save_qn',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: getProject_use().id,
      name: getProject_use().name,
      type: getProject_use().type === '考试' ? 1 : 0,
      public: false,
      permission: 0,
      background_image: getProject_use().background_URL,
      header_image: getProject_use().title_URL,
      state: getProject_use().type === '未开放' ? 0 : 1,
      title: getProject_use().name,
      description: getProject_use().description,
      font_color: getProject_use().font_color,
      questions: questions_upload,
      header_font_color: getNowDate()
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res.data)
    let message = '已于' + getNowDate() + '成功保存'
    ElMessage.success(message)
    saveornot.value = true
  }).catch(err=>{
    console.log(err)
  })
}
const activeNames = ref([])
function onsubmit(val){
  console.log(val)
}
function test(){
  console.log(background_Url.value)
}
</script>

<style scoped>
*{
  margin: 0;
  padding: 0;
}
.main{
  height: 100%;
  background-size: cover;
}
.header{
  background: #333f4d;
  height: 50px;
  line-height: 45px;
  padding-left: 10px;
}
.header .el-button{
  color: white;
  padding: 5px;
  background: rgb(126, 126, 127);
  border-color: rgb(255, 255, 255);
}
.header .el-button:hover{
  background: linear-gradient(90deg,transparent,
  rgba(255, 255, 255, 0.7),transparent);
  transition: 0.5s;
  border-color: #515152;
}
.see .el-button{
  color: white;
  margin-left: 20px;
  padding: 5px;
  background: rgb(49, 174, 251);
  border-color: rgb(255, 255, 255);
}
.see .el-button:hover{
  background: linear-gradient(90deg,transparent,
  rgb(49, 174, 251),transparent);
  transition: 0.5s;
  border-color: #515152;
}
.save .el-button{
  color: white;
  margin-left: 20px;
  padding: 5px;
  background: rgb(253, 120, 48);
  border-color: rgb(255, 255, 255);
}
.save .el-button:hover{
  background: linear-gradient(90deg,transparent,
  rgb(253, 120, 48),transparent);
  transition: 0.5s;
  border-color: #515152;
}
.share .el-button{
  color: white;
  margin-left: 20px;
  padding: 5px;
  background: #5DFB31FF;
  border-color: rgb(255, 255, 255);
}
.share .el-button:hover{
  background: linear-gradient(90deg,transparent,
  #5DFB31FF,transparent);
  transition: 0.5s;
  border-color: #515152;
}
.edit_page{
  height: 300px;

}
.el-collapse-item{
  border-radius: 10%;
}
.el-collapse{
  border-width: 0px;
}
.co-container{
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px 8px 8px 8px;
  border: 2px solid #a0a5a8;
  box-shadow: #7e7e7f;
}
::v-deep .el-collapse-item__header
{
  border-width: 0;
  background: rgb(201, 201, 210, .0);
  color: v-bind(font_color);
  font-weight: bold;
}
::v-deep .el-collapse-item__header:before
{
  background: rgb(255, 255, 255, .4);
  border-top: 2px solid #a0a5a8;
}
::v-deep .el-collapse-item__header:hover
{
  background: linear-gradient(90deg,transparent,
  rgba(255,255,255,.7),transparent);
  transition: 0.5s;
}
::v-deep .el-collapse-item__wrap
{
  background: rgb(255, 255, 255, .0);
  border-width: 0px;
}
::v-deep .el-collapse-item__content
{
  background: rgb(255, 255, 255, .0);
  min-height: 200px;
}
.outlook_form_container{
  width: 100%;
  /*min-height: 220px;*/
  background: rgba(255, 255, 255, 0.0);
}
::v-deep .el-form-item__label
{
  color: v-bind(font_color);
}
.el-button{
  color: v-bind(font_color);
  padding: 5px;
  background: rgba(126, 126, 127, 0.3);
  border-color: white;
}
.el-button:hover{
  background: linear-gradient(90deg,transparent,
  rgba(255, 255, 255, 0.7),transparent);
  transition: 0.5s;
  border-color: #515152;
}
.el-form-item{
  margin:10px 0 10px 0;
}
::v-deep .el-divider--horizontal{
  margin: 0;
}
.el-main::-webkit-scrollbar {
  width: 0;
}
</style>
