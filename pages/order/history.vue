<template>
  <template v-if="orderList.length !== 0">
    <div class="page-container">

      <div class="section">
        <CustomInput v-model="orderSearch" />
        <div class="order" v-for="order in orderList" :key="order.orderId">
          <div class="left">
            <div class="info">
              <div class="order-date">
                <span>訂單日期: </span><span>{{ order.orderDate }}</span>
              </div>
              <div class="order-amount">
                <span>訂單金額: </span><span>{{ order.totalAmount }}</span>
              </div>
              <div class="order-no">
                <span>訂單編號: </span><span>{{ order.orderId }}</span>
              </div>
              <CustomButton link :type="'primary'" class="!mr-auto" @click="handleClick(order.orderId)">查看訂單
              </CustomButton>
            </div>
            <div class="delivery-status">
              <span>出貨狀態</span>
              <el-steps :active="order.status" finish-status="success" class="flex justify-start my-3">
                <el-step title="收到訂單" />
                <el-step title="撿貨" />
                <el-step title="出貨" />
                <el-step title="已送達" />
              </el-steps>
            </div>
          </div>
          <div class="right">
            <img src="/images/placeholders/gift1.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </template>
  <template v-else>
    <div class="sec-section">
      <img src="/images/illustration/in-thought.svg" alt="" class="w-[300px]" />
      <h1>目前沒有訂單</h1>
    </div>
  </template>
  <el-dialog v-model="dialogVisible" title="訂單詳情" width="500">
    <div v-if="clickedOrder">
      <div class="order-date">
        <span>訂單日期: </span><span>{{ clickedOrder.orderDate }}</span>
      </div>
      <div class="order-amount">
        <span>訂單金額: </span><span>{{ clickedOrder.totalAmount }}</span>
      </div>
      <div class="order-no">
        <span>訂單編號: </span><span>{{ clickedOrder.orderId }}</span>
      </div>
      <div class="order-detail">
        <el-table :data="clickedOrder.items" style="width: 100%">
          <!-- <el-table-column label="圖片">
            <template #default="{ row }">
              <img :src="row.image" alt="" style="width: 100px" />
            </template>
          </el-table-column> -->
          <el-table-column prop="Product.name" label="商品名稱" />
          <el-table-column prop="Product.price" label="價格" />
          <el-table-column prop="quantity" label="購買數量" />
        </el-table>
      </div>
    </div>
  </el-dialog>

</template>
<script setup lang="ts">
import type { Order, Product } from '@/types/interfaces';

definePageMeta({
  middleware: 'auth',
});

useHead({
  title: '訂單紀錄',
  meta: [
    {
      name: 'description',
      content: '訂單紀錄',
    },
  ],
});

const userStore = useUserStore();
const user = computed(() => userStore.user);

const orderSearch = ref<string>('');
const dialogVisible = ref<boolean>(false);
const clickedOrder = ref<Order | null>(null);

const handleClick = (orderId: number) => {
  fetchSingleOrderByOrderId(orderId.toString());
  dialogVisible.value = true;
};



const orderList = ref<Order[]>([]);

async function fetchOrdersByUserId() {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/orders/${user.value?.userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    orderList.value = res.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

async function fetchSingleOrderByOrderId(orderId: string) {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/orders/${user.value?.userId}/order/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    clickedOrder.value = res.data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

}

watch(user, () => {
  fetchOrdersByUserId();
});

onMounted(() => {
  fetchOrdersByUserId();
});
</script>
<style lang="scss" scoped>
.page-container {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  gap: 30px;

  .section {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    align-items: center;
    max-width: 800px;
    gap: 20px;

    .order {
      // max-width: 800px;
      width: 100%;
      margin-bottom: 20px;
      padding: 20px;
      border: 1px solid #ccc;
      display: flex;
      justify-content: center;
      align-items: space-between;
      gap: 10%;
      background-color: $secondary;

      .left {
        width: 80%;


        .info {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;

          .order-date,
          .order-amount,
          .order-no {
            display: flex;
            width: 50%;
            justify-content: flex-start;
          }

          :deep(.el-button) {
            margin-right: auto !important;
            font-size: 16px;
            padding: 0;
            color: $primary;
          }
        }

        .delivery-status {
          margin-top: 20px;
        }
      }

      .right {
        width: 20%;
        margin: auto 0;

        // padding: 20px;
        img {
          margin: 0 auto;
          // width: 100%;
          height: 100%;
          max-height: 250px;
        }
      }
    }
  }


}

.sec-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  // padding: 50px;
  padding-top: 70px;
  margin: auto 0;
  // min-height: 100vh;
  min-height: 90vh;
  // align-items: center;

  .el-icon {
    font-size: 100px;
    color: $primary;
  }

  h1 {
    font-size: 2rem;
  }

  div {
    display: flex;
    gap: 20px;
  }
}
</style>
