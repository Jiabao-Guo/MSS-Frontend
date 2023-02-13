<template>
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
  <br />

  <el-form
      ref="formInstance"
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
        v-model = "form.instructorNumber"
        remote
        remote-show-suffix
        :remote-method = "remoteMethod"
        :loading = "loading">
        <el-option
            v-for="item in instructors"
            :key = "item.instructorNumber"
            :label = "`${item.name} (${item.instructorNumber})`"
            :value = "item.instructorNumber"
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
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
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
        <el-checkbox-button label="Online course" name="type" />
        <el-checkbox-button label="Offline course" name="type" />
        <el-checkbox-button label="With lab" name="type" />
      </el-checkbox-group>
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio border label="Sponsor" />
        <el-radio border label="Venue" />
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
      <el-input v-model="form.evaluation" type="textarea" />
    </el-form-item>


    <el-form-item>
      <el-button type="primary" @click="onSubmit">Submit</el-button>
      <el-button>Cancel</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Net from "@/components/util/network";

export default {
  data() {
    return {
      formObject: null,
      size: 'default',
      formSize: 'default',
      labelPosition: 'top',
      loading: false,
      instructors: [],

      // 待提交的表单
      form: {
        instructorNumber: '',
        region: '',
        lectureStartDate: '',
        lectureEndDate: '',
        courseType: [],
        resource: '',
        evaluation: '',
        satisfaction: 5
      },

      rules: {
        instructorNumber: [
          { required: true, message: 'Please enter instructor name.' },
//          { min: 3, max: 10, message: "Length should be in 3 ~ 10" }
        ],
        lectureStartDate: [
          { required:true, message:'please choose start time.' }
        ],
        lectureEndDate: [
          { required:true, message:'please choose end time.' }
        ]

      }




    }
  },
  mounted() {
  },
  methods: {
    onSubmit() {
      this.$refs.formInstance.validate((isValid) => {
        // 到这时，validation已经完成
        // isValid指的就是验证是否通过
        // 如果不通过，invalidFields指的就是哪些不通过
        if (isValid) {
          console.log(this.form)
          //post投递到后端
          Net.post('/professor-evaluation', {
            ...this.form,
            studentNumber: localStorage.getItem("student_number"),
            sessionId: localStorage.getItem("session"),
          })
              .then(res => {
                alert(res.data.message)
              })
        }
      });
    },

    // 每当用户输入，这个方法就被调用，
    // 其中inputName是用户刚刚输入的内容，
    // 代表着名字教授的的一部分
    remoteMethod(inputName) {
      // 如果输入是空的， 那就不搜索
      if(!inputName){
        return
      }

      // 要开始搜索了，loading=true
      this.loading = true

      // 正式进行搜索，也就是进行网络请求
      // 把用户输入的内容，传给后端的InstructorController
      Net.get('/instructor/by-name/'+inputName,)
          .then(res => {
            // 执行到then里面的内容的时候，说明服务器给了回应了
            // 其中res就包含着回应的内容
            // 在这个函数中，res包含着刚刚搜到的教授们的信息

            // 既然搜到了，loading=false
            this.loading = false

           // 搜索结果立刻存入this.instructors
           this.instructors = res.data
      })




    }
  }
}

</script>
