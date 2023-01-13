<template >

  <el-carousel :interval="4000" type="card" height="400px" style="margin-top: 200px">
    <el-carousel-item class="item" v-for="item in [0,1,2,3,4,5]" :key="item">
      <img style="width: 100%; height: 100%" src="http://mikutart.com/ha.jpg">
    </el-carousel-item>
  </el-carousel>
</template>

<script>
export default {
  name: "StudentMainPage"
}
</script>

<style scoped>
.item {
  box-shadow: black 0 0 16px 16px;
}
.item:hover {
  box-shadow: purple 0 0 16px 16px;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 400px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
