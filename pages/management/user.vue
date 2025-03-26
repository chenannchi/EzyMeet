<template>
  <div class="page-container">
    <div class="title">用戶管理</div>
    <el-button type="primary" @click="addUserDialogVisible = true">新增用戶</el-button>
    <div class="flex justify-start items-center gap-4 w-full">
      <el-input v-model="filter.search" placeholder="請輸入用戶id、名稱或電子信箱" class="search-input" />
      <el-select v-model="filter.role" placeholder="請選擇角色" class="category-select">
        <el-option label="Admin" value="0" />
        <el-option label="Store" value="1" />
        <el-option label="Member" value="2" />
        <el-option label="All" value="" />
      </el-select>
    </div>
    <el-table :data="filteredUsers" style="width: 100%">
      <el-table-column prop="userId" label="用戶ID" />
      <el-table-column prop="name" label="用戶姓名" />
      <el-table-column prop="email" label="電子信箱" />
      <el-table-column label="角色">
        <template #default="{ row }">
          {{ roles.find(role => role.value === row.role)?.label }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-icon color="#9b2f62" size="24" class="mx-1" @click="handleOpenUserDetailDialog(row, false)">
            <Edit />
          </el-icon>
          <el-icon color="#9b2f62" size="24" class="mx-1" @click="handleOpenUserDetailDialog(row, true)">
            <View />
          </el-icon>
          <el-icon color="#9b2f62" size="24" class="mx-1" @click="handleOpenDeleteUser(row)">
            <DeleteFilled />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="userDetailDialogVisible" :before-close="handleCloseUserDetailDialog">
    <div class="title">{{ isViewMode ? '查看用戶' : '編輯用戶' }}</div>
    <el-form :model="editUserForm" :rules="rules" ref="editUserFormRef" label-width="100px">
      <el-form-item v-if="isViewMode" label="用戶ID" prop="userId">
        <el-input v-model="editUserForm.userId" disabled />
      </el-form-item>
      <el-form-item label="用戶名稱" prop="username">
        <el-input v-model="editUserForm.username" :disabled="isViewMode" placeholder="請輸入用戶名稱" />
      </el-form-item>
      <el-form-item label="用戶姓名" prop="name">
        <el-input v-model="editUserForm.name" :disabled="isViewMode" placeholder="請輸入用戶姓名" />
      </el-form-item>
      <el-form-item label="電子信箱" prop="email">
        <el-input v-model="editUserForm.email" :disabled="isViewMode" placeholder="請輸入電子信箱" />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="editUserForm.role" :disabled="isViewMode" placeholder="請選擇角色">
          <el-option v-for="role in roles" :key="role.value" :label="role.label" :value="role.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="editUserForm.address" :disabled="isViewMode" placeholder="請輸入住址" />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="editUserForm.phone" :disabled="isViewMode" placeholder="請輸入電話" />
      </el-form-item>
    </el-form>
    <div class="btn-container" v-if="!isViewMode">
      <el-button type="primary" @click="handleSaveUser">
        儲存
      </el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="addUserDialogVisible" :before-close="handleCloseAddUserDialog">
    <div class="title">新增用戶</div>
    <el-form :model="addUserForm" :rules="rules" ref="addUserFormRef" label-width="100px">
      <el-form-item label="用戶名稱" prop="username">
        <el-input v-model="addUserForm.username" placeholder="請輸入用戶名稱" />
      </el-form-item>
      <el-form-item label="用戶姓名" prop="name">
        <el-input v-model="addUserForm.name" placeholder="請輸入用戶姓名" />
      </el-form-item>
      <el-form-item label="電子信箱" prop="email">
        <el-input v-model="addUserForm.email" placeholder="請輸入電子信箱" />
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input v-model="addUserForm.password" placeholder="請輸入密碼" show-password />
      </el-form-item>
      <el-form-item label="確認密碼" prop="doubleCheckPwd">
        <el-input v-model="addUserForm.doubleCheckPwd" placeholder="請再次輸入密碼" show-password />
      </el-form-item>
      <el-form-item label="角色" prop="role">
        <el-select v-model="addUserForm.role" placeholder="請選擇角色">
          <el-option v-for="role in roles" :key="role.value" :label="role.label" :value="role.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="住址" prop="address">
        <el-input v-model="addUserForm.address" placeholder="請輸入住址" />
      </el-form-item>
      <el-form-item label="電話" prop="phone">
        <el-input v-model="addUserForm.phone" placeholder="請輸入電話" />
      </el-form-item>
    </el-form>
    <div class="btn-container">
      <el-button type="primary" @click="handleSaveNewUser">
        新增
      </el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="deleteDialogVisible">
    <div class="title">確認刪除{{ deleteUser!.name }}?</div>
    <template #footer>
      <el-button type="primary" @click="handleDeleteUser">
        刪除
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { DeleteFilled, Edit, View } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import type { User } from '~/types/interfaces';
definePageMeta({
  layout: 'management',
})
useHead({
  title: '用戶管理',
});

const filter = reactive({
  search: '',
  role: '',
});

const userDetailDialogVisible = ref(false);
const editUserFormRef = ref<FormInstance | null>(null);

const addUserDialogVisible = ref(false);
const addUserFormRef = ref<FormInstance | null>(null);

const deleteDialogVisible = ref(false);
const deleteUser = ref<User | null>(null);

const handleOpenDeleteUser = (user: any) => {
  deleteDialogVisible.value = true;
  deleteUser.value = user;
};

let addUserForm = reactive({
  username: '',
  name: '',
  email: '',
  password: '',
  doubleCheckPwd: '',
  role: '',
  address: '',
  phone: '',
});

const handleCloseAddUserDialog = () => {
  addUserDialogVisible.value = false;
  addUserFormRef.value?.clearValidate();
  addUserFormRef.value?.resetFields();
};

const handleSaveNewUser = () => {
  addUserFormRef.value?.validate((valid) => {
    if (valid) {
      handleAddUser();
      addUserDialogVisible.value = false;
    }
  });
};

let editUserForm = reactive({
  userId: '',
  username: '',
  name: '',
  email: '',
  role: '',
  address: '',
  phone: '',
});

const handleCloseUserDetailDialog = () => {
  userDetailDialogVisible.value = false;
  editUserFormRef.value?.clearValidate();
  editUserFormRef.value?.resetFields();
};

const handleSaveUser = () => {
  editUserFormRef.value?.validate((valid) => {
    if (valid) {
      handleEditUser(editUserForm);
      userDetailDialogVisible.value = false;
    }
  });
};

const checkEmail = (rule: any, value: any, callback: any) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(value)) {
    callback(new Error('請輸入有效的電子郵件地址'));
  } else {
    callback();
  }
};

