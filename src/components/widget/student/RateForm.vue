<template>
  <el-card class="card">
    <div>
      <el-radio-group v-model="size" label="size control">
        <el-radio-button label="large">large</el-radio-button>
        <el-radio-button label="default">default</el-radio-button>
        <el-radio-button label="small">small</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="labelPosition" label="position control">
        <el-radio-button label="left">Left</el-radio-button>
        <el-radio-button label="right">Right</el-radio-button>
        <el-radio-button label="top">Top</el-radio-button>
      </el-radio-group>
    </div>
    <br/>

    <el-form
        ref="formObject"
        :model="form"
        :label-position="labelPosition"
        :size="size"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
    >
      <el-form-item label="Instructor Name" prop="instructorNumber">
        <el-select
            filterable
            v-model="form.instructorUid"
            remote
            remote-show-suffix
            :remote-method="remoteMethod"
            :loading="loading">
          <el-option
              v-for="item in instructors"
              :key="item.uid"
              :label="`${item.name} (${item.uid})`"
              :value="item.uid"
          >
            <!-- key是vue要的东西，它只是想要个不一样的值，具体给什么它不关心 -->
            <!-- 这里item.instructorNumber，作为教授的工号，它恰好是个每人都不一样的值 -->

            <!-- the content that shown to the users (display on screen) -->

            <!-- When user select one from the dropdown list,
             what actual value should be stored -->
            <!-- The ":value" corresponds to "v-model" at line 29 -->

          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label=" zone">
        <el-select
            v-model="form.region"
            placeholder="please select your zone"
        >
          <el-option label="Zone one" value="shanghai"/>
          <el-option label="Zone two" value="beijing"/>
        </el-select>
      </el-form-item>

      <el-form-item label="Lecture start date" prop="lectureStartDate">
        <el-col :span="11">
          <el-date-picker
              v-model="form.lectureStartDate"
              type="date"
              label="Pick a date"
              placeholder="Pick a date"
              style="width: 100%"
          />
        </el-col>
        <el-col class="text-center" :span="1" style="margin: 0 0.5rem">-</el-col>
      </el-form-item>

      <el-form-item label="Lecture end date" prop="lectureEndDate">
        <el-col :span="11">
          <el-date-picker
              v-model="form.lectureEndDate"
              type="date"
              label="Pick a date"
              placeholder="Pick a date"
              style="width: 100%"
          />
        </el-col>
      </el-form-item>

      <el-form-item label="Course type">
        <el-checkbox-group v-model="form.courseType">
          <el-checkbox-button label="Online course" name="type"/>
          <el-checkbox-button label="Offline course" name="type"/>
          <el-checkbox-button label="With lab" name="type"/>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio border label="Sponsor"/>
          <el-radio border label="Venue"/>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="Are lesson plans and lesson schedule well prepared?">
        <el-rate
            v-model="form.satisfaction"
            :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
            show-text
            clearable
            allow-half
        />
      </el-form-item>


      <el-form-item label="Please evaluate your teacher Sincerely">
        <el-input v-model="form.evaluation" type="textarea"/>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import Net from "@/components/util/network";
import {reactive, ref} from "vue";

const formObject = ref()

const size = ref('default')
const labelPosition = ref('top')
const loading = ref(false)
const instructors = ref([])

const form = reactive({
  instructorUid: '',
  region: '',
  lectureStartDate: '',
  lectureEndDate: '',
  courseType: [],
  resource: '',
  evaluation: '',
  satisfaction: 5
})

const rules = reactive({
  instructorUid: [
    {required: true, message: 'Please enter instructor name.'},
  ],
  lectureStartDate: [
    {required: true, message: 'please choose start time.'}
  ],
  lectureEndDate: [
    {required: true, message: 'please choose end time.'}
  ]

})

function onSubmit() {
  formObject.value.validate((isValid) => {
    if (isValid) {
      Net.post('/professor-evaluation', form)
          .then(res => {
            alert(res.data.message)
          })
    }
  });
}

function remoteMethod(inputName) {
  if (!inputName) {
    return
  }
  loading.value = true

  Net.get('/instructor/by-name/' + inputName)
      .then(res => {
        loading.value = false
        instructors.value = res.data
      })
}
</script>

<style scoped>
.card {
  border: 0;
  border-radius: 12px;
  box-shadow: black 0 0 !important;
}
</style>
