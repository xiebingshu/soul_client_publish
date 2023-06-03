import {createStore} from 'vuex'
import {toRaw} from "vue";
const UserModule ={
    state: {
        login_or_not:false, //是否已经登录，可能用于懒加载项目信息
        get_qr:true,
        get_organization:true,
        user_name: "",//用户名
        token: "",//token
        user_email: ""//用户邮箱，以上是目前用的，未完待续
    },
    mutations: {
        loginSuccess(state, user){//登录时更改用户状态
            state.login_or_not = true;
            state.user_name = toRaw(user.user_name);
            state.token = toRaw(user.token);
            state.user_email = toRaw(user.user_email);
        },
        getSuccess(state){
            state.get_qr = false
        },
        getOrganizationSuccess(state){
            state.get_organization = false
        },
    },
    actions: {

    }
}
export default UserModule
