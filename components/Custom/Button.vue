<template>
  <el-button :type="type" :link="link" @click="emit('click')">
    <slot></slot>
  </el-button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { defineEmits } from 'vue';

const emit = defineEmits(['click']);

function handleClick() {
  emit('click');
}

const props = defineProps<{
  type: '' | 'text' | 'default' | 'success' | 'warning' | 'info' | 'primary' | 'danger';
  link?: boolean;
}>();

</script>

<style scoped>
.el-button {
  margin: 0 !important;

}


</style>