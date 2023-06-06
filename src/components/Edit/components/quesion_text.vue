<template>
  <div class="container" ref="question_container" @click="select" >
    <div style="margin-bottom: 10px">
      <div class="title"><span v-if="Question.must">*</span><span style="font-weight: bold" v-if="number === true">{{props.index+1}}. </span>{{Question.name}}<span v-if="Question.must" style="color:indianred;">（必填）</span></div>
      <span class="description" v-if="Question.description != ''">{{Question.description}}</span>
    </div>
    <div class="el-input_container" v-if="Question.type === 'text' && Question.mutex === false"><el-input></el-input></div>
    <!--    以上为单行文本-->
    <div class="el-input_container" v-if="Question.type === 'text' && Question.mutex">
      <el-input type="textarea" :rows="4" resize="none"></el-input>
    </div>
    <!--    以上为多行文本-->
    <div class="el-radio-container" v-if="Question.type === 'select' && Question.mutex === false">
        <el-radio :label="option" border v-for="(option, item) in Question.options" :key = item>{{option}}</el-radio>
    </div>
    <!--    以上为单项选择-->
    <div class="el-radio-container" v-if="Question.type === 'select' && Question.mutex === true">
      <el-checkbox-group>
        <el-checkbox v-for="(option, item) in Question.options" :key="item" :label="option" border>{{
            option
          }}</el-checkbox>
      </el-checkbox-group>
    </div>
    <!--    以上为多项选择-->
    <div class="el-input_container" v-if="Question.type === 'pulldown'">
      <el-select placeholder="请选择" style="width: 90%">
        <el-option
            v-for="(option, item) in Question.options"
            :key="item"
            :label="option"
            :value="option">
        </el-option>
      </el-select>
    </div>
    <!--    以上为下拉选择-->
    <div class="el-input_container" v-if="Question.type === 'date' && Question.mutex === false">
      <el-date-picker
          align="right"
          type="date"
          placeholder="选择日期"
          style="width: 90%;"
      >
      </el-date-picker>
    </div>
    <!--    以上为日期选择-->
    <div class="el-input_container" v-if="Question.type === 'date' && Question.mutex === true">
      <el-date-picker
          align="right"
          type="datetime"
          placeholder="选择日期时间"
          style="width: 90%;"
      >
      </el-date-picker>
    </div>
    <!--    以上为日期时间选择-->
    <div class="el-input_container" v-if="Question.type === 'number'"><el-input><template #append>{{Question.append}}</template></el-input></div>
    <!--    以上为日期时间选择-->
    <div class="el-radio-container" v-if="Question.type === 'grade'">
      <el-rate
          :icons="icons"
          :void-icon="ChatRound"
          :colors="['#409eff', '#67c23a', '#FF9900']"
          :max="Question.max"
      />
    </div>
    <!--    以上为评分-->
    <div class="el-input-container" v-if="Question.type === 'picture'" style="text-align: center">
      <div class="demo-image__error" v-if="Question.mutex === false">
        <div class="block">
          <el-image :src="Question.picture_content" fit="cover" :preview-src-list="[Question.picture_content]">
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
            v-if="Question.mutex === true"
            :src="Question.picture_content"
            controls
            class="video-player"
            style="height: 200px"
        ></video>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useStore} from "vuex";
import {onMounted, provide, reactive, ref, toRaw, watch} from "vue";
const icons = [ChatRound, ChatLineRound, ChatDotRound]
import {Briefcase, Search, ChatDotRound, ChatLineRound, ChatRound, Picture } from "@element-plus/icons-vue";
function test(){
}
const store = useStore()
const props = defineProps({
  index: Number
})
function getOptions(locked){
  return locked.split("###")
}
const Questions = ref(toRaw(getProject_use().questions))
const Question = reactive({
  type: Questions.value[props.index].type,
  description: Questions.value[props.index].description,
  name: Questions.value[props.index].name,
  mutex: Questions.value[props.index].mutex,
  must: Questions.value[props.index].must,
  options: getOptions(Questions.value[props.index].options),
  append: Questions.value[props.index].append,
  max: Questions.value[props.index].max,
  picture_content: Questions.value[props.index].picture_content,
})
function getProject_use(){
  return store.getters.get_currentProject
}
watch(() => getProject_use().questions, (newVal, oldVal) => {
  Questions.value = toRaw(newVal)
  Question.name = Questions.value[props.index].name
  Question.description = Questions.value[props.index].description
  Question.mutex = Questions.value[props.index].mutex
  Question.must = Questions.value[props.index].must
  Question.options = getOptions(Questions.value[props.index].options)
  Question.type = Questions.value[props.index].type
  Question.append = Questions.value[props.index].append
  Question.max = Questions.value[props.index].max
  Question.picture_content = Questions.value[props.index].picture_content
}, { deep: true })
onMounted(()=>{
  if(props.index === store.state.Project.currentQuestion){
    question_container.value.classList.add('container_select')
  }
})
watch(() => store.state.Project.currentQuestion, (newVal, oldVal) => {
  if(oldVal != props.index && newVal === props.index){
    question_container.value.classList.add('container_select')
  }
  if(oldVal === props.index && newVal != props.index){
    console.log(oldVal, newVal)
    question_container.value.classList.remove('container_select')
  }
})
const font_color = ref(getProject_use().font_color)
const number = ref(getProject_use().number)
const question_container = ref()
watch(()=>getProject_use().font_color, (newVal, oldVal) => {
  font_color.value = newVal
})
watch(()=>getProject_use().number, (newVal, oldVal) => {
  number.value = newVal
})
function select(){
  if(store.state.Project.currentQuestion != props.index) {
    question_container.value.classList.add('container_select')
    store.commit('updateQuestion', props.index)
  }
  else{
    console.log('cause')
    question_container.value.classList.remove('container_select')
    store.commit('updateQuestion', -1)
  }
}
</script>

<style scoped>
.container{
  width: 99.7%;
  min-height: 90px;
  background: rgba(255,255,255,0);
  border: 1px #7e7e7f solid;
}
.container_select{
  background: rgba(255,255,255,0.45);
  border: 1px #ffffff solid;
}
.title{
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 15px;
  color: v-bind(font_color);
  font-size: 15px;
  font-weight: bold;
}
.description{
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
.el-radio-container{
  margin-top: 5px;
  margin-left: 5%;
  display: flex;
  flex-wrap: wrap;
}
.el-radio {
  margin-bottom: 10px;
  color: v-bind(font_color);
}
.el-checkbox {
  margin-bottom: 10px;
  color: v-bind(font_color);
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
</style>