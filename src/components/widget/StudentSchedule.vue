<template>
  <el-calendar ref="calendar">
    <template #header="{ date }">
      <span>My Schedule</span>
      <span>{{ date }}</span>
      <el-button-group>

        <el-button size="small" @click="selectDate('prev-month')">
          Previous Month
        </el-button>
        <el-button size="small" @click="selectDate('today')">
          Today
        </el-button>
        <el-button size="small" @click="selectDate('next-month')">
          Next Month
        </el-button>

      </el-button-group>
    </template>

    <template #date-cell="{ data }">
      <div class="wrapper-div" @click="(e) => this.handleAddSchedule(e, data)">
        <span class="span-date">{{ data.date.getDate() }}</span>
        <span class="span-schedule">
          <el-popover
              v-for="(s, i) in (this.schedules[this.keyFromDate(data.date)] || [])"
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
                  @mouseenter="() => this.handleTagMouseEnter(this.keyFromDate(data.date) + i)"
                  @mouseleave="() => this.handleTagMouseLeave(this.keyFromDate(data.date) + i)"
                  @click="(e) => this.handleUpdateSchedule(e, data, s)"
                  :type="this.scheduleHover[this.keyFromDate(data.date) + i] ? 'warning' : ''"
                  effect="dark"
                  size="small"
              >
                <div>
                {{ this.getTimePart(s.subject) }}
                </div>
              </el-tag>
            </template>
          </el-popover>
        </span>
      </div>
    </template>
  </el-calendar>
</template>

<script>

import {ElMessage, ElMessageBox} from "element-plus";
import Net from "@/components/util/network";

export default {
  data() {
    return {
      // year-month-day: [schedules]
      schedules: {},
      scheduleHover: {}
    }
  },
  mounted() {
    this.reloadSchedule()
  },
  methods: {
    getTimePart(s) {
      let parts = s.split(' ')
      return parts.length === 1 ? s : parts.slice(0, -1).join(' ').trim()
    },
    // Date object -> "YYYY-MM-DD"
    keyFromDate(date) {
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()

      year = `${year}`
      month = month < 10 ? `0${month}` : `${month}`
      day = day < 10 ? `0${day}` : `${day}`

      return `${year}-${month}-${day}`
    },
    async reloadSchedule() {
      let res = await Net.post('/schedule/query', {
        studentNumber: localStorage.getItem("student_number"),
        sessionId: localStorage.getItem("session"),
      }).catch(() => {
      })

      if (!res.data.success) {
        ElMessage.error({
          message: res.data.message,
        })
        return
      }

      let schedules = {}
      for (let schedule of res.data.schedules) {
        // 2023-02-10T20:25:20.000+00:00
        let key = this.keyFromDate(new Date(schedule.date))
        schedules[key] ||= []
        schedules[key].push(schedule)
      }
      this.schedules = schedules
    },
    async handleAddSchedule(event, data) {
      let date = this.keyFromDate(data.date);
      let subject = await ElMessageBox.prompt(`What's your plan on ${date}?`, 'New Schedule', {
        confirmButtonText: 'Create',
        draggable: true,
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
      await this.reloadSchedule()
    },
    async handleUpdateSchedule(event, data, oldSchedule) {
      event.stopPropagation()

      let date = this.keyFromDate(data.date);

      ElMessageBox.prompt(`What's your new plan on ${date}?`, 'Update Schedule', {
        distinguishCancelAndClose: true,
        confirmButtonText: 'Update',
        cancelButtonText: "Delete",
        inputValue: oldSchedule.subject,
        inputPattern: /.+/,
        inputErrorMessage: 'Schedule must not be empty.',
        draggable: true,
      }).then(res => {
        let newSchedule = oldSchedule
        newSchedule.subject = res.value
        Net.put(`/schedule/${oldSchedule.id}`, newSchedule).then(r => {
          ElMessage({
            type: r.data.success ? 'success' : 'error',
            message: r.data.message
          })
          this.reloadSchedule()
        }).catch(() => {
        })
      }).catch((action) => {
        if (action === 'cancel') {
          ElMessageBox.confirm('Are you sure to delete this?', 'Delete', {
            type: 'warning',
            draggable: true,
          }).then(() => {
            Net.delete(`/schedule/${oldSchedule.id}`).then(r => {
              ElMessage({
                type: r.data.success ? 'success' : 'error',
                message: r.data.message
              })
              this.reloadSchedule()
            })
          }).catch(() => {
          })
        }
      })
    },
    handleTagMouseEnter(key) {
      this.scheduleHover[key] = true;
    },
    handleTagMouseLeave(key) {
      this.scheduleHover[key] = false;
    },
  }
}

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

</style>
