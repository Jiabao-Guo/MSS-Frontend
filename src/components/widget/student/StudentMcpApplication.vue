<template>
  <el-card class="card">
    <el-form
        ref="formObject"
        :model="form"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        label-position="right"
        status-icon
    >
      <el-form-item label="UID" prop="uid" label-width="150">
        <el-input v-model="form.uid" disabled/>
      </el-form-item>

      <el-form-item label="Marital status" prop="maritalStatus" label-width="150">
        <el-select v-model="form.maritalStatus" placeholder="Marital status">
          <el-option label="Single" value="Single"/>
          <el-option label="Married" value="Married"/>
          <el-option label="Divorced" value="Divorced"/>
        </el-select>
      </el-form-item>

      <el-form-item label="Application time" required label-width="150">
        <el-col :span="11">
          <el-form-item prop="applicationTime">
            <el-date-picker
                v-model="form.applicationTime"
                type="date"
                label="Pick a date"
                placeholder="Pick a date"
                style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="Delivery Card" prop="delivery" label-width="150">
        <el-switch v-model="form.delivery"/>
      </el-form-item>

      <el-form-item label="Identity type" prop="identityType" label-width="150">
        <el-radio-group v-model="form.identityType">
          <el-radio label="Citizens"/>
          <el-radio label="International Students"/>
          <el-radio label="Homeless"/>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Reason to Canada" prop="reason" label-width="150">
        <el-input v-model="form.reason" type="textarea"/>
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
import {useLocalStorage} from "@vueuse/core";
import {StorageKey} from "@/components/util/storage";

let formSize = ref('default')

let form = reactive({
  uid: useLocalStorage(StorageKey.uid, '0').value,
  maritalStatus: '',
  applicationTime: '',
  delivery: false,
  identityType: '',
  reason: '',
})

let rules = reactive({
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
    // 到这时，validation已经完成
    // isValid指的就是验证是否通过
    // 如果不通过，invalidFields指的就是哪些不通过
    if (isValid) {
      //post投递到后端
      Net.post('/mcp-application', form)
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
