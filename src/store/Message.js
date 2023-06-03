import {createStore} from 'vuex'
const MessageModule ={
    state: {
        Messages:[],
    },
    mutations: {
        changeMessage(state, Messages){
            state.Messages = JSON.parse(JSON.stringify(Messages))//增加项目
        },
        removeMessage(state, index){//删除项目
            state.Messages.splice(index,1)
        },
    },
    actions: {

    }
}
export default MessageModule
