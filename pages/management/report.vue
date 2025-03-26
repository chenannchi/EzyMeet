<template>
  <div class="report-container">
    <div class="statistic-card">
      <el-statistic :value="outputValue1">
        <template #title>
          <div style="display: inline-flex; align-items: center">訂單數量</div>
        </template>
      </el-statistic>
    </div>
    <div class="statistic-card">
      <el-statistic :value="outputValue2">
        <template #title>
          <div style="display: inline-flex; align-items: center">銷售總額</div>
        </template>
      </el-statistic>
    </div>
    <div class="statistic-card">
      <el-statistic :value="outputValue4">
        <template #title>
          <div style="display: inline-flex; align-items: center">購買顧客人數</div>
        </template>
      </el-statistic>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { useTransition } from '@vueuse/core';
import User from './user.vue';

definePageMeta({
  layout: 'management',
});
useHead({
  title: '銷售報告',
  meta: [
    {
      name: 'description',
      content: 'Report',
    },
  ],
});

const userStore = useUserStore();
const user = computed(() => userStore.user);



const outputValue1 = ref(0)
const outputValue2 = ref(0)
const outputValue4 = ref(0)


async function fetchReport() {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/management/report/${user.value?.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    outputValue1.value = res.data.orderCount;
    outputValue2.value = res.data.totalAmount;
    outputValue4.value = res.data.customerCount;

  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

onMounted(() => {
  userStore.loadUserFromLocalStorage();
  fetchReport();
});
</script>

<style scoped lang="scss">
:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.report-container {
  padding: 20px;
  // min-height: 100vh;

  width: 100%;
  // margin: auto;
  display: flex;
  // flex-wrap: wrap;
  // justify-content: center;
  // align-items: center;
  background-color: $secondary;

}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  // height: 100%;
  padding: 20px;
  border-radius: 4px;
  background-color: $primary;
  border: 1px solid $secondary;
  width: 200px;
  height: 100px;

  :deep(.el-statistic__head > div) {
    color: white;
  }

  :deep(.el-statistic__content) {
    color: white;
  }
}
</style>
