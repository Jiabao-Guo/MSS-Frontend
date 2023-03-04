<template>
  <el-dialog
      v-model="shouldShowDialog"
      width="30%"
      title="Drop Course Confirm"
      draggable
      modal-class="drop-course-dialog"
      class="drop-course-dialog"
  >
    <div class="warning-icon">
      <el-icon>
        <WarningFilled/>
      </el-icon>
    </div>

    <p>
      You are trying to
      <span class="highlight">
        DROP {{ props.courseNumber }} {{ props.courseName }}
      </span>.
    </p>

    <p>
      Verify password for {{ props.username }} (UID: {{ props.userUid }}):
    </p>

    <el-input v-model="inputPassword" type="password" placeholder="Password"/>

    <p>
      Input <span class="highlight">Drop {{ props.courseNumber }} {{ props.courseName }}</span> below to confirm:
    </p>

    <el-input v-model="inputText"/>

    <span slot="footer">
      <div class="dialog-footer">
        <el-button @click="handleClose">Cancel</el-button>
        <el-button type="danger" @click="handleConfirm" v-loading="loading" :disabled="loading || !inputVerified()">
          Drop!
        </el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script setup>
import {computed, ref} from "vue";
import {WarningFilled} from "@element-plus/icons-vue";
import Net from "@/components/util/network";
import {sha256} from "js-sha256";
import {useDefaultConfig} from "@/components/util/global";
import {ElMessage} from "element-plus";

const props = defineProps({
  showDialog: Boolean,
  courseNumber: Number,
  courseName: String,
  username: String,
  userUid: String,
})

const emit = defineEmits(['cancel', 'confirm'])

// V-model does not work with props. Must seal the props.
const shouldShowDialog = computed({
  get() {
    return props.showDialog
  },
  set(value) {
    if (!value) {
      emit('cancel')
    }
  }
})

const loading = ref(false)
const inputText = ref('')
const inputPassword = ref('')
const config = useDefaultConfig()

function handleClose() {
  emit('cancel')
}

function inputVerified() {
  return inputText.value.toLowerCase() === `drop ${props.courseNumber} ${props.courseName}`.toLowerCase()
}

async function handleConfirm() {
  if (!inputVerified()) {
    return
  }
  loading.value = true

  let passwordSha256Sha256 = sha256(sha256(inputPassword.value))
  let response = await Net.post('/login', {
    number: props.userUid,
    password: passwordSha256Sha256,
    verifyOnly: true,
    salt: Net.saltForLogin(passwordSha256Sha256, props.userUid)
  }).catch(() => {

  }).finally(() => {
    setTimeout(() => {
      loading.value = false
      inputPassword.value = ''
    }, config.minLoadingTimeMillis)
  })

  if (!response.data.success) {
    ElMessage.error('Password incorrect.')
    return
  }

  emit('confirm')
  emit('cancel')
}
</script>

<style lang="scss">
.highlight {
  color: red;
  font-weight: bold;
}

.drop-course-dialog {
  border-radius: 12px !important;
}

.el-dialog__body {
  padding: 0 24px 24px 24px;
}

.dialog-footer {
  display: flex;
  margin-top: 24px;
  justify-content: right;
}

.warning-icon {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 24px;
  color: red;
}
</style>
