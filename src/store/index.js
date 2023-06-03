import {createStore} from "vuex";
import UserModule from './User.js'
import ProjectModule from "./Project.js"
import OrganizationModule from "./Organization.js";
import MessageModule from "./Message.js";
const store = createStore({//简单的分发
    modules:{
        User: UserModule, //用户模块，对应User.js
        Project: ProjectModule, //项目模块，对应Project.js
        Organization: OrganizationModule, //组织模块，对应Organization.js
        Message: MessageModule,
    },
})

export default store
