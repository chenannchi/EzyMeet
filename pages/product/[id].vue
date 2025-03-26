<template>
  <div class="page-container" v-if="product">
    <div class="left">
      <img :src="product.image" alt="Placeholder image" />
    </div>
    <div class="right">
      <div class="title">{{ product.name }}</div>
      <div class="price">NT$ {{ product.price }}</div>
      <div class="quantity">
        <label>數量</label>
        <el-select v-model="quantity" placeholder="請選擇數量" size="large">
          <el-option v-for="quantity in quantityOptions" :key="quantity.label" :value="quantity.value"
            :label="quantity.label" />
        </el-select>
      </div>
      <div>
        <el-button type="primary" @click="addProductToCart">加入購物車</el-button>
      </div>
      <!-- <div>
        <el-button type="info" @click="addProductToFavorite">加入我的最愛</el-button>
      </div> -->
      <!-- <div class="promotion">{{ product.promotion }}</div> -->
      <div class="title">產品介紹</div>
      <div class="description">
        {{ product.description }}
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import type { Product } from '@/types/interfaces';
import { ElMessage } from 'element-plus'

useHead({
  title: '產品詳情'
});

const quantityOptions = Array.from({ length: 10 }, (_, i) => ({ label: String(i + 1), value: i + 1 }));
const quantity = ref<number>(1);
const product = ref<Product | null>(null);

const userStore = useUserStore();
const user = computed(() => userStore.user);

/**
 * TODO: Add product to cart
 */
const addProductToCart = () => {
  updateProductQuantityInCart();
};

/**
 * ! Optional: Add product to favorite
 */
// const addProductToFavorite = () => {
//   console.log('Add product to favorite', product.value);
// };

async function fetchProductById(id: string) {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('res:', res.data);
    product.value = res.data;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
};

async function updateProductQuantityInCart() {
  try {
    const res = await $fetch<any>(`http://localhost:5005/giftopia/orders/${user.value?.userId}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: product.value?.productId,
        quantity: quantity.value,
      }),
    });
    console.log('res:', res.data);
    ElMessage({
      message: '商品加入購物車',
      type: 'success',
    })
  } catch (error) {
    console.error('商品加入購務車失敗', error);
  }
};

onMounted(() => {
  const id = useRoute().params.id;
  fetchProductById(Array.isArray(id) ? id[0] : id);
});

</script>
<style lang="scss" scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
}

.left {
  width: 45%;

  img {
    // width: 100%;;
    max-height: 80vh;
    border-radius: 25px;
    margin-left: auto;
  }
}

.right {
  float: right;
  width: 55%;

  .title {
    font-size: 24px;
    font-weight: bold;
    margin-top: 20px;
  }

  .price {
    font-size: 20px;
    color: red;
    margin-top: 10px;
  }

  .quantity {
    margin-top: 10px;

    label {
      font-size: 16px;
    }

    el-input {
      width: 100px;
    }
  }

  .promotion {
    margin-top: 10px;
  }

  .description {
    margin-top: 10px;
  }
}
</style>