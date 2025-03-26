// layouts/default.vue
<template>
  <!-- <div v-if="isLogin"> -->
    <div>
      <LayoutsHeader></LayoutsHeader>

      <slot />
    </div>
  <!-- </div> -->
  <!-- <div v-else>
    <LayoutHeader />
    <div :class="isProjectList ? 'no-sideBar-content' :'main-content'">
      <LayoutBreadCrumb />
      <slot />
    </div>

    <LayoutSideBar v-if="!isProjectList" />
  </div> -->
</template>

<script lang="ts" setup>
// const router = useRoute();
// const isLogin = computed(() => router.path === '/login');
// // sideBar 不顯示在 專案列表、專案列表設定、帳號管理
// const sideBarNotShow = ['/project/project_list','/project/project_setting', '/account/account']
// const isProjectList = computed(()=> sideBarNotShow.includes(router.path))
</script>
<style>
/* .no-sideBar-content {
  margin: 116px 7% 0;
}
.main-content {
  min-height: 100vh;
  margin: 56px 0 0 212px;
  padding: 36px 36px 36px 16px;
} */


</style>
