<template>
    <div>
<!--&lt;!&ndash;      <div class="sky">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="deep_sky"></div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="c1">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="cloud"></div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="c2">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="cloud"></div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="c3">&ndash;&gt;-->
<!--&lt;!&ndash;        <div class="cloud"></div>&ndash;&gt;-->
<!--&lt;!&ndash;      </div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="mountain_a"></div>&ndash;&gt;-->
<!--&lt;!&ndash;      <div class="mountain_b"></div>&ndash;&gt;-->
      <div class="house right">
        <div class="fence"></div>
        <div class="wall"></div>
        <div class="roof left"></div>
        <div class="roof right"></div>
        <div class="door"></div>
      </div>
      <div class="house left">
        <div class="fence"></div>
        <div class="wall"></div>
        <div class="roof left"></div>
        <div class="roof right"></div>
        <div class="door"></div>
      </div>
      <div class="tree_back"></div>
      <div class="tree"></div>
      <div class="postbox_a">
        <div class="hole"></div>
      </div>
      <div class="postbox_b">
        <div class="hole"></div>
      </div>
      <div class="windmill">
        <div class="tower"></div>
        <div class="t1"></div>
        <div class="t2"></div>
        <div class="blade">
          <div class="windblade"></div>
          <div class="windblade windblade2"></div>
          <div class="windblade windblade3"></div>
          <div class="windblade windblade4"></div>
        </div>
      </div>
      <div class="allsnows">
        <div class="snow1"></div>
        <div class="snow2"></div>
        <div class="snow3"></div>
        <div class="snow4"></div>
        <div class="snow5"></div>
        <div class="snow6"></div>
        <div class="snow7"></div>
        <div class="snow8"></div>
        <div class="snow9"></div>
        <div class="snow10"></div>
        <div class="snow11"></div>
        <div class="snow12"></div>
        <div class="snow13"></div>
        <div class="snow14"></div>
        <div class="snow15"></div>
        <div class="snow16"></div>
        <div class="snow17"></div>
        <div class="snow18"></div>
        <div class="snow19"></div>
        <div class="snow20"></div>
      </div>
      <div class="ground">
        <div class="g1"></div>
        <div class="g2"></div>
        <div class="g3"></div>
        <div class="ice">
          <div class="glare"></div>
          <div class="ice_shadow"></div>
        </div>

      </div>
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
                                        <el-button class="control-button" @click="uploadMember" text>成员列表</el-button>
                                    </div>
                                </div>
                            </template>

                            <div v-if="currentId > -1" style="min-width: 800px; max-height: 500px;overflow: auto">
                              <el-table
                                  :data="Projects_use.filter((qr)=> qr.organization === getCurrentOrganization().id)"
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
                                    <el-icon class="option-image" @click="getSharelink2(scope.row.id)"><Promotion /></el-icon>
                                    <el-icon class="option-image" @click="go_to_edit(scope.row)" v-if="getCurrentOrganization().state === 4"><Edit /></el-icon>
                                    <el-icon class="option-image" @click="go_to_static(scope.row)" v-if="getCurrentOrganization().state === 4"><Histogram /></el-icon>
                                    <el-icon class="option-image" @click="getSharelink(scope.row.id)" v-if="getCurrentOrganization().state === 4"><Share /></el-icon>
                                    <el-icon class="option-image" style="color: #7ef66a" v-if="scope.row.state == '未开放'" @click="open(scope.row.id)"><SwitchButton /></el-icon>
                                    <el-icon class="option-image" style="color: #ecdd43" v-if="scope.row.state == '已开放'" @click="close(scope.row.id)"><SwitchButton /></el-icon>
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
                                        <el-button class="control-button" @click="uploadQuestionnaire">团队问卷</el-button>
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
  Plus, View, Edit, Histogram, Share, DeleteFilled, Finished, Promotion, SwitchButton,
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
      organization_id: getCurrentOrganization().id
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
      organization_id: getCurrentOrganization().id
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
    console.log(res)
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
      // if(item.getQr === true){
      //   geQuestionnaire_former()
      // }
      geQuestionnaire_former()
      const edit = getOrganization_edit()
      edit.members = JSON.parse(JSON.stringify(res.data.list))
      edit.getQr = false
      store.commit('updateCurrentOrganization', {organization: edit, index:store.getters.get_currentOrganizationIndex})
    }
  }).catch(err=>{
    console.log(err)
  })
}
function uploadMember(){
  isLookQuestionnaire.value = false
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/user_about/organization/list_user',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      organization_id: currentId.value
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno === 0){
      const edit = getOrganization_edit()
      edit.members = JSON.parse(JSON.stringify(res.data.list))
      store.commit('updateCurrentOrganization', {organization: edit, index:store.getters.get_currentOrganizationIndex})
    }
  }).catch(err=>{
    console.log(err)
  })
}
function uploadQuestionnaire(){
  isLookQuestionnaire.value = true
  geQuestionnaire_former()
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
  background_URL: './static/media/questionnaire/77/file/Background_image/default.png',//问卷背景图
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
  newQuestionnaire.background_URL='./static/media/questionnaire/77/file/Background_image/default.png'
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
        let getAlready = false
        for(let j = 0; j < Projects_use.value.length; j++){
          if(Qr.id == Projects_use.value[j].id){
            getAlready = true
            break
          }
        }
        if(getAlready == true){
          continue
        }
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
.sky {
  position: absolute;
  background: #96dada;
  width: 100%;
  height: 200px;
  z-index: -2;
}

/*天空第二層*/
.deep_sky {
  position: absolute;
  background: #78c7c7;
  width: 100%;
  height: 100px;
}

/*天空第三層*/
.deep_sky:before {
  content: "";
  position: absolute;
  background: #5fb4b4;
  width: 100%;
  height: 30px;
}

/*------------地面------------*/

/*地層*/
.ground {

  position: absolute;
  background: #a2e6cf;
  width: 95%;
  height: 180px;
  bottom: 0;
}

/*冰面*/
.ice {
  
  position: absolute;
  background: #c7ede0;
  width: 100%;
  height: 40px;
}

/*冰面反光線*/
.glare{
  
  position:absolute;
  background:#ffffff;
  width:95%;
  height:10px;
  top:0;
}

/*冰面反光第一層-仿像素畫效果*/
.glare:before{
  
  content:"";
  position:absolute;
  background:#c7ede0;
  width:10px;
  height:10px;
  bottom:0;
  left:40%;
  box-shadow:-10px 0px 0px #e3f7f0,5px 0px 0px #c7ede0,10px 0px 0px #c7ede0,15px 0px 0px #c7ede0,20px 0px 0px #c7ede0,25px 0px 0px #c7ede0,30px 0px 0px #c7ede0,35px 0px 0px #c7ede0,40px 0px 0px #c7ede0,-140px 10px 0px #e3f7f0,-150px 10px 0px #ffffff,-155px 10px 0px #ffffff,-160px 10px 0px #ffffff,-165px 10px 0px #ffffff,-170px 10px 0px #ffffff,-175px 10px 0px #ffffff,-180px 10px 0px #ffffff,-185px 10px 0px #ffffff,-190px 10px 0px #ffffff,-195px 10px 0px #ffffff,-200px 10px 0px #ffffff,-180px 20px 0px #e3f7f0,-280px 10px 0px #e3f7f0,-290px 10px 0px #ffffff,-295px 10px 0px #ffffff,-300px 10px 0px #ffffff,-305px 10px 0px #ffffff,-310px 10px 0px #ffffff,-315px 10px 0px #ffffff,-320px 10px 0px #ffffff,-325px 10px 0px #ffffff,-330px 10px 0px #ffffff,-335px 10px 0px #ffffff,-340px 10px 0px #ffffff,-345px 10px 0px #ffffff,-350px 10px 0px #ffffff;
}

/*冰面反光第二層-仿像素畫效果*/
.glare:after{
  
  content:"";
  position:absolute;
  background:#c7ede0;
  width:10px;
  height:10px;
  bottom:0;
  right:0;
  box-shadow:-10px 0px 0px #e3f7f0,-200px 0px 0px #c7ede0,-205px 0px 0px #c7ede0,-210px 0px 0px #c7ede0,-215px 0px 0px #c7ede0,-220px 0px 0px #c7ede0,-225px 0px 0px #c7ede0,-230px 0px 0px #c7ede0,-240px 0px 0px #e3f7f0,-250px 0px 0px #c7ede0,-255px 0px 0px #c7ede0,-260px 0px 0px #c7ede0,-270px 0px 0px #e3f7f0,-120px 10px 0px #e3f7f0,-130px 10px 0px #ffffff,-135px 10px 0px #ffffff,-140px 10px 0px #ffffff,-145px 10px 0px #ffffff,-150px 10px 0px #ffffff,-350px 10px 0px #e3f7f0,-360px 10px 0px #ffffff,-365px 10px 0px #ffffff,-370px 10px 0px #ffffff,-375px 10px 0px #ffffff,-380px 10px 0px #ffffff,-385px 10px 0px #ffffff,-390px 10px 0px #ffffff,-395px 10px 0px #ffffff,-400px 10px 0px #ffffff,-405px 10px 0px #ffffff,-410px 10px 0px #ffffff
}

/*冰面陰影線*/
.ice_shadow{
  
  position:absolute;
  background: #84bba8;
  width: 100%;
  height: 10px;
  bottom:-10px;
}

/*冰面陰影第一層-仿像素畫效果*/
.ice_shadow:before {
  
  content: "";
  position: absolute;
  background: #a2d1c1;
  width: 10px;
  height: 10px;
  bottom: 0;
  left:20%;
  box-shadow:10px 0px 0px #a3e2cd,95px -10px 0px #84bba8,100px -10px 0px #84bba8,105px -10px 0px #84bba8,110px -10px 0px #84bba8,115px -10px 0px #84bba8,120px -10px 0px #84bba8,125px -10px 0px #84bba8,130px -10px 0px #84bba8,135px -10px 0px #a2d1c1,140px -10px 0px #a2d1c1,400px 0px 0px #a2d1c1,410px 0px 0px #a3e2cd;
}

/*冰面陰影第二層-仿像素畫效果*/
.ice_shadow:after{
  
  content: "";
  position: absolute;
  background: #84bba8;
  width: 20px;
  height: 10px;
  bottom: 10px;
  right:10%;
  box-shadow:10px 0px 0px #a2d1c1,-20px 0px 0px #84bba8,-140px 0px 0px #84bba8,-160px 0px 0px #84bba8,-170px 0px 0px #84bba8,-180px 0px 0px #84bba8,-190px 0px 0px #84bba8;
}

/*冰層陰影-底部*/
.g1 {
  
  position: absolute;
  background: #72ccad;
  width: 100%;
  height: 20px;
  bottom: 0;
}

/*冰層陰影-仿像素畫效果*/
.g2 {
  
  position: absolute;
  background: #72ccad;
  width: 50px;
  height: 140px;
  right: -30px;
  bottom: 0;
  box-shadow: -10px 50px 0px #72ccad, -20px 70px 0px #72ccad,
  -30px 80px 0px #72ccad, -40px 90px 0px #72ccad, -60px 100px 0px #72ccad,
  -110px 110px 0px #72ccad;
  /*用陰影仿出一格一格的效果*/
}

/*冰層透光處-仿像素畫效果*/
.g3 {
  
  position: absolute;
  background: #c6feeb;
  width: 180px;
  height: 20px;
  top: 40px;
  box-shadow: -80px 10px 0px #c6feeb, -130px 20px 0px #c6feeb,
  -150px 30px 0px #c6feeb, -160px 40px 0px #c6feeb, -170px 50px 0px #c6feeb;
  /*用陰影仿出一格一格的效果*/
}

/*------------群山------------*/

/*大山*/
.mountain_a {
  position: absolute;
  background: #eeeeee;
  width: 780px;
  height: 660px;
  border-radius: 50%;
  bottom: -240px;
  left: 5%;
}

/*小山*/
.mountain_b {
  position: absolute;
  background: #e5e5e5;
  width: 620px;
  height: 460px;
  border-radius: 50%;
  left: 25%;
  bottom: -80px;
}

/*------------房屋------------*/

/*定位房子*/
.house {
  
  position: absolute;
  bottom: 220px;
}

/*右邊一間*/
.house.right {
  
  position: absolute;
  right: 10%;
}

/*左邊也一間*/
.house.left {
  
  position: absolute;
  left: 12%;
}

/*牆壁的方形部分*/
.wall {
  
  position: absolute;
  background: #e2f4f4;
  width: 80px;
  height: 40px;
}

/*牆壁的三角部分*/
.wall:before {
  
  content: "";
  position: absolute;
  background: transparent;
  width: 0;
  height: 0;
  bottom: 40px;
  border-bottom: 80px solid #e2f4f4;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  /*就是一些三角形設定*/
}

/*屋頂設定*/
.roof {
  
  position: absolute;
  background: #ffffff;
  width: 100px;
  height: 10px;
  border-radius: 40px;
}

/*右邊屋頂*/
.roof.right {
  
  position: absolute;
  left: 14px;
  bottom: 30px;
  transform: rotate(58deg);
}

/*左邊屋頂*/
.roof.left {
  
  position: absolute;
  left: -34px;
  bottom: 30px;
  transform: rotate(-58deg);
}

/*房子的門*/
.door {
  
  position: absolute;
  background: #9acccb;
  width: 20px;
  height: 30px;
  bottom: -40px;
  left: 16px;
}

/*直柵欄*/
.fence {
  
  position: absolute;
  background: #ffffff;
  width: 3px;
  height: 30px;
  bottom: -45px;
  left: -20px;
  border-radius: 3px;
  box-shadow: -10px 0px 0px #ffffff, -20px 0px 0px #ffffff,
  -30px 0px 0px #ffffff, -40px 0px 0px #ffffff, -50px 0px 0px #ffffff,
  -60px 0px 0px #ffffff, -70px 0px 0px #ffffff;
  /*用陰影做出其他的*/
}

/*橫柵欄*/
.fence:before {
  
  content: "";
  position: absolute;
  background: #ffffff;
  width: 72px;
  height: 3px;
  bottom: 22px;
  right: 0;
  box-shadow: 0px 14px 0px #ffffff;
  /*用陰影做出其他的*/
}

/*------------植物------------*/

/*小樹樹幹*/
.tree_back {
  
  position: absolute;
  background: #348e8d;
  width: 10px;
  height: 15px;
  bottom: 180px;
  right: 30%;
}

/*小樹*/
.tree_back:before {
  
  content: "";
  position: absolute;
  background: #e2f4f4;
  width: 30px;
  height: 60px;
  border-radius: 50%;
  bottom: 15px;
  right: -10px;
}

/*大樹樹幹*/
.tree {
  
  position: absolute;
  background: #348e8d;
  width: 10px;
  height: 40px;
  bottom: 180px;
  right: 28%;
}

/*大樹*/
.tree:before {
  
  content: "";
  position: absolute;
  background: #ffffff;
  width: 40px;
  height: 80px;
  border-radius: 50%;
  bottom: 25px;
  left: -15px;
}

/*------------郵筒------------*/

/*郵筒a*/
.postbox_a {
  
  position: absolute;
  background: #73fffd;
  width: 20px;
  height: 25px;
  bottom: 190px;
  left: 35%;
  animation-name: upppp;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  /*無限重複播放動畫*/
  animation-timing-function: ease-in-out;
  /*緩入緩出效果*/
  animation-direction: alternate;
  /*反向播放動畫*/
}

/*郵筒a的桿子*/
.postbox_a:after {
  
  content: "";
  position: absolute;
  background: #76ecea;
  width: 5px;
  height: 20px;
  bottom: -20px;
  left: 8px;
}

/*所有的郵筒洞洞*/
.hole {
  
  position: absolute;
  background: #ffffff;
  width: 6px;
  height: 2px;
  top: 5px;
  left: 2px;
  box-shadow: 10px 0px 0px rgba(100%, 100%, 100%);
}

/*郵筒b*/
.postbox_b {
  
  position: absolute;
  background: #2cb7b5;
  width: 20px;
  height: 25px;
  bottom: 190px;
  left: 37%;
  animation-name: upppp;
  animation-duration: 1s;
  animation-delay: 1s;
  /*晚一秒播放動畫*/
  animation-iteration-count: infinite;
  /*無限重複播放動畫*/
  animation-timing-function: ease-in-out;
  /*緩入緩出效果*/
  animation-direction: alternate;
  /*反向播放動畫*/
}

/*郵筒b的桿子*/
.postbox_b:after {
  
  content: "";
  position: absolute;
  background: #348e8d;
  width: 5px;
  height: 20px;
  bottom: -20px;
  left: 8px;
}

/*郵筒上升動畫*/
@keyframes upppp {
  100% {
    transform: translatey(-10px);
  }
}

/*------------雲朵------------*/

/*雲的底部*/
.cloud {
  position: absolute;
  background: #ffffff;
  width: 100px;
  height: 40px;
  top: 50px;
  border-radius: 50px;
  
}

/*雲的突起*/
.cloud:after {
  content: "";
  position: absolute;
  background: #ffffff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  top: -20px;
  left: 10px;
}

/*雲的小突起*/
.cloud:before {
  content: "";
  position: absolute;
  background: #ffffff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  top: -15px;
  right: 20px;
}

/*雲a的動畫設定*/
.c1 {
  top: 60px;
  opacity: 0.5;
  animation-name: moving;
  animation-duration: 35s;
  animation-iteration-count: infinite;
  /*無限重複播放動畫*/
  animation-timing-function: ease-in-out;
  /*緩入緩出效果*/
}

/*雲b的動畫設定*/
.c2 {
  top: 80px;
  opacity: 0.8;
  animation-name: moving;
  animation-duration: 25s;
  animation-iteration-count: infinite;
  /*無限重複播放動畫*/
  animation-timing-function: ease-in-out;
  /*緩入緩出效果*/
}

/*雲c的動畫設定*/
.c3 {
  top: 100px;
  animation-name: moving;
  animation-duration: 18s;
  animation-iteration-count: infinite;
  /*無限重複播放動畫*/
  animation-timing-function: ease-in-out;
  /*緩入緩出效果*/
}

/*所有雲的位移動畫*/
@keyframes moving {
  0% {
    margin-left: -200px;
  }
  100% {
    margin-left: 105%;
  }
}

/*------------風車------------*/

/*定位風車*/
.windmill {
  
  position: absolute;
  left: 50%;
  bottom: 180px;
}

/*風車塔*/
.tower {
  
  position: absolute;
  background: transparent;
  width: 60px;
  height: 0;
  border-top: 0px solid transparent;
  border-bottom: 90px solid #e2f4f4;
  border-right: 20px solid transparent;
  border-left: 20px solid transparent;
  bottom: 0;
}

/*風車中間*/
.t1 {
  
  position: absolute;
  background: #2cb7b5;
  width: 90px;
  height: 10px;
  bottom: 40px;
  left: 5px;
}

/*塔門*/
.t1:before {
  
  content: "";
  position: absolute;
  background: #2cb7b5;
  width: 20px;
  height: 20px;
  bottom: -40px;
  right: 35px;
  box-shadow: 0px -54px 0px #2cb7b5;
  /*二樓的窗*/
}

/*風車屋頂*/
.t2 {
  
  position: absolute;
  background: transparent;
  width: 0;
  height: 0;
  border-bottom: 40px solid #2cb7b5;
  border-right: 30px solid transparent;
  border-left: 30px solid transparent;
  bottom: 90px;
  left: 20px;
}

/*風車屋簷*/
.t2:after {
  
  content: "";
  position: absolute;
  background: #2cb7b5;
  width: 70px;
  height: 10px;
  border-radius: 10px;
  bottom: -50px;
  left: -35px;
}

/*扇葉範圍與動畫*/
.blade {
  
  position: absolute;
  width: 100px;
  height: 200px;
  left: 0;
  bottom: 0;
  animation-name: spin;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  /*無限重複播放動畫*/
  animation-timing-function: linear;
  /*線性動畫*/
}

/*扇葉柄*/
.windblade {
  
  position: absolute;
  background: #ffffff;
  width: 4px;
  height: 76px;
  bottom: 106px;
  left: 46px;
}

/*扇葉*/
.windblade:before {
  
  content: "";
  position: absolute;
  background: #e2f4f4;
  opacity: 0.8;
  width: 16px;
  height: 60px;
}

/*複製一個旋轉90度*/
.windblade2 {
  
  transform: rotate(90deg);
  bottom: 65px;
  left: 87px;
}

/*複製一個旋轉180度*/
.windblade3 {
  
  transform: rotate(180deg);
  bottom: 25px;
}

/*複製一個旋轉270度*/
.windblade4 {
  
  transform: rotate(270deg);
  bottom: 65px;
  left: 5px;
}

/*旋轉中心點*/
.windblade4:after {
  
  content: "";
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  bottom: -8px;
  right: -3px;
}

/*風車旋轉動畫*/
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

/*------------落雪------------*/

/*落雪範圍*/
.allsnows {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

/*落下動畫*/
@keyframes snowing {
  0% {
    opacity: 0;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translatey(600px);
  }
}

/*個別設定雪球*/
.allsnows .snow1 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  left: 5%;
  top: -2%;
}

.allsnows .snow2 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 3s;
  /*晚一秒播放動畫*/
  left: 10%;
  top: -2%;
}

