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
                  class="input-frame" v-model="username"
                  :placeholder="isStudentLogin ? 'Student Number' : 'Instructor Number'"
              ></el-input>
            </el-col>

            <el-col>
              <el-input
                  @keydown.enter="onLogin"
                  class="input-frame" v-model="password" placeholder="Password"></el-input>
            </el-col>
          </el-row>
        </p>

        <div style="margin: 2px 6px; color: gray; ">
          <el-radio-group v-model="isStudentLogin">
            <el-radio :label="true">Student</el-radio>
            <el-radio :label="false">Instructor</el-radio>
          </el-radio-group>
        </div>

        <p>
          <el-button
              size="large" type="success" class="login"
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
  Moon
} from '@element-plus/icons-vue'
import {ElMessage} from "element-plus"
import {sha256} from "js-sha256"
import Net from "@/components/util/network"
import {onMounted, ref} from "vue"
import {useDefaultConfig, useInitForDarkMode, useToggleDarkMode} from "@/components/util/global"
import {useRouter} from "vue-router";

const router = useRouter()

const username = ref('')
const password = ref('')
const isStudentLogin = ref(true)
const loading = ref(false)
const config = useDefaultConfig()

function mounted() {
  useInitForDarkMode()()
}

function onLogin() {
  loading.value = true
  Net.post('/login', {
    /**
     * ??????loginEntity ??????????????????????????????
     * */
    number: username.value,
    passwordSha256: sha256(password.value),
    isStudentLogin: isStudentLogin.value
  }).then(res => {

    /** ?????????????????????????????? ???????????? res.data ????????? response??????*/
    let response = res.data

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

    /**  ??????response.sessionId ????????????????????????(??????)
     *   ????????????
     */
    localStorage.setItem("session", response.sessionId)
    localStorage.setItem("student_number", username.value)


    setTimeout(() => {
      Net.init()
    }, config.minLoadingTimeMillis / 2)

    setTimeout(() => {
      router.push('/home')
    }, config.minLoadingTimeMillis)

  }).finally(() => {
    setTimeout(() => {
      loading.value = false
    }, config.minLoadingTimeMillis);
  })
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
