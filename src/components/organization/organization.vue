<template>
    <div>
        <el-container class="layout-container">
            <el-header class="header" height="7vh">
                <div class="header-box">
                    <el-menu
                        :default-active="activeIndex"
                        class="top-menu"
                        mode="horizontal"
                        router
                    >
                        <el-menu-item index="/project" @click="store.commit('setCurrentOrganizationId', -1)"><h3>工作台</h3></el-menu-item>
                        <el-menu-item index="/organization"><h3>组织</h3></el-menu-item>
                    </el-menu>
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
                        <el-menu-item @click="dialogOrganizationAdd=true" index="">
                            <el-icon><Plus /></el-icon>
                            <span>新建组织</span>
                        </el-menu-item>
                        <el-sub-menu>
                            <template #title>
                                <el-icon @click="getQrganization"><location /></el-icon>
                                <span @click="getQrganization">我的组织</span>
                            </template>
                            <el-menu-item-group v-for="(item, index) in Organizations_use" :key="index">
                                <el-menu-item @click="changeCurrentOrganization(item)" index="">{{item.name}}</el-menu-item>
                            </el-menu-item-group>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main style="background-color: #f9f9f9">
                    <div style="background-color: #ffffff; height: 60px; margin-bottom: 5px">
                        <el-card v-if="isLookQuestionnaire" style="width: 100%">
                            <template #header>
                                <div class="card-header">
                                    <div>
                                        <span style="font-size: 24px; font-weight: bold">群组详情</span>
                                        <span v-if="currentId > -1" style="font-size: 28px">/</span>
                                        <span v-if="currentId > -1" style="font-size: 22px">{{getCurrentOrganization().name}}团队问卷列表</span>
                                    </div>
                                    <div>
                                        <el-button class="control-button" @click="dialogBlankQuestionnaireAdd=true" text v-if="getCurrentOrganization().state === 4">创建问卷</el-button>
                                        <el-button class="control-button" @click="isLookQuestionnaire=false" text>成员列表</el-button>
                                    </div>
                                </div>
                            </template>

                            <div v-if="currentId > -1" style="min-width: 800px; max-height: 500px">
                              <el-table
                                  :data="Projects_use.filter((qr)=> qr.organization === getCurrentOrganization().id)"
                                  highlight-current-row
                                  :row-class-name="tableRowClassName"
                                  :row-style="{height: '70px'}"
                                  style="width: 100%"
                              >
                                <el-table-column type="index" width="50" />
                                <el-table-column property="current_date" label="名称/修改时间" width="340" >
                                  <template #default="scope">
                                    <div style="font-size: 18px">{{scope.row.name}}</div>
                                    <div class="time">修改时间：{{scope.row.current_date}}</div>
                                  </template>
                                </el-table-column>
                                <el-table-column property="id" label="问卷ID" width="190" />
                                <el-table-column property="results" label="问卷统计" width="190" />
                                <el-table-column label="问卷状态" width="190" >
                                  <template #default="scope">
                                    <el-tag class="ml-2" type="success" v-if="scope.row.state == '已开放'">{{scope.row.state}}</el-tag>
                                    <el-tag class="ml-2" type="warning" v-if="scope.row.state == '未开放'">{{scope.row.state}}</el-tag>
                                  </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                  <template #default="scope">
                                    <el-icon class="option-image" @click="go_to_preview(scope.row)"><View /></el-icon>
                                    <el-icon class="option-image" @click="getSharelink2(scope.row.id)"><Promotion /></el-icon>
                                    <el-icon class="option-image" @click="go_to_edit(scope.row)" v-if="getCurrentOrganization().state === 4"><Edit /></el-icon>
                                    <el-icon class="option-image" @click="go_to_static(scope.row)" v-if="getCurrentOrganization().state === 4"><Histogram /></el-icon>
                                    <el-icon class="option-image" @click="getSharelink(scope.row.id)" v-if="getCurrentOrganization().state === 4"><Share /></el-icon>
                                    <el-icon class="option-image_delete" @click="deleteQr(scope.row)" v-if="getCurrentOrganization().state === 4"><DeleteFilled /></el-icon>
                                  </template>
                                </el-table-column>
                              </el-table>
                            </div>

                        </el-card>
                        <el-card v-else style="width: 100%">
                            <template #header>
                                <div class="card-header">
                                    <div>
                                        <span style="font-size: 24px; font-weight: bold">群组详情</span>
                                        <span v-if="currentId > -1" style="font-size: 28px">/</span>
                                        <span v-if="currentId > -1" style="font-size: 22px">{{getCurrentOrganization().name}}成员列表</span>
                                    </div>
                                    <div v-if="currentId > -1">
                                        <el-button class="control-button" @click="invite_dialog">邀请成员</el-button>
                                      <el-popover
                                          trigger="click"
                                          placement="bottom"
                                          :width="500"
                                          popper-style="height: 600px;"
                                      >
                                        <template #reference>
                                          <el-button class="control-button" v-if="getCurrentOrganization().state === 4" @click="getApplication">审核申请</el-button>
                                        </template>
                                        <el-card shadow="never">
                                          <template #header>
                                            <div class="messageCard-header">
                                              <h3>审核列表</h3>
                                            </div>
                                          </template>
                                          <div style="height: 460px; overflow:auto">
                                            <el-scrollbar height="460px">
                                            <el-badge is-dot v-for="(item, index) in Applications" :key="index" class="singleMessageNR">
                                              <h4 style="color:#0e0e0e;">申请人：{{item.username}}</h4>
                                              <div class="singleMessageText" style="margin-top: 5px; color: #31c2fb">
                                                邮箱：{{item.email}}
                                              </div>
                                              <span style="margin-left: 290px">
                                                <el-button style="margin-top: 5px;" type="success" @click="agreejoin(item, index)">同意</el-button>
                                                <el-button style="margin-top: 5px; margin-left: 10px" type="danger" @click="refusejoin(item, index)">拒绝</el-button>
                                              </span>
                                              <el-divider style="margin: 3px"/>
                                            </el-badge>
                                            </el-scrollbar>
                                            </div>
                                          </el-card>
                                        </el-popover>
                                        <el-button class="control-button" v-if="getCurrentOrganization().state === 4" @click="deleteOrganization">解散组织</el-button>
                                        <el-button class="control-button" v-if="getCurrentOrganization().state !== 4" @click="leave">退出组织</el-button>
                                        <el-button class="control-button" @click="isLookQuestionnaire=true">团队问卷</el-button>
                                    </div>
                                </div>
                            </template>

                            <el-table
                                v-if="currentId > -1"
                                :data="getCurrentOrganization().members"
                                style="width: 100%"
                                ref="memberTable"
                                :row-style="{height: '40px'}"
                            >
                                <el-table-column property="username" label="姓名" width="500" />
                                <el-table-column property="email" label="联系方式" width="500" />
                                <el-table-column label="操作">
                                    <template #default="scope">
                                        <span @click="removeMember(scope.row, scope.$index)"><el-button :disabled="getCurrentOrganization().state !== 4 || user_id == scope.row.username" type="danger">移除</el-button></span>
                                    </template>
                                </el-table-column>
                            </el-table>

                        </el-card>
                    </div>

                </el-main>
            </el-container>
        </el-container>
    </div>

    <el-dialog v-model="dialogOrganizationAdd" title="新建组织" @close="initNewOrganization">
        <el-form :model="newOrganization">
            <el-form-item label="组织名称" :label-width="formLabelWidth">
                <el-input v-model="newOrganization.name" autocomplete="off" style="width: 300px"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogOrganizationAdd = false">取消</el-button>
                <el-button type="primary" @click="createOrganization()">
                确认
                </el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="showInformation" title="个人信息">
        <div class="informationDisplay">
            <div style="width: 500px; height: 200px">
                <el-avatar :size="150" :src=circleUrl />
                <span></span>
            </div>
        </div>
    </el-dialog>

    <el-dialog v-model="invite_people" title="邀请成员" @close="invitee.name = ''">
      <el-form :model="invitee">
        <el-form-item label="成员用户名" :label-width="formLabelWidth">
          <el-input v-model="invitee.name" autocomplete="off" style="width: 300px"/>
        </el-form-item>
      </el-form>
      <template #footer>
              <span class="dialog-footer">
                  <el-button @click="invite_people = false">取消</el-button>
                  <el-button type="primary" @click="invite">
                  确认
                  </el-button>
              </span>
      </template>
    </el-dialog>
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
import {onBeforeMount, reactive, ref, toRaw, watch} from "vue";
import {useStore} from "vuex";
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Plus, View, Edit, Histogram, Share, DeleteFilled, Finished, Promotion,
} from '@element-plus/icons-vue'
import {ElMessage, ElTable} from "element-plus";
import axios from "axios";
import organization from "../../store/Organization.js";
import {useRouter} from "vue-router";
import clipboard3 from "vue-clipboard3";
onBeforeMount(()=>{
  store.commit('setCurrentOrganizationId', -1)
  getQrganization()
})
const store = useStore()
const activeIndex = ref('/organization')
const Organizations_use = ref(store.state.Organization.Organizations)
const user_id = ref(store.state.User.user_name)
watch(() => store.state.Organization.Organizations, (newVal, oldVal) => {
  Organizations_use.value = newVal
})
const Applications = ref([])
function getApplication(){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/list_unreviewed_list',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: getCurrentOrganization().id,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 0){
      Applications.value = JSON.parse(JSON.stringify(res.data.list))
    }
  }).catch(err=>{
    console.log(err)
  })
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
function agreejoin(item, index){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/pass',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: getCurrentOrganization().id,
      invitee_id: item.id,
      if_agree: 1,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno === 0){
      ElMessage.success('审核成功')
      Applications.value.splice(index,1)
    }
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
}
const link_share = ref(false)
const link_display = ref('')
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
function getSharelink2(id){
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
      const projectEdit = getProject_edit()
      projectEdit.state = '已开放'
      store.commit('updateCurrent',{project:projectEdit, index:store.getters.get_currentIndex})
      store.commit('setCurrentOrganizationId', -1)
      const parts = res.data.link.split('/')
      router.push({ name: 'answer', params: { link: parts[parts.length - 1]}})
    }
  }).catch(err=>{
    console.log(err)
  })
}
function init_share(){
  link_share.value = false
  link_display.value = ''
}
const { toClipboard } = clipboard3();
const copy = async () => {
  try {
    await toClipboard(link_display.value);
    ElMessage.success('复制成功')
  } catch (error) {
    ElMessage.error("复制失败!!")
  }
};
function refusejoin(item, index){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/pass',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: getCurrentOrganization().id,
      invitee_id: item.id,
      if_agree: 0,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno === 0){
      ElMessage.info('审核成功')
      Applications.value.splice(index,1)
    }
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
}
const dialogOrganizationAdd = ref(false)
const isLookQuestionnaire = ref(false)
const invite_people = ref(false)
const delete_people = ref(false)
const formLabelWidth = '140px'
const token = ref(store.state.User.token)
const currentId = ref(store.state.Organization.currentOrganizationId)
function getOrganization_edit(){
  return JSON.parse(JSON.stringify(store.getters.get_currentOrganization))
}
watch(()=>store.state.Organization.currentOrganizationId, (newVal, oldVal)=> {
  currentId.value = store.state.Organization.currentOrganizationId
})
watch(() => store.state.User.token, (newVal, oldVal) => {
  token.value = newVal
})
const invitee = reactive({
  name:''
})
const deleteee = reactive({
  name: ''
})
function invite_dialog(){
  invite_people.value = true
}
function delete_dialog(){
  delete_people.value = true
}
const newOrganization = reactive({
    name: '',
    members: [],
    state: 0,
    id: -1,
    projects: [],
    getQr: true,
})
const showInformation = ref(false)
const circleUrl = ref("https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png")
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
function initNewOrganization(){
    newOrganization.name=''
    newOrganization.id = -1
    newOrganization.state = 0
    newOrganization.members=[]
    newOrganization.projects=[]
    newOrganization.getQr = true
}
// function
function invite(){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/invite',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: getCurrentOrganization().id,
      invitee_id: invitee.name
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 0){
      ElMessage.success('邀请成功')
      invite_people.value = false
    }
    else if(res.data.errno == 1006){
      ElMessage.error('该用户已拒绝邀请')
    }
    else if (res.data.errno == 1007){
      ElMessage.error('该用户的申请正在被审核')
    }
    else if (res.data.errno == 1008){
      ElMessage.error('该用户已在组织中或尚未同意邀请')
    }
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
}
function leave(){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/quit',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: getCurrentOrganization().id,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 0){
      store.commit('setCurrentOrganizationId', -1)
      getQrganization()
      ElMessage.success('退出成功')
    }
    else{
      ElMessage.error('退出失败')
    }
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })

}
function createOrganization(){
    if (newOrganization.name===''){
        ElMessage.error('请输入组织名称！')
        return;
    }
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/create_organization',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_name: newOrganization.name,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno == 0){
      newOrganization.id = res.data.id
      newOrganization.state = 4
      ElMessage.success('创建组织成功')
      dialogOrganizationAdd.value=false
      store.commit('addOrganization',newOrganization)
      initNewOrganization()
    }
  }).catch(err=>{
    console.log(err)
  })
}
function getQrganization(){
    axios({
      // 接口网址：包含协议名，域名，端口和路由
      url: 'http://82.156.174.104/api/mainpage/list_organization',
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
        let organizations = res.data.return_list
        store.commit('initOrganization')
        for(let i = 0; i < organizations.length; i++){
          newOrganization.id = organizations[i].id
          newOrganization.name = organizations[i].name
          newOrganization.state = organizations[i].state
          store.commit('addOrganization',newOrganization)
          initNewOrganization()
        }
        ElMessage.success('获取组织成功')
        store.commit('getOrganizationSuccess')
      }
    }).catch(err=>{
      console.log(err)
    })
}
function deleteOrganization(){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/disband',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: getCurrentOrganization().id,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 0){
      store.commit('setCurrentOrganizationId', -1)
      getQrganization()
      ElMessage.success('解散成功')
    }
    else{
      ElMessage.error('解散失败')
    }
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
}
function getCurrentOrganization(){
    return store.getters.get_currentOrganization
}
function getCurrentOrganizationEdit(){
  return JSON.parse(JSON.stringify(store.getters.get_currentOrganization))
}
function changeCurrentOrganization(item) {
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/list_user',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: item.id
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno === 0){
      store.commit('setCurrentOrganizationId',item.id)
      if(item.getQr === true){
        geQuestionnaire_former()
      }
      const edit = getOrganization_edit()
      edit.members = JSON.parse(JSON.stringify(res.data.list))
      edit.getQr = false
      store.commit('updateCurrentOrganization', {organization: edit, index:store.getters.get_currentOrganizationIndex})
    }
  }).catch(err=>{
    console.log(err)
  })
}
function removeMember(item, index){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/kick',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: getCurrentOrganization().id,
      kicked_id: item.id
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 0){
      const currentEdit = getCurrentOrganizationEdit()
      currentEdit.members.splice(index, 1)
      store.commit('updateQuestion',{index: store.getters.get_currentOrganizationIndex, organization: currentEdit})
      ElMessage.success('删除成功')
    }
    console.log(res)
  }).catch(err=>{
    console.log(err)
  })
}
const dialogBlankQuestionnaireAdd = ref(false)
function handleBlank(){
  dialogBlankQuestionnaireAdd.value = true
}
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
  newQuestionnaire.get = false
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
      organization_id: getCurrentOrganization().id,
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
    newQuestionnaire.organization = getCurrentOrganization().id
    console.log(newQuestionnaire)
    store.commit('addProject',newQuestionnaire)
    ElMessage.success('创建成功')
    dialogBlankQuestionnaireAdd.value=false
    initNewQuestionnaire()
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
      current_status: getCurrentOrganization().id,
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
          organization: getCurrentOrganization().id,
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
const Projects_use = ref(store.state.Project.Projects)
const Projects_edit = JSON.parse(JSON.stringify(store.state.Project.Projects))
watch(() => store.state.Project.Projects, (newVal, oldVal) => {
  console.log(newVal, oldVal)
  Projects_use.value = newVal
  Projects_edit.value = JSON.parse(JSON.stringify(newVal))
})
function go_to_edit(item){
  console.log(item)
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
const importantprogress = ref(false);
const router = useRouter()
function getProject_use(){
  return store.getters.get_currentProject
}
function getProject_edit(){
  return JSON.parse(JSON.stringify(store.getters.get_currentProject))
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
  if(project_edit.state == 1){
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
      organization_id: getCurrentOrganization().id,
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
                ElMessage.error('问卷已被收集，不可编辑')
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
  if(project_edit.title_URL != null && project_edit.title_URL != '')
  {
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
  if(project_edit.title_URL == null){
    title_succeed = true
  }
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
  if(project_edit.title_URL == null){
    title_succeed = true
  }
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
      router.push('../result')
    }
  },1000)
}
function tableRowClassName({ row, rowIndex }) {
  if (rowIndex % 2 !== 0) {
    return 'el-table__row--striped'
  }
}
</script>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.control-button{
    margin-left: 8px;
}
.time {
    font-size: 12px;
    color: #999;
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
.informationDisplay{
    margin-left: 50px;
    margin-right: 50px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.singleMessageNR{
  margin-top: 4px;
  margin-right: 4px;
  margin-bottom: 35px;
  width: 98%;
  height: 70px;
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
.time {
  font-size: 12px;
  color: #999;
}
/*:deep(.el-scrollbar__bar.is-horizontal){*/
/*  height: 0 !important;*/
/*}*/
</style>