.allsnows .snow3 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-delay: 7s;
  /*晚一秒播放動畫*/
  left: 15%;
  top: -2%;
}

.allsnows .snow4 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 2s;
  /*晚一秒播放動畫*/
  left: 20%;
  top: -2%;
}

.allsnows .snow5 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-delay: 5s;
  /*晚播放動畫*/
  left: 25%;
  top: -2%;
}

.allsnows .snow6 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 3s;
  /*晚播放動畫*/
  left: 30%;
  top: -2%;
}

.allsnows .snow7 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-delay: 7s;
  /*晚播放動畫*/
  left: 35%;
  top: -2%;
}

.allsnows .snow8 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 4s;
  /*晚播放動畫*/
  left: 40%;
  top: -2%;
}

.allsnows .snow9 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-delay: 1s;
  /*晚播放動畫*/
  left: 45%;
  top: -2%;
}

.allsnows .snow10 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 6s;
  /*晚播放動畫*/
  left: 50%;
  top: -2%;
}

.allsnows .snow11 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-delay: 5s;
  /*晚播放動畫*/
  left: 55%;
  top: -2%;
}

.allsnows .snow12 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 7s;
  /*晚播放動畫*/
  left: 60%;
  top: -2%;
}

.allsnows .snow13 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-delay: 4s;
  /*晚播放動畫*/
  left: 65%;
  top: -2%;
}

