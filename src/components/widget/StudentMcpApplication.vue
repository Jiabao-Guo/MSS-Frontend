<template>
  <el-card class="card">
    <el-form
        ref="formObject"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        label-position="right"
        status-icon
    >
      <el-form-item label="Student number" prop="studentNumber" label-width="150">
        <el-input v-model="ruleForm.studentNumber"/>
      </el-form-item>
      <el-form-item label="Marital status" prop="maritalStatus" label-width="150">
        <el-select v-model="ruleForm.maritalStatus" placeholder="Marital status">
          <el-option label="Single" value="Single"/>
          <el-option label="Married" value="Married"/>
          <el-option label="Divorced" value="Divorced"/>
        </el-select>
      </el-form-item>

      <el-form-item label="Application time" required label-width="150">
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

      <el-form-item label="Delivery Card" prop="delivery" label-width="150">
        <el-switch v-model="ruleForm.delivery"/>
      </el-form-item>

      <el-form-item label="Identity type" prop="identityType" label-width="150">
        <el-radio-group v-model="ruleForm.identityType">
          <el-radio label="Citizens"/>
          <el-radio label="International Students"/>
          <el-radio label="Homeless"/>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Reason to Canada" prop="reason" label-width="150">
        <el-input v-model="ruleForm.reason" type="textarea"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm">Submit</el-button>
        <el-button @click="resetForm">Reset</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import Net from "@/components/util/network";
import {reactive, ref} from "vue";

let formSize = ref('default')

let ruleForm = reactive({
  studentNumber: '',
  maritalStatus: '',
  applicationTime: '',
  delivery: false,
  identityType: '',
  reason: '',
})

let rules = reactive({
  studentNumber: [
    {required: true, message: 'Please input studentNumber', trigger: 'blur'},
    {min: 3, max: 10, message: 'Length should be 3 to 5', trigger: 'blur'},
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

  delivery: [
    {
      type: 'boolean',
      required: true,
      message: 'Please select delivery',
      trigger: 'change',
    },
  ],

  identityType: [
    {
      required: true,
      message: 'Please select identityType',
      trigger: 'change',
    },
  ],

  reason: [
    {
      required: true,
      message: 'Please input reason',
      trigger: 'blur',
    },
  ],
})

const formObject = ref()

function submitForm() {
  formObject.value.validate((isValid) => {
    // ????????????validation????????????
    // isValid??????????????????????????????
    // ??????????????????invalidFields???????????????????????????
    if (isValid) {
      //post???????????????
      Net.post('/mcp-application', {
        ...ruleForm,
        studentNumber: localStorage.getItem("student_number"),
        sessionId: localStorage.getItem("session"),
      })
          .then(res => {
            alert(res.data.message)
          })
    }
  })
}

function resetForm() {
  formObject.value.resetFields()
}

</script>

<style scoped>
.card {
  border: 0;
  border-radius: 12px;
  box-shadow: black 0 0 !important;
}
</style>
