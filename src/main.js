import 'element-plus/dist/index.css'
import './assets/main.scss'

import ElementPlus from "element-plus"

import {createApp, ref} from 'vue'
import LoginPage from '@/components/LoginPage.vue'
import MainPage from "@/components/MainPage.vue"
import App from "@/App.vue"

import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

import StudentDashboardPage from "@/components/widget/student/StudentDashboardPage.vue"
import StudentSchedule from "@/components/widget/student/StudentSchedule.vue"
import StudentCourse from "@/components/widget/student/StudentRegistration.vue"
import StudentGrade from "@/components/widget/student/StudentGrade.vue"
import StudentRate from "@/components/widget/student/StudentRate.vue"
import RateForm from "@/components/widget/student/RateForm.vue"
import McpApplication from "@/components/widget/student/StudentMcpApplication.vue"
import Net from "@/components/util/network";
import InstructorManagement from "@/components/widget/management/InstructorManagement.vue";
import CourseManagement from "@/components/widget/management/CourseManagement.vue";
import StudentManagement from "@/components/widget/management/StudentManagement.vue";
import UserManagement from "@/components/widget/management/UserManagement.vue";

let router = createRouter({
    history: createWebHashHistory(),
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
                    path: '/dashboard',
                    component: StudentDashboardPage
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
                    path: '/student-management',
                    component: StudentManagement,
                },
                {
                    path: '/user-management',
                    component: UserManagement,
                },
                {
                    path: '/rate-form',
                    component: RateForm,
                },
                {
                    path: '/mcp-application',
                    component: McpApplication,
                }
            ]
        },
    ]
})

Net.init()

createApp(App)
    .use(router)
    .use(ElementPlus)
    .mount('#app')
