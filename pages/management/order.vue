<template>
  <div class="page-container">
    <div class="title">訂單管理</div>
    <div class="flex justify-start items-center gap-4 w-full">
      <el-input v-model="filter.search" placeholder="請輸入訂單id或訂購人姓名" class="search-input" />
    </div>
    <el-table :data="filteredOrders" style="width: 100%">
      <el-table-column prop="orderId" label="訂單ID" />
      <el-table-column prop="user.name" label="訂購者姓名" />
      <el-table-column prop="orderDate" label="訂購日期" />
      <el-table-column prop="totalAmount" label="訂購金額" />
      <el-table-column label="付款方式">
        <template #default="{ row }">
          <span>{{ paymentMethods.find(method => method.value === row.paymentMethod)?.label }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="狀態">
        <template #default="{ row }">
          <el-select v-model="row.status" placeholder="請選擇訂單狀態" :readonly="isViewMode" @change="updateOrderState(row)">
            <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <!-- <el-icon color="#9b2f62" size="24" class="mx-1" @click="handleOpenOrderDetailDialog(row, false)">
            <Edit />
          </el-icon> -->
          <el-icon color="#9b2f62" size="24" class="mx-1" @click="handleOpenOrderDetailDialog(row, true)">
            <View />
          </el-icon>
          <el-icon color="#9b2f62" size="24" class="mx-1" @click="handleOpenDeleteOrder(row)">
            <DeleteFilled />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="orderDetailDialogVisible" :before-close="handleCloseOrderDetailDialog">
    <div class="title">{{ isViewMode ? '查看訂單' : '編輯訂單' }}</div>
    <el-form ref="editOrderFormRef" :model="editOrderForm" label-width="100px">
      <el-form-item label="訂單ID">
      <el-input v-model="editOrderForm.orderId" :disabled="isViewMode" />
      </el-form-item>
      <el-form-item label="訂購者姓名">
      <el-input v-model="editOrderForm.user.name" :disabled="isViewMode" />
      </el-form-item>
      <el-form-item label="訂購日期">
      <el-date-picker v-model="editOrderForm.orderDate" type="date" :disabled="isViewMode" />
      </el-form-item>
      <el-form-item label="訂購金額">
      <el-input v-model="editOrderForm.totalAmount" :disabled="isViewMode" />
      </el-form-item>
      <el-form-item label="付款方式">
      <el-select v-model="editOrderForm.paymentMethod" placeholder="請選擇付款方式" :disabled="isViewMode">
        <el-option v-for="item in paymentMethods" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      </el-form-item>
      <el-form-item label="狀態">
      <el-select v-model="editOrderForm.status" placeholder="請選擇訂單狀態" :disabled="isViewMode"
        @change="handleEditOrder(editOrderForm)">
        <el-option v-for="item in status" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      </el-form-item>
    </el-form>
    <div class="order-detail">
      <el-table :data="editOrderForm.items" style="width: 100%">
        <el-table-column prop="Product.productId" label="商品ID" />
        <el-table-column prop="Product.name" label="商品名稱" />
        <el-table-column prop="Product.price" label="價格" />
        <el-table-column prop="quantity" label="購買數量" />
      </el-table>
    </div>

    <!-- <div class="btn-container" v-if="!isViewMode">
      <el-button type="primary" @click="handleSaveOrder">
        儲存
      </el-button>
    </div> -->
  </el-dialog>
  <el-dialog v-model="deleteDialogVisible">
    <div class="title">確認刪除訂單#{{ deleteOrder!.orderId }}?</div>
    <template #footer>
      <el-button type="primary" @click="handleDeleteOrder">
        刪除
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { DeleteFilled, Edit, View } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';
import type { OrderDetail } from '~/types/interfaces';
definePageMeta({
  layout: 'management',
})
useHead({
  title: '訂單管理',
});

const filter = reactive({
  search: ''
});

const userStore = useUserStore();
const store = computed(() => userStore.user);

const orderDetailDialogVisible = ref(false);
const editOrderFormRef = ref<FormInstance | null>(null);

const deleteDialogVisible = ref(false);
const deleteOrder = ref<OrderDetail | null>(null);

const handleOpenDeleteOrder = (order: any) => {
  deleteDialogVisible.value = true;
  deleteOrder.value = order;
};

let editOrderForm = reactive<OrderDetail>({
  orderId: 0,
  userId: 0,
  storeId: 0,
  user: {
    name: '',
    email: '',
    phone: ''
  },
  orderDate: '',
  totalAmount: 0,
  paymentMethod: 0,
  status: 0,
  items: []
});

const handleCloseOrderDetailDialog = () => {
  orderDetailDialogVisible.value = false;
  editOrderFormRef.value?.clearValidate();
  editOrderFormRef.value?.resetFields();
};

// const handleSaveOrder = () => {
//   editOrderFormRef.value?.validate((valid) => {
//     if (valid) {
//       handleEditOrder(editOrderForm);
//       orderDetailDialogVisible.value = false;
//     }
//   });
// };

const paymentMethods = [
  { label: '信用卡', value: 0 },
  { label: '貨到付款', value: 1 },
];

const status = [
  { label: '已收到', value: 1 },
  { label: '理貨中', value: 2 },
  { label: '運送中', value: 3 },
  { label: '已送達', value: 4 },
]

const isViewMode = ref<boolean>(false);

const handleOpenOrderDetailDialog = (order: OrderDetail, viewMode: boolean) => {
  isViewMode.value = viewMode;
  orderDetailDialogVisible.value = true;

  (Object.keys(editOrderForm) as (keyof OrderDetail)[]).forEach((key) => {
    if (key in order) {
      (editOrderForm[key] as string | number) = order[key] as string | number;
    }
  });
};

const handleEditOrder = (order: any) => {
  /**
   * TODO: Edit order api (update status)
   */
  console.log(order);


};

async function updateOrderState(order: any) {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/management/${store.value?.userId}/update-order-status/${order.orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: order.status,
      }),
    });

    ElMessage({
      message: '訂單狀態已更新',
      type: 'success',
    })


  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

const handleDeleteOrder = async () => {
  deleteDialogVisible.value = false;
  await performDeleteOrder();
  await fetchOrders();

};

const orders = ref<OrderDetail[]>([]);

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    return (
      filter.search === '' ||
      order.orderId.toString().toLowerCase().includes(filter.search.toLowerCase()) ||
      order.user.name.toLowerCase().includes(filter.search.toLowerCase())
    );
  });
});

async function fetchOrders() {
  try {
    if (store) {
      const res = await $fetch<any>(`http://localhost:5005/giftopia/management/orders/${store.value?.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      orders.value = res.data;
    } else {
      console.error('Store is null');
    }
    // orders.value = res.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

async function performDeleteOrder() {
  try {
    if (store) {
      const res = await $fetch<any>(`http://localhost:5005/giftopia/management/orders/${store.value?.userId}/delete-order/${deleteOrder.value?.orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      ElMessage({
        message: '訂單已刪除',
        type: 'success',
      });
    }
    // orders.value = res.data;
  } catch (error) {

    ElMessage({
      message: '刪除訂單失敗',
      type: 'error',
    });
    console.error('Failed to fetch products:', error);
  }
}

onMounted(async () => {
  userStore.loadUserFromLocalStorage();
  await fetchOrders();
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