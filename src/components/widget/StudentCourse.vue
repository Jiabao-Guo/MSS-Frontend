<template>
  <GenericTable
      model="instructor"
      noun="Instructor"
      model-key="instructorNumber"
      :columns="[
        {prop: 'instructorNumber', label: 'Instructor Number', width: '180', rules: []},
        {prop: 'name', label: 'Instructor Name', rules: []},
        {prop: 'salary', label: 'Salary', width: '180', rules: []},
      ]"
      :query-form="{
        min: 0.0, max: 100000.0, name: 'a'
      }"
  />
  <el-table :data="tableData" stripe style="margin-bottom: 8px;"
            @selection-change="handleSelectionChange"
            v-loading="loading">
    <el-table-column type="selection" width="55"/>
    <el-table-column prop="courseNumber" label="Course Number" width="180"/>
    <el-table-column prop="name" label="Course Name" width="180"/>
    <el-table-column prop="instructor.name" label="Instructor Name"/>
  </el-table>

  <el-form-item>
    <el-button type="primary" @click="handleRegister">Register Selected</el-button>
    <el-button>Cancel</el-button>
  </el-form-item>

</template>

<script>
import {ElMessage} from "element-plus";
import GenericTable from "@/components/generic/GenericTable.vue";
import Net from "@/components/util/network";

export default {
  components: {GenericTable},
  data() {
    return {
      tableData: [
        {
          //新数据更新完  会替换掉初始值
          courseNumber: '9877',
          name: 'example data',
          instructor: {
            name: 'x'
          }
        },
      ],
      currentSelection: [],
      loading: false
    }
  },
  mounted() {
    //每次页面更新 从后端取出数据放到前段
    Net.post('/course', {
      studentNumber: localStorage.getItem("student_number"),
      sessionId: localStorage.getItem("session"),

    }).then(res => {
      // 这个时候res.data是接收到的数据
      this.tableData = res.data
    })
  },

  methods: {
    // selection: array of courses
    handleSelectionChange(selection) {
      this.currentSelection = selection


    },

    handleRegister() {
      //post  8080  传到后端
      Net.post('/course-registration', {
        studentNumber: localStorage.getItem("student_number"),
        sessionId: localStorage.getItem("session"),

        //此数组课程 传到后端
        selectCourse: this.currentSelection
        //res => 后端的CourseRegistrationResponse
      }).then(res => {
        // let type = 'success';
        // if (!res.data.success) {
        //   type = 'error';
        // }

        ElMessage({
          message: res.data.message,
          type: res.data.success ? 'success' : 'error'
          //type:type
        })
      })


    }

  }
}
</script>

<style scoped>

</style>
