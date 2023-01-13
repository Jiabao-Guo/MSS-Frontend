<template>
  <el-form
      ref="formInstance"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
  >
    <el-form-item label="Student number" prop="studentNumber">
      <el-input v-model="ruleForm.studentNumber" />
    </el-form-item>
    <el-form-item label="Marital status" prop="maritalStatus">
      <el-select v-model="ruleForm.maritalStatus" placeholder="Marital status">
        <el-option label="Single" value="Single" />
        <el-option label="Married" value="Married" />
        <el-option label="Divouced" value="Divouced" />
      </el-select>
    </el-form-item>
<!--    <el-form-item label="Intending to reside in Canada" prop="count">-->
<!--      <el-select-v2-->
<!--          v-model="ruleForm.count"-->
<!--          placeholder="Intending to reside in Canada"-->
<!--          :options="options"-->
<!--      />-->
<!--    </el-form-item>-->
    <el-form-item label="Application time" required>
      <el-col :span="11">
        <el-form-item prop="applicationTime">
          <el-date-picker
              v-model="ruleForm.applicationTime"
              type="date"
              label="Pick a date"
              placeholder="Pick a date"
              style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-form-item>

    <el-form-item label="Delivery Card" prop="delivery">
      <el-switch v-model="ruleForm.delivery" />
    </el-form-item>

    <el-form-item label="Identity type" prop="identityType">
      <el-radio-group v-model="ruleForm.identityType">
        <el-radio label="Citizens" />
        <el-radio label="International Students" />
        <el-radio label="Homeless" />
      </el-radio-group>
    </el-form-item>

    <el-form-item label="Reason to Canada" prop="reason">
      <el-input v-model="ruleForm.reason" type="textarea" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm">Submit</el-button>
      <el-button @click="resetForm">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";

export default {
  data(){
    return{
      formObject:null,
      size:'default',
      formSize:'default',
      loading:false,

      ruleForm:{
        studentNumber: '',
        maritalStatus: '',
        applicationTime: '',
        delivery: false,
        identityType: '',
        reason: '',
      },

      rules:{

        studentNumber: [
          { required: true, message: 'Please input studentNumber', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 5', trigger: 'blur' },
        ],
        maritalStatus: [
          {
            required: true,
            message: 'Please select maritalStatus',
            trigger: 'change',
          },
        ],

        applicationTime: [
          {
            type: 'date',
            required: true,
            message: 'Please pick a applicationTime',
            trigger: 'change',
          },
        ],

        identityType: [
          {
            required: true,
            message: 'Please select  one identityType',
            trigger: 'change',
          },
        ],

        reason: [
          { required: true, message: 'Please input reason', trigger: 'blur' },
        ],

      }
    }
  },

  mounted() {
  },

  methods:{
    submitForm() {
      this.$refs.formInstance.validate((isValid) => {
        // 到这时，validation已经完成
        // isValid指的就是验证是否通过
        // 如果不通过，invalidFields指的就是哪些不通过
        if (isValid) {
          console.log(this.ruleForm)
          //post投递到后端
          axios.post('http://localhost:8080/mcp-application', {
            ...this.ruleForm,
            studentNumber: localStorage.getItem("student_number"),
            sessionId: localStorage.getItem("session"),
          })
              .then(res => {
                alert(res.data.messages)
              })
        }
      });
    },
  }
}


</script>
