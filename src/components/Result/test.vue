<template>

  <!-- 顶部导航栏 -->
  <el-header class="header_test">
    <el-button type="info" :icon="HomeFilled" class="see" @click="home">返回</el-button>
  </el-header>
  <div class="content-wrapper" :style="{ backgroundImage: 'url(' + getProject_use().background_Content+ ')'}">

    <el-main class="main">
          
        
      <el-scrollbar max-height="650px">
        <div style="background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(40px);
          " :style="{color: getProject_use().font_color}">
      <div class="questionnaire-title">{{ questionnaireTitle }}</div>
      <div class="overview">
            <div class="overview-header">
              <h2 class="overview-title">问卷总体情况</h2>
            </div>
            <el-table :data="sumtableData" class="overview-table" stripe border>
              <el-table-column label="回收量" prop="recovery">
                <template #default="{ row }">
                  <span class="overview-number">{{ row.recovery }}</span>
                </template>
              </el-table-column>
              <el-table-column label="平均完成时间" prop="avgCompletionTime">
                <template #default="{ row }">
                  <span class="overview-number">{{ row.avgCompletionTime }}</span>
                </template>
              </el-table-column>
            </el-table>
      </div>

      <el-form ref="form" :model="form" label-width="120px" class="questionlist">
              <!-- 遍历问卷中的问题 -->
              <div v-for="question in state.questions" :key="question.id" class="question-item">
                <h2 class="question-title">{{ question.title }}</h2>
                <div class="question-description">{{ question.description }}</div>

                <div v-if="question.questionType === 'choice'">
                  <div class="question-chart-container">
                    <div :id="'chart'+ question.id "  class="question-chart"></div>
                  </div>
                  <div class="button-container">
                      <el-button class="rendering_button" v-for="chartType in chartTypes_for_chart" :key="chartType" @click="changeChartType(question.id, chartType, question)">
                          {{ chartType }}
                      </el-button>
                  </div>
                </div>
                <div v-if="question.questionType === 'star'">
                  <div class="question-chart-container">
                    <div :id="'chart'+ question.id "  class="question-chart"></div>
                  </div>
                  <div class="button-container">
                      <el-button class="rendering_button" v-for="chartType in chartTypes_for_star" :key="chartType" @click="changeChartType(question.id, chartType, question)">
                          {{ chartType }}
                      </el-button>
                  </div>
                </div>
                <div v-if="question.questionType === 'number'">
                  <div class="question-chart-container">
                    <div :id="'chart'+ question.id "  class="question-chart"></div>
                  </div>
                  <div class="button-container">
                      <el-button class="rendering_button" v-for="chartType in chartTypes_for_number" :key="chartType" @click="changeChartType(question.id, chartType, question)">
                          {{ chartType }}
                      </el-button>
                  </div>
                </div>
                <div v-if="question.questionType === 'text_simple'">
                  <div class="table-container">
                    <table >
                    <thead>
                      <tr>
                        <th>编号</th>
                        <th>回答</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(answer, index) in question.seriesData" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>{{ answer }}</td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </div>
                <div v-if="question.questionType === 'text'">
                  <div v-if = "true">
                    <div class="table-container">
                      <table >
                        <thead>
                        <tr>
                          <th>编号</th>
                          <th>回答</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(answer, index) in question.seriesData" :key="index">
                          <td>{{ index + 1 }}</td>
                          <td>{{ answer }}</td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div v-if = "true">
                    <div class="question-chart-container">
                      <div :id="'chart'+ question.id "  class="question-chart"></div>
                    </div>
                  </div>
                  <div class="button-container">
                    <el-button class="rendering_button" v-for="chartType in chartTypes_for_text" :key="chartType" @click="changeChartType(question.id, chartType, question)">
                      {{ chartType }}
                    </el-button>
                  </div>
                </div>
              </div>
        </el-form>
        </div>
      </el-scrollbar>
    </el-main>
  </div>
