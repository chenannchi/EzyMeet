<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
    @select="handleSelect">
    <el-menu-item index="0" @click="useRouter().push({ path: '/management/report'  })">
      <div>Giftopia</div>
    </el-menu-item>

    <el-menu-item index="1" @click="logoutDialogVisible=true">登出</el-menu-item>
  </el-menu>
  <el-dialog v-model="logoutDialogVisible" :before-close="handleCloseLogoutDialog">
    <div class="title">確認登出?</div>
    <template #footer>
      <el-button type="primary" @click="handleLogout">
        登出
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {Search} from '@element-plus/icons-vue';

// const userStore = useUserStore();

const activeIndex = ref('1')
const handleSelect = (index: string) => {
  activeIndex.value = index
}


const logoutDialogVisible = ref(false);

const searchKeyword = ref('');

const handleCloseLogoutDialog = () => {
  logoutDialogVisible.value = false;
};

const handleLogout = () => {
  logoutDialogVisible.value = false;
  // userStore.clearUser();
  // console.log('userStore.user', userStore.user);
  useRouter().push({ path: '/management' });
};

</script>

<style lang="scss" scoped>
.el-menu-item div {
  font-family: "Fraunces", serif;
  color: #9b2f62;
  font-size: 24px;
  font-weight: 800;
}

.el-input{
  height: 50%;
  width: 200px;
  margin: auto 30px;
}

.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>