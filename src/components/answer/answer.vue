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
          </el-aside>
          <el-main>
            <div class="page">
              <el-scrollbar height="100%">
                <div class="title_container" :style="{ backgroundImage: title_Content !='' ? 'url(' + title_Content+ ')' : ''}">
                  <div class="title">{{title_Text}}</div>
                  <div v-if="description_Text != ''" class="description">{{description_Text}}</div>
                </div>
                <template v-for= "(question, item) in Questions">
                  <div :class="{ 'container': question.mutex === false, 'container_mutex': question.mutex}" ref="question_container" >
                    <div style="margin-bottom: 10px">
                      <div class="question-title"><span v-if="question.must">*</span><span style="font-weight: bold" v-if="number === true">{{item + 1}}. </span>{{question.name}}<span v-if="question.must" style="color:indianred;">（必填）</span></div>
                      <span class="question-description" v-if="question.description != ''">{{question.description}}</span>
                    </div>
                    <div class="el-input_container" v-if="question.type === 'text' && question.mutex === false"><el-input v-model="textAnswer[item]"></el-input></div>
                    <!--    以上为单行文本-->
                    <div class="el-input_container" v-if="question.type === 'text' && question.mutex">
                      <el-input type="textarea" :rows="4" resize="none" v-model="textAnswer[item]"></el-input>
                    </div>
                    <!--    以上为多行文本-->
                    <div class="el-radio-container" v-if="question.type === 'select' && question.mutex === false">
                      <el-radio-group v-model="radioAnswer[item]">
                        <el-radio :label="item" border v-for="(option, item) in question.options" :key = item >{{option}}</el-radio>
                      </el-radio-group>
                    </div>
                    <!--    以上为单项选择-->
                    <div class="el-radio-container" v-if="question.type === 'select' && question.mutex === true">
                      <el-checkbox-group v-model="checkAnswer[item]">
                        <el-checkbox v-for="(option, item) in question.options" :key="item" :label="item" border>{{
                            option
                          }}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                    <!--    以上为多项选择-->
                    <div class="el-input_container" v-if="question.type === 'pulldown'">
                      <el-select placeholder="请选择" style="width: 90%" v-model="pullAnswer[item]">
                        <el-option
                            v-for="(option, item) in question.options"
                            :key="item"
                            :label="option"
                            :value="item">
                        </el-option>
                      </el-select>
                    </div>
                    <!--    以上为下拉选择-->
                    <div class="el-input_container" v-if="question.type === 'date' && question.mutex === false">
                      <el-date-picker
                          align="right"
                          type="date"
                          placeholder="选择日期"
                          style="width: 90%;"
                          v-model="textAnswer[item]"
                      >
                      </el-date-picker>
                    </div>
                    <!--    以上为日期选择-->
                    <div class="el-input_container" v-if="question.type === 'date' && question.mutex === true">
                      <el-date-picker
                          align="right"
                          type="datetime"
                          placeholder="选择日期时间"
                          style="width: 90%;"
                          v-model="textAnswer[item]"
                      >
                      </el-date-picker>
                    </div>
                    <!--    以上为日期时间选择-->
                    <div class="el-input_container" v-if="question.type === 'number'"><el-input v-model="textAnswer[item]"><template #append>{{question.append}}</template></el-input></div>
                    <!--    以上为日期时间选择-->
                    <div class="el-radio-container" v-if="question.type === 'grade'">
                      <el-rate
                          :icons="icons"
                          :void-icon="ChatRound"
                          :colors="['#409eff', '#67c23a', '#FF9900']"
                          :max="question.max"
                          v-model="intAnswer[item]"
                      />
                    </div>
                    <!--    以上为评分-->
                    <div class="el-input-container" v-if="question.type === 'picture'" style="text-align: center">
                      <div class="demo-image__error" v-if="question.mutex === false">
                        <div class="block">
                          <el-image :src="question.picture_content" fit="cover" :preview-src-list="[question.picture_content]">
                            <template #error>
                              <div class="image-slot">
                                <el-icon><Picture /></el-icon>
                              </div>
                            </template>
                          </el-image>
                        </div>
                      </div>
                      <!--      以上为照片展示-->
                      <div class="demo-image__error">
                        <video
                            v-if="question.mutex === true"
                            :src="question.picture_content"
                            controls
                            class="video-player"
                            style="height: 200px"
                        ></video>
                      </div>
                    </div>
                  </div>
                </template>
              </el-scrollbar>
            </div>
          </el-main>
          <el-aside>
          </el-aside>
        </el-container>
      </div>
    </el-main>
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
          <div class="progress_container">
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
  </el-container>