</template>

  
<script setup>
  import * as echarts from 'echarts';
  import 'echarts-wordcloud';
  import {ElIcon, ElMessage} from 'element-plus';
  import { ElTable, ElTableColumn,ElButton } from 'element-plus';
  import {onMounted, ref, reactive, computed, watch, onBeforeMount} from "vue";
  import { useStore } from 'vuex';
  import axios from "axios";
  import {HomeFilled} from "@element-plus/icons-vue";
  import {useRouter} from "vue-router";
  const router = useRouter()
  const store = useStore()
  const token = ref(store.state.User.token)
  const currentId = ref(store.state.Project.currentId)
  watch(() => store.state.User.token, (newVal, oldVal) => {
    token.value = newVal
  })
  watch(() => store.state.Project.currentId, (newVal, oldVal) => {
    currentId.value = newVal
  })
  // import 'element-plus/packages/theme-chalk/src/index.scss';
  

  
  const form = ref({});
const sumtableData = reactive([
  {
    recovery: 0,
    avgCompletionTime: '0'
  }
]);
const questionnaireTitle = ref('问卷标题');
const activeIndex = ref('/');
const chartTypes_for_chart = ['bar', 'line', 'pie','ring'];
const chartTypes_for_star = ['bar','line','pie','ring'];
const chartTypes_for_number = ['scatter','ring','line'];
  const chartTypes_for_text = ['cloud'];
