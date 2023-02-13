import 'element-plus/dist/index.css'
import './assets/main.scss'

import ElementPlus from "element-plus"

import {createApp, ref} from 'vue'
import LoginPage from '@/components/LoginPage.vue'
import MainPage from "@/components/MainPage.vue"
import App from "@/App.vue"

import { createRouter, createWebHistory } from 'vue-router'

import StudentRegistrationPage from "@/components/widget/StudentRegistrationPage.vue"
import StudentMainPage from "@/components/widget/StudentMainPage.vue"
import StudentSchedule from "@/components/widget/StudentSchedule.vue"
import StudentCourse from "@/components/widget/StudentCourse.vue"
import StudentGrade from "@/components/widget/StudentGrade.vue"
import StudentRate from "@/components/widget/StudentRate.vue"
import ProfessorInformation from "@/components/widget/ProfessorInformation.vue"
import RateForm from "@/components/widget/RateForm.vue"
import McpApplication from "@/components/widget/StudentMcpApplication.vue"
import {useDark} from "@vueuse/core";
import Net from "@/components/util/network";

let mixin = {
    methods: {
        globalSetDarkMode: function(dark) {
            ref(useDark()).value = !!dark
            localStorage.setItem('dark', !!dark ? 'true' : 'false')
        },
        globalToggleDarkMode: function() {
            let current = ref(useDark()).value
            ref(useDark()).value = !current
            localStorage.setItem('dark', !current ? 'true' : 'false')
        },
        globalInitForDarkMode: function() {
            let dark = localStorage.getItem('dark')
            this.globalSetDarkMode(dark === 'true')
        }
    }
}

let router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: LoginPage,
        },
        {
            path: '/mainpage',
            component: MainPage,
            children: [
                {
                    path: '/main',
                    component: StudentMainPage
                },
                {
                    path: '/registration',
                    component: StudentRegistrationPage
                },
                {
                    path: '/course',
                    component: StudentCourse,
                },
                {
                    path: '/grade',
                    component: StudentGrade,
                },
                {
                    path: '/schedule',
                    component: StudentSchedule,
                },
                {
                    path:'/rate',
                    component: StudentRate,
                },
                {
                    path:'/professor-information',
                    component: ProfessorInformation,
                },
                {
                    path:'/rate-form',
                    component: RateForm,
                },
                {
                    path:'/mcp-application',
                    component: McpApplication,
                },
            ]
        },
    ]
})

Net.init()

createApp(App)
    .mixin(mixin)
    .use(router)
    .use(ElementPlus)
    .mount('#app')
