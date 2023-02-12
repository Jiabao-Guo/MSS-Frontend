<!-- 导入图标 -->
<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import McpApplication from "@/components/widget/McpApplication.vue";
</script>

<template>
  <div class="common-layout" >
    <!-- 主容器 -->
    <el-container style="height: 100%">

      <!-- Header，顶部横条 -->
      <el-header class="header-container">
        <h2 class="header-title">MSS Frontend - {{ name }}</h2>
        <el-button class="toggle-button" @click="handleToggleDark">
          <el-icon><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa=""><path fill="currentColor" d="M240.448 240.448a384 384 0 1 0 559.424 525.696 448 448 0 0 1-542.016-542.08 390.592 390.592 0 0 0-17.408 16.384zm181.056 362.048a384 384 0 0 0 525.632 16.384A448 448 0 1 1 405.056 76.8a384 384 0 0 0 16.448 525.696z"></path></svg></el-icon>
          暗いモード</el-button>
        <el-divider class="header-divider"></el-divider>
      </el-header>

      <el-container>
        <!-- 左侧侧边栏 -->
        <el-aside width="300px">
          <el-menu
              default-active="2"
              class="el-menu-vertical-demo"

              :router="true"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon><location /></el-icon>
                <span>Main Menu</span>
              </template>

              <el-menu-item-group title="Student Operations">
                <el-menu-item index="main">Main Page</el-menu-item>
                <el-menu-item index="registration">Registration</el-menu-item>
                <el-menu-item index="1-3">My Courses</el-menu-item>
                <el-menu-item index="1-4">My Grades</el-menu-item>
              </el-menu-item-group>

              <el-menu-item-group title="Group Two">
                <el-menu-item index="1-5">item three</el-menu-item>
              </el-menu-item-group>

              <el-sub-menu index="1-6">
                <template #title>item four</template>
                <el-menu-item index="1-6-1">item one</el-menu-item>
              </el-sub-menu>
            </el-sub-menu>

            <el-menu-item index="course">
              <el-icon><location /></el-icon>
              <span>Course</span>
            </el-menu-item>

            <el-menu-item index="grade">
              <el-icon><document /></el-icon>
              <span>Grade</span>
            </el-menu-item>

            <el-menu-item index="schedule" >
              <el-icon><setting /></el-icon>
              <span>Schedule</span>
            </el-menu-item>

            <el-sub-menu index="rate">
              <template #title>
                <el-icon><location /></el-icon>
                <span>Rate</span>
              </template>
              <el-menu-item index="professor-information">
                <template #title>Professor Information</template>
              </el-menu-item>
              <el-menu-item index="rate-form">
                <template #title>Rate Form</template>
              </el-menu-item>
            </el-sub-menu>

            <el-menu-item index="mcp-application" >
              <el-icon><setting /></el-icon>
              <span>McpApplication</span>
            </el-menu-item>

          </el-menu>

        </el-aside>

        <!-- 内容区  -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script>
import axios from "axios";
import {ElMessage} from "element-plus";
import {ref} from 'vue';

import {useDark} from "@vueuse/core";

export default {

mounted() {
    this.checkSessionId()
},
  data() {
    return {
      name: ''
    }
  },
  methods: {
    checkSessionId() {
      axios.post('http://localhost:8080/greetings', {
        studentNumber: localStorage.getItem("student_number"),
        sessionId: localStorage.getItem("session"),
      }).then(res => {

        /** 将前端方法返回的结果 全部存入 res.data 并且用 response接收*/
        let response = res.data
        this.name = response.name
        ElMessage.success(`Hello, ${response.name}!`)
      })
    },

    handleToggleDark() {

      //import { useDark, useToggle } from '@vueuse/core'
      //const isDark = useDark()
      //const toggleDark = useToggle(isDark)

      let darkState = useDark()
      let darkStateRef = ref(darkState)
      darkStateRef.value = !darkStateRef.value
    }
  }
}
</script>


<style scoped>

.common-layout {
  width: 100%;
  height: 100%;
  position: absolute;
}

.header-container {
  position: relative;
}

.header-title {
  position: absolute;
  margin: 0;
  height: 50%;
  left: 20px;
  transform: translate(0, 50%);
}

.toggle-button {
  position: absolute;
  margin: 0;
  height: 50%;
  right: 20px;
  transform: translate(0, 50%);
}

.header-divider {
  position: absolute;
  margin: 0;
  bottom: 0;
}

</style>
