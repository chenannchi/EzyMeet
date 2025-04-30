// layouts/default.vue
<template>

  <div class="main-content">
    <LayoutsHeader></LayoutsHeader>

    <slot />
  </div>

</template>

<script lang="ts" setup>

</script>
<style>
.main-content {
  min-height:calc(100vh - 60px);
  /* margin: 56px 0 0 212px; */
  /* padding: 36px 36px 36px 16px; */
}
</style>
