<template>
  <GenericTable
      model="course"
      noun="Course"
      model-key="id"
      :columns="columns"
      view-only
      disable-pagination-control
      @selection-updated="handleSelectionUpdated"
  >
    <template #header>
      <h3>My Courses</h3>
      <el-table
          :data="myCourses"
      >
        <template #empty>
          You have not registered any courses yet.
        </template>

        <el-table-column
            prop="course.courseNumber"
            label="Course Number"
        />
        <el-table-column
            prop="course.name"
            label="Name"
        />
        <el-table-column
            prop="courseRegistrationTime"
            label="Registered At"
        >
          <template #default="{row}">
            {{ new Date(row.courseRegistrationTime).toLocaleString() }}
          </template>
        </el-table-column>
        <el-table-column
            label="Operation"
        >
          <template #default="{row}">
            <el-button
                @click="handleDrop(row)"
                type="danger" size="small">
              Drop
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>

    <template #management>
      <el-divider direction="horizontal"/>

      <el-button
          @click="handleRegister"
          type="primary" v-if="selection.length > 0"
      >
        Register {{ selection.length }} Course(s)
      </el-button>
    </template>
  </GenericTable>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import GenericTable from "@/components/generic/GenericTable.vue";
import Net from "@/components/util/network";
import {ElMessage, ElMessageBox} from "element-plus";

const selection = ref([])
const myCourses = ref([])

const columns = reactive([
  {
    prop: 'courseNumber',
    label: 'Course Number',
    dataType: 'number',
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        courseNumber: ''
      }
    }
  },
  {
    prop: 'name',
    label: 'Name',
    dataType: 'string',
    width: '',
    asInsert: true,
    asFilter: true,
    modifiable: true,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        name: ''
      },
    },
  },
  {
    prop: 'instructorByInstructorNumber.name',
    label: 'Taught By',
    dataType: 'string',
    width: '',
    asInsert: false,
    asFilter: true,
    modifiable: false,
    createForm: {
      rules: []
    },
    filterForm: {
      defaultValues: {
        'instructorByInstructorNumber.name': '',
      },
    },
    alias: {
      'instructorByInstructorNumber.name': 'instructorName'
    }
  },
  {
    prop: 'instructorByInstructorNumber.instructorNumber',
    label: 'Instructor Number',
    dataType: 'string',
    width: '',
    asInsert: true,
    asFilter: false,
    modifiable: true,
    createForm: {},
    filterForm: {},
    alias: {
      'instructorByInstructorNumber.instructorNumber': 'instructorNumber'
    }
  },
])


function handleSelectionUpdated(s) {
  selection.value = s
}

async function reloadMyCourses() {
  let id = localStorage.getItem('student_id')
  let response = await Net.get(`/student/${id}/course-registration`)
  myCourses.value = response.data || []
}

async function handleRegister() {
  let action = await ElMessageBox.confirm(
      'Are you sure to register these courses?', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).catch(() => {
  })

  if (!action) {
    return
  }

  let response = await Net.post('/course-registration', {
    studentNumber: localStorage.getItem('student_number'),
    courseNumbers: selection.value.map(it => it.courseNumber)
  })
  ElMessage({
    message: response.data.message,
    type: response.data.success ? 'success' : 'error'
  })
  await reloadMyCourses()
}

async function handleDrop(row) {
  let registry = myCourses.value.find(it => it.courseNumber === row.courseNumber)
  if (!registry) {
    return
  }
  let span = '<span style="color: red; font-weight: bold">'
  let spanEnd = '</span>'
  let action = await ElMessageBox.confirm(
      `Are you sure to ${span}DROP ${registry.course.name} (${row.courseNumber})${spanEnd}?`,
      'Confirm', {
        confirmButtonText: `Drop ${registry.course.name} (${row.courseNumber})`,
        showCancelButton: false,
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).catch(() => {
  })

  if (!action) {
    return
  }

  let response = await Net.delete(`/course-registration/${registry.id}`)
  ElMessage({
    message: response.data.message,
    type: response.data.success ? 'success' : 'error'
  })
  await reloadMyCourses()
}

onMounted(reloadMyCourses)


</script>

<style scoped>

</style>
