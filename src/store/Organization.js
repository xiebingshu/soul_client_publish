import {createStore} from 'vuex'
import {reactive, toRaw} from "vue";
const OrganizationModule ={
    state: {
        Organizations:[],  //数组，存储当前所有的组织
        currentOrganizationId:-1, //当前选择组织
        newOrganizationId: 1,
    },
    mutations: {
        addOrganization(state, organization){
            state.Organizations.push(JSON.parse(JSON.stringify(organization)))//增加项目
        },
        removeOrganization(state, index){//删除项目
            state.Organizations.splice(index,1)
        },
        setCurrentOrganizationId(state, id){//改变currentId
            state.currentOrganizationId = toRaw(id)
        },
        updateCurrentOrganization(state, props){//更新当前的项目，用于安全的修改项目的信息，添加问题等
            state.Organizations.splice(props.index, 1, JSON.parse(JSON.stringify(props.organization)))
        },
        initOrganization(state){
            state.Organizations = []
        }
    },
    actions: {

    },
    getters: {
        get_currentOrganization(state){
            const organizations = state.Organizations
            for(let organization of organizations){
                if(organization.id===state.currentOrganizationId){
                    return organization
                }
            }
        },
        get_currentOrganizationIndex(state){//通过currentId获得当前项目在Organizations数组中的位置
            let index = 0
            for(let organization of state.Organizations){
                if(organization.id===state.currentOrganizationId){
                    return index
                }
                index++
            }
        },
    }
}
export default OrganizationModule
