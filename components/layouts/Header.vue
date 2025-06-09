<template>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
    @select="handleSelectMenu">
    <el-menu-item index="0" @click="useRouter().push({ path: '/'  })">
      <div >EzyMeet</div>
    </el-menu-item>
    <!-- <el-menu-item index="1" @click="useRouter().push({ path: '/product/product_list' })">所有產品</el-menu-item>
    <el-menu-item index="2" @click="useRouter().push({ path: '/order/history' })">訂單查詢</el-menu-item> -->
    <!-- <el-menu-item index="3" @click="useRouter().push({ path: '/member_center' })">會員中心</el-menu-item> -->
    <!-- <el-menu-item index="4" @click="useRouter().push({ path: '/order/cart' })">購物車</el-menu-item> -->
    <!-- <el-menu-item v-if="!user" index="5" @click="loginDialogStore.showLoginDialog">登入/註冊</el-menu-item> -->
    <el-menu-item v-if="user">
      <button @click="show = !show"><el-icon><BellFilled /></el-icon></button>
      <CustomNotificationList v-if="show" @closeNotification="handleCloseNotification" />
    </el-menu-item>
    <el-menu-item v-if="user" index="5" @click="logoutDialogVisible = true">登出</el-menu-item>
  </el-menu>
  <el-dialog v-model="loginDialogStore.loginDialogVisible" :before-close="handleCloseLoginDialog">
    <div class="title">登入</div>
    <el-form ref="loginRuleFormRef" style="max-width: 600px" :model="loginRuleForm" :rules="rules" label-width="auto"
      class="demo-loginRuleForm" status-icon>
      <el-form-item label="帳號" prop="account">
        <el-input v-model="loginRuleForm.account" placeholder="請輸入使用者名稱" />
      </el-form-item>
      <el-form-item label="密碼" prop="pwd">
        <el-input v-model="loginRuleForm.pwd" placeholder="請輸入密碼" show-password />
      </el-form-item>
    </el-form>
    <template #footer>

      <el-button type="primary" @click="handleLogin">
        登入
      </el-button>
      <el-divider direction="horizontal"></el-divider>
      <el-button type="info" @click="openRegisterDialog">
        註冊
      </el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="registerDialogVisible" :before-close="handleCloseRegisterDialog">
    <div class="title">註冊</div>
    <el-form ref="registerRuleFormRef" style="max-width: 600px" :model="registerRuleForm" :rules="registerRules"
      label-width="auto" class="demo-loginRuleForm" status-icon>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="registerRuleForm.name" placeholder="請輸入姓名" />
      </el-form-item>
      <el-form-item label="使用者名稱" prop="username">
        <el-input v-model="registerRuleForm.username" placeholder="請輸入使用者名稱" />
      </el-form-item>
      <el-form-item label="信箱" prop="email">
        <el-input v-model="registerRuleForm.email" placeholder="請輸入信箱" />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="registerRuleForm.phone" placeholder="請輸入電話" />
      </el-form-item>
      <el-form-item label="密碼" prop="pwd">
        <el-input v-model="registerRuleForm.pwd" placeholder="請輸入密碼" show-password/>
      </el-form-item>
      <el-form-item label="確認密碼" prop="doubleCheckPwd">
        <el-input v-model="registerRuleForm.doubleCheckPwd" placeholder="請再次輸入密碼" />
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="registerRuleForm.address" placeholder="請輸入住址" />
      </el-form-item>

    </el-form>
    <template #footer>
      <el-button type="primary" @click="handleRegister">
        註冊
      </el-button>
    </template>
  </el-dialog>
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
import type { FormInstance } from 'element-plus';
import { BellFilled } from '@element-plus/icons-vue';

const { user, isLoading, login, logout, getIdToken } = useAuth()
const activeIndex = ref('1')
const loginDialogVisible = ref(false);
const registerDialogVisible = ref(false);
const logoutDialogVisible = ref(false);

const loginRuleFormRef = ref<FormInstance | null>(null);
const registerRuleFormRef = ref<FormInstance | null>(null);
const show = ref(false)

function handleCloseNotification() {
  show.value = false;
}

