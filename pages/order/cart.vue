<template>
  <template v-if="orderItems?.length">
    <el-steps style="max-width: 600px" finish-status="success" :active="step" align-center class="mx-auto mt-12 mb-4">
      <el-step title="訂單明細確認" />
      <el-step title="購買完成" />
    </el-steps>
    <template v-if="step == 1">
      <div class="main-section">
        <div class="left">
          <CustomProductCard v-for="item in orderItems" :key="item.productId" :product="item" @update:product="updateProductQuantityInCart" @remove="updateProductQuantityInCart"></CustomProductCard>
        </div>
        <div class="right">
          <div>結帳明細</div>
          <div class="value-counting">
            <span>商品總金額(含運費100)</span>
            <span>{{ cart?(cart.totalAmount + cart.totalDiscountAmount).toLocaleString():"0" }}</span>
          </div>
          <div class="value-counting">
            <span>折扣金額</span>
            <span class="text-red-600">-{{ totalDiscountAmount }}</span>
          </div>
          <div class="value-counting">
            <span>結帳金額</span>
            <span>{{ cart ? ((cart.totalAmount ?? 0)).toLocaleString() : '0' }}</span>
          </div>
          <!-- <div class="promotion-code">
          <el-input placeholder="請輸入折扣碼" v-model="discountCode"></el-input>
          <el-button type="success" plain>套用</el-button>
        </div> -->
          <el-button type="primary" @click="handleCheckout">結帳</el-button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="sec-section">
        <el-icon size="60">
          <SuccessFilled />
        </el-icon>
        <h1>訂單已成功送出!</h1>
        <div>
          <el-button type="primary" @click="useRouter().push({ path: '/' })">回到首頁</el-button>
          <el-button type="success" @click="useRouter().push({ path: '/order/history' })">查看訂單</el-button>
        </div>
      </div>
    </template>
  </template>
  <template v-else>
    <div class="sec-section">
      <!-- <el-icon size="60"><ShoppingCart /></el-icon> -->
      <img src="/images/illustration/empty-cart.svg" alt="" class="w-[300px]" />

      <h1>購物車是空的!</h1>
      <el-button type="primary" @click="useRouter().push({ path: '/' })" class="!w-[200px]">繼續購物</el-button>
    </div>
  </template>

</template>
<script setup lang="ts">
import { SuccessFilled,ShoppingCart } from '@element-plus/icons-vue';
import type { Cart, OrderItem } from '~/types/interfaces';

definePageMeta({
  middleware: 'auth',
});

useHead({
  title: '購物車',
});

const userStore = useUserStore();

const user = computed(() => userStore.user);

const discountCode = ref('');

const step = ref(1);

const totalDiscountAmount = computed(() => {
  return cart.value?.totalDiscountAmount ? cart.value.totalDiscountAmount.toLocaleString() : '0';
});

// const handleCheckout = () => {
//   step.value += 1;
// }

const orderItems = ref<OrderItem[] | null>();
const cart = ref<Cart | null>(null);
async function fetchCartByUserId() {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/orders/${user.value?.userId}/cart`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    cart.value = res.data;
    orderItems.value = res.data.items;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

async function updateProductQuantityInCart(updatedProduct: OrderItem) {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/orders/${user.value?.userId}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: updatedProduct.productId,
        quantity: updatedProduct.quantity,
      }),
    });
    console.log('res:', res.data);
    ElMessage({
      message: '商品數量已更新',
      type: 'success',
    })
    // cart.value = res.data;
    fetchCartByUserId();
  } catch (error) {
    console.error('商品數量更新失敗', error);
  }
};

async function handleCheckout() {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/orders/${user.value?.userId}/update-order/${cart.value?.orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status:1,
      }),
    });
    step.value += 1;
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

onMounted(() => {
  fetchCartByUserId();
});
</script>
<style lang="scss" scoped>
// .el-steps {
//   margin: 50px auto;

//   :deep(.el-step) {

//     .el-step__head {
//       color: $primary !important;
//       border-color: $primary !important;

//       .el-step__line {
//         background-color: $primary !important;
//       }
//     }

//     .el-step__main {
//       .el-step__title {
//         color: $primary !important;
//       }

//     }
//   }
// }

.main-section {
  display: flex;
  justify-content: center;
  padding: 20px 50px;
  gap: 5%;

  .left {
    width: 45%;
    display: flex;
    flex-direction: column;
    gap: 20px;

  }

  .right {
    width: 35%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    // background-color: $secondary;
    border-radius: 20px;
    padding: 20px;
    border: 1px solid #ccc;
    height: fit-content;
    background-color: $secondary;

    .value-counting {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }

    .promotion-code {
      margin-top: 10px;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .el-input {
        width: 70%;
      }

      .el-button {
        width: 25%;
        margin-top: 0 !important;
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
