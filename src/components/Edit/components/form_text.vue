<template>
  <div class="outlook_form_container">
    <el-divider></el-divider>
    <el-form ref="form_container" :model="form" label-width="100px" class="outlook-form" label-suffix="">
      <el-form-item label="切换组件类型" v-if="Question_type === 'text'">
        <el-select v-model="form.mutex" class="m-2"  size="small">
          <el-option
              v-for="item in options_text"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="切换组件类型" v-if="Question_type === 'select'">
              <el-select v-model="form.mutex" class="m-2"  size="small">
                <el-option
                    v-for="item in options_select"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
              </el-select>
      </el-form-item>
      <el-form-item label="切换组件类型" v-if="Question_type === 'date'">
        <el-select v-model="form.mutex" class="m-2"  size="small">
          <el-option
              v-for="item in options_date"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="切换组件类型" v-if="Question_type === 'picture'">
        <el-select v-model="form.mutex" class="m-2" size="small" @change="form.picture_content = ''">
          <el-option
              v-for="item in options_picture"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-divider v-if="['text', 'select', 'date', 'picture'].includes(Question_type)"></el-divider>
      <el-form-item label="标题">
        <el-input v-model="form.name" :placeholder=curQuestion.name size="small" style="margin-right: 5px"/>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="描述">
        <el-input v-model="form.description" :placeholder=curQuestion.description size="small" style="margin-right: 5px"/>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="是否必填">
        <el-checkbox v-model="form.must"></el-checkbox>
      </el-form-item>
      <el-divider v-if="['number', 'select', 'pulldown', 'grade', 'picture'].includes(Question_type)"></el-divider>
      <el-form-item label="选项内容" v-if="Question_type === 'select' || Question_type === 'pulldown'">
        <el-popover
            placement="left"
            :width="200"
            trigger="click"
        >
          <template #reference>
            <el-button type="primary" ><el-icon size="15px" style="margin-right: 5px;"><Menu /></el-icon>编辑选项</el-button>
          </template>
          <div class="el-button_container">
            <el-scrollbar height="400px">
              <template v-for="(choice, item) in choices" :key="item">
                <el-input type="textarea" :rows="2" resize="none" v-model="choices[item]" :placeholder=choices[item] size="small" />
                <el-button type="primary" @click="delete_option(item)"><el-icon size="15px" style="align-items: center"><Delete /></el-icon>删除选项</el-button>
                <el-divider content-position="center">选项{{item+1}}</el-divider>
              </template>
              <template v-if="Qr_type === '考试'">
                <div style="margin-top: 50px" v-if="Qr_type === '考试' && Question_type === 'select' && form.mutex === true">
                  <el-divider content-position="center">答案</el-divider>
                  <el-checkbox-group v-model="form.answer" size="small">
                    <el-checkbox border v-for="(choice, item) in choices" :label="item" :key="item" :value="item">{{choice}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div style="margin-top: 50px" v-else>
                  <el-divider content-position="center">答案</el-divider>
                  <el-radio-group v-model="answer_radio" size="small">
                    <el-radio border v-for="(choice, item) in choices" :label="item" :key="item" :value="item">{{choice}}</el-radio>
                  </el-radio-group>
                </div>
              </template>
            </el-scrollbar>
            <div class="add_button"><el-button type="primary" @click="add_option"><el-icon size="15px" style="align-items: center"><Plus /></el-icon>增加选项</el-button></div>
          </div>
        </el-popover>
      </el-form-item>
      <el-form-item label="单位" v-if="Question_type === 'number'">
        <el-input v-model="form.append" :placeholder=curQuestion.append size="small" style="margin-right: 5px"/>
      </el-form-item>
      <el-form-item label="分数上限" v-if="Question_type === 'grade'">
        <el-input-number v-model="form.max" :min="1" :max="20"/>
      </el-form-item>
      <el-form-item label="上传图片" v-if="Question_type === 'picture' && form.mutex === false">
        <el-button type="primary" @click="handlePictureUpload">
          <input
              ref="fileInput"
              type="file"
              style="display: none;"
              accept="image/*"
              @change="handlePictureChange"
          />
          <el-icon size="15px" style="margin-right: 5px;"><Picture/></el-icon>上传图片</el-button>
      </el-form-item>
      <el-form-item label="上传视频" v-if="Question_type === 'picture' && form.mutex === true">
        <el-button type="primary" @click="handlePictureUpload">
          <input
              ref="fileInput"
              type="file"
              style="display: none;"
              accept="video/*"
              @change="handlePictureChange"
          />
          <el-icon size="15px" style="margin-right: 5px;"><Picture/></el-icon>上传视频</el-button>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="删除问题">
        <el-button type="primary" @click="deleteQuestion">
          <el-icon size="15px" style="margin-right: 5px;"><DeleteFilled/></el-icon>删除问题</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {useStore} from "vuex";
import {onMounted, provide, reactive, ref, toRaw, watch} from "vue";
import {Menu, Delete, Plus, Picture, DeleteFilled} from "@element-plus/icons-vue";
import axios from "axios";
import {ElMessage} from "element-plus";
const store = useStore()
const Questions = ref(toRaw(getProject_use().questions))
const Questions_edit = ref(getProject_edit().questions)
const current_Question_id = ref(store.state.Project.currentQuestion)
const Question_type = ref(Questions.value[current_Question_id.value].type)
const font_color_form = ref(getProject_use().font_color)
const fileInput = ref()
const Qr_type = ref(getProject_use().type)
const token = ref(store.state.User.token)
const answer_radio = ref(-1)
watch(()=>answer_radio.value,(newVal)=>{
  if(Questions.value[current_Question_id.value].type === 'select' && Questions.value[current_Question_id.value].mutex){
    return
  }
  let answers = []
  answers.push(answer_radio.value)
  form.answer = answers
})
watch(() => store.state.User.token, (newVal, oldVal) => {
  token.value = newVal
})
watch(()=>getProject_use().font_color, (newVal, oldVal) => {
  font_color_form.value = newVal
})
function getProject_edit(){
  return JSON.parse(JSON.stringify(store.getters.get_currentProject))
}
function getProject_use(){
  return store.getters.get_currentProject
}
function handlePictureUpload (){
  // fileInput.value = document.querySelector('input[type=file]:nth-of-type(2)')
  fileInput.value.click()
}
function deleteQuestion(){
  Questions_edit.value.splice(current_Question_id.value, 1)
  const currentProjectEdit = getProject_edit()
  currentProjectEdit.questions = Questions_edit.value
  store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
  store.commit('updateQuestion', -1)
}
function handlePictureChange (event){
  const file = event.target.files[0]
  if (!file) {
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    form.picture_content = e.target.result
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
        form.picture_url = res.data.url
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
const curQuestion = reactive({
  name: Questions.value[current_Question_id.value].name,
  description: Questions.value[current_Question_id.value].description,
  append: Questions.value[current_Question_id.value].append,
})
watch(() => getProject_use().questions, (newVal, oldVal) => {
  Questions.value = toRaw(newVal)
  Questions_edit.value = getProject_edit().questions
  curQuestion.append = Questions.value[current_Question_id.value].append
  curQuestion.name = Questions.value[current_Question_id.value].name
  curQuestion.description = Questions.value[current_Question_id.value].description
  choices.value = getOptions(Questions.value[current_Question_id.value].options)
}, { deep: true })
watch(() => store.state.Project.currentQuestion, (newVal, oldVal) => {
  Questions.value = getProject_use().questions
  current_Question_id.value = toRaw(newVal)
  if(newVal != -1){
    curQuestion.name = Questions.value[current_Question_id.value].name
    curQuestion.description = Questions.value[current_Question_id.value].description
    curQuestion.append = Questions.value[current_Question_id.value].append
    form.append = Questions.value[current_Question_id.value].append
    form.name = Questions.value[current_Question_id.value].name
    form.description = Questions.value[current_Question_id.value].description
    form.mutex = Questions.value[current_Question_id.value].mutex
    form.must = Questions.value[current_Question_id.value].must
    form.options = Questions.value[current_Question_id.value].options
    form.max = Questions.value[current_Question_id.value].max
    form.picture_content = Questions.value[current_Question_id.value].picture_content
    form.picture_url = Questions.value[current_Question_id.value].picture_url
    form.answer = Questions.value[current_Question_id.value].answer
    choices.value = getOptions(Questions.value[current_Question_id.value].options)
    Question_type.value = Questions.value[current_Question_id.value].type
    console.log(Questions.value[current_Question_id.value].answer)
    if(Questions.value[current_Question_id.value].answer != null){
      answer_radio.value = Questions.value[current_Question_id.value].answer[0]
    }
    if(Questions.value[current_Question_id.value].answer == null){
      answer_radio.value = -1
    }
  }
})
function getOptions(locked){
  return locked.split("###")
}
function delete_option(item){
  choices.value.splice(item,1)
  console.log(choices.value)
}
function add_option(){
  choices.value.push('选项' + (choices.value.length + 1))
}
const form = reactive({
  mutex: Questions.value[current_Question_id.value].mutex,
  name: Questions.value[current_Question_id.value].name,
  description: Questions.value[current_Question_id.value].description,
  must: Questions.value[current_Question_id.value].must,
  options: Questions.value[current_Question_id.value].options,
  append: Questions.value[current_Question_id.value].append,
  max: Questions.value[current_Question_id.value].max,
  picture_content: Questions.value[current_Question_id.value].picture_content,
  picture_url: Questions.value[current_Question_id.value].picture_url,
  answer: [],
})
watch(() => form,(newVal, oldVal) => {
    Questions_edit.value.splice(current_Question_id.value, 1, {
      type: toRaw(Questions.value[current_Question_id.value].type),
      description: toRaw(form.description),
      name: toRaw(form.name),
      mutex: toRaw(form.mutex),
      must: toRaw(form.must),
      options: toRaw(form.options),
      append: toRaw(form.append),
      max: toRaw(form.max),
      answer: toRaw(form.answer),
      picture_content: toRaw(form.picture_content),
      picture_url: toRaw(form.picture_url)
    })
    const currentProjectEdit = getProject_edit()
    currentProjectEdit.questions = Questions_edit.value
    store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
    console.log(getProject_use().questions)
},{deep: true})
const options_text = [
  {
    value: false,
    label: '单行文本',
  },
  {
    value: true,
    label: '多行文本',
  },
]
const options_select = [
  {
    value: false,
    label: '单项选择',
  },
  {
    value: true,
    label: '多项选择',
  },
]
const options_date = [
  {
    value: false,
    label: '日期选择',
  },
  {
    value: true,
    label: '日期时间选择',
  },
]
const options_picture = [
  {
    value: false,
    label: '图片展示',
  },
  {
    value: true,
    label: '视频展示',
  },
]
const choices = ref(getOptions(Questions.value[current_Question_id.value].options))
watch(() => choices.value,(newVal, oldVal) => {
  console.log(choices.value)
  let option_temp = ''
  for(let i = 0; i < choices.value.length; i++){
    option_temp += choices.value[i]
    if(i < choices.value.length - 1){
      option_temp += '###'
    }
  }
  form.options = option_temp
},{deep: true})
function test(){
  console.log(form.answer)
}
</script>

<style scoped>
.el-button_container .el-button{
  background: white;
  border-color: #e39381;
  color: #c76969;
  margin: 5px 45px;

}
.el-button_container .el-button:hover{
  background: #e39381;
  color: white;
  transition: 0.5s;
  border-color: #ffffff;
}
.add_button .el-button{
  background: white;
  border-color: #83b7ef;
  color: #1f7fe7;
  margin: 5px 45px;

}
.add_button .el-button:hover{
  background: #e39381;
  color: white;
  transition: 0.5s;
  border-color: #ffffff;
}
.el-divider--horizontal{
  margin: 10px 0;
}
.el-form-item{
  margin:10px 0 10px 0;
}
.el-button{
  color :v-bind(font_color_form);
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
.el-radio {
  margin-bottom: 10px;
  margin-right: 10px
}
.el-checkbox {
  margin-bottom: 10px;
  margin-right: 10px !important;
}
</style>