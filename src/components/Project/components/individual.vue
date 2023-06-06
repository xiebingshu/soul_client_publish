<template>
    <div class="control-block">
        <el-input
            v-model="searchInput"
            placeholder="请输入问卷名、问卷ID或修改日期"
            :suffix-icon="Search"
            style="max-width: 500px; margin-top: 9px"
            @keyup.enter.native="searchEnterFun()"
        />
        <el-radio-group v-model="sortOrder" style="margin: 10px">
            <el-radio-button label="问卷名称" />
            <el-radio-button label="更改时间" />
        </el-radio-group>
        <el-radio-group v-model="displayStyle">
            <el-radio-button label="卡片" />
            <el-radio-button label="列表" />
        </el-radio-group>
    </div>
    <div v-if="displayStyle==='卡片'" style="min-width: 800px; max-height: 500px;">
        <el-row>
            <el-col
                v-for="(item, index) in Projects_use.filter((qr)=> qr.organization === -1)"
                :key="index"
                :span="4"
                :offset="index%5>0?1:0"
            >
                <div style="margin-top: 5px; margin-bottom: 20px">
                    <el-card :body-style="{ padding: '0px' }">
                        <img
                            v-if="item.background_Content == ''"
                            src="../assets/default.png"
                            class="questionnaire-image"
                        />
                        <img
                            v-if="item.background_Content != ''"
                            :src="item.background_Content"
                            class="questionnaire-image"
                        />
                        <div style="padding: 14px;" class="header_container">
                            <span>{{item.name}}
                            </span>
                            <div class="card-bottom">
                                <div class="time">修改时间：{{item.current_date}}</div>
                                <el-icon class="option-image" @click="go_to_preview(item)"><View /></el-icon>
                                <el-icon class="option-image" @click="go_to_edit(item)"><Edit /></el-icon>
                                <el-icon class="option-image" @click="go_to_static(item)"><Histogram /></el-icon>
                                <el-icon class="option-image" @click="getSharelink(item.id)"><Share /></el-icon>
                                <el-icon class="option-image_delete" @click="deleteQr(item)"><DeleteFilled /></el-icon>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
    <div v-if="displayStyle==='列表'" style="min-width: 800px; max-height: 500px">
        <el-table
            :data="Projects_use.filter((qr)=> qr.organization === -1)"
            highlight-current-row
            :row-class-name="tableRowClassName"
            :row-style="{height: '70px'}"
            style="width: 100%"
        >
            <el-table-column type="index" width="50" />
            <el-table-column property="current_date" label="名称/修改时间" width="300" >
                <template #default="scope">
                    <div style="font-size: 18px">{{scope.row.name}}</div>
                    <div class="time">修改时间：{{scope.row.current_date}}</div>
                </template>
            </el-table-column>
            <el-table-column property="id" label="问卷ID" width="150" />
            <el-table-column label="问卷类型" width="150" >
              <template #default="scope">
                <el-tag class="ml-2"  v-if="scope.row.type == '考试'">考试问卷</el-tag>
                <el-tag class="ml-2" type="info" v-if="scope.row.type == '非考试'">非考试问卷</el-tag>
              </template>
            </el-table-column>
            <el-table-column property="results" label="问卷统计" width="150" />
            <el-table-column label="问卷状态" width="150" >
              <template #default="scope">
                <el-tag class="ml-2" type="success" v-if="scope.row.state == '已开放'">{{scope.row.state}}</el-tag>
                <el-tag class="ml-2" type="warning" v-if="scope.row.state == '未开放'">{{scope.row.state}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                  <el-icon class="option-image" @click="go_to_preview(scope.row)"><View /></el-icon>
                  <el-icon class="option-image" @click="go_to_edit(scope.row)"><Edit /></el-icon>
                  <el-icon class="option-image" @click="go_to_static(scope.row)"><Histogram /></el-icon>
                  <el-icon class="option-image" @click="getSharelink(scope.row.id)"><Share /></el-icon>
                  <el-icon class="option-image" style="color: #7ef66a" v-if="scope.row.state == '未开放'" @click="open(scope.row.id)"><SwitchButton /></el-icon>
                  <el-icon class="option-image" style="color: #ecdd43" v-if="scope.row.state == '已开放'" @click="close(scope.row.id)"><SwitchButton /></el-icon>
                  <el-icon class="option-image_delete" @click="deleteQr(scope.row)"><DeleteFilled /></el-icon>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-drawer
        v-model="drawer"
        title="搜索结果如下"
        direction="btt"
        size="85%"
    >
    <div v-if="displayStyle==='卡片'" class="searchDisplay">
        <el-row>
            <el-col
                v-for="(item, index) in Projects_search.filter((qr)=> qr.organization === -1)"
                :key="index"
                :span="4"
                :offset="index%5>0?1:0"
            >
                <div style="margin-top: 5px; margin-bottom: 20px">
                    <el-card :body-style="{ padding: '0px' }">
                      <img
                          v-if="item.background_Content == ''"
                          src="../assets/default.png"
                          class="questionnaire-image"
                      />
                      <img
                          v-if="item.background_Content != ''"
                          :src="item.background_Content"
                          class="questionnaire-image"
                      />
                        <div style="padding: 14px">
                            <span>{{item.name}}</span>
                            <div class="card-bottom">
                                <span class="time">修改时间：{{item.current_date}}</span>
                              <el-icon class="option-image" @click="go_to_preview(item)"><View /></el-icon>
                              <el-icon class="option-image" @click="go_to_edit(item)"><Edit /></el-icon>
                              <el-icon class="option-image" @click="go_to_static(item)"><Histogram /></el-icon>
                              <el-icon class="option-image" @click="getSharelink(item.id)"><Share /></el-icon>
                              <el-icon class="option-image_delete" @click="deleteQr(item)"><DeleteFilled /></el-icon>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
    <div v-if="displayStyle==='列表'" class="searchDisplay">
        <el-table
            :data="Projects_search.filter((qr)=> qr.organization === -1)"
            highlight-current-row
            :row-style="{height: '70px'}"
            style="width: 100%"
        >
          <el-table-column property="current_date" label="名称/修改时间" width="300" >
            <template #default="scope">
              <div style="font-size: 18px">{{scope.row.name}}</div>
              <div class="time">修改时间：{{scope.row.current_date}}</div>
            </template>
          </el-table-column>
          <el-table-column property="id" label="问卷ID" width="150" />
          <el-table-column label="问卷类型" width="150" >
            <template #default="scope">
              <el-tag class="ml-2"  v-if="scope.row.type == '考试'">考试问卷</el-tag>
              <el-tag class="ml-2" type="info" v-if="scope.row.type == '非考试'">非考试问卷</el-tag>
            </template>
          </el-table-column>
          <el-table-column property="results" label="问卷统计" width="150" />
          <el-table-column label="问卷状态" width="150" >
            <template #default="scope">
              <el-tag class="ml-2" type="success" v-if="scope.row.state == '已开放'">{{scope.row.state}}</el-tag>
              <el-tag class="ml-2" type="warning" v-if="scope.row.state == '未开放'">{{scope.row.state}}</el-tag>
            </template>
          </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                  <el-icon class="option-image" @click="go_to_preview(scope.row)"><View /></el-icon>
                  <el-icon class="option-image" @click="go_to_edit(scope.row)"><Edit /></el-icon>
                  <el-icon class="option-image" @click="go_to_static(scope.row)"><Histogram /></el-icon>
                  <el-icon class="option-image" @click="getSharelink(scope.row.id)"><Share /></el-icon>
                  <el-icon class="option-image" style="color: #7ef66a" v-if="scope.row.state == '未开放'" @click="open(scope.row.id)"><SwitchButton /></el-icon>
                  <el-icon class="option-image" style="color: #ecdd43" v-if="scope.row.state == '已开放'" @click="close(scope.row.id)"><SwitchButton /></el-icon>
                  <el-icon class="option-image_delete" @click="deleteQr(scope.row)"><DeleteFilled /></el-icon>
                </template>
            </el-table-column>
        </el-table>
    </div>
    </el-drawer>
  <el-dialog id="important_progress" v-model="importantprogress" style="width:20%;
  right:10%;
  height:0;
  opacity: 100%;
  top:20%;
  background-color: rgb(0,0,0,0)!important;
  border: 1px solid rgb(0,0,0,0)!important;"
             :close-on-click-modal="false"
             :show-close="false">
    <div class="out">
      <div class="fade-in">
        <div class="container">
          <div class="one common"></div>
          <div class="two common"></div>
          <div class="three common"></div>
          <div class="four common"></div>
          <div class="five common"></div>
          <div class="six common"></div>
          <div class="seven common"></div>
          <div class="eight common"></div>
        </div>
      </div>
    </div>
  </el-dialog>
  <el-dialog v-model="link_share" @close="init_share"
             :show-close="false">
  >
    <template #header="{ close, titleId, titleClass }">
      <div class="my-header">
        <h4 :id="titleId" :class="titleClass">分享链接</h4>
        <el-button type="primary" @click="copy">
          <el-icon class="el-icon--left"><Finished /></el-icon>
          复制
        </el-button>
      </div>
    </template>
    <span style="color:#31a0fb;">{{link_display}}</span>
  </el-dialog>
</template>

<script setup>
import {Finished, Search, Share, SwitchButton, View} from '@element-plus/icons-vue'
import { ElMessage, ElTable, ElMessageBox} from 'element-plus'
import {CircleCloseFilled, EditPen, Edit, Histogram, DeleteFilled} from '@element-plus/icons-vue'
import {useStore} from "vuex";
import {onMounted, provide, reactive, ref, toRaw, watch} from "vue";
import {hasScopeRef} from "@vue/compiler-core";
import clipboard3 from "vue-clipboard3";
import {useRouter} from "vue-router";
import axios from "axios";
const store = useStore()
const router = useRouter()
const searchInput = ref('')
const sortOrder=ref('更改时间')
const displayStyle=ref('卡片')
const currentDate = ref('2023.05.16')
const Projects_use = ref(store.state.Project.Projects)
const Projects_edit = JSON.parse(JSON.stringify(store.state.Project.Projects))
const Projects_search = ref([])
const drawer = ref(false)
const token = ref(store.state.User.token)
const importantprogress = ref(false);
const link_share = ref(false)
const link_display = ref('')
const { toClipboard } = clipboard3();
const copy = async () => {
  try {
    await toClipboard(link_display.value);
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error("复制失败!!")
  }
};
function init_share(){
  link_share.value = false
  link_display.value = ''
}
watch(() => store.state.User.token, (newVal, oldVal) => {
  token.value = newVal
})
function tableRowClassName({ row, rowIndex }) {
  if (rowIndex % 2 !== 0) {
    return 'el-table__row--striped'
  }
}
watch(()=> sortOrder.value, (newVal, oldVal) =>{
  console.log('sort')
  store.commit('updateOrder', sortOrder.value)
})
watch(() => store.state.Project.Projects, (newVal, oldVal) => {
    console.log(newVal, oldVal)
    Projects_use.value = newVal
    Projects_edit.value = JSON.parse(JSON.stringify(newVal))
},{deep: true})
onMounted(()=>{
  if(store.state.User.get_qr === true){
    geQuestionnaire_former()
  }
})
function close(id){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/mainpage/qn_about/close_qn',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: id,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno === 0){
      store.commit('setCurrent', id)
      const projectEdit = getProject_edit()
      projectEdit.state = '未开放'
      store.commit('updateCurrent',{project:projectEdit, index:store.getters.get_currentIndex})
      store.commit('setCurrent', -1)
    }
    else{
      ElMessage.error('出错啦，找周霄')
    }
  }).catch(err=>{
    console.log(err)
  })
}
function open(id){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/mainpage/qn_about/open_qn',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: id,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno === 0){
      store.commit('setCurrent', id)
      const projectEdit = getProject_edit()
      projectEdit.state = '已开放'
      store.commit('updateCurrent',{project:projectEdit, index:store.getters.get_currentIndex})
      store.commit('setCurrent', -1)
    }
    else{
      ElMessage.error('出错啦，找周霄')
    }
  }).catch(err=>{
    console.log(err)
  })
}
function geQuestionnaire_former(){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/mainpage/list_qn',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      current_status: -1,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno == 0)
    {
      let Qrlist = res.data.return_list
      for(let i = 0; i < Qrlist.length; i++){
        let Qr = Qrlist[i]
        console.log(Qr)
        const newQuestionnaire = {
          name: Qr.title,
          organization: -1,
          number: true,
          background_URL: Qr.background_image,//问卷背景图
          background_Content: '',
          title_URL:Qr.header_image,//表头背景图
          title_Content: '',
          questions: [],//问卷的问题列表（数组）
          id: Qr.id, //问卷的Id,是前端与后端问卷唯一的识别标志，按照目前的想法这个Id由后端给
          current_date: Qr.header_font_color,
          description: Qr.description,
          font_color : Qr.font_color,
          type: Qr.type === 1 ? '考试':'非考试',
          results: Qr.collection_num,
          state: Qr.state === 0 ? '未开放':'已开放',
          get: false,
        }
        store.commit('addProject', newQuestionnaire)
      }
      ElMessage.success('拉取问卷成功')
      store.commit('getSuccess')
    }
    else{
      ElMessage.error('出错了，找周霄')
    }
  }).catch(err=>{
    console.log(err)
  })
}
function string2num(answersString){
  let answersArr = []
  for(let i = 0; i < answersString.length; i++){
    let num = answersString[i].charCodeAt(0) - 65;
    answersArr.push(num)
  }
  return answersArr
}
function geQuestionnaire_full(){
  const project_edit = getProject_edit()
  if(project_edit.state == '已开放'){
    ElMessage.error('问卷已经发布，无法编辑')
    return
  }
  if(project_edit.get == true){
    router.push('../edit')
    return
  }
  let title_succeed = false
  let background_succeed = false
  let question_succeed = false
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      file_url: getProject_use().background_URL,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno === 0){
      project_edit.background_Content = 'data:image/png;base64,' + res.data.content
      background_succeed = true
    }
    else{
      ElMessage.error('出错啦，找周霄')
    }
  }).catch(err=>{
    console.log(err)
  })
  if(project_edit.title_URL != null && project_edit.title_URL != ''){
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: JSON.stringify({
        token: token.value,
        file_url: getProject_use().title_URL,
      }),
// 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      console.log(res)
      if(res.data.errno === 0){
        project_edit.title_Content = 'data:image/png;base64,' + res.data.content
        title_succeed = true
      }
      else{
        ElMessage.error('出错啦，找周霄')
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  title_succeed = true
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/edit_qn/edit_qn',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: store.state.Project.currentId,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno == 0)
    {
      console.log(res.data)
      importantprogress.value = true
      const questions_get = res.data.qn.questions
      const questions = []
      for(let i = 0; i < questions_get.length; i++){
        let question = {
          type: '',
          description: '',
          name: '',
          mutex: false,
          must: false,
          options: '选项1###选项2',
          append: '',
          max: 5,
          picture_content: '',
          picture_url: '',
          answer: [],
        }
        let getPicture = false
        if(questions_get[i].answer1 != null){
          question.answer = string2num(questions_get[i].answer1)
        }
        if(questions_get[i].type === 1 || questions_get[i].type === 2){
          question.type = 'select'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
          question.options = questions_get[i].content1
        }
        if(questions_get[i].type === 3 && questions_get[i].image === null){
          question.type = 'text'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
        }
        if(questions_get[i].type === 4){
          question.type = 'file'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.must = questions_get[i].necessary
        }
        if(questions_get[i].type === 6){
          question.type = 'pulldown'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.must = questions_get[i].necessary
          question.options = questions_get[i].content1
        }
        if(questions_get[i].type === 7){
          question.type = 'number'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.must = questions_get[i].necessary
          question.append = questions_get[i].unit
        }
        if(questions_get[i].type === 8){
          question.type = 'date'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
        }
        if(questions_get[i].type === 9){
          question.type = 'grade'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
          question.max = questions_get[i].num_limit
        }
        if(questions_get[i].type === 3 && questions_get[i].image !== null){
          question.type = 'picture'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.picture_url = questions_get[i].image
          if(question.picture_url != null){
            getPicture = true
            axios({
              // 接口网址：包含协议名，域名，端口和路由
              url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
              // 请求方式，默认为get，可以不写
              method: 'post',
              // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
              data: JSON.stringify({
                token: token.value,
                file_url: questions_get[i].image,
              }),
// 成功请求回数据后，进入then，并用console.log打印结果
            }).then(res => {
              console.log(res)
              if(res.data.errno === 0){
                question.picture_content = 'data:image/png;base64,' + res.data.content
                console.log(question.picture_content)
                getPicture = false
              }
              else{
                ElMessage.error('出错啦，找周霄')
              }
            }).catch(err=>{
              console.log(err)
            })
          }
        }
        let timer
        if(getPicture === true)
        {
          timer = setInterval(()=>{
            if(getPicture === false){
              questions.push(question)
              clearInterval(timer)
            }
          },500)
        }
        else{
          questions.push(question)
        }
      }
      console.log(questions)
      project_edit.questions = questions
      question_succeed = true
    }
    else{
      ElMessage.error('问卷已被收集，不可编辑')
    }
  }).catch(err=>{
    console.log(err)
  })
  let timer
  timer = setInterval(()=>{
    if(title_succeed === true && background_succeed === true && question_succeed === true){
      project_edit.get = true
      store.commit('updateCurrent',{project:project_edit, index:store.getters.get_currentIndex})
      clearInterval(timer)
      importantprogress.value = false
      router.push('../edit')
    }
  },1000)
}
function geQuestionnaire_full_preview(){
  const project_edit = getProject_edit()
  let title_succeed = false
  let background_succeed = false
  let question_succeed = false
  if(project_edit.get === true){
    router.push('../preview')
    return
  }
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      file_url: getProject_use().background_URL,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno === 0){
      project_edit.background_Content = 'data:image/png;base64,' + res.data.content
      background_succeed = true
    }
    else{
      ElMessage.error('出错啦，找周霄')
    }
  }).catch(err=>{
    console.log(err)
  })
  if(project_edit.title_URL != null && project_edit.title_URL != ''){
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: JSON.stringify({
        token: token.value,
        file_url: getProject_use().title_URL,
      }),
// 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      console.log(res)
      if(res.data.errno === 0){
        project_edit.title_Content = 'data:image/png;base64,' + res.data.content
        title_succeed = true
      }
      else{
        ElMessage.error('出错啦，找周霄')
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  title_succeed = true
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/edit_qn/preview_qn',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: store.state.Project.currentId,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 0)
    {
      importantprogress.value = true
      const questions_get = res.data.qn.questions
      const questions = []
      for(let i = 0; i < questions_get.length; i++){
        let question = {
          type: '',
          description: '',
          name: '',
          mutex: false,
          must: false,
          options: '选项1###选项2',
          append: '',
          max: 5,
          picture_content: '',
          picture_url: '',
        }
        let getPicture = false
        if(questions_get[i].type === 1 || questions_get[i].type === 2){
          question.type = 'select'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
          question.options = questions_get[i].content1
        }
        if(questions_get[i].type === 3 && questions_get[i].image === null){
          question.type = 'text'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
        }
        if(questions_get[i].type === 4){
          question.type = 'file'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.must = questions_get[i].necessary
        }
        if(questions_get[i].type === 6){
          question.type = 'pulldown'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.must = questions_get[i].necessary
          question.options = questions_get[i].content1
        }
        if(questions_get[i].type === 7){
          question.type = 'number'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.must = questions_get[i].necessary
          question.append = questions_get[i].unit
        }
        if(questions_get[i].type === 8){
          question.type = 'date'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
        }
        if(questions_get[i].type === 9){
          question.type = 'grade'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
          question.max = questions_get[i].num_limit
        }
        if(questions_get[i].type === 3 && questions_get[i].image !== null){
          question.type = 'picture'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.picture_url = questions_get[i].image
          if(question.picture_url != null){
            getPicture = true
            axios({
              // 接口网址：包含协议名，域名，端口和路由
              url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
              // 请求方式，默认为get，可以不写
              method: 'post',
              // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
              data: JSON.stringify({
                token: token.value,
                file_url: questions_get[i].image,
              }),
// 成功请求回数据后，进入then，并用console.log打印结果
            }).then(res => {
              console.log(res)
              if(res.data.errno === 0){
                question.picture_content = 'data:image/png;base64,' + res.data.content
                getPicture = false
                console.log(question.picture_content)
              }
              else{
                ElMessage.error('出错啦，找周霄')
              }
            }).catch(err=>{
              console.log(err)
            })
          }
        }
        let timer
        if(getPicture === true)
        {
          timer = setInterval(()=>{
            if(getPicture === false){
              questions.push(question)
              clearInterval(timer)
            }
          },500)
        }
        else{
          questions.push(question)
        }
      }
      console.log(questions)
      project_edit.questions = questions
      question_succeed = true
    }
    else{
      ElMessage.error('问卷已被收集，不可编辑')
    }
  }).catch(err=>{
    console.log(err)
  })
  let timer
  timer = setInterval(()=>{
    if(title_succeed === true && background_succeed === true && question_succeed === true){
      project_edit.get = true
      store.commit('updateCurrent',{project:project_edit, index:store.getters.get_currentIndex})
      clearInterval(timer)
      importantprogress.value = false
      router.push('../preview')
    }
  },1000)
}
function geQuestionnaire_full_answer(){
  const project_edit = getProject_edit()
  let title_succeed = false
  let background_succeed = false
  let question_succeed = false
  if(project_edit.get === true){
    router.push('../result')
    return
  }
  importantprogress.value = true
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      file_url: getProject_use().background_URL,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno === 0){
      project_edit.background_Content = 'data:image/png;base64,' + res.data.content
      background_succeed = true
    }
    else{
      ElMessage.error('出错啦，找周霄')
    }
  }).catch(err=>{
    console.log(err)
  })
  if(project_edit.title_URL != null && project_edit.title_URL != ''){
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
      // 请求方式，默认为get，可以不写
      method: 'post',
      // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
      data: JSON.stringify({
        token: token.value,
        file_url: getProject_use().title_URL,
      }),
// 成功请求回数据后，进入then，并用console.log打印结果
    }).then(res => {
      console.log(res)
      if(res.data.errno === 0){
        project_edit.title_Content = 'data:image/png;base64,' + res.data.content
        title_succeed = true
      }
      else{
        ElMessage.error('出错啦，找周霄')
      }
    }).catch(err=>{
      console.log(err)
    })
  }
  title_succeed = true
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/edit_qn/preview_qn',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: store.state.Project.currentId,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno == 0)
    {
      console.log(res.data)
      const questions_get = res.data.qn.questions
      const questions = []
      for(let i = 0; i < questions_get.length; i++){
        let question = {
          type: '',
          description: '',
          name: '',
          mutex: false,
          must: false,
          options: '选项1###选项2',
          append: '',
          max: 5,
          picture_content: '',
          picture_url: '',
        }
        if(questions_get[i].type === 1 || questions_get[i].type === 2){
          question.type = 'select'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
          question.options = questions_get[i].content1
        }
        if(questions_get[i].type === 3 && questions_get[i].image === null){
          question.type = 'text'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
        }
        if(questions_get[i].type === 4){
          question.type = 'file'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.must = questions_get[i].necessary
        }
        if(questions_get[i].type === 6){
          question.type = 'pulldown'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.must = questions_get[i].necessary
          question.options = questions_get[i].content1
        }
        if(questions_get[i].type === 7){
          question.type = 'number'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.must = questions_get[i].necessary
          question.append = questions_get[i].unit
        }
        if(questions_get[i].type === 8){
          question.type = 'date'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
        }
        if(questions_get[i].type === 9){
          question.type = 'grade'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
          question.max = questions_get[i].num_limit
        }
        if(questions_get[i].type === 3 && questions_get[i].image !== null){
          question.type = 'picture'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.picture_url = questions_get[i].image
          if(question.picture_url != null){
            axios({
              // 接口网址：包含协议名，域名，端口和路由
              url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
              // 请求方式，默认为get，可以不写
              method: 'post',
              // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
              data: JSON.stringify({
                token: token.value,
                file_url: questions_get[i].image,
              }),
// 成功请求回数据后，进入then，并用console.log打印结果
            }).then(res => {
              console.log(res)
              if(res.data.errno === 0){
                question.picture_content = 'data:image/png;base64,' + res.data.content
                console.log(question.picture_content)
              }
              else{
                ElMessage.error('出错啦，找周霄')
              }
            }).catch(err=>{
              console.log(err)
            })
          }
        }
        questions.push(question)
      }
      console.log(questions)
      project_edit.questions = questions
      question_succeed = true
    }
    else{
      ElMessage.error('出错了，找周霄')
    }
  }).catch(err=>{
    console.log(err)
  })
  let timer
  timer = setInterval(()=>{
    if(title_succeed === true && background_succeed === true && question_succeed === true){
      project_edit.get = true
      store.commit('updateCurrent',{project:project_edit, index:store.getters.get_currentIndex})
      clearInterval(timer)
      importantprogress.value = false
      router.push('../result')
    }
  },1000)
}
function getProject_use(){
  return store.getters.get_currentProject
}
function getProject_edit(){
  return JSON.parse(JSON.stringify(store.getters.get_currentProject))
}
function go_to_edit(item){
    store.commit('setCurrent', item.id)
    store.commit('updateQuestion', -1)
    geQuestionnaire_full()
}
function go_to_preview(item){
  store.commit('setCurrent', item.id)
  store.commit('updateQuestion', -1)
  geQuestionnaire_full_preview()
}
function go_to_static(item){
  store.commit('setCurrent', item.id)
  store.commit('updateQuestion', -1)
  geQuestionnaire_full_answer()
}
function searchEnterFun(){
    console.log('we')
    drawer.value=true
    let oldArr=JSON.parse(JSON.stringify(Projects_use))._value
    // console.log(oldArr)
    // console.log(Projects_use.value)
    let arr;
    let e=searchInput.value.trim()
    if(e){
        arr=oldArr.filter((item)=>{
            return Object.keys(item).some((key)=>{
                return String(item[key]).toLowerCase().match(e)
            })
        })
    } else {
        arr=oldArr
    }
    Projects_search.value = arr;
}
function deleteQr(item){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/mainpage/qn_about/delete_qn',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: item.id,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 0){
      store.commit('setCurrent', item.id)
      store.commit('removeProject', store.getters.get_currentIndex)
      ElMessage.success('删除成功')
      store.commit('setCurrent', -1)
    }
  }).catch(err=>{
    console.log(err)
  })
}
function getSharelink(id){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/mainpage/qn_about/generate_link',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: id,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 0){
      store.commit('setCurrent', id)
      const projectEdit = getProject_edit()
      projectEdit.state = '已开放'
      store.commit('updateCurrent',{project:projectEdit, index:store.getters.get_currentIndex})
      const parts = res.data.link.split('/')
      link_display.value = 'http://82.156.174.104/?#/answer/' + parts[parts.length - 1]
      link_share.value = true
      store.commit('setCurrent', -1)
    }
  }).catch(err=>{
    console.log(err)
  })
}
function test(){
  router.push('../answer')
}
</script>