const checkPhone = (rule: any, value: any, callback: any) => {
  const phonePattern = /^(09\d{8}|0\d{1,2}\d{6,8})$/;
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
  if (value !== addUserForm.password) {
    callback(new Error('兩次輸入的密碼不一致'));
  } else {
    callback();
  }
};

const rules = {
  username: [{ required: true, message: '請輸入用戶名稱', trigger: 'change' }],
  name: [{ required: true, message: '請輸入用戶姓名', trigger: 'change' }],
  email: [{ required: true, message: '請輸入電子信箱', trigger: 'change' }, { validator: checkEmail, trigger: 'change' }],
  password: [{ required: true, message: '請輸入密碼', trigger: 'change' }, { validator: checkPwd, trigger: 'change' }],
  doubleCheckPwd: [{ required: true, message: '請再次輸入密碼', trigger: 'change' }, { validator: checkDoubleCheckPwd, trigger: 'change' }],
  role: [{ required: true, message: '請選擇角色', trigger: 'change' }],
  address: [{ required: true, message: '請輸入住址', trigger: 'change' }],
  phone: [{ required: true, message: '請輸入電話', trigger: 'change' }, { validator: checkPhone, trigger: 'change' }],
};

const isViewMode = ref<boolean>(false);

const handleOpenUserDetailDialog = (user: any, viewMode: boolean) => {
  isViewMode.value = viewMode;
  userDetailDialogVisible.value = true;

  (Object.keys(editUserForm) as (keyof typeof editUserForm)[]).forEach((key) => {
    if (key in user) {
      editUserForm[key] = user[key];
    }
  });
};

const handleEditUser = async (user: any) => {
  editUser(user);
};

const handleDeleteUser = async (user: any) => {
  deleteDialogVisible.value = false;
  performDeleteUser(user);
};

const handleAddUser = async () => {
  const user = {
    username: addUserForm.username,
    name: addUserForm.name,
    email: addUserForm.email,
    password: addUserForm.password,
    role: addUserForm.role,
    address: addUserForm.address,
    phone: addUserForm.phone,
  };
  createUser(user);
  addUserFormRef.value?.clearValidate();
  addUserFormRef.value?.resetFields();

};


const users = ref<User[]>([]);

const roles = ref([
  {
    value: 0,
    label: 'Admin',
  },
  {
    value: 1,
    label: 'Store',
  },
  {
    value: 2,
    label: 'Member',
  }
]);

async function fetchUsers() {
  try {
    const res = await $fetch<any>('http://localhost:5005/giftopia/management/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    users.value = res.data;

  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

async function createUser(user: any) {
  try {
    const res = await $fetch<any>('http://localhost:5005/giftopia/management/create-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    ElMessage({
      message: '新增用戶成功',
      type: 'success',
    })
    fetchUsers();
  } catch (error) {
    ElMessage({
      message: '新增用戶失敗',
      type: 'error',
    })
    console.error('Failed to create user:', error);
  }
}

async function performDeleteUser(user: any) {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/management/delete-user/${deleteUser.value?.userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    ElMessage({
      message: '刪除用戶成功',
      type: 'success',
    })
    fetchUsers();
  } catch (error) {
    ElMessage({
      message: '刪除用戶失敗',
      type: 'error',
    })
    console.error('Failed to delete user:', error);
  }
}

async function editUser(user: any) {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/management/edit-user/${user.userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }
    );
    ElMessage({
      message: '編輯用戶成功',
      type: 'success',
    })
    fetchUsers();
  } catch (error) {
    ElMessage({
      message: '編輯用戶失敗',
      type: 'error',
    })
    console.error('Failed to edit user:', error);
  }
}


const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    return (
      (filter.search === '' || user.email.includes(filter.search) || user.userId.toString().includes(filter.search) || user.name.includes(filter.search))
      && (filter.role === '' || user.role === Number(filter.role))
    );
  });
});

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped lang="scss">
.page-container {
  width: 100%;
  padding: 80px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  gap: 10px;
  background-color: $secondary;


  .title {
    font-size: 24px;
    // margin-bottom: 20px;
  }

  .el-button {
    width: fit-content;
  }

  .search-input {
    width: 70%;
  }

  .category-select {
    width: 30%;
  }
}
</style>
