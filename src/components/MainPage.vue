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
                    @click="useToggleDarkMode()()"
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
                <el-menu-item index="dashboard">Dashboard</el-menu-item>
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

              <el-menu-item index="student-management">
                <template #title>Student Management</template>
              </el-menu-item>
            </el-sub-menu>

          </el-menu>

          <div class="copyright">
            © 2023 Jasper - {{ isDebug() ? 'Debug' : 'Release' }} Build
          </div>
        </el-aside>


        <el-main>
          <div class="header-div">
            <h2 class="current-location">/{{ currentRoute }}</h2>

            <el-popover
                v-model:visible="popoverVisible"
                class="el-popper"
                placement="bottom"
                trigger="hover"
                width="300px"
            >
              <template #reference>
                <el-button
                    :class="'task-button ' + taskButtonClass()"
                    type="primary"
                    @click="handleTaskButtonClick"
                >
                  {{ tasks.length }} Task(s) Running
                </el-button>
              </template>

              <el-table :data="tasks" :show-header="false" class="task-list">
                <el-table-column>
                  <template #default="scope">
                    <div class="task-name-group">
                      <div class="task-name">{{ scope.row.name }}</div>
                    </div>
                    <div :class="descriptionTextClass(scope.row)">
                      {{ scope.row.description }}
                    </div>
                    <el-progress
                        :percentage="scope.row.progress / scope.row.total * 100"
                        :show-text="false"
                    />
                    <el-link
                        @click="handleTaskCancel(scope.row)"
                        class="task-cancel-button"
                    >
                      {{ cancelButtonText(scope.row) }}
                    </el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-popover>
          </div>
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
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {
  useDefaultElMessageBoxConfig,
  useInitForDarkMode,
  useToggleDarkMode, useTasks, useDefaultConfig
} from "@/components/util/global";
import {useRouter} from "vue-router";

/**
 * [{
 *  uuid: string,
 *  name: string,
 *  progress: number,
 *  total: number,
 * }]
 */
const tasks = ref([])
const router = useRouter()
const didAppearAnimPlayed = ref(false)
const {getTasks, addTask, removeTask} = useTasks()

const TaskStatusRunning = 0
const TaskStatusSuccess = 1
const TaskStatusFailed = 2


const name = ref('')
const currentRoute = ref('')
const defaultElConfig = useDefaultElMessageBoxConfig()
const defaultConfig = useDefaultConfig()

const intervalHandle = ref(null)
const popoverVisible = ref(false)

function handleSelect(s) {
  currentRoute.value = s
}

function handleLogout() {
  ElMessageBox.confirm('Are you sure to log out?', 'Log out', {
    confirmButtonText: 'Log out',
    cancelButtonText: 'Cancel',
    type: 'warning',
    ...defaultElConfig,
  }).then(() => {
    localStorage.removeItem("session")
    localStorage.removeItem("student_number")
    localStorage.removeItem("student_id")
    router.push('/')
  }).catch(() => {
  })
}

function checkSessionId() {
  Net.post('/greetings', {
    studentNumber: localStorage.getItem("student_number"),
    sessionId: localStorage.getItem("session"),
  }).then(res => {
    let response = res.data
    name.value = response.name
    localStorage.setItem("student_id", response.id)
    localStorage.setItem("student_name", response.name)
    ElMessage.success(`Hello, ${response.name}!`)
    router.push('/dashboard')
    currentRoute.value = 'dashboard'
  })
}

function taskButtonClass() {
  if (!didAppearAnimPlayed.value) {
    return 'task-button-animation-hide'
  }
  if (tasks.value.length > 0) {
    return 'task-button-animation-enter'
  } else {
    return 'task-button-animation-exit'
  }
}

function handleTaskButtonClick() {
  popoverVisible.value = !popoverVisible.value
}

async function handleCreateTask() {
  let uuid = (await Net.post('/debug', {
    name: 'test_task'
  })).data
  console.log("Created task: " + uuid)
  addTask(uuid)
  await refreshTasks()
}

function mounted() {
  checkSessionId()
  useInitForDarkMode()()
  intervalHandle.value = setInterval(refreshTasks, defaultConfig.taskRefreshRateMillis)
}

function unmounted() {
  clearInterval(intervalHandle.value)
}

async function refreshTasks() {
  let taskUuids = getTasks()

  if (taskUuids.length === 0) {
    return
  }

  let taskList = (await Net.get('/task', {
    uuids: taskUuids.join(',')
  })).data

  if (taskList.length > 0) {
    if (!didAppearAnimPlayed.value) {
      popoverVisible.value = true
    }
    didAppearAnimPlayed.value = true
  }

  tasks.value = taskList.filter(t => !!t)
}

function handleTaskCancel(task) {
  useTasks().removeTask(task.uuid)
  tasks.value = tasks.value.filter(t => t.uuid !== task.uuid)
  Net.delete(`/task/${task.uuid}`)
}

function cancelButtonText(task) {
  switch (task.status) {
    case TaskStatusRunning:
      return 'Cancel'
    case TaskStatusSuccess:
      return 'OK'
    case TaskStatusFailed:
      return 'Dismiss'
  }
}

function descriptionTextClass(task) {
  switch (task.status) {
    case TaskStatusRunning:
      return 'task-description'
    case TaskStatusSuccess:
      return 'task-description-success'
    case TaskStatusFailed:
      return 'task-description-failed'
  }
}

onMounted(mounted)
onUnmounted(unmounted)

</script>


<style lang="scss" scoped>
@use "src/assets/main";

.common-layout {
  width: 100%;
  height: 100%;
}

.header-container {
  margin: 24px 24px;
}

.header-title {
  left: 20px;
  margin-bottom: 4px;
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

.header-div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-location {
  font-family: "Courier New", Consolas, Monospaced;
  color: gray;
}

.task-button {
  border-radius: 12px;
}

.task-button-animation-enter {
  transform: scale(1);
  animation: task-button-appear 0.5s;
}

.task-button-animation-exit {
  transform: scale(0);
  animation: task-button-disappear 0.3s;
}

.task-button-animation-hide {
  display: none;
}

@keyframes task-button-appear {
  0% {
    transform: scale(0.2);
  }
  75% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes task-button-disappear {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

.task-list {
  border-radius: 12px;
}

.task-item {
  padding: 4px;
  margin: 8px 4px;
}

.task-name {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 2px;
}

.task-description {
  font-size: 12px;
  margin-bottom: 2px;
}

.task-description-failed {
  font-size: 12px;
  margin-bottom: 2px;
  color: darkred;
}

.task-description-success {
  font-size: 12px;
  margin-bottom: 2px;
  color: green;
}

.task-cancel-button {
  float: right;
  margin-top: 4px;
}

.task-name-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

<style>
.el-popper.is-light {
  border-radius: 12px !important;
}
</style>