function getProject_use(){
  return store.getters.get_currentProject
}
function getAnswer(){
  axios({
    // 接口网址：包含协议名，域名，端口和路由
    url: 'http://82.156.174.104:8000/api/analyse_qn/get_all_info',
    // 请求方式，默认为get，可以不写
    method: 'post',
    // 请求可以携带的参数，用对象来写，get方法对应params，其他方法对应data
    data: JSON.stringify({
      token: token.value,
      qn_id: currentId.value,
    }),
// 成功请求回数据后，进入then，并用console.log打印结果
  }).then(res => {
    console.log(res)
    if(res.data.errno == 0){
      const answers = res.data.all_info.answer_sheets
      let sumTime = 0
      for(let answer of answers){
        sumTime += answer.duration
      }
      sumtableData[0].avgCompletionTime = (sumTime / answers.length) + '秒'
      sumtableData[0].recovery = answers.length
      console.log(getProject_use())
      console.log(store.state.Project.currentId)
      let questionId = 0
      for(let i = 0; i < getProject_use().questions.length; i++){
        let question_state = {
          id: -1,
          title: '',
          questionType: '',
          chartType: 'bar',
          stem: '',
          description: '',
          categories: [],
          seriesData: [],
          keywords:[]
        }
        let question = getProject_use().questions[i]
        let question_answer = res.data.all_info.qn.questions[i].extra_data
        if(question.type === 'text'){
          question_state.id = questionId;
          question_state.title = question.name
          question_state.questionType = 'text'
          question_state.chartType = 'cloud'
          question_state.description = question.description
          question_state.keywords = question_answer.statistics
          for(let j = 0; j < question_answer.answers.length; j++){
            question_state.seriesData.push(question_answer.answers[j].answer)
          }
        }
        else if(question.type === 'select'){
          question_state.id = questionId;
          question_state.title = question.name
          question_state.questionType = 'choice'
          question_state.description = question.description
          question_state.categories = getOptions(question.options)
          for(let j = 0; j < question_answer.options.length; j++){
            question_state.seriesData.push(question_answer.options[j].count)
          }
        }
        else if(question.type === 'pulldown'){
          question_state.id = questionId;
          question_state.title = question.name
          question_state.questionType = 'choice'
          question_state.description = question.description
          question_state.categories = getOptions(question.options)
          for(let j = 0; j < question_answer.options.length; j++){
            question_state.seriesData.push(question_answer.options[j].count)
          }
        }
        else if(question.type === 'date'){
          question_state.id = questionId;
          question_state.title = question.name
          question_state.questionType = 'text_simple'
          question_state.description = question.description
          for(let j = 0; j < question_answer.answers.length; j++){
            let dateObj = new Date(question_answer.answers[j].answer);
            let localDateStr = dateObj.toLocaleString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "numeric",
              minute: "2-digit",
              hour12: false, // 设置小时部分以24小时制显示
              timeZone: "Asia/Shanghai"
            });
            question_state.seriesData.push(localDateStr)
          }
        }
        else if(question.type === 'number'){
          question_state.id = questionId;
          question_state.title = question.name
          question_state.questionType = 'text_simple'
          question_state.description = question.description
          for(let j = 0; j < question_answer.answers.length; j++){
            question_state.seriesData.push(question_answer.answers[j].answer)
          }
        }
        else if(question.type === 'grade'){
          question_state.id = questionId;
          question_state.title = question.name
          question_state.questionType = 'star'
          question_state.description = question.description
          for (let j = 1; j <= question.max; j++){
            question_state.categories.push(j)
            question_state.seriesData.push(0)
          }
          for (let j = 0; j < question_answer.answers.length; j++){
            question_state.seriesData[parseInt(question_answer.answers[j].answer - 1)] = question_answer.answers[j].count
          }
        }
        else{
          continue
        }
        state.questions.push(JSON.parse(JSON.stringify(question_state)))
        questionId++;
      }
      console.log(state)
      let timer
      timer = setTimeout(()=>{
        state.questions.forEach((question) => {
          console.log(question.id)
          if(question.questionType === 'choice'){
            chartRefs[question.id] = echarts.init(document.getElementById('chart'+question.id));
            renderChart(question.id, question.chartType, question);
          }
          if(question.questionType === 'star'){
            chartRefs[question.id] = echarts.init(document.getElementById('chart'+question.id));
            renderChart(question.id, question.chartType, question);
          }
          if(question.questionType === 'number'){
            chartRefs[question.id] = echarts.init(document.getElementById('chart'+question.id));
            renderChart(question.id, question.chartType, question);
          }
          else if(question.questionType === 'text'){
            chartRefs[question.id] = echarts.init(document.getElementById('chart'+question.id));
            renderChart(question.id, question.chartType, question);
          }
        });
      }, 2000)
    }
  }).catch(err=>{
    console.log(err)
  })
}
function getOptions(locked){
  return locked.split("###")
}
const state = reactive({
    questions: [],
  });
  
  const chartRefs = ref([]);


  onMounted(() => {
    getAnswer()
    });

  const renderChart = (questionId, chartType, question) => {

    let option;
    if (chartType === 'bar') {
      option = {
        xAxis: {
          type: 'category',
          data: question.categories,
        },
        
        yAxis: {
          type: 'value',
        },
        series: [{
          type: 'bar',
          data: question.seriesData,
          showBackground: true,
           backgroundStyle: {
           color: 'rgb(255,255,255, 0.6)'
           },
          itemStyle: {
              color: function(params) {
                const colorArray = generateRandomColorArray(question.seriesData.length);
                return colorArray[params.dataIndex % colorArray.length];
            },
              colorAlpha: 0.3,
          },
         
        }],
        
      };
    } else if (chartType === 'line') {
      var lineColor = generateRandomColorArray(1);
      option = {
        xAxis: {
          type: 'category',
          data: question.continued_categories,
          axisLine: {
            lineStyle: {
              color: '#999',
              width: 2
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#666',
            fontSize: 14,
            formatter: '{value}\n',
          },
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#999',
              width: 2
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#666',
            fontSize: 14,
          },
          splitLine: {
            lineStyle: {
              color: '#eee',
              type: 'dashed'
            }
          }
        },
        series: [{
          type: 'line',
          data: question.seriesData,
          lineStyle: {
            color: lineColor[0],
            width: 3,
            type: 'solid',
          },
          itemStyle: {
            color: lineColor[0],
            borderColor: '#fff',
            borderWidth: 2,
            shadowColor: lineColor[0],
            shadowBlur: 10,
          },
          symbolSize: 10,
          symbol: 'circle',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return idx * 10;
          },
        }],
      };
    }else if (chartType === 'pie') {
        var template = [];
        for(let i=0;i<question.categories.length;i++){
            template.push({value:question.seriesData[i],name:question.categories[i]})
        }
        option = {
        title: {
          textStyle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333'
          },
          left: 'center',
          top: '20px'
        },
        tooltip: {
          trigger: 'item',
          formatter:"{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'center',
          textStyle: {
            fontSize: 14,
            color: '#666'
          },
          data: question.categories
        },
        series: [
          {
            name: '数据',
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['50%', '60%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '20',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: template,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
              normal: {
                color: function(params) {
                const colorArray = generateRandomColorArray(question.seriesData.length);
                return colorArray[params.dataIndex % colorArray.length];
                },
                colorAlpha: 0.3,
              }
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
            }
          }
        ]
      };
 
    }else if (chartType === 'ring') {
        var template = [];
        for(let i=0;i<question.categories.length;i++){
            template.push({value:question.seriesData[i],name:question.categories[i]})
        }
        option = {
        title: {
            text: question.title,
            left: 'center',
            top: 'center'
        },
        series: [
            {
            type: 'pie',
            data: template,
            radius: ['40%', '70%']
            }
        ]
      };
    }else if (chartType === 'scatter') {
      // 注意，散点图纵坐标是值，而不是人数
      var template = [];
        for(let i=0;i<question.number_data.length;i++){
            template.push([i,question.seriesData[i]])
        }
        option = {
          xAxis: {},
          yAxis: {},
          series: [
            {
              symbolSize: 20,
              data: template,
              type: 'scatter',
              itemStyle: {
                color: 'blue', // 修改点的颜色为深蓝色
                borderColor: '#ffffff', // 边框颜色为白色
                borderWidth: 2, // 边框宽度为2
                // 浅蓝色阴影
                shadowColor: 'rgba(0, 0, 255, 0.2)',
                shadowBlur: 10 // 阴影模糊程度为10
              }
            }
          ]
        };
    }else if (chartType === 'cloud') {
      var catimage = "data:image/png;base64,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";
      var maskImage = new Image();
      maskImage.src = catimage;
      // var cloudData = generateCloudData(question.answerString);
      // console.log(cloudData);
      option={
        backgroundColor:'#fff',
        tooltip: {
          show: false
        },
        series: [{
          type: 'wordCloud',
          sizeRange: [20, 80],
          gridSize: 1,
          rotationRange: [-100, 100],
          rotationStep: 25,
          shape: 'circle',
          // maskImage: maskImage,
          //设置整个云图的图形为猫猫的形状，但是感觉区别不大
          textStyle: {
            color: function(params) {
              const colorArray = generateRandomColorArray(question.keywords.length);
              return colorArray[params.dataIndex % question.keywords.length];
            },
          },
          data: question.keywords,
          left: 'center',
          top: 'center',
          right: null,
          bottom: null,
        }]
      }
    }
    chartRefs[questionId].clear();
    chartRefs[questionId].setOption(option);
  };
  function test(){
    console.log(document.getElementById('chart9'))
  }
  const changeChartType = (questionId, chartType, question) => {
    renderChart(questionId, chartType,question);
  };
  // 
  const generateRandomColorArray=(num) =>{
    const colorArray = [];
    for (let i = 0; i < num; i++) {
      const color = "#" + Math.floor(Math.random() * 16777215).toString(16);
      colorArray.push(color);
    }
    console.log(colorArray);
    return colorArray;
  }
  function home(){
    router.back()
  }


  </script>
<style src="./css/frame.css" scoped></style>
<style src="./css/overview.css" scoped></style>
<style src="./css/question.css" scoped></style>
<style src="./css/button.css" scoped></style>
<style src="./css/icon.css" scoped></style>
<style src="./css/questionTable.css" scoped></style>
<style src="./css/expose.css"></style>

