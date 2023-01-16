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
      <el-header>Header</el-header>

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
import {ElMessageBox} from "element-plus";

export default {

mounted() {
    this.checkSessionId()
},
  data() {
    return {
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
        ElMessageBox.alert(`Hello, ${response.name}!`, 'Welcome', {
          confirmButtonText: 'OK'
        })
      })
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

</style>
