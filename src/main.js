import 'element-plus/dist/index.css'
import './assets/main.scss'

import ElementPlus from "element-plus"

import { createApp } from 'vue'
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
import McpApplication from "@/components/widget/McpApplication.vue"

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

createApp(App)
    .use(router)
    .use(ElementPlus)
    .mount('#app')
