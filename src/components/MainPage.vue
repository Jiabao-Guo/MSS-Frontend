<!-- 导入图标 -->
<script setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
import McpApplication from "@/components/widget/StudentMcpApplication.vue";
import isDebug from "./config";
</script>

<template>
  <div class="common-layout">
    <!-- 主容器 -->
    <el-container style="height: 100%;">

      <!-- Header，顶部横条 -->
      <el-header class="header-container">
        <h2 class="header-title">MSS Frontend - {{ name }}</h2>
        <el-button class="toggle-button" @click="globalToggleDarkMode">
          <el-icon>
            <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-029747aa="">
              <path fill="currentColor"
                    d="M240.448 240.448a384 384 0 1 0 559.424 525.696 448 448 0 0 1-542.016-542.08 390.592 390.592 0 0 0-17.408 16.384zm181.056 362.048a384 384 0 0 0 525.632 16.384A448 448 0 1 1 405.056 76.8a384 384 0 0 0 16.448 525.696z"></path>
            </svg>
          </el-icon>
          暗いモード
        </el-button>
        <el-divider class="header-divider"></el-divider>
      </el-header>

      <el-container>
        <!-- 左侧侧边栏 -->
        <el-aside width="300px">
          <el-menu
              default-active="2"
              style="height: 100%;"
              :router="true"
          >
            <el-sub-menu index="1">
              <template #title>
                <el-icon>
                  <location/>
                </el-icon>
                <span>General</span>
              </template>

              <el-menu-item-group title="Daily">
                <el-menu-item index="main">Dashboard</el-menu-item>
                <el-menu-item index="registration">My Courses</el-menu-item>
                <el-menu-item index="grade">My Grades</el-menu-item>
              </el-menu-item-group>

              <el-menu-item-group title="Management">
                <el-menu-item index="course">Registration</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>

            <el-menu-item index="schedule">
              <el-icon>
                <setting/>
              </el-icon>
              <span>My Schedule</span>
            </el-menu-item>

            <el-sub-menu index="rate">
              <template #title>
                <el-icon>
                  <location/>
                </el-icon>
                <span>Events</span>
              </template>

              <el-menu-item index="rate-form">
                <template #title>Instructor Evaluation</template>
              </el-menu-item>


              <el-menu-item index="mcp-application">
                <template #title>MCP Application</template>
              </el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="admin">
              <template #title>
                <el-icon>
                  <location/>
                </el-icon>
                <span>System Administration</span>
              </template>

              <el-menu-item index="professor-information">
                <template #title>Instructor Management</template>
              </el-menu-item>

            </el-sub-menu>

            <div class="copyright">
              © 2023 Jasper
              <p>
                MSS {{ isDebug() ? 'Debug' : 'Release' }} Build
              </p>
            </div>
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
import {ElMessage} from "element-plus";
import Net from "@/components/util/network";

export default {

  mounted() {
    this.checkSessionId()
    this.globalInitForDarkMode()
  },
  data() {
    return {
      name: ''
    }
  },
  methods: {
    checkSessionId() {
      Net.post('greetings', {
        studentNumber: localStorage.getItem("student_number"),
        sessionId: localStorage.getItem("session"),
      }).then(res => {

        /** 将前端方法返回的结果 全部存入 res.data 并且用 response接收*/
        let response = res.data
        this.name = response.name
        ElMessage.success(`Hello, ${response.name}!`)
      })
    },
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

li .el-menu-item {
  height: 40px;
  font-weight: bold;
}

.copyright {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translate(-50%, 0);
  width: 90%;
  color: gray;
  text-align: center;
}

</style>