</template>

<script setup>
import {useStore} from "vuex";
import {onBeforeMount, onMounted, provide, reactive, ref, toRaw, watch} from "vue";
import {Briefcase, Search, ChatDotRound, ChatLineRound, ChatRound } from "@element-plus/icons-vue";
import {useRoute, useRouter} from "vue-router";
import axios from "axios";
import {ElMessage} from "element-plus";
import {HomeFilled, MessageBox, Picture, Share, Upload, View} from "@element-plus/icons-vue";
import {decodeUtf8, encodeUtf8} from "node-forge/lib/util.js";
const store = useStore()
const importantprogress = ref(false)
const textAnswer = ref([])
const checkAnswer = ref([])
const intAnswer = ref([])
const pullAnswer = ref([])
const radioAnswer = ref([])
const qn_id = ref(-1)
const start_time = ref(null)
const end_time = ref(null)
const route = useRoute()
const project_type = ref(0)
const link = route.params.link
watch(() => store.state.User.token, (newVal, oldVal) => {
  token.value = newVal
})
onBeforeMount(()=>{
  if(token.value == ''){
    router.push('../login_before_answer/'+link)
  }
})
onMounted(()=>{
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/answer_qn/answer_qn',
    // 请求方式，默认为get`，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      link: link,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno == 1004){
      ElMessage.error('问卷未发布或已关闭')
      router.push('../project/individual')
    }
    if(res.data.errno == 1006){
      ElMessage.error('您已回答过该问卷')
      router.push('../project/individual')
    }
    if(res.data.errno == 0){
      project_type.value = res.data.qn.type
      qn_id.value = res.data.qn.id
      background_Url.value = res.data.qn.background_image
      description_Text.value = res.data.qn.description
      font_color.value = res.data.qn.font_color
      title_Url.value = res.data.qn.header_image
      number.value = res.data.qn.question_num_visible
      title_Text.value = res.data.qn.title
      let title_succeed = false
      let background_succeed = false
      let question_succeed = false
      importantprogress.value = true
      axios({
        // 接口网址：包含协议名，域名，端口和路由
        url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
        // 请求方式，默认为get，可以不写
        method: 'post',
        // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
        data: JSON.stringify({
          token: token.value,
          file_url: background_Url.value,
        }),
// 成功请求回数据后，进入then，并用console.log打印结果
      }).then(res => {
        console.log(res)
        if(res.data.errno === 0){
          background_Content.value = 'data:image/png;base64,' + res.data.content
          background_succeed = true
        }
      }).catch(err=>{
        console.log(err)
      })
      if(title_Url.value != null && title_Url.value != ''){
        axios({
          // 接口网址：包含协议名，域名，端口和路由
          url: 'http://82.156.174.104/api/edit_qn/read_qn_file',
          // 请求方式，默认为get，可以不写
          method: 'post',
          // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
          data: JSON.stringify({
            token: token.value,
            file_url: title_Url.value,
          }),
// 成功请求回数据后，进入then，并用console.log打印结果
        }).then(res => {
          console.log(res)
          if(res.data.errno === 0){
            title_Content.value = 'data:image/png;base64,' + res.data.content
            title_succeed = true
          }
        }).catch(err=>{
          console.log(err)
        })
      }
      title_succeed = true
      const questions_get = res.data.qn.questions.sort(function (a,b){
        return a.order - b.order
      })
      const questions_tmp = []
      for(let i = 0; i < questions_get.length; i++){
        textAnswer.value.push('')
        radioAnswer.value.push(-1)
        checkAnswer.value.push([])
        pullAnswer.value.push(0)
        intAnswer.value.push(0)
        let question = {
          id: -1,
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
        question.id = questions_get[i].id
        if(questions_get[i].type === 1 || questions_get[i].type === 2){
          question.type = 'select'
          question.description = questions_get[i].description
          question.name = questions_get[i].surface
          question.mutex = questions_get[i].multi_lines == 1 ? true : false
          question.must = questions_get[i].necessary
          question.options = getOptions(questions_get[i].content1)
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
          question.options = getOptions(questions_get[i].content1)
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
            }).catch(err=>{
              console.log(err)
            })
          }
        }
        questions_tmp.push(question)
      }
      console.log(questions_tmp)
      Questions.value = questions_tmp
      question_succeed = true
      let timer
      timer = setInterval(()=>{
        if(title_succeed === true && background_succeed === true && question_succeed === true){
          clearInterval(timer)
          importantprogress.value = false
          start_time.value = Date.parse(new Date());
        }
      },1000)
    }
  }).catch(err=>{
    console.log(err)
  })
})
function submit(){
  end_time.value = Date.parse(new Date())
  let duration = Math.floor((end_time.value - start_time.value) / 1000)
  let answers = []
  let answer_tmp = {
    question_id: -1,
    answer: '',
  }
  for(let i = 0; i < Questions.value.length; i++){
    answer_tmp.question_id = Questions.value[i].id
    if(checkAnswer.value[i].length == 0 && intAnswer.value[i] === 0 && textAnswer.value[i] === '' && radioAnswer.value[i] === -1 && Questions.value[i].type !== 'pulldown' && Questions.value[i].must == true){
      ElMessage.error('题目' + (i + 1) + '为必答题')
      return
    }
    else if(checkAnswer.value[i].length == 0 && intAnswer.value[i] === 0 && textAnswer.value[i] === '' && radioAnswer.value[i] === -1 && Questions.value[i].type !== 'pulldown'){
      continue
    }
    else if(Questions.value[i].type === 'select' && Questions.value[i].mutex == true){
      answer_tmp.answer = num2string(checkAnswer.value[i])
    }
    else if(Questions.value[i].type === 'grade'){
      answer_tmp.answer = int2string(intAnswer.value[i])
    }
    else if(Questions.value[i].type === 'select' && Questions.value[i].mutex == false){
      answer_tmp.answer = radio2string(radioAnswer.value[i])
    }
    else if(Questions.value[i].type === 'pulldown'){
      answer_tmp.answer = radio2string(pullAnswer.value[i])
    }
    else if(Questions.value[i].type === 'picture'){
      continue
    }
    else{
      answer_tmp.answer = textAnswer.value[i]
    }
    answers.push(JSON.parse(JSON.stringify(answer_tmp)))
  }
  console.log(answers)
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104/api/answer_qn/submit_answers',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: qn_id.value,
      duration: duration,
      answers : answers,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    if(res.data.errno == 0){
      ElMessage.success('提交成功')
      if(project_type.value == 1){
        ElMessage.info('您客观题的得分为' + res.data.score)
        let timer
        timer = setTimeout(()=>{
          router.push('../project/individual')
        },2000)
      }
      router.push('../project/individual')
    }
  }).catch(err=>{
    console.log(err)
  })
}
const icons = [ChatRound, ChatLineRound, ChatDotRound]
const font_color = ref('#FFFFFF')
const background_Url = ref('')
const background_Content = ref('')
const title_Url = ref('')
const router = useRouter()
const token = ref(store.state.User.token)
const saveornot = ref(true)
const Questions = ref([])
const title_Content = ref('')
const title_Text = ref('')
const description_Text = ref('')
const number = ref(true)
function getOptions(locked){
  return locked.split("###")
}
function home(){
  router.push('../project')
}
function string2num(answersString){
  let answersArr = []
  for(let i = 0; i < answersString.length; i++){
    let num = answersString[i].charCodeAt(0) - 65;
    answersArr.push(num)
  }
  return answersArr
}
function num2string(answers){
  console.log(answers)
  let answerString = ''
  answers.sort(function (a,b){
    return a - b
  })
  for(let i = 0; i < answers.length; i++){
    if (answers[i] >= 0 && answers[i] <= 25) {
      let char = String.fromCharCode(65 + parseInt(answers[i]));
      answerString += char
    }
  }
  console.log(answerString)
  return answerString
}
function radio2string(answers){
  console.log(answers)
  let answerString = ''
  answerString = '' + String.fromCharCode(65 + parseInt(answers));
  console.log(answerString)
  return answerString
}
function int2string(answers){
  let answerString = ''
  answerString = '' + answers;
  return answerString
}
function pull2string(answers){
  console.log(answers)
  const pattern = /\d+/; // 匹配一个或多个数字
  const match = answers.match(pattern); // 获取所有匹配项
  const number = match ? Number.parseInt(match[0]) : null
  console.log(int2string(number))
  return int2string(number)
}
function test(){
  console.log(checkAnswer.value)
  console.log(textAnswer.value)
  console.log(radioAnswer.value)
  console.log(pullAnswer.value)
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
  background: linear-gradient(to right, #21444EFF, #CDE9FAFF);
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
.page{
  width: 80%;
  height: 100%;
  margin-left: 8%;
  background: rgba(251,251,251,.1);
  backdrop-filter: blur(10px);
}
.title{
  color: v-bind(font_color);
  width: 100%;
  padding: 30px 0;
  text-align: center;
  font-weight: bolder;
  letter-spacing: 2px;
  font-size: 30px;
  font-family: "Arial Black";
}
.description{
  color: v-bind(font_color);
  text-align: center;
  font-size: 20px;
}
.title_container{
  min-height: 200px;
  background-size: cover;
  border-radius: 15px 15px 15px 15px;
}
.moving {
  opacity: 0;
}
.container{
  width: 99.7%;
  min-height: 90px;
  background: rgba(255,255,255,0);
  border: 1px #7e7e7f solid;
}
.container_mutex{
  width: 99.7%;
  min-height: 90px;
  background: rgba(255,255,255,0);
  border: 1px #7e7e7f solid;
}
.container_select{
  background: rgba(255,255,255,0.45);
  border: 1px #ffffff solid;
}
.question-title{
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 15px;
  color: v-bind(font_color);
  font-size: 15px;
  font-weight: bold;
}
.question-description{
  margin-left: 40px;
  color: v-bind(font_color);
  font-family: "等线 Light";
  font-size: 14px;

}
.el-input_container{
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 5%;
}
::v-deep.el-input{
  margin: auto auto;
  width: 90%;
}
::v-deep.el-textarea{
  margin: auto auto;
  width: 90%;
}
.demo-image__error .block {
  text-align: center;
  display: inline-block;
  width: 49%;
  box-sizing: border-box;
  vertical-align: top;
}
.demo-image__error .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.demo-image__error .el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 200px;
  width: 100%;
  height: 200px;
}
.demo-image__error .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
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
.el-radio-container{
  margin-top: 5px;
  margin-left: 5%;
  display: flex;
  flex-wrap: wrap;
}
.el-radio {
  margin-bottom: 10px;
  margin-right: 32px;
  color: v-bind(font_color);
}
.el-checkbox {
  margin-bottom: 10px;
  margin-right: 32px;
  color: v-bind(font_color);
}
.progress_container {
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
  box-shadow: inset 0vw 0vw 0vw .1vw #b131fb, 0vw 0vw 1.5vw 0vw #671bc4;
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

.progress_container {
  animation: progress_container 5s linear infinite;
  -moz-animation: progress_container 5s linear infinite;
  /* Firefox */
  -webkit-animation: progress_container 5s linear infinite;
  /* Safari and Chrome */
  -o-animation: progress_container 5s linear infinite;
  /* Opera */
}

@keyframes progress_container {
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

@keyframes out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
