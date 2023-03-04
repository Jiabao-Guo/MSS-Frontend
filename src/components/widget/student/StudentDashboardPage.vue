<template>
  <el-carousel
      :interval="3000"
      height="450px"
      type="card"
  >
    <el-carousel-item v-for="url in imageUrls" :key="url">
      <img :src="url" />
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import m1 from '/src/assets/images/m1.jpg'
import m2 from '/src/assets/images/m2.jpg'
import m3 from '/src/assets/images/m3.jpg'
import m4 from '/src/assets/images/m4.jpg'
import m5 from '/src/assets/images/m5.jpg'

const imageUrls = [m1, m2, m3, m4, m5]

</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}

.el-carousel {
  border-radius: 12px;
}

.el-carousel__item {
  border-radius: 12px;
  margin: 12px;
  + .is-active, .is-in-stage {
    box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px;
  }
}
</style>
