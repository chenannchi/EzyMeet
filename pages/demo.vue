<template>
  <div class="item">
    <CustomSelect v-model="selectValue" :items="items" />
  </div>
  <div class="item">
    
  </div>
  
</template>
<script setup lang="ts">
const items = [
  { id: 10, label: '10' },
  { id: 20, label: '20' },
  { id: 50, label: '50' },
  { id: 100, label: '100' },
];

const selectValue = ref(10);
</script>
<style lang="scss" scoped>
.item{
  max-width: 400px;
  width: 40%;
}
</style>