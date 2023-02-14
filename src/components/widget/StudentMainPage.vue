<template>
  <el-carousel :interval="4000" type="card" height="300px">
    <el-carousel-item v-for="i in [0,1,2,3,4,5]" :key="i">
      <img :src="getImageSource(i)">
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
function getImageSource(index) {
  return index % 2 === 0
    ? 'http://mikutart.com/ha.jpg'
    : 'http://mikutart.com/9.jpg'
}
</script>

<style scoped>
img {
  border-radius: 12px;
  width: 100%;
  height: 100%;
}
</style>
