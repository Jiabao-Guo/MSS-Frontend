<template>
  <div>
    <div class="bg">
      <div class="mask"></div>
      <div class="title">Memorial Self-Service</div>
    </div>

    <div class="right">
      <div class="contents">
        <div class="righttitle">Course Registration System</div>
        <br>
        <input class="inputframe" v-model="username" placeholder="Username">
        <br>
        <input class="inputframe" v-model="password" placeholder="Password">
        <br>
        <div style="margin: 2px 6px; color: gray; ">
          <input type="radio" name="role" :value="true" v-model="isStudentLogin">
          <label for="student">Student</label>
          <input type="radio" name="role" :value="false" v-model="isStudentLogin">
          <label for="staff">Teacher</label>
        </div>
        <br>
        <button class="login" @click="onLogin">Login</button>
        <br>
        <button class="forgetpassword">Forget password?</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {ElMessage} from "element-plus";

export default {
  data() {
    return {
      username: '',
      password: '',
      isStudentLogin: true
    }
  },
  mounted() {

  },
  methods: {
    onLogin() {
      axios.post('http://localhost:8080/login', {

        /**
         * 后端loginEntity 根据以下三个属性编写
         * */
        number_123: this.username,
        password: this.password,
        isStudentLogin: this.isStudentLogin
      }).then(res => {

        /** 将前端方法返回的结果 全部存入 res.data 并且用 response接收*/
        let response = res.data

        if (!response.isSuccess) {
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

        /**  用过response.sessionId 拿到后端设置的值(手环)
         *   二次加密
         */
        localStorage.setItem("session", response.sessionId)
        localStorage.setItem("student_number", this.username)

        this.$router.push('/mainpage')

      })
    }
  }
}

</script>



<style scoped>
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
  opacity: 0.5;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 0;
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
  background: black;
  height: 100%;
  width: 500px;
  right: 0;
  top: 0;
  z-index: 1;
  position: absolute;
  box-shadow: greenyellow 0 0 240px;
  transition: box-shadow 2s;
  margin: 0;
}

.right:hover {
  box-shadow: purple 0 0 240px 99px;
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

.righttitle {
  font-size: 24px;
  font-weight: bold;
}

.inputframe {
  opacity: 0.5;
  text-align: center;
}

.login {
  background: dodgerblue;
  transition: background 1s;
}

.login:hover {
  background: pink;
}

.forgetpassword {
  background: transparent;
  transition: background 1s;
  width: 160px !important;
}

.forgetpassword:hover {
  background: palegreen;
}

button {
  border: 0;
  border-radius: 8px;
  padding: 10px;

  font-weight: bold;
  margin: 4px;

  width: 240px;

  cursor: pointer;

  color: rgb(232, 232, 232);
}

input {
  border-radius: 8px;
  padding: 6px 2px;

  font-size: 18px;

}


</style>