.allsnows .snow14 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 6s;
  /*晚播放動畫*/
  left: 70%;
  top: -2%;
}

.allsnows .snow15 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-delay: 4s;
  /*晚播放動畫*/
  left: 75%;
  top: -2%;
}

.allsnows .snow16 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 3s;
  /*晚播放動畫*/
  left: 80%;
  top: -2%;
}

.allsnows .snow17 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-delay: 6s;
  /*晚播放動畫*/
  left: 85%;
  top: -2%;
}

.allsnows .snow18 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 2s;
  /*晚播放動畫*/
  left: 90%;
  top: -2%;
}

.allsnows .snow19 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 10s;
  animation-iteration-count: infinite;
  animation-delay: 3s;
  /*晚播放動畫*/
  left: 95%;
  top: -2%;
}

.allsnows .snow20 {
  
  position: absolute;
  background: #ffffff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation-name: snowing;
  animation-duration: 8s;
  animation-iteration-count: infinite;
  animation-delay: 8s;
  /*晚播放動畫*/
  left: 45%;
  top: -2%;
}
::v-deep .el-card__body {
  background: rgb(255, 255, 255);
  position: relative;
}
/*:deep(.el-scrollbar__bar.is-horizontal){*/
/*  height: 0 !important;*/
/*}*/
</style>
