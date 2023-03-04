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
            prop="course.user.name"
            label="Taught By"
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

  <DropCourseDialog
      v-model:show-dialog="showDropDialog"
      :courseNumber="dropCourseNumber"
      :courseName="dropCourseName"
      :user-uid="userUid"
      :username="username"
      @cancel="handleCancel"
      @confirm="handleDropConfirm"
  />
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import GenericTable from "@/components/generic/GenericTable.vue";
import Net from "@/components/util/network";
import {ElMessage, ElMessageBox} from "element-plus";
import DropCourseDialog from "@/components/dialog/DropCourseDialog.vue";
import {useDefaultElMessageBoxConfig} from "@/components/util/global";
import {StorageKey} from "@/components/util/storage";
import {useLocalStorage} from "@vueuse/core";

const defaultElConfig = useDefaultElMessageBoxConfig()

const selection = ref([])
const myCourses = ref([])

const showDropDialog = ref(false)
const dropCourseNumber = ref(0)
const dropCourseName = ref('')
const username = ref(localStorage.getItem(StorageKey.username))
const userUid = useLocalStorage(StorageKey.uid, '0')

const columns = reactive([
  {
    prop: 'courseNumber',
    label: 'Course Number',
    dataType: 'number',
    asInsert: false,
    asFilter: true,
    modifiable: false,
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
    asInsert: false,
    asFilter: true,
    modifiable: false,
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
    prop: 'major.name',
    label: 'Major / Department',
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
        'major.name': '',
      },
    },
    alias: {
      'major.name': 'majorName'
    }
  },
  {
    prop: 'user.name',
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
        'user.name': '',
      },
    },
    alias: {
      'user.name': 'taughtBy'
    }
  },
  {
    prop: 'user.uid',
    label: 'Instructor UID',
    dataType: 'string',
    width: '',
    asInsert: false,
    asFilter: false,
    modifiable: false,
    createForm: {},
    filterForm: {},
    alias: {
      'user.uid': 'userId'
    }
  },
])


function handleSelectionUpdated(s) {
  selection.value = s
}

async function reloadMyCourses() {
  let response = await Net.get('/course-registration')
  myCourses.value = response.data || []
}

async function handleRegister() {
  let action = await ElMessageBox.confirm(
      'Are you sure to register these courses?', 'Confirm', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning',
        ...defaultElConfig
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

function handleDrop(row) {
  dropCourseNumber.value = row.course.courseNumber
  dropCourseName.value = row.course.name
  showDropDialog.value = true
}

async function handleDropConfirm() {
  let registry = myCourses.value.find(it => it.course.courseNumber === dropCourseNumber.value)
  if (!registry) {
    return
  }
  let span = '<span style="color: red; font-weight: bold">'
  let spanEnd = '</span>'
  let action = await ElMessageBox.confirm(
      `Are you sure to ${span}DROP ${registry.course.name} (${dropCourseNumber.value})${spanEnd}?`,
      'Confirm', {
        title: 'Final Confirm',
        confirmButtonText: `Drop ${registry.course.name} (${dropCourseNumber.value})`,
        showCancelButton: false,
        dangerouslyUseHTMLString: true,
        type: 'warning',
        ...defaultElConfig
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

function handleCancel() {
  showDropDialog.value = false
}

onMounted(reloadMyCourses)


</script>

<style scoped>

</style>
