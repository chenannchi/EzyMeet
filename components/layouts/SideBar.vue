<template>
  <div class="sidebar-container">
    <template v-if="user">

      <el-menu class="el-menu-vertical-demo" @click="handleSelect('/management/product')" v-if="user.role == 1"> 商品管理 </el-menu>
      <el-menu class="el-menu-vertical-demo" @click="handleSelect('/management/order')" v-if="user.role == 1"> 訂單管理 </el-menu>
      <el-menu class="el-menu-vertical-demo" @click="handleSelect('/management/user')" v-if="user.role == 0"> 用戶管理 </el-menu>
      <!-- <el-menu class="el-menu-vertical-demo" @click="handleSelect('/management/promotion')"> 促銷管理 </el-menu> -->
      <el-menu class="el-menu-vertical-demo" @click="handleSelect('/management/report')" v-if="user.role == 1"> 銷售報告 </el-menu>
    </template>
  </div>
</template>
<script lang="ts" setup>
const handleSelect = (index: string) => {
  useRouter().push(index)
}

const userStore = useUserStore();
const user = computed(() => userStore.user);
</script>
<style scoped lang="scss">
.sidebar-container {
  padding: 20px;
  min-height: 100vh;
  width: 20%;
  max-width: 250px;
  min-height: 100vh;
  border-right: 1px solid #dcdfe6;

  :deep(ul){
    // background-color: $primary;
    border-right: none;
    color: $primary;
  }

  >div{
    height: 100vh;
  }

  .el-menu:hover{
    cursor: pointer;
  }
}
</style>