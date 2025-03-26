<template>
  <div class="page-container">
    <div class="title">商品管理</div>
    <el-button type="primary" @click="addProductDialogVisible = true">新增商品</el-button>
    <div class="flex justify-center items-center gap-4 w-full">
      <el-input v-model="filter.search" placeholder="請輸入商品id或名稱" class="search-input" />
      <el-select v-model="filter.category" placeholder="請選擇商品分類" class="category-select">
        <el-option label="全部" value="all" />
        <el-option v-for="item in categories" :key="item.categoryId" :label="item.name" :value="item.categoryId" />
      </el-select>
    </div>
    <el-table :data="filteredProducts" style="width: 100%">
      <el-table-column prop="productId" label="商品ID" />
      <el-table-column label="分類">
        <template #default="{ row }">
          {{ getCategoryName(row.categoryId) }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名稱" />
      <el-table-column prop="price" label="價格" />
      <el-table-column prop="stock" label="庫存" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-icon color="#9b2f62" size="24" class="mx-1" @click="handleOpenProductDetailDialog(row, false)">
            <Edit />
          </el-icon>
          <el-icon color="#9b2f62" size="24" class="mx-1" @click="handleOpenProductDetailDialog(row, true)">
            <View />
          </el-icon>
          <el-icon color="#9b2f62" size="24" class="mx-1" @click="handleOpenDeleteProduct(row)">
            <DeleteFilled />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="productDetailDialogVisible" :before-close="handleCloseProductDetailDialog">
    <div class="title">{{ isViewMode ? '查看商品' : '編輯商品' }}</div>
    <el-form ref="editProductFormRef" style="max-width: 600px" :model="editProductForm" :rules="rules"
      label-width="auto" class="demo-editProductForm" status-icon>
      <el-form-item label="商品名稱" prop="name" disabled>
        <el-input v-model="editProductForm.name" placeholder="請輸入商品名稱" :disabled="isViewMode" />
      </el-form-item>
      <el-form-item label="價格" prop="price">
        <el-input v-model="editProductForm.price" placeholder="請輸入價格" :disabled="isViewMode"
          :formatter="(v: any) => v.replace(/[^0-9]/g, '')" />
      </el-form-item>
      <el-form-item label="庫存" prop="stock">
        <el-input v-model="editProductForm.stock" placeholder="請輸入庫存" :disabled="isViewMode"
          :formatter="(v: any) => v.replace(/[^0-9]/g, '')" />
      </el-form-item>
      <el-form-item label="分類" prop="categoryId">
        <el-select v-model="editProductForm.categoryId" placeholder="請選擇商品分類" :disabled="isViewMode">
          <el-option v-for="item in categories" :key="item.categoryId" :label="item.name" :value="item.categoryId" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品介紹" prop="description">
        <el-input type="textarea" v-model="editProductForm.description" placeholder="請輸入產品介紹" :disabled="isViewMode" />
      </el-form-item>
      <el-form-item label="圖片Url" prop="image">
        <el-input v-model="editProductForm.image" placeholder="請輸入產品照片Url" :disabled="isViewMode" />
      </el-form-item>
    </el-form>

    <div class="btn-container" v-if="!isViewMode">
      <el-button type="primary" @click="handleSaveProduct">
        儲存
      </el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="addProductDialogVisible" :before-close="handleCloseAddProductDialog">
    <div class="title">新增商品</div>
    <el-form ref="addProductFormRef" style="max-width: 600px" :model="addProductForm" :rules="rules" label-width="auto"
      class="demo-addProductForm" status-icon>
      <el-form-item label="商品名稱" prop="name">
        <el-input v-model="addProductForm.name" placeholder="請輸入商品名稱" />
      </el-form-item>
      <el-form-item label="價格" prop="price">
        <el-input v-model="addProductForm.price" placeholder="請輸入價格"
          :formatter="(v: any) => v.replace(/[^0-9]/g, '')" />
      </el-form-item>
      <el-form-item label="庫存" prop="stock">
        <el-input v-model="addProductForm.stock" placeholder="請輸入庫存"
          :formatter="(v: any) => v.replace(/[^0-9]/g, '')" />
      </el-form-item>
      <el-form-item label="分類" prop="categoryId">
        <el-select v-model="addProductForm.categoryId" placeholder="請選擇商品分類">
          <el-option v-for="item in categories" :key="item.categoryId" :label="item.name" :value="item.categoryId" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品介紹" prop="description">
        <el-input type="textarea" v-model="addProductForm.description" placeholder="請輸入產品介紹" />
      </el-form-item>
      <el-form-item label="圖片Url" prop="image">
        <el-input v-model="addProductForm.image" placeholder="請輸入產品照片Url" />
      </el-form-item>

    </el-form>

    <div class="btn-container">
      <el-button type="primary" @click="handleSaveNewProduct">
        新增
      </el-button>
    </div>
  </el-dialog>
  <el-dialog v-model="deleteDialogVisible">
    <div class="title">確認刪除{{ deleteProduct!.name }}?</div>
    <template #footer>
      <el-button type="primary" @click="handleDeleteProduct">
        刪除
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { DeleteFilled, Edit, View } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import type { Category, Product } from '~/types/interfaces';
definePageMeta({
  layout: 'management',
})
useHead({
  title: '商品管理',
});

const userStore = useUserStore();
const store = computed(() => userStore.user);

const filter = reactive({
  search: '',
  category: 'all'
});

const productDetailDialogVisible = ref(false);
const editProductFormRef = ref<FormInstance | null>(null);

const addProductDialogVisible = ref(false);
const addProductFormRef = ref<FormInstance | null>(null);

const deleteDialogVisible = ref(false);
const deleteProduct = ref<Product | null>(null);



const handleOpenDeleteProduct = (product: any) => {
  deleteDialogVisible.value = true;
  deleteProduct.value = product;
};

let addProductForm = reactive({
  name: '',
  price: null,
  stock: null,
  categoryId: 1,
  description: '',
  image: '',
});

const handleCloseAddProductDialog = () => {
  addProductDialogVisible.value = false;
  addProductFormRef.value?.clearValidate();
  addProductFormRef.value?.resetFields();
};

const handleSaveNewProduct = () => {
  addProductFormRef.value?.validate((valid) => {
    if (valid) {
      handleAddProduct();
      addProductDialogVisible.value = false;
    }
  });
};



let editProductForm = reactive<Partial<Product>>({
  name: '',
  price: 0,
  stock: 0,
  categoryId: 1,
  description: '',
  image: '',
  productId: 0,
  storeId: 0,
  createdAt: ''
});

const handleCloseProductDetailDialog = () => {
  productDetailDialogVisible.value = false;
  editProductFormRef.value?.clearValidate();
  editProductFormRef.value?.resetFields();
};

const handleSaveProduct = () => {
  editProductFormRef.value?.validate((valid) => {
    if (valid) {
      handleEditProduct(editProductForm);
      productDetailDialogVisible.value = false;
    }
  });
};

const checkPrice = (rule: any, value: string, callback: (message?: string) => void) => {
  if (!value) {
    callback('請輸入價格');
  } else {
    callback();
  }
};

const checkStock = (rule: any, value: string, callback: (message?: string) => void) => {
  if (!value) {
    callback('請輸入庫存');
  } else if (!/^\d+$/.test(value)) {
    callback('庫存必須為整數');
  } else {
    callback();
  }
};

const rules = {
  name: [{ required: true, message: '請輸入商品名稱', trigger: 'change' }],
  price: [{ required: true, message: '請輸入價格', trigger: 'change' }, { validator: checkPrice, trigger: 'change' }],
  stock: [{ required: true, message: '請輸入庫存', trigger: 'change' }, { validator: checkStock, trigger: 'change' }],
  categoryId: [{ required: true, message: '請選擇商品分類', trigger: 'change' }],
  description: [{ required: true, message: '請輸入產品介紹', trigger: 'change' }],
  image: [{ required: true, message: '請輸入產品照片Url', trigger: 'change' }],
};

const isViewMode = ref<boolean>(false);

const handleOpenProductDetailDialog = (product: any, viewMode: boolean) => {
  // console.log(product)
  isViewMode.value = viewMode;

  // Update properties of the reactive object instead of reassigning
  (Object.keys(editProductForm) as (keyof typeof editProductForm)[]).forEach((key) => {
    if (key in product) {
      editProductForm[key] = product[key] as never;
    }
  });
  productDetailDialogVisible.value = true;
};

const handleEditProduct = async (product: any) => {
  productDetailDialogVisible.value = false;
  try {
    await updateProduct();
    await handleFetchAllProductsByStoreId();
    ElMessage({
      message: '商品更新成功',
      type: 'success',
    });
  } catch (error) {
    ElMessage({
      message: '商品更新失敗',
      type: 'error',
    });
  }

};

const handleDeleteProduct = async (product: any) => {
  deleteDialogVisible.value = false;
  try {
    await performDeleteProduct();
    await handleFetchAllProductsByStoreId();
    ElMessage({
      message: '商品刪除成功',
      type: 'success',
    });
  } catch (error) {
    ElMessage({
      message: '商品刪除失敗',
      type: 'error',
    });
  }
};

const handleAddProduct = async () => {
  if (!addProductFormRef.value) return;
  addProductFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await createProduct();
        handleFetchAllProductsByStoreId();
        ElMessage({
          message: '商品新增成功',
          type: 'success',
        });
      } catch (error) {
        ElMessage({
          message: '商品新增失敗',
          type: 'error',
        });
      }
    }
  });
};

