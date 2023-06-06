<template>
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
          <div class="el-input_container" v-if="question.type === 'text' && question.mutex === false"><el-input></el-input></div>
          <!--    以上为单行文本-->
          <div class="el-input_container" v-if="question.type === 'text' && question.mutex">
            <el-input type="textarea" :rows="4" resize="none"></el-input>
          </div>
          <!--    以上为多行文本-->
          <div class="el-radio-container" v-if="question.type === 'select' && question.mutex === false">
            <el-radio :label="option" border v-for="(option, item) in question.options" :key = item>{{option}}</el-radio>
          </div>
          <!--    以上为单项选择-->
          <div class="el-radio-container" v-if="question.type === 'select' && question.mutex === true">
            <el-checkbox-group>
              <el-checkbox v-for="(option, item) in question.options" :key="item" :label="option" border>{{
                  option
                }}</el-checkbox>
            </el-checkbox-group>
          </div>
          <!--    以上为多项选择-->
          <div class="el-radio-container" v-if="question.type === 'pulldown'">
            <el-select placeholder="请选择" style="width: 90%">
              <el-option
                  v-for="(option, item) in question.options"
                  :key="item"
                  :label="option"
                  :value="option">
              </el-option>
            </el-select>
          </div>
          <!--    以上为下拉选择-->
          <div class="el-radio-container" v-if="question.type === 'date' && question.mutex === false">
            <el-date-picker
                align="right"
                type="date"
                placeholder="选择日期"
                style="width: 90%;"
            >
            </el-date-picker>
          </div>
          <!--    以上为日期选择-->
          <div class="el-radio-container" v-if="question.type === 'date' && question.mutex === true">
            <el-date-picker
                align="right"
                type="datetime"
                placeholder="选择日期时间"
                style="width: 90%;"
            >
            </el-date-picker>
          </div>
          <!--    以上为日期时间选择-->
          <div class="el-input_container" v-if="question.type === 'number'"><el-input><template #append>{{question.append}}</template></el-input></div>
          <!--    以上为日期时间选择-->
          <div class="el-radio-container" v-if="question.type === 'grade'">
            <el-rate
                :icons="icons"
                :void-icon="ChatRound"
                :colors="['#409eff', '#67c23a', '#FF9900']"
                :max="question.max"
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
</template>

<script setup>
import question from './quesion_text.vue'
import {useStore} from "vuex";
import {onMounted, provide, reactive, ref, toRaw, watch} from "vue";
const icons = [ChatRound, ChatLineRound, ChatDotRound]
import {Briefcase, Search, ChatDotRound, ChatLineRound, ChatRound, Picture } from "@element-plus/icons-vue";
const store = useStore()
const Questions = ref([])
const title_Content = ref('')
const title_Text = ref('')
const description_Text = ref('')
const font_color = ref('')
const number = ref(true)
function getOptions(locked){
  return locked.split("###")
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