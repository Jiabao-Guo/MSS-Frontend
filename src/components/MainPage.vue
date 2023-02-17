<template>
  <div class="common-layout">
    <el-container>
      <el-container>
        <el-aside>
          <div class="header-container">
            <h4 class="header-subtitle">MEMORIAL MSS</h4>
            <h2 class="header-title">
              Hi, {{ name }}!
              <div class="function-area">
                <el-link
                    class="function-item"
                    @click="handleLogout"
                >
                  <el-icon>
                    <Key/>
                  </el-icon>
                </el-link>

                <el-link
                    class="function-item"
                    @click="useGlobalToggleDarkMode()()"
                >
                  <el-icon>
                    <Moon/>
                  </el-icon>
                </el-link>
              </div>
            </h2>
            <div>System Administrator</div>
          </div>

          <el-menu
              default-active="2"
              class="side-menu"
              :router="true"
              @select="handleSelect"
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

              <el-menu-item index="course-management">
                <template #title>Course Management</template>
              </el-menu-item>

              <el-menu-item index="instructor-management">
                <template #title>Instructor Management</template>
              </el-menu-item>

            </el-sub-menu>

          </el-menu>

          <div class="copyright">
            © 2023 Jasper - MSS {{ isDebug() ? 'Debug' : 'Release' }} Build
          </div>
        </el-aside>


        <el-main>
          <h2 class="current-space">/{{ currentRoute }}</h2>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>


<script setup>
import {
  Location,
  Setting,
  Moon,
  Key,
} from '@element-plus/icons-vue'
import isDebug from "./config";
import {ElMessage, ElMessageBox} from "element-plus";
import Net from "@/components/util/network";
import {onMounted, ref} from "vue";
import {
  useDefaultElMessageBoxConfig,
  useGlobalInitForDarkMode,
  useGlobalToggleDarkMode
} from "@/components/util/global";
import {useRouter} from "vue-router";

const router = useRouter()

const name = ref('')
const currentRoute = ref('')
const defaultElConfig = useDefaultElMessageBoxConfig()

function handleSelect(s) {
  currentRoute.value = s
}

function handleLogout() {
  ElMessageBox.confirm('Are you sure to log out?', 'Log out', {
    confirmButtonText: 'Log out',
    cancelButtonText: 'Cancel',
    type: 'warning',
    ...defaultElConfig(),
  }).then(() => {
    localStorage.removeItem("session")
    localStorage.removeItem("student_number")
    localStorage.removeItem("student_id")
    router.push('/')
  }).catch(() => {})
}

function checkSessionId() {
  Net.post('/greetings', {
    studentNumber: localStorage.getItem("student_number"),
    sessionId: localStorage.getItem("session"),
  }).then(res => {
    let response = res.data
    name.value = response.name
    localStorage.setItem("student_id", response.id)
    ElMessage.success(`Hello, ${response.name}!`)
    router.push('/main')
    console.log(res)
  })
}

function mounted() {
  checkSessionId()
  useGlobalInitForDarkMode()()
}

onMounted(mounted)
</script>


<style lang="scss" scoped>
@use "src/assets/main";

.common-layout {
  width: 100%;
  height: 100%;
  position: absolute;
}

.header-container {
  margin: 24px 24px;
}

.header-title {
  left: 20px;
  margin-bottom: 4px;
  word-wrap: anywhere;
}

.header-subtitle {
  color: gray;
}

li .el-menu-item {
  font-weight: bold;
}

.copyright {
  margin: 24px;
  color: gray;
  text-align: center;
}

.side-menu {
  margin-left: 12px;
  border: 0;
  border-radius: 12px;
}

.dark .side-menu {
  background: rgb(29, 30, 31);
}

.function-area {
  display: inline;
}

.function-item {
  margin: 4px;
  font-size: 28px;
}

.current-space {
  font-family: "Courier New", Consolas, Monospaced;
  color: gray;
}

</style>
