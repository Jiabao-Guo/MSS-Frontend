<template>
  <el-calendar ref="calendar">
    <template #header="{ date }">
      <span>My Schedule</span>
      <span>{{ date }}</span>
      <el-button-group>

        <el-button size="small" @click="selectDate('prev-month')">
          Previous Month
        </el-button>
        <el-button size="small" @click="selectDate('today')">Today</el-button>
        <el-button size="small" @click="selectDate('next-month')">
          Next Month
        </el-button>

      </el-button-group>
    </template>
  </el-calendar>
</template>

<script>



export default {
  name: "StudentSchedule"
}

</script>

<style scoped>

</style>