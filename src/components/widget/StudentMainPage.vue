<template>
  <el-carousel
      :interval="500"
      height="450px"
      indicator-position="none"
      :direction="direction1"
      arrow="never"
      :pause-on-hover="false"
  >
    <el-carousel-item v-for="i in [0,1]" :key="i">
      <img :src="getImageSource(i)"/>
    </el-carousel-item>
  </el-carousel>

  <el-carousel
      :interval="500"
      height="450px"
      indicator-position="none"
      :direction="direction2"
      arrow="never"
      :pause-on-hover="false"
  >
    <el-carousel-item v-for="i in [0,1]" :key="i">
      <img :src="getImageSource(i)"/>
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import Net from "@/components/util/network";

let direction1 = ref('horizontal')
let direction2 = ref('horizontal')
let intervalHandle = ref(null)

function getImageSource(index) {
  return index % 2 === 0
    ? 'https://mikutart.com/ha.jpg'
    : 'https://mikutart.com/9.jpg'
}

onMounted(() => {
  Net.init()
  intervalHandle.value = setInterval(() => {
    direction1.value = ['horizontal', 'vertical'][Math.random() > 0.5 ? 0 : 1]
    direction2.value = ['horizontal', 'vertical'][Math.random() > 0.5 ? 0 : 1]
  }, 500)
})

onUnmounted(() => {
  clearInterval(intervalHandle.value)
})

</script>

<style scoped>
img {
  width: 100%;
  height: 100%;
}

.el-carousel {
  border-radius: 12px;
}
</style>
