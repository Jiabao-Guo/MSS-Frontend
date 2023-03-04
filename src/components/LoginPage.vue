<template>
  <div>
    <div class="bg">
      <div class="mask"></div>
      <div class="title">Memorial Self-service</div>
    </div>

    <el-container class="right" v-loading="loading">
      <div class="contents">
        <div class="right-title-dimmed">MEMORIAL</div>
        <div class="right-title">Self-service</div>

        <p>
          <el-row>
            <el-col>
              <el-input
                  @keydown.enter="onLogin"
                  class="input-frame" v-model="uid"
                  placeholder="Account UID"
              ></el-input>
            </el-col>

            <el-col>
              <el-input
                  @keydown.enter="onLogin"
                  class="input-frame" v-model="password" placeholder="Password"></el-input>
            </el-col>
          </el-row>
        </p>

        <p>
          <el-button
              size="large" type="success" class="login"
              :disabled="!uid || !password"
              @click="onLogin"
          >
            Login
          </el-button>
        </p>
        <p>
          <el-link>Forgot password?</el-link>
        </p>
      </div>

      <el-button class="button-toggle-dark" @click="useToggleDarkMode()()">
        <el-icon>
          <Moon/>
        </el-icon>
      </el-button>
    </el-container>
  </div>
</template>

<script setup>
import {
  Moon,
} from '@element-plus/icons-vue'
import {ElMessage, ElMessageBox} from "element-plus"
import {sha256} from "js-sha256"
import Net from "@/components/util/network"
import {onMounted, ref} from "vue"
import {
  useDefaultConfig,
  useDefaultElMessageBoxConfig,
  useInitForDarkMode,
  useToggleDarkMode,
  useTokenExpiry
} from "@/components/util/global"
import {useRouter} from "vue-router";
import isDebug from "@/components/config";
import {removeLocalStorageAsync, saveToLocalStorageAsync, StorageKey} from "@/components/util/storage";
import {useLocalStorage} from "@vueuse/core";

const router = useRouter()

const uid = ref('')
const password = ref('')
const loading = ref(false)
const config = useDefaultConfig()
const defaultElConfig = useDefaultElMessageBoxConfig()

function mounted() {
  useInitForDarkMode()()


  // TODO: remove this
  if (!isDebug()) {
    ElMessageBox.alert(
        '服务器在多伦多 国内访问很可能很慢 正在迁移和解决国内要求备案问题<br><br>' +
        'Admin Username: <span style="font-weight: bold; color: deepskyblue">1</span><br>' +
        'Admin Password: <span style="font-weight: bold; color: deepskyblue">123</span><br>' +
        'Method: Student Login', 'Preview Build', {
          confirmButtonText: 'OK',
          type: 'info',
          dangerouslyUseHTMLString: true,
          ...defaultElConfig,
        })
  }
}

async function onLogin() {
  loading.value = true
  let passwordSha256Sha256 = sha256(sha256(password.value))
  await removeLocalStorageAsync(StorageKey.token)

  let response = await Net.post('/login', {
    number: uid.value,
    password: passwordSha256Sha256,
    verifyOnly: false,
    salt: Net.saltForLogin(passwordSha256Sha256, uid.value)
  }).catch(err => {
    console.error(err)
    ElMessage({
      message: 'Network error or server down',
      type: 'error'
    })
  }).finally(() => {
    setTimeout(() => {
      loading.value = false
    }, config.minLoadingTimeMillis);
  })

  response = response.data
  if (!response.success) {
    ElMessage({
      message: response.message,
      type: 'error'
    })
    return
  }
  ElMessage({
    message: response.message,
    type: 'success'
  })

  const roles = response.roles.join(',')

  await saveToLocalStorageAsync(StorageKey.uid, uid.value.toString())
  await saveToLocalStorageAsync(StorageKey.session_expires_at, response.expiresAt.toString())
  await saveToLocalStorageAsync(StorageKey.token, response.token)
  await saveToLocalStorageAsync(StorageKey.roles, roles === '' ? 'Guest' : roles)
  await saveToLocalStorageAsync(StorageKey.privileged, response.privileged.toString())

  Net.init()

  await router.push('/home')
}

onMounted(mounted)

</script>

<style lang="scss" scoped>
@import "src/assets/main";

.bg {
  background: url("@/assets/images/mun.jpg");
  background-size: cover;
  position: absolute;
  width: calc(100% - 500px);
  height: 100%;
  left: 0;
  top: 0;
}

.mask {
  background: black;
  opacity: 0.3;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 0;

  transition: opacity 1s;
}

.mask:hover {
  transition-delay: 0.5s;
  opacity: 0;
}

.title {
  color: white;
  position: absolute;
  text-align: center;
  left: 50%;
  transform: translateX(-50%);
  bottom: 60px;
  font-size: 20px;
  z-index: 10;
}

@keyframes shadow {
  from {
    box-shadow: greenyellow 0 0 240px;
  }
  to {
    box-shadow: darkred 0 0 240px;
  }
}

.right {
  height: 100%;
  width: 500px;
  right: 0;
  top: 0;
  z-index: 1;
  position: absolute;
  transition: box-shadow 0.5s;
  margin: 0;
}

.right:hover {
  box-shadow: black 0 0 24px;
}

.contents {
  color: rgb(232, 232, 232);
  background: transparent;
  position: absolute;
  text-align: center;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}

.right-title-dimmed {
  font-size: 36px;
  color: $color-dark;
}

.right-title {
  font-size: 24px;
  font-weight: bold;
  color: $color-dark;
}

.dark .right-title {
  color: $color-bright;
}

.dark .right-title-dimmed {
  color: $color-bright;
}


.input-frame {
  width: 40%;
  margin-top: 4px;
}

.login {
  width: 220px;
  cursor: pointer;
  font-weight: bold;
}

.button-toggle-dark {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 10;
}

</style>
