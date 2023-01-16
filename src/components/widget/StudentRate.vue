<template>
  <el-rate
      v-model="value"
      :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
      show-text

      clearable

      allow-half


  />
</template>

<script lang="ts" setup>



import { ref } from 'vue'

const value = ref()




</script>

<style scoped>

</style>
