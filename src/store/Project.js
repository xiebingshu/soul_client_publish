import {createStore} from 'vuex'
import {reactive, toRaw} from "vue";
const ProjectModule ={
    state: {
        Projects:[],  //数组，存储当前所有的项目
        method: '',
        currentId:-1, //当前选择项目的Id，细节在project那里
        currentQuestion:-1, //当前项目选择问题的Id，理论上是不应该放在这里，但父子组件通信太烦了就放在这里了，其实不怎么关注，当改变项目的时候要置成-1
    },
    mutations: {
        addProject(state, project){
            state.Projects.push(JSON.parse(JSON.stringify(project)))//增加项目
            this.commit('order')
        },
        removeProject(state, index){//删除项目
            state.Projects.splice(index,1)
        },
        setCurrent(state, id){//改变currentId
            state.currentId = toRaw(id)
        },
        updateCurrent(state, props){//更新当前的项目，用于安全的修改项目的信息，添加问题等
            state.Projects.splice(props.index, 1, JSON.parse(JSON.stringify(props.project)))
            this.commit('order')
        },
        updateQuestion(state, index){//改变currentQuestion
            state.currentQuestion = toRaw(index)
        },
        updateOrder(state, method){
            state.method = toRaw(method)
            this.commit('order')
        },
        order(state){
            if(state.method === '问卷名称'){
                state.Projects = state.Projects.sort(function(a, b) {
                    if (a.name < b.name) {
                        return -1;
                    }
                    if (a.name > b.name) {
                        return 1;
                    }
                    return 0;
                })
            }
            else if(state.method === '更改时间'){
                state.Projects = state.Projects.sort(function(a, b) {
                    if (a.current_date > b.current_date) {
                        return -1;
                    }
                    if (a.current_date < b.current_date) {
                        return 1;
                    }
                    return 0;
                })
            }
        }
    },
    actions: {

    },
    getters: {
        get_currentProject(state){//通过currentId获得当前的项目
            const projects = state.Projects
            for(let project of projects){
                if(project.id===state.currentId){
                    return project
                }
            }
        },
        get_currentIndex(state){//通过currentId获得当前项目在Projects数组中的位置
            let index = 0
            for(let project of state.Projects){
                if(project.id===state.currentId){
                    return index
                }
                index++
            }
        },
    }
}
export default ProjectModule