const categories = ref<Category[]>([]);
const products = ref<Product[]>([]);


async function handleFetchCategories() {
  try {
    const res = await $fetch<any>('http://localhost:5005/giftopia/products/categories', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // console.log('res:', res.data);
    categories.value = res.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

async function handleFetchAllProductsByStoreId() {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/management/products/${store.value?.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('storeId:', store.value?.userId);
    console.log('res:', res.data);
    products.value = res.data;
    
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

async function createProduct() {
  try {
    const res = await $fetch<any>('http://localhost:5005/giftopia/products/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ...addProductForm, 
        storeId: store.value?.userId,
        price: addProductForm.price !== null ? parseInt(addProductForm.price, 10) : 0,
        stock: addProductForm.stock !== null ? parseInt(addProductForm.stock, 10) : 0
      }),
    });
    
  } catch (error) {
    console.error('Failed to create product:', error);
  }
};

async function performDeleteProduct() {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/products/${deleteProduct.value?.productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      
    });
    
  } catch (error) {
    console.error('Failed to create product:', error);
  }
};

async function updateProduct() {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/products/${editProductForm.productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ...editProductForm, 
        price: editProductForm.price ?? 0,
        stock: editProductForm.stock !== null ? parseInt(editProductForm.stock?.toString() || '0', 10) : 0
      }),
    });
    
  } catch (error) {
    console.error('Failed to create product:', error);
  }
};

const filteredProducts = computed(() => {
  if (!products.value.length) {
    return []; // 資料尚未載入時回傳空陣列
  }
  return products.value.filter((product) => {
    return (
      (filter.search === '' || product.productId.toString().includes(filter.search) || product.name.includes(filter.search)) &&
      (filter.category == 'all' || product.categoryId.toString() == filter.category)
    );
  });
});

const getCategoryName = (categoryId: string) => {
  // console.log('categoryId:', categoryId);
  // console.log('categories:', categories.value);
  const category = categories.value.find(cat => cat.categoryId.toString() == categoryId);
  return category ? category.name : '';
};

onMounted(async () => {
  userStore.loadUserFromLocalStorage();
  // console.log('User loaded:', userStore.user);
  await handleFetchCategories(); 
  await handleFetchAllProductsByStoreId();
  // console.log('Products loaded:', products.value);
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