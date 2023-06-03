import {createRouter,createWebHashHistory} from 'vue-router'
const Login=()=>import('../components/Login/login.vue')
const Edit=()=>import('../components/Edit/edit.vue')
const Project=()=>import('../components/Project/Project.vue')
const Team=() =>import('../components/Project/components/team.vue')
const Individual=() =>import('../components/Project/components/individual.vue')
const Recent=() =>import('../components/Project/components/recent.vue')
const Organization =() =>import('../components/organization/organization.vue')
const See = () =>import('../components/See/preview.vue')
const Answer = () =>import('../components/answer/answer.vue')
const Login_before_answer = () =>import('../components/answer/Login/login.vue')
const Result = () =>import('../components/Result/test.vue')
const routes = [
    { path: '/login', component: Login },
    { path: '/edit', component: Edit },
    { path: '/preview', component: See},
    {
        path: '/project',
        component: Project,
        children: [
            {
                path: 'recent',
                component: Recent,
            },
            {
                path: 'team',
                component: Team,
            },
            {
                path: 'individual',
                component: Individual,
            }
        ]
    },
    { path: '/organization', component: Organization },
    {
        path: '/answer/:link',
        name: 'answer',
        component: Answer
    },
    {
        path: '/login_before_answer/:link',
        component: Login_before_answer,
    },
    {
        path: '/result',
        component: Result
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
export default router