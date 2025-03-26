<template>
  <div class="page-container">
    <div class="form-container">

      <div class="title">後臺帳號登入</div>
      <el-form ref="loginRuleFormRef" :model="loginRuleForm" :rules="rules" label-width="auto" class="loginRuleForm"
        status-icon>
        <el-form-item label="帳號" prop="account">
          <el-input v-model="loginRuleForm.account" placeholder="請輸入使用者名稱" />
        </el-form-item>
        <el-form-item label="密碼" prop="pwd">
          <el-input v-model="loginRuleForm.pwd" placeholder="請輸入密碼" show-password />
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleLogin">登入</el-button>
    </div>
  </div>

</template>
<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormInstance } from 'element-plus';

useHead({
  title: '後臺帳號登入'
});

definePageMeta({
  layout: 'no-header'
});

const userStore = useUserStore();
const user = computed(() => userStore.user);

const loginRuleFormRef = ref<FormInstance | null>(null);
const logoutDialogVisible = ref(false);
const loginRuleForm = reactive({
  account: '',
  pwd: ''
});
const rules = {
  account: [
    { required: true, message: '請輸入使用者名稱', trigger: 'change' }
  ],
  pwd: [
    { required: true, message: '請輸入密碼', trigger: 'change' },
    { min: 8, message: '密碼長度不能小於8位', trigger: 'change' }
  ]
};



async function handleLogin() {
  loginRuleFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.login(loginRuleForm.account, loginRuleForm.pwd);
        if (user.value?.role == 1) {

          useRouter().push('/management/report');
        } else {
          useRouter().push('/management/user');
        }
      } catch (error) {
        console.error('Failed to login:', error);
      }
    }
  });

}




</script>
<style lang="scss" scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column !important;
  text-align: center;
  background-color: $primary;

  .form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    border: 1px solid $secondary;
    background-color: white;
    border-radius: 20px;
    padding: 20px;
  }

  >* {
    width: 60%;
    max-width: 300px;
  }
}
</style>