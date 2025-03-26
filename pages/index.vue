<template>
  <div class="page-container">
    <div class="flex justify-center items-center">
      <img src="/logo/ezymeet_logo.png" alt="logo" />
    </div>
    <CustomButton :type="'primary'" class="!mr-auto !w-auto" @click="handleLogin">登入
    </CustomButton>
  </div>
  
</template>
<script setup lang="ts">
import type { Product } from '~/types/interfaces';

useHead({
  title: '首页'
})




</script>
<style scoped lang="scss">
.page-container {
  padding-top: 50px;
  // padding: 20px;
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  max-width: 60vw;
  margin: 0 auto;


  >* {
    width: 80%;
    max-width: 800px;
    margin: 0 auto;
  }
}


</style>