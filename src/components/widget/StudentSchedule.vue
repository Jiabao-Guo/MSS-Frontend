<template>
  <el-card class="card">
    <el-calendar ref="calendar" class="calendar" v-loading="loading">
      <template #date-cell="{ data }">
        <div class="wrapper-div" @click="(e) => handleAddSchedule(e, data)">
          <span class="span-date">{{ data.date.getDate() }}</span>
          <span class="span-schedule">
          <el-popover
              v-for="(s, i) in (schedules[keyFromDate(data.date)] || [])"
              :key="i"
              placement="right"
              :show-after="0"
              :hide-after="0"
              transition=""
              :content="s.subject"
              trigger="hover"
          >
            <template #reference>
              <el-tag
                  @mouseenter="() => handleTagMouseEnter(keyFromDate(data.date) + i)"
                  @mouseleave="() => handleTagMouseLeave(keyFromDate(data.date) + i)"
                  @click="(e) => handleUpdateSchedule(e, data, s)"
                  :type="scheduleHover[keyFromDate(data.date) + i] ? 'warning' : ''"
                  effect="dark"
                  size="small"
              >
                <div>
                {{ getTimePart(s.subject) }}
                </div>
              </el-tag>
            </template>
          </el-popover>
        </span>
        </div>
      </template>
    </el-calendar>
  </el-card>
</template>

<script setup>

import {ElMessage, ElMessageBox} from "element-plus";
import Net from "@/components/util/network";
import {onMounted, reactive, ref} from "vue";
import {useDefaultConfig, useDefaultElMessageBoxConfig} from "@/components/util/global";

const loading = ref(false)
const schedules = reactive({})
const scheduleHover = reactive({})
const defaultElConfig = useDefaultElMessageBoxConfig()
const config = useDefaultConfig()

function getTimePart(s) {
  let parts = s.split(' ')
  return parts.length === 1 ? s : parts.slice(0, -1).join(' ').trim()
}

// Date object -> "YYYY-MM-DD"
function keyFromDate(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()

  year = `${year}`
  month = month < 10 ? `0${month}` : `${month}`
  day = day < 10 ? `0${day}` : `${day}`

  return `${year}-${month}-${day}`
}

async function reloadSchedule() {
  loading.value = true
  let res = await Net.post('/schedule/query', {
    studentNumber: localStorage.getItem("student_number"),
    sessionId: localStorage.getItem("session"),
  }).catch(() => {
  }).finally(() => {
    setTimeout(() => {
      loading.value = false
    }, config.minLoadingTimeMillis)
  })

  if (!res.data.success) {
    ElMessage.error({
      message: res.data.message,
    })
    return
  }

  const sched = {}
  for (let schedule of res.data.schedules) {
    // 2023-02-10T20:25:20.000+00:00
    let key = keyFromDate(new Date(schedule.date))
    sched[key] ||= []
    sched[key].push(schedule)
  }
  Object.assign(schedules, sched)
}

async function handleAddSchedule(event, data) {
  let date = keyFromDate(data.date);
  let subject = await ElMessageBox.prompt(`What's your plan on ${date}?`, 'New Schedule', {
    confirmButtonText: 'Create',
    ...defaultElConfig
  })
      .catch(() => {
      })

  if (!subject || subject.action !== 'confirm') {
    return
  }

  let addScheduleForm = {
    studentNumber: localStorage.getItem("student_number"),
    sessionId: localStorage.getItem("session"),
    date: data.date.getTime(),
    subject: subject.value,
  }

  let res = await Net.post('/schedule', addScheduleForm)
  ElMessage({
    type: res.data.success ? 'success' : 'error',
    message: res.data.message
  })
  await reloadSchedule()
}

async function handleUpdateSchedule(event, data, oldSchedule) {
  event.stopPropagation()

  let date = keyFromDate(data.date);

  ElMessageBox.prompt(`What's your new plan on ${date}?`, 'Update Schedule', {
    distinguishCancelAndClose: true,
    confirmButtonText: 'Update',
    cancelButtonText: "Delete",
    inputValue: oldSchedule.subject,
    inputPattern: /.+/,
    inputErrorMessage: 'Schedule must not be empty.',
    ...defaultElConfig
  }).then(res => {
    let newSchedule = oldSchedule
    newSchedule.subject = res.value
    Net.put(`/schedule/${oldSchedule.id}`, newSchedule).then(r => {
      ElMessage({
        type: r.data.success ? 'success' : 'error',
        message: r.data.message
      })
      reloadSchedule()
    }).catch(() => {
    })
  }).catch((action) => {
    if (action === 'cancel') {
      ElMessageBox.confirm('Are you sure to delete this?', 'Delete', {
        type: 'warning',
        ...defaultElConfig
      }).then(() => {
        Net.delete(`/schedule/${oldSchedule.id}`).then(r => {
          ElMessage({
            type: r.data.success ? 'success' : 'error',
            message: r.data.message
          })
          reloadSchedule()
        })
      }).catch(() => {
      })
    }
  })
}

function handleTagMouseEnter(key) {
  scheduleHover[key] = true;
}

function handleTagMouseLeave(key) {
  scheduleHover[key] = false;
}

onMounted(reloadSchedule)


</script>

<style scoped>
.wrapper-div {
  position: relative;
  width: 100%;
  height: 100%;
}

.span-date {
  font-size: 16px;
  font-weight: bold;
}

.span-schedule {
  position: absolute;
  bottom: 2px;
  left: 2px;
  top: 20px;
  overflow: scroll;
}

.el-calendar-table .el-calendar-day {
}

span, el-tag {
  max-width: 100%;
  text-align: left;
  justify-content: left;
  margin: 1px 0 0;
  overflow: scroll;
  scrollbar-gutter: auto;
}

::-webkit-scrollbar {
  display: none;
}

tbody {
  border-radius: 12px;
}

.card {
  border-radius: 12px;
  border: 0;
  box-shadow: black 0 0 !important;
}

</style>
