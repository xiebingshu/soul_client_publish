<template>
  <div class="container">
    <button @click="addQuestion">
      <el-icon class="icon" size="25px" v-if="props.type==='text'"><Document /></el-icon>
      <el-icon class="icon" size="25px" v-if="props.type==='select'"><ChatLineSquare /></el-icon>
      <el-icon class="icon" size="25px" v-if="props.type==='date'"><Clock /></el-icon>
      <el-icon class="icon" size="25px" v-if="props.type==='grade'"><Star /></el-icon>
      <el-icon class="icon" size="25px" v-if="props.type==='picture'"><Picture /></el-icon>
      <el-icon class="icon" size="25px" v-if="props.type==='pulldown'"><ArrowDown /></el-icon>
      <el-icon class="icon" size="25px" v-if="props.type==='number'"><Histogram /></el-icon>
      <el-icon class="icon" size="25px" v-if="props.type==='file'"><Folder /></el-icon>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      {{text}}
    </button>
  </div>
</template>
<script setup>
import {ref, watch} from "vue";
import {ChatLineSquare, Clock, Star, Picture, ArrowDown, Histogram, Document, Folder} from "@element-plus/icons-vue";
const props = defineProps({
  type: String
})
const text=ref("")
if(props.type === 'text'){
  text.value='文本框'
}
if(props.type === 'select'){
  text.value='选择'
}
if(props.type === 'pulldown'){
  text.value='下拉'
}
if(props.type === 'date'){
  text.value='日期'
}
if(props.type === 'number'){
  text.value='数字'
}
if(props.type === 'grade'){
  text.value='评分'
}
if(props.type === 'picture'){
  text.value='图片'
}
if(props.type === 'file'){
  text.value='视频'
}
import {useStore} from "vuex";
const store = useStore()
function getProject_edit(){//这个还挺重要的，相当于复制了一份当前选择的问卷，那个看着很愚蠢的处理是为了去除响应式
  return JSON.parse(JSON.stringify(store.getters.get_currentProject))
}
function getProject_use(){//这个还挺重要的，相当于复制了一份当前选择的问卷，那个看着很愚蠢的处理是为了去除响应式
  return store.getters.get_currentProject
}
const font_color = ref(getProject_use().font_color)
watch(()=>getProject_use().font_color, (newVal, oldVal) => {
  font_color.value = newVal
})
function addQuestion(){
  const currentProjectEdit = getProject_edit()
  if(props.type === 'file'){
    currentProjectEdit.questions.push({
      type: 'picture',
      description: '',
      name: '视频',
      mutex: true,
      must: false,
      options: '选项1###选项2',
      append: '',
      max: 5,
      picture_content: '',
      picture_url: '',
      answer: [],
    })
    store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
    store.commit('updateQuestion', getProject_use().questions.length - 1)
    return
  }
  currentProjectEdit.questions.push({
    type: props.type,
    description: '',
    name: text.value,
    mutex: false,
    must: false,
    options: '选项1###选项2',
    append: '',
    max: 5,
    picture_content: '',
    picture_url: '',
    answer: [],
  })
  store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
  store.commit('updateQuestion', getProject_use().questions.length - 1)
}
</script>

<style scoped>
 *{
   margin: 0;
   padding: 0;
 }
 .container{
   margin: 0;
   padding: 0;
   height: 90px;
   width: 90px;
   display: inline-flex;
   justify-content: center;
   align-items: center;
   background: rgba(255, 255, 255, 0)
 }
 button span
 {
   position: absolute;
   display: block;
   transition: 0.5s ease;
 }
 button span:nth-child(1)
 {
   top: 0;
   left: 0;
   width: 0;
   height: 1px;
   background: #fff;
 }
 button:hover span:nth-child(1)
 {
   width: 100%;
   transform: translateX(100%);
 }
 button span:nth-child(3)
 {
   bottom: 0;
   right: 0;
   width: 0;
   height: 1px;
   background: #fff;
 }
 button:hover span:nth-child(3)
 {
   width: 100%;
   transform: translateX(-100%);
 }
 button span:nth-child(2)
 {
   bottom: 0;
   right: 0;
   width: 1px;
   height: 0;
   background: #fff;
 }
 button:hover span:nth-child(2)
 {
   Height: 100%;
   transform: translateY(-100%);
 }
 button span:nth-child(4)
 {
   top: 0;
   left: 0;
   width: 1px;
   height: 0;
   background: #fff;
 }
 button:hover span:nth-child(4)
 {
   Height: 100%;
   transform: translateY(100%);
 }
 button:hover .icon{
  transform: translateY(-3px);
 }
 button
 {
   position: relative;
   height: 70px;
   width: 70px;
   line-height: 90px;
   text-align: center;
   text-decoration: none;
   color: v-bind(font_color);
   border-color: #7e7e7f;
   border-width: 2px;
   text-transform: uppercase;
   font-family: "fantasy";
   font-weight: bold;
   overflow: hidden;
   border-radius: 20%;
   background: rgba(255,255,255,.1);
   backdrop-filter: blur(10px);
   /*box-shadow: 0 5px 5px rgb(126, 126, 127);*/
 }
 button:before
 {
   content: '';
   position: absolute;
   top: 0;
   left: 0;
   width: 50%;
   height: 100%;
   background: rgb(255, 255, 255, .1)
 }
 button:after
 {
   content:'';
   position: absolute;
   top: 0;
   left: -100%;
   width: 100%;
   height: 100%;
   background: linear-gradient(90deg,transparent,
   rgba(255,255,255,.4),transparent);
   transition: 0.5s;
 }
 button:hover:after
 {
   left:100%;
 }
 button .icon{
   position: absolute;
   top: 8px;
   left: 21px;
 }
</style>