const loginDialogStore = useLoginDialogStore();
// const userStore = useUserStore();

/**
 * TODO: 登入狀態
 */
// const isLogin = ref(true);

const handleCloseLoginDialog = () => {
  loginDialogStore.hideLoginDialog();
  loginRuleFormRef.value?.clearValidate();
  loginRuleFormRef.value?.resetFields();
};

const openRegisterDialog = () => {
  loginDialogStore.hideLoginDialog();
  registerDialogVisible.value = true;
};

const handleCloseRegisterDialog = () => {
  handleCloseLoginDialog();
  registerDialogVisible.value = false;
  loginRuleFormRef.value?.clearValidate();
  loginRuleFormRef.value?.resetFields();
};

const handleCloseLogoutDialog = () => {
  logoutDialogVisible.value = false;
};

// const user = computed(() => userStore.user);

async function handleLogin() {
  
  try {
    await login();
    loginDialogStore.hideLoginDialog();
  } catch (error) {
    console.error('Failed to login:', error);
  }
}

async function handleLogout() {
  try {
    await logout();
    logoutDialogVisible.value = false;
  } catch (error) {
    console.error('Failed to logout:', error);
  }

  useRouter().push({ path: '/' });
};

const handleRegister = () => {
  registerDialogVisible.value = false;
  handleCloseRegisterDialog();

  /**
   * TODO: 註冊功能
   */
};

const loginRuleForm = reactive({
  account: '',
  pwd: '',
});

const registerRuleForm = reactive({
  name: '',
  username: '',
  email: '',
  phone: '',
  pwd: '',
  doubleCheckPwd: '',
  address: '',
});



const handleSelectMenu = (index: string) => {
  activeIndex.value = index
}

const checkEmail = (rule: any, value: any, callback: any) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(value)) {
    callback(new Error('請輸入有效的電子郵件地址'));
  } else {
    callback();
  }
};

const checkPhone = (rule: any, value: any, callback: any) => {
  const phonePattern = /^(09\d{8}|0\d{1,2}-\d{6,8})$/;
  if (!phonePattern.test(value)) {
    callback(new Error('請輸入有效的手機號碼或市話號碼'));
  } else {
    callback();
  }
};

const checkPwd = (rule: any, value: any, callback: any) => {
  const pwdPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!pwdPattern.test(value)) {
    callback(new Error('需包含至少一個字母和一個數字，且長度需>=8'));
  } else {
    callback();
  }
};

const checkDoubleCheckPwd = (rule: any, value: any, callback: any) => {
  if (value !== registerRuleForm.pwd) {
    callback(new Error('兩次輸入的密碼不一致'));
  } else {
    callback();
  }
};

const rules = {
  account: [
    { required: true, message: '請輸入使用者名稱', trigger: 'change' },
  ],
  pwd: [
    { required: true, message: '請輸入密碼', trigger: 'change' },
    { validator: checkPwd, trigger: 'change' }
  ],
};

const registerRules = {
  name: [
    { required: true, message: '請輸入姓名', trigger: 'change' },
  ],
  username: [
    { required: true, message: '請輸入使用者名稱', trigger: 'change' },

  ],
  email: [
    { required: true, message: '請輸入信箱', trigger: 'change' },
    { validator: checkEmail, trigger: 'change' }
  ],
  phone: [
    { required: true, message: '請輸入電話', trigger: 'change' },
    { validator: checkPhone, trigger: 'change' }
  ],
  pwd: [
    { required: true, message: '請輸入密碼', trigger: 'change' },
    { validator: checkPwd, trigger: 'change' }
  ],
  doubleCheckPwd: [
    { required: true, message: '請再次輸入密碼', trigger: 'change' },
    { validator: checkDoubleCheckPwd, trigger: 'change' }

  ],
  address: [
    { required: true, message: '請輸入住址', trigger: 'change' },
  ],
};

onMounted(() => {
  
});
</script>

<style lang="scss" scoped>
.el-menu-item div {
  font-family: "Fraunces", serif;
  color: #9b2f62;
  font-size: 24px;
  font-weight: 800;
}

.el-input {
  height: 50%;
  width: 200px;
  margin: auto 30px;
}

.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}

</style>