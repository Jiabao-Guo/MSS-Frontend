<template>

  <el-table :data="tableData" stripe style="margin-bottom: 8px;"
            @selection-change="handleSelectionChange"
            v-loading = "loading">
    <el-table-column type="selection" width="55" />
    <el-table-column prop="courseNumber" label="Course Number" width="180" />
    <el-table-column prop="name" label="Course Name" width="180" />
    <el-table-column prop="instructor.name" label="Instructor Name" />
  </el-table>

  <el-form-item>
    <el-button type="primary" @click="handleRegistrator">Register Selected</el-button>
    <el-button>Cancel</el-button>
  </el-form-item>

</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
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
    axios.post('http://localhost:8080/course',{
      studentNumber: localStorage.getItem("student_number"),
      sessionId: localStorage.getItem("session"),

    }).then(res => {
      // 这个时候res.data是接收到的数据
      this.tableData = res.data
    })
  },

  methods:{
    // selection: array of courses
    handleSelectionChange(selection) {
      this.currentSelection = selection



    },

    handleRegistrator(){
      //post  8080  传到后端
      axios.post('http://localhost:8080/course-registration', {
        studentNumber: localStorage.getItem("student_number"),
        sessionId: localStorage.getItem("session"),

        //此数组课程 传到后端
         selectCourse: this.currentSelection
        //res => 后端的CourseRegistrationResponse
      }).then(res =>{
        // let type = 'success';
        // if (!res.data.isSuccess) {
        //   type = 'error';
        // }

        ElMessage({
          message: res.data.messages,
          type: res.data.isSuccess ? 'success' : 'error'
          //type:type
        })
      })


    }

  }
}
</script>

<style scoped>

</style>
