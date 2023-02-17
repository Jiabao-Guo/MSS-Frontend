import 'element-plus/dist/index.css'
import './assets/main.scss'

import ElementPlus from "element-plus"

import {createApp, ref} from 'vue'
import LoginPage from '@/components/LoginPage.vue'
import MainPage from "@/components/MainPage.vue"
import App from "@/App.vue"

import {createRouter, createWebHistory} from 'vue-router'

import StudentMainPage from "@/components/widget/StudentMainPage.vue"
import StudentSchedule from "@/components/widget/StudentSchedule.vue"
import StudentCourse from "@/components/widget/StudentCourse.vue"
import StudentGrade from "@/components/widget/StudentGrade.vue"
import StudentRate from "@/components/widget/StudentRate.vue"
import RateForm from "@/components/widget/RateForm.vue"
import McpApplication from "@/components/widget/StudentMcpApplication.vue"
import {useDark} from "@vueuse/core";
import Net from "@/components/util/network";
import InstructorManagement from "@/components/widget/InstructorManagement.vue";
import CourseManagement from "@/components/widget/CourseManagement.vue";

let router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: LoginPage,
        },
        {
            path: '/home',
            component: MainPage,
            children: [
                {
                    path: '/main',
                    component: StudentMainPage
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
                    path: '/rate',
                    component: StudentRate,
                },
                {
                    path: '/instructor-management',
                    component: InstructorManagement,
                },
                {
                    path: '/course-management',
                    component: CourseManagement,
                },
                {
                    path: '/rate-form',
                    component: RateForm,
                },
                {
                    path: '/mcp-application',
                    component: McpApplication,
                },
            ]
        },
    ]
})

Net.init()

createApp(App)
    .use(router)
    .use(ElementPlus)
    .mount('#app')
