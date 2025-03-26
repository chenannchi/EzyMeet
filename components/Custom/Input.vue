<template>
  <el-input v-model="enteredWords" size="large" placeholder="請輸入" />
</template>
<script setup lang="ts">
const enteredWords = ref<string>('');
</script>
<style scoped lang="scss">
</style>