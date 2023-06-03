<template>
  <div class="page">
    <el-scrollbar height="100%">
      <div class="title_container" :style="{ backgroundImage: title_Content !='' ? 'url(' + title_Content+ ')' : ''}">
        <div class="title">{{title_Text}}</div>
        <div v-if="description_Text != ''" class="description">{{description_Text}}</div>
      </div>
      <div v-for = "(question, item) in Questions" :key = item
           draggable="true"
           @dragstart="dragstart($event, item)"
           @dragenter="dragenter($event, item)"
           @dragend="dragend"
           @dragover="dragover"
      >
        <question :index="item"></question>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import question from './quesion_text.vue'
import {useStore} from "vuex";
import {onMounted, provide, reactive, ref, toRaw, watch} from "vue";
const store = useStore()
const question_select = ref(null)
const Questions = ref(toRaw(getProject_use().questions))
const title_Content = ref(toRaw(getProject_use().title_Content))
const title_Text = ref(toRaw(getProject_use().name))
const description_Text = ref(toRaw(getProject_use().description))
const font_color = ref(getProject_use().font_color)
watch(()=>getProject_use().font_color, (newVal, oldVal) => {
  font_color.value = newVal
})
function getProject_use(){//从数据库中拿到当前的问卷，有响应式，库中状态改变会同步更新
  return store.getters.get_currentProject
}
function getProject_edit(){//这个还挺重要的，相当于复制了一份当前选择的问卷，那个看着很愚蠢的处理是为了去除响应式
  return JSON.parse(JSON.stringify(store.getters.get_currentProject))
}
watch(() => getProject_use().questions, (newVal, oldVal) => {//通过深度监听使得questions能够相应的更新
  Questions.value = toRaw(newVal)
}, { deep: true })
watch(()=>getProject_use().title_Content, (newVal, oldVal)=>{
  title_Content.value = toRaw(newVal)
})
watch(()=>getProject_use().name, (newVal, oldVal)=>{
  title_Text.value = toRaw(newVal)
})
watch(()=>getProject_use().description, (newVal, oldVal)=>{
  description_Text.value = toRaw(newVal)
})
function exchangeQuestion(dragIndex, index){
  const currentProjectEdit = getProject_edit()
  let source = currentProjectEdit.questions[dragIndex]
  currentProjectEdit.questions.splice(dragIndex, 1)
  currentProjectEdit.questions.splice(index, 0, source)
  store.commit('updateCurrent',{project:currentProjectEdit, index:store.getters.get_currentIndex})
}
let dragIndex = 0

function dragstart(e, index) {
  console.log(index)
  e.stopPropagation()
  dragIndex = index
  store.commit('updateQuestion', -1)
  setTimeout(() => {
    e.target.classList.add('moving')
  },0)
}
function dragenter(e, index) {
  e.preventDefault()
  // 拖拽到原位置时不触发
  if (dragIndex !== index) {
    exchangeQuestion(dragIndex, index)
    // 更新节点位置
    dragIndex = index
  }
}
function dragover(e) {
  e.preventDefault()
  e.dataTransfer.dropEffect = 'move'
}
function dragend(e) {
  e.target.classList.remove('moving')
}
function test(){
}
</script>

<style scoped>
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
  min-height: 150px;
  background-size: cover;
  border-radius: 15px 15px 15px 15px;
}
.moving {
  opacity: 0;
}
</style>