<style scoped>
.control-block{
    height: 60px;
    min-width: 800px;
}
.time {
    font-size: 12px;
    color: #999;
}
.card-bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.questionnaire-image {
    width: 100%;
    height: 133px;
    background-size: cover;
    display: block;
}
.option-image {
    margin-left: 2px;
    margin-right: 2px;
    font-size: 18px;
}
.option-image :hover{
  color: royalblue;
}
.option-image_delete {
  margin-left: 2px;
  margin-right: 2px;
  font-size: 18px;
}
.option-image_delete :hover{
  color: #e00f0f;
}
.searchDisplay{
    min-width: 800px;
    max-height: 500px;
    margin-left: 75px;
    margin-right: 75px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-header {
 display: flex;
 justify-content: space-between;
 align-items: center;
}
.info{
  font-size: 12px;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}

::v-deep .el-table__body tr,
::v-deep .el-table__body td {
  padding: 0;
  height: 34px;
}
::v-deep .el-table__body tr.el-table__row--striped td {
  background: rgba(134, 196, 238, 0.3);
;
}
::v-deep .el-table__body {
  background: #ffffff;
}

::v-deep .el-table__body tr:hover > td{
  background-color: rgba(201, 201, 210, 0.99) !important;
}
.container {
  width: 40vw;
  height: 40vw;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
}

.common {
  height: 5vw;
  max-height: 100%;
  overflow: auto;
  width: 2vw;
  margin: auto;
  max-width: 100%;
  position: absolute;
  border-radius: 0vw 10vw 0vw 10vw;
  box-shadow: inset 0vw 0vw 0vw .1vw #31c2fb, 0vw 0vw 1.5vw 0vw #1b24c4;
}

.one {
  transform: rotate(45deg);
  left: 0;
  right: 0;
  top: 0;
  bottom: 7.5vw;
}

.two {
  transform: rotate(90deg);
  left: 5.5vw;
  right: 0;
  top: 0;
  bottom: 5.5vw;
}

.three {
  transform: rotate(135deg);
  left: 7.5vw;
  right: 0;
  top: 0;
  bottom: 0;
}

.four {
  transform: rotate(180deg);
  left: 5.5vw;
  right: 0;
  top: 5.5vw;
  bottom: 0;
}

.five {
  transform: rotate(225deg);
  left: 0;
  right: 0;
  top: 7.5vw;
  bottom: 0;
}

.six {
  transform: rotate(270deg);
  left: 0;
  right: 5.5vw;
  top: 5.5vw;
  bottom: 0;
}

.seven {
  transform: rotate(315deg);
  left: 0;
  right: 7.5vw;
  top: 0;
  bottom: 0;
}

.eight {
  transform: rotate(360deg);
  left: 0;
  right: 5.5vw;
  top: 0;
  bottom: 5.5vw;
}

.bar {
  width: 12vw;
  height: .25vw;
  position: absolute;
  left: 0;
  right: 0;
  top: 16vw;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: #1b24c4;
}

.progress {
  width: 12vw;
  height: .5vw;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  overflow: hidden;
  background: #c9c9d2;
}

.one {
  animation: one 1s ease infinite;
  -moz-animation: one 1s ease infinite;
  /* Firefox */
  -webkit-animation: one 1s ease infinite;
  /* Safari and Chrome */
  -o-animation: one 1s ease infinite;
  /* Opera */
}

@keyframes one {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.two {
  animation: two 1s .125s ease infinite;
  -moz-animation: two 1s .125s ease infinite;
  /* Firefox */
  -webkit-animation: two 1s .125s ease infinite;
  /* Safari and Chrome */
  -o-animation: two 1s .125s ease infinite;
  /* Opera */
}

@keyframes two {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.three {
  animation: three 1s .25s ease infinite;
  -moz-animation: three 1s .25s ease infinite;
  /* Firefox */
  -webkit-animation: three 1s .25s ease infinite;
  /* Safari and Chrome */
  -o-animation: three 1s .25s ease infinite;
  /* Opera */
}

@keyframes three {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.four {
  animation: four 1s .375s ease infinite;
  -moz-animation: four 1s .375s ease infinite;
  /* Firefox */
  -webkit-animation: four 1s .375s ease infinite;
  /* Safari and Chrome */
  -o-animation: four 1s .375s ease infinite;
  /* Opera */
}

@keyframes four {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.five {
  animation: five 1s .5s ease infinite;
  -moz-animation: five 1s .5s ease infinite;
  /* Firefox */
  -webkit-animation: five 1s .5s ease infinite;
  /* Safari and Chrome */
  -o-animation: five 1s .5s ease infinite;
  /* Opera */
}

@keyframes five {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.six {
  animation: six 1s .625s ease infinite;
  -moz-animation: six 1s .625s ease infinite;
  /* Firefox */
  -webkit-animation: six 1s .625s ease infinite;
  /* Safari and Chrome */
  -o-animation: six 1s .625s ease infinite;
  /* Opera */
}

@keyframes six {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.seven {
  animation: seven 1s .750s ease infinite;
  -moz-animation: seven 1s .750s ease infinite;
  /* Firefox */
  -webkit-animation: seven 1s .750s ease infinite;
  /* Safari and Chrome */
  -o-animation: seven 1s .750s ease infinite;
  /* Opera */
}

@keyframes seven {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.eight {
  animation: eight 1s .875s ease infinite;
  -moz-animation: eight 1s .875s ease infinite;
  /* Firefox */
  -webkit-animation: eight 1s .875s ease infinite;
  /* Safari and Chrome */
  -o-animation: eight 1s .875s ease infinite;
  /* Opera */
}

@keyframes eight {
  0%,
  100% {}
  50% {
    box-shadow: inset 0vw 0vw 0vw .1vw #c9c9d2, 0vw 0vw 1.5vw 0vw #c9c9d2;
  }
}

.container {
  animation: container 5s linear infinite;
  -moz-animation: container 5s linear infinite;
  /* Firefox */
  -webkit-animation: container 5s linear infinite;
  /* Safari and Chrome */
  -o-animation: container 5s linear infinite;
  /* Opera */
}

@keyframes container {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(-360deg);
  }
}

.progress {
  animation: progress 15s ease;
  -moz-animation: progress 15s ease;
  /* Firefox */
  -webkit-animation: progress 15s ease;
  /* Safari and Chrome */
  -o-animation: progress 15s ease;
  /* Opera */
}

@keyframes progress {
  0% {
    left: -24vw;
  }
  10% {
    left: -20vw;
  }
  30% {
    left: -16vw;
  }
  50% {
    left: -12vw;
  }
  65% {
    left: -10vw;
  }
  80% {
    left: -4vw;
  }
  100% {
    left: 0;
  }
}

.fade-in {
  animation: fade-in 2s ease;
  -moz-animation: fade-in 2s ease;
  /* Firefox */
  -webkit-animation: fade-in 2s ease;
  /* Safari and Chrome */
  -o-animation: fade-in 2s ease;
  /* Opera */
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.out {
  animation: out 2s 15s ease;
  -moz-animation: out 2s 15s ease;
  /* Firefox */
  -webkit-animation: out 2s 15s ease;
  /* Safari and Chrome */
  -o-animation: out 2s 15s ease;
  /* Opera */
}
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
@keyframes